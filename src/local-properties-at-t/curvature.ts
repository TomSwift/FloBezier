
import { evaluateDx } from "./t-to-dxy/evaluate-dx";
import { evaluateDy } from "./t-to-dxy/evaluate-dy";
import { evaluateDdx } from "./t-to-ddxy/evaluate-ddx";
import { evaluateDdy } from "./t-to-ddxy/evaluate-ddy";
import { sign, twoProduct, expansionDiff, estimate, expansionProduct, fastExpansionSum, scaleExpansion } from "flo-numerical";
import { getDxyAt0 } from "./t-to-dxy/get-dxy-at-0";
import { getDdxyAt0 } from "./t-to-ddxy/get-ddxy-at-0";
import { getDddxy } from "../to-power-basis/get-dddxy";


/**
 * Returns the curvature, κ, at a specific t. 
 * 
 * This function is curried. 
 * 
 * Alias of curvature.
 * @param ps An order 1, 2 or 3 bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 * @param t The parameter value where the curvature should be evaluated
 */
function κ(ps: number[][], t: number): number;
function κ(ps: number[][]): (t: number) => number;
function κ(ps: number[][], t?: number) {
	let evDx  = evaluateDx (ps); 
	let evDy  = evaluateDy (ps);
	let evDdx = evaluateDdx(ps);
    let evDdy = evaluateDdy(ps);

	function f(t: number): number {
		let dx  = evDx (t); 
		let dy  = evDy (t);
		let ddx = evDdx(t);
		let ddy = evDdy(t);
		
		let a = dx*ddy - dy*ddx;
		let b = Math.sqrt((dx*dx + dy*dy)**3);

		return a/b;
	}

	// Curry
	return t === undefined ? f : f(t);
}


/**
 * Compare the curvature, κ, between two curves at t === 0. 
 * 
 * Returns a positive number if κ for psI > κ for psO, negative if κ for psI < κ 
 * for psO or zero if the curve extensions are identical (i.e. in same K-family).
 * 
 * Precondition: The point psI evaluated at zero must === the point psO 
 * evaluated at zero.
 * 
 * Exact: Returns the exact result if the bithlength of all 
 * coordinates <= 53 - 5 === 48 and are bit-aligned.
 * 
 * @param psI An order 1, 2 or 3 bezier, e.g. [[0,0],[1,1],[2,1],[2,0]] 
 * representing the incoming curve
 * @param psO Another bezier representing the outgoing curve
 */
function compareCurvaturesAtInterface(
        psI: number[][], 
        psO: number[][]) {

    // Get x' and y' for incoming curve evaluated at 0
    let [dxI, dyI] = getDxyAt0(psI); // max bitlength increase / max shift === 3
    // Get x'' and y'' for incoming curve evaluated at 0
    let [ddxI, ddyI] = getDdxyAt0(psI); // max bitlength increase / max shift === 5

    // Get x' and y' for outgoing curve evaluated at 0
    let [dxO, dyO] = getDxyAt0(psO); // max bitlength increase / max shift === 3
    // Get x'' and y'' for outgoing curve evaluated at 0
    let [ddxO, ddyO] = getDdxyAt0(psO); // max bitlength increase / max shift === 5

    //console.log('κI: ', κ(psI, 0));
    //console.log('κO: ', κ(psO, 0));

    // Remember the formula for the signed curvature of a parametric curve:
    // κ = x′y′′ - y′x′′ / sqrt(x′² + y′²)³
    // κ² = (x′y′′ - y′x′′)² / (x′² + y′²)³

    // This allows us to do an exact comparison of curvatures
    // Simplifying the above gives (denoting the incoming curve with a subscript
    // of 1 and the outgoing with a 2):
    //      κIncoming > κOutgoing
    // <=>  (x₁′y₁′′ - y₁′x₁′′)²(x₂′² + y₂′²)³ > (x₂′y₂′′ - y₂′x₂′′)²(x₁′² + y₁′²)³
    // <=>  a²b³ > c²d³
    // Note b³ > 0 and d³ > 0

    // max aggregate bitlength increase (let original bitlength === p):
    // a -> 2 x ((p+3)+(p+5) + 1) === 4p + 18 -> max p in double precision === 8 -> too low
    //let a = (dxI*ddyI - dyI*ddxI)**2;
    // b -> 3 x ((p+3) + 1) === 3p + 12
    //let b = (dxO*dxO  + dyO*dyO )**3;
    // c -> 2 x ((p+3)+(p+5) + 1) === 4p + 18
    //let c = (dxO*ddyO - dyO*ddxO)**2;
    // d -> 3 x ((p+3) + 1) === 3p + 12
    //let d = (dxI*dxI  + dyI*dyI )**3;

    // We need to resort to exact floating point arithmetic at this point
    let a = expansionDiff(
        twoProduct(dxI, ddyI), 
        twoProduct(dyI, ddxI)
    );
    let c = expansionDiff(
        twoProduct(dxO, ddyO),
        twoProduct(dyO, ddxO)
    );

    let signA = sign(a);
    let signC = sign(c);
    if (signA !== signC) {
        //console.log('branch 3');
        return signA - signC;
    }

    let b = fastExpansionSum(
        twoProduct(dxO, dxO),
        twoProduct(dyO, dyO)
    );
    let d = fastExpansionSum(
        twoProduct(dxI, dxI),
        twoProduct(dyI, dyI)
    );

    let b2 = expansionProduct(b, b);
    let b3 = expansionProduct(b2, b);
    let d2 = expansionProduct(d, d);
    let d3 = expansionProduct(d2, d);

    if (signA !== 0 || signC !== 0) {
        //console.log('branch 4');
        let a2 = expansionProduct(a, a);
        let c2 = expansionProduct(c, c);

        // max aggregate bitlength increase (let original bitlength === p):
        // κ -> (2 x ((p+3)+(p+5) + 1)) + (3 x ((p+3) + 1)) === 7p + 30
        // e.g. for bit-aligned input bitlength p of 10 we get output bitlength 
        // of 100, or for p === 3 (the max exact bitlength allowed to have exact
        // results without resorting to infinite precision) we get 51 bits.

        
        let κI = expansionProduct(a2,b3);
        let κO = expansionProduct(c2,d3);
        let δκ = sign(expansionDiff(κI, κO));

        if (δκ !== 0) {
            //console.log('branch 5');
            // At this point signA === signC, both +tive or -tive
            return signA > 0 ? δκ : -δκ;
        }
    }

    // At this point signA === signC, both +tive or -tive or 0

    // Now we have to look at the change of curvature w.r.t. the parameter t,
    // i.e. 
    // κ′ = [(x′²+y′²)(x′y′′′-y′x′′′) - 3(x′y′′-y′x′′)(x′x′′+y′y′′)] / (x′²+y′²)^(5/2)
    // Therefore: (denoting the incoming curve with a subscript of 1 and the outgoing with a 2)
    // κ′Incoming > κ′Outgoing
    // <=> [(x₁′²+y₁′²)(x₁′y₁′′′-y₁′x₁′′′) - 3(x₁′y₁′′-y₁′x₁′′)(x₁′x₁′′+y₁′y₁′′)]²(x₂′²+y₂′²)⁵ >
    //     [(x₂′²+y₂′²)(x₂′y₂′′′-y₂′x₂′′′) - 3(x₂′y₂′′-y₂′x₂′′)(x₂′x₂′′+y₂′y₂′′)]²(x₁′²+y₁′²)⁵
    // <=> (de - 3af)²b⁵ > (bg - 3ch)²d⁵
    // <=> i²b⁵ > j²d⁵

    // Get x′′′ and y′′′ for incoming curve evaluated at 1
    let [dddxI, dddyI] = getDddxy(psI); // max bitlength increase === max shift === 6
    let [dddxO, dddyO] = getDddxy(psO); // max bitlength increase === max shift === 6

    let e = expansionDiff(
        twoProduct(dxI, dddyI),
        twoProduct(dyI, dddxI)
    );

    let f = fastExpansionSum(
        twoProduct(dxI, ddxI),
        twoProduct(dyI, ddyI)
    );

    let g = expansionDiff(
        twoProduct(dxO, dddyO),
        twoProduct(dyO, dddxO)
    );

    let h = fastExpansionSum(
        twoProduct(dxO, ddxO),
        twoProduct(dyO, ddyO)
    );

    // (de - 3af)²b⁵ > (bg - 3ch)²d⁵
    // i²b⁵ > j²d⁵
    let i = expansionDiff(
        expansionProduct(d, e),
        scaleExpansion(
            expansionProduct(a, f),
            3
        )
    );

    let j = expansionDiff(
        expansionProduct(b, g),
        scaleExpansion(
            expansionProduct(c, h),
            3
        )
    );

    let signI = sign(i);
    let signJ = sign(j);
    if (signA !== signC) {
        return signI - signJ;
    }

    if (signI === 0 && signJ === 0) {
        // Both curve extensions are identical, i.e. in the same K-family
        return 0;
    }

    let i2 = expansionProduct(i,i);
    let b5 = expansionProduct(b2,b3);
    let j2 = expansionProduct(j,j);
    let d5 = expansionProduct(d2,d3);

    let dκI = expansionProduct(i2,b5);
    let dκO = expansionProduct(j2,d5);

    let sgn = sign(expansionDiff(dκI, dκO));

    return signI > 0 ? sgn : -sgn;

    // If the above returned value is still zero then the two curve extensions 
    // are identical, i.e. in the same K-family
}


export { κ, compareCurvaturesAtInterface }
