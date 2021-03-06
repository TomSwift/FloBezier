
import { allRoots } from 'flo-poly';

//import { rotatePs as rotate, translatePs as translate } from 'flo-vector2d';
import { rotate, translate } from 'flo-vector2d';
import { getY } from '../../to-power-basis/get-y';

//import { getY } from './get-y';


/**
 * Returns the bezier t values of the intersection between the given cubic 
 * bezier and the given line.
 * @param ps - The bezier curve
 * @param l - The line given as a start and end point
 */
function lineIntersection(ps: number[][], l: number[][]) {
	let [[x0,y0],[x1,y1]] = l;
	let [x,y] = [x1-x0, y1-y0];

	if (x === 0 && y === 0) { return []; } // It is not a line, it's a point. 

	// Move the line and the bezier together so the line's first point is on the
	// origin.
	ps = ps.map(translate([-x0,-y0]));

	// Rotate the bezier and line together so the line is y=0.
	let len = Math.sqrt(x*x + y*y);
	let sinθ = y/len;
	let cosθ = x/len;
	ps = ps.map(rotate(-sinθ, cosθ));

	// Find the intersection t values
	return allRoots(getY(ps),0,1);
}


export { lineIntersection }
