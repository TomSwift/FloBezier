/**
 * Returns the y value of the once differentiated (with respect to t) bezier
 * when evaluated at t. This function is curried.
 * @param ps A line, quadratic or cubic bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 * @param t The t parameter
  */
declare function evaluateDy(ps: number[][], t: number): number;
declare function evaluateDy(ps: number[][]): (t: number) => number;
export { evaluateDy };
