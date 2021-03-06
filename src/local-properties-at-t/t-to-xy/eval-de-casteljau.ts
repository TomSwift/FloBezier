
/** 
 * Evaluates the given bezier curve at the parameter t.
 * @param ps An order 1, 2 or 3 bezier curve, e.g. [[0,0],[1,1],[2,1],[2,0]]
 * @param t The parameter value where the bezier should be evaluated
 **/
function evalDeCasteljau(
		ps: number[][], 
		t: number) {

	if (t === 0) {
		return ps[0];
	} else if (t === 1) {
		return ps[ps.length-1];
	}

	//let s = 1-t;  // <= exact if eps | t, but not a precondition here

	if (ps.length === 4) {
		const [[x0,y0], [x1,y1], [x2,y2], [x3,y3]] = ps;	

		let a01 = x0 + (x1 - x0)*t;
		let a11 = x1 + (x2 - x1)*t;
		let a21 = x2 + (x3 - x2)*t;
		let a02 = a01 + (a11 - a01)*t;
		let a12 = a11 + (a21 - a11)*t;
		let x = a02 + (a12 - a02)*t;

		let b01 = y0 + (y1 - y0)*t;
		let b11 = y1 + (y2 - y1)*t;
		let b21 = y2 + (y3 - y2)*t;
		let b02 = b01 + (b11 - b01)*t;
		let b12 = b11 + (b21 - b11)*t;
		let y = b02 + (b12 - b02)*t;

		return [x,y];
	} else if (ps.length === 3) {
		const [[x0,y0], [x1,y1], [x2,y2]] = ps;	

		let a01 = x0 + (x1 - x0)*t;
		let a11 = x1 + (x2 - x1)*t;
		let x = a01 + (a11 - a01)*t;

		let b01 = y0 + (y1 - y0)*t;
		let b11 = y1 + (y2 - y1)*t;
		let y = b01 + (b11 - b01)*t;

		return [x,y];
	} else if (ps.length === 2) {
		const [[x0,y0], [x1,y1]] = ps;	

		let x = x0 + (x1 - x0)*t;
		let y = y0 + (y1 - y0)*t;

		return [x,y];
	}
}


/** 
 * Evaluates the given bezier curve at the parameter t.
 * @param ps An order 1, 2 or 3 bezier curve, e.g. [[0,0],[1,1],[2,1],[2,0]]
 * @param t The parameter value where the bezier should be evaluated
 **/
function evalDeCasteljauX(
		ps: number[][], 
		t: number): number {

	if (t === 0) {
		return ps[0][0];
	} else if (t === 1) {
		return ps[ps.length-1][0];
	}

	//let s = 1-t;  // <= exact if eps | t, but not a precondition here

	if (ps.length === 4) {
		const [[x0,], [x1], [x2], [x3,]] = ps;	

		let a01 = x0 + (x1 - x0)*t;
		let a11 = x1 + (x2 - x1)*t;
		let a21 = x2 + (x3 - x2)*t;
		let a02 = a01 + (a11 - a01)*t;
		let a12 = a11 + (a21 - a11)*t;
		return a02 + (a12 - a02)*t;
	} else if (ps.length === 3) {
		const [[x0,], [x1], [x2]] = ps;	

		let a01 = x0 + (x1 - x0)*t;
		let a11 = x1 + (x2 - x1)*t;
		return a01 + (a11 - a01)*t;
	} else if (ps.length === 2) {
		const [[x0,], [x1]] = ps;	

		return x0 + (x1 - x0)*t;
	}
}


/** 
 * Evaluates the given bezier curve at the parameter t.
 * @param ps An order 1, 2 or 3 bezier curve, e.g. [[0,0],[1,1],[2,1],[2,0]]
 * @param t The parameter value where the bezier should be evaluated
 **/
function evalDeCasteljauY(
		ps: number[][], 
		t: number): number {

	if (t === 0) {
		return ps[0][1];
	} else if (t === 1) {
		return ps[ps.length-1][1];
	}

	//let s = 1-t;  // <= exact if eps | t, but not a precondition here

	if (ps.length === 4) {
		const [[,y0],[,y1],[,y2],[,y3]] = ps;	

		let b01 = y0 + (y1 - y0)*t;
		let b11 = y1 + (y2 - y1)*t;
		let b21 = y2 + (y3 - y2)*t;
		let b02 = b01 + (b11 - b01)*t;
		let b12 = b11 + (b21 - b11)*t;
		return b02 + (b12 - b02)*t;
	} else if (ps.length === 3) {
		const [[,y0],[,y1],[,y2]] = ps;	

		let b01 = y0 + (y1 - y0)*t;
		let b11 = y1 + (y2 - y1)*t;
		return b01 + (b11 - b01)*t;
	} else if (ps.length === 2) {
		const [[,y0],[,y1]] = ps;	

		return y0 + (y1 - y0)*t;
	}
}


export { evalDeCasteljau, evalDeCasteljauX, evalDeCasteljauY }
