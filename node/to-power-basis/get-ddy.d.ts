/**
 * Returns the 2nd derivative of the power basis representation of a line,
 * quadratic or cubic bezier's y-coordinates.
 *
 * This function is memoized on its points parameter by object reference.
 *
 * Bitlength: If the coordinates of the control points are grid-aligned then
 * max bitlength increase === max shift === 6 (for cubics)
 * max bitlength increase === max shift === 3 (for quadratics)
 * max bitlength increase === max shift === 0 (for lines)
 *
 * @param ps An order 1,2 or 3 bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 */
declare function getDdy(ps: number[][]): number[];
export { getDdy };
