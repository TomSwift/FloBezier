/**
 * Returns the approximate bezier curve that is the curve from t1 to t2 in such
 * a way that the control points axis-aligned-box of the newly returned curve is
 * guaranteed to engulf the true (numerically exact) curve control points
 * axis-aligned box.
 * * **precondition** t1 < t2
 * @param ps an order 1,2 or 3 bezier curve
 * @param t1 first parameter value as a quad precision floating point value
 * @param t2 second parameter value as a quad precision floating point value
 */
declare function getIntervalBoxQuad(ps: number[][], ts: number[][]): number[][][];
declare function getIntervalBox3Quad([[x0, y0], [x1, y1], [x2, y2], [x3, y3]]: number[][], [t1, t2]: number[][]): number[][][];
declare function getIntervalBox2Quad([[x0, y0], [x1, y1], [x2, y2]]: number[][], [t1, t2]: number[][]): number[][][];
/**
 * @param param0
 * @param param1
 */
declare function getIntervalBox1Quad([[x0, y0], [x1, y1]]: number[][], [t1, t2]: number[][]): number[][][];
declare function getIntervalBoxExactTQuad(ps: number[][], t: number[]): number[][][];
export { getIntervalBoxQuad, getIntervalBox1Quad, getIntervalBox2Quad, getIntervalBox3Quad, getIntervalBoxExactTQuad };
