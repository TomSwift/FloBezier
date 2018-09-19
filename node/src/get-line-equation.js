"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Get the implicit line equation from two 2d points in the form f(x,y) ax + by + c = 0
 * returned as the array [a,b,c].
 * @ignore
 * @param l - A line given by two points, e.g. [[2,0],[3,3]]
 * @returns {number[]}
 */
function getLineEquation(l) {
    let [[x1, y1], [x2, y2]] = l;
    let a = y1 - y2;
    let b = x2 - x1;
    let c = x1 * y2 - x2 * y1;
    return [a, b, c];
}
exports.getLineEquation = getLineEquation;

//# sourceMappingURL=get-line-equation.js.map