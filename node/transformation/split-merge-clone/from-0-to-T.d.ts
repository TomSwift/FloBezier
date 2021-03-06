/**
 * Returns an order 1, 2 or 3 bezier curve that starts at the given curve's t=0
 * and ends at the given t parameter.
 *
 * A loose bound on the accuracy of the resultant points is given by:
 * |δP| = 2n*max(|b_k|)η, where n = 3 (cubic), b_k are the control points
 * and η is Number.EPSILON.
 * @param ps - A cubic bezier curve
 * @param t - The t parameter where the resultant bezier should end
 */
declare function from0ToT(ps: number[][], t: number): number[][];
export { from0ToT };
