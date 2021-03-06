/**
 * Returns true if the 2 given axis-aligned rectangular boxes intersect.
 * @param a An axis-aligned rectangular box
 * @param a Another axis-aligned rectangular box
 * @param closed (defaults to true) Interpret boxes as being closed (i.e. they
 * contain their border) or open. If open then if both boxes have zero area
 * then they are both considered close.
 */
declare function areBoxesIntersecting(closed: boolean): (a: number[][], b: number[][]) => boolean;
export { areBoxesIntersecting };
