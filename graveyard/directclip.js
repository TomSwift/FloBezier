// This is the directClip version of the cubic bezier curve intersection 
// algorithm. Since a cubic needs to be solved as opposed to two quadratics as
// in GeoClip, GeoClip is faster and this function belongs here in the 
// graveyard. :(

function directClip(P, dQ, dMin, dMax) {
    // Calculate the distance from the control points of P to the line 
    // [Q0,Q3].
    let dPi = i => dQ(P[i]);
    let dPs = [0,1,2,3].map(dPi);
    let [dP0,dP1,dP2,dP3] = dPs;

    let Dy = [
        dP3 - 3*dP2 + 3*dP1 - dP0, // t^3
        3*dP2 - 6*dP1 + 3*dP0,    // t^2
        3*dP1 - 3*dP0,           // t^1
        dP0,                    // t^0
    ];
    
    let errorBound = 2*Poly.hornerErrorBound(Dy, 1);
    dMin = dMin - errorBound;
    dMax = dMax + errorBound;

    let DyMin = Dy.slice();
    DyMin[3] = DyMin[3] - dMin;
    let DyMax = Dy.slice();
    DyMax[3] = DyMax[3] - dMax;

    let rootsMin = Poly.allRoots(DyMin,0,1);
    let rootsMax = Poly.allRoots(DyMax,0,1);
    let tMin = Math.min(...rootsMin, ...rootsMax);
    let tMax = Math.max(...rootsMin, ...rootsMax);

    let PP0 = Poly.evaluate(Dy,0);
    let PP1 = Poly.evaluate(Dy,1);
    if (PP0 >= dMin && PP0 <= dMax) { tMin = 0; } 
    if (PP1 >= dMin && PP1 <= dMax) { tMax = 1; } 
    if (tMin < 0) { tMin = 0; }
    if (tMax > 1) { tMax = 1; }

    return {tMin, tMax};
}