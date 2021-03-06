
import { getXY } from '../../to-power-basis/get-xy';


const abs = Math.abs;


/**
 * Returns an approximate implicit form of the given quadratic bezier and a 
 * coefficientwise error bound.
 * * the error bound needs to be multiplied by γ === nu/(1-nu), where 
 * u === Number.EPSILON / 2
 * * the coordinates of the given bezier must be 47-bit aligned
 * * Adapted from http://www.mare.ee/indrek/misc/2d.pdf
 * @param ps 
 */
function getImplicitForm2(ps: number[][]) {
    // The implicit form is given by:
    // vₓₓx² +vₓᵧxy + vᵧᵧy² + vₓx + vᵧy + v = 0
    
    let [[a2,a1,a0],[b2,b1,b0]] = getXY(ps);

    let a2b1 = a2*b1;
    let a1b2 = a1*b2;
    let a2b0 = a2*b0;
    let a0b2 = a0*b2;
    let a1b0 = a1*b0;
    let a0b1 = a0*b1;
    let a2a2 = a2*a2;
    let a2b2 = a2*b2;
    let b2b2 = b2*b2;

    let q1 = a2b1 - a1b2;
    let q2 = a2b0 - a0b2;
    let q3 = a1b0 - a0b1;

    let _q1 = abs(q1);
    let _q2 = abs(q2);
    let _q3 = abs(q3);

    let q1_ = abs(a2b1) + abs(a1b2) + _q1;
    let q2_ = abs(a2b0) + abs(a0b2) + _q2;
    let q3_ = abs(a1b0) + abs(a0b1) + _q3;

    // -a1*q1*y - a2**2*y**2 + 2*a2*b2*x*y + 2*a2*q2*y + b1*q1*x - b2**2*x**2 - 2*b2*q2*x + q1*q3 - q2**2

    // b2**2*x**2
    // -b2**2 *x**2
    let vₓₓ = -b2b2;
    let vₓₓ_ = abs(b2b2)

    // -2*a2*b2*x*y
    // 2*a2*b2 *x*y
    let vₓᵧ = 2*a2b2;
    let vₓᵧ_ = 2*abs(a2b2);

    // a2**2*y**2
    // -a2**2 *y**2 
    let vᵧᵧ = -a2a2;
    let vᵧᵧ_ = abs(a2a2);

    // -2*a0*b2**2 + a1*b1*b2 + 2*a2*b0*b2 - a2*b1**2
    // (b1*q1 + -2*b2*q2) *x
    //let vₓ = b1*q1 - 2*b2*q2;
    let w1 = b1*q1;
    let w1_ = abs(b1)*q1_ + abs(w1);
    let w2 = 2*b2*q2;
    let w2_ = 2*(abs(b2)*q2_) + abs(w2);
    let vₓ = w1 - w2;
    let vₓ_ = w1_ + w2_ + abs(vₓ);

    // 2*a0*a2*b2 - a1**2*b2 + a1*a2*b1 - 2*a2**2*b0
    // (-a1*q1 + 2*a2*q2) *y
    let w3 = 2*a2*q2;
    let w3_ = 2*(abs(a2)*q2_) + abs(w3);
    let w4 = a1*q1;
    let w4_ = abs(a1)*q1_ + abs(w4);
    let vᵧ = w3 - w4;
    let vᵧ_ = w3_ + w4_ + abs(vᵧ);

    // a0**2*b2**2 - a0*a1*b1*b2 - 2*a0*a2*b0*b2 + a0*a2*b1**2 + a1**2*b0*b2 - a1*a2*b0*b1 + a2**2*b0**2
    // q1*q3 + -q2**2
    let w5 = q1*q3;
    let w5_ = q1_*_q3 + _q1*q3_ + abs(w5);
    let w6 = q2*q2;
    let w6_ = 2*(_q2*q2_) + abs(w6);
    let v = w5 - w6;
    let v_ = w5_ + w6_ + abs(v);


    return { 
        coeffs: { vₓₓ, vₓᵧ, vᵧᵧ, vₓ, vᵧ, v },
        errorBound: { vₓₓ_, vₓᵧ_, vᵧᵧ_, vₓ_, vᵧ_, v_ }
    }
}


export { getImplicitForm2 }
