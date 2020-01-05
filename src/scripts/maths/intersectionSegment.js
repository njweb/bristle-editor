import { vec2 } from 'gl-matrix';
import {
  createBoundingBox,
  initBoundingBoxFromSegment,
  isPointInBoundingBox,
  doBoundingBoxesOverlap,
} from './boundingBox';

// UTILITIES ---------> (TODO extract?)
const EPSILON = 0.00001;
const isApproximately0 = v => Math.abs(v) < EPSILON;

const getNormal = (out, p1, p2) => vec2.normalize(out, vec2.sub(out, p2, p1));

const getSegmentNormal = (out, s) => {
  const [p1, p2] = s;
  //return vec2.normalize(out, vec2.sub(out, p2, p1));
  return getNormal(out, p1, p2);
};

const getPerpendicularNormal = (out, n) => {
  return vec2.set(out, n[1], -n[0]);
};
// <---------------- UTILITES

const getPointsNormalDotProduct = (() => {
  const normal = vec2.create();

  return (a, b, n) => {
    vec2.normalize(localNormal, vec2.sub(localNormal, b, a));
    return vec2.dot(n, localNormal);
  }
})();

const findMiddleColinearSegmentPoints = (s1, s2) => {
  return [...s1, ...s2].sort((a, b) => (
    a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]
  )).slice(1, -1).map(p => vec2.clone(p));
};

const areSegmentsColinear = (() => {
  const normal = vec2.create();
  const n1 = vec2.create();
  const n2 = vec2.create();
  const n3 = vec2.create();

  return (s1, s2) => {
    getSegmentNormal(normal, s1);
    getNormal(n1, s1[0], s1[1]);
    getNormal(n2, s1[0], s2[0]);
    getNormal(n3, s1[0], s2[1]);
    getPerpendicularNormal(n1, n1);

    return isApproximately0(vec2.dot(n1, n2)) && isApproximately0(vec2.dot(n1, n3));
  };
})();

const computeIntersectionValues = (x1, y1, x2, y2, x3, y3, x4, y4) => ([
  (x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4),
  (x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4),
  (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4),
]);

const intersectSegments = (() => {
  const box1 = createBoundingBox();
  const box2 = createBoundingBox();

  return (s1, s2) => {
    initBoundingBoxFromSegment(box1, s1);
    initBoundingBoxFromSegment(box2, s2);
    if (!doBoundingBoxesOverlap(box1, box2)) return [];

    const [nx, ny, d] = computeIntersectionValues(
      s1[0][0], s1[0][1], s1[1][0], s1[1][1],
      s2[0][0], s2[0][1], s2[1][0], s2[1][1],
    );

    if (d === 0) {
      if (areSegmentsColinear(s1, s2)) {
        const middlePoints = findMiddleColinearSegmentPoints(s1, s2);
        if (vec2.equals(middlePoints[0], middlePoints[1])) return [middlePoints[0]];
        return middlePoints;
      }
      return [];
    }

    const intersection = vec2.set(vec2.create(), nx / d, ny / d);

    const intersectionIsOnSegments =
      isPointInBoundingBox(intersection, box1) && isPointInBoundingBox(intersection, box2)
    return  intersectionIsOnSegments ? [intersection] : [];
  };
})();

export { intersectSegments };
