/**
 * Returns the approximate power basis representation of a line, quadratic or
 * cubic bezier's y-coordinates.
 *
 * If certain preconditions are met (see below) it returns the exact result.
 *
 * This function is memoized on its points parameter by object reference.
 *
 * Returns the power basis polynomial from highest power to lowest,
 * e.g. at^3 + bt^2 + ct + d is returned as [a,b,c,d]
 *
 * Bitlength: If the coordinates of the control points are grid-aligned then
 * max bitlength increase === max shift === 4 (for cubics)
 * (due to 'multiplication' by 9 (3x 6x 3x)
 * max bitlength increase === max shift === 2 (for quadratics)
 * (due to 'multiplication' by 4 (1x 2x 1x)
 * max bitlength increase === max shift === 1 (for lines)
 * (due to 'multiplication' by 4 (1x 1x)
 *
 * @param ps An order 1, 2 or 3 bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 */
declare function getY(ps: number[][]): number[];
declare function getYExact(ps: number[][]): number[][];
export { getY, getYExact };
