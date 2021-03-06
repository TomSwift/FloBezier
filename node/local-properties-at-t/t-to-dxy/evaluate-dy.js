"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateDy = void 0;
const flo_poly_1 = require("flo-poly");
const get_dy_1 = require("../../to-power-basis/get-dy");
function evaluateDy(ps, t) {
    const dPs = get_dy_1.getDy(ps); // Speed optimizing cache
    const f = flo_poly_1.evaluate(dPs);
    return t === undefined ? f : f(t); // Curry
}
exports.evaluateDy = evaluateDy;
//# sourceMappingURL=evaluate-dy.js.map