import { vec2 } from 'gl-matrix';
import { intersectSegments } from './intersectionSegment';

const buildVector = (x, y) => vec2.set(vec2.create(), x, y);

const createShapePoint = vertex => ({
  location: vec2.copy(vec2.create(), vertex),
  nextPoint: null,
  prevPoint: null,
  crossPoint: null,
});

const createCorner = point => ({
  point,
  next: null,
  prev: null,
  isFromShapeA: false,
  isIntersection: false,
  intersections: [],
});

const buildShape = pointSequence => {
  return pointSequence.reduce((acc, _, idx) => {
    acc[idx].nextPoint = acc[(idx + 1) % acc.length];
    acc[idx].prevPoint = acc[(acc.length + idx - 1) % acc.length];
    return acc;
  }, pointSequence.map(p => createShapePoint(p)));
};

const findIntersections = (shapeA, shapeB) => {
  const allIntersections = shapeA.reduce((accA, pA) => {
    const segA = [pA.location, pA.nextPoint.location];
    return [
      ...accA,
      ...shapeB.reduce((accB, pB) => {
        const segB = [pB.location, pB.nextPoint.location];
        return [...accB, ...intersectSegments(segA, segB)];
      }, [])
    ];
  }, []);

  return allIntersections.filter(arr => arr.length > 0);
};

const buildShapeMk2 = pointSeq => {
  pointSequence.map(p => createCorner(p)).reduce((acc, c, idx, corners) => {
    const nextCorner = corners[(i + 1) % corners.length];
    c.next = nextCorner;
    nextCorner.prev = c;
    acc.push(c);
    return acc;
  }, []);
};
const findIntersectionsMk2 = (shapeA, shapeB) => {

};

export { buildShape, findIntersections }
