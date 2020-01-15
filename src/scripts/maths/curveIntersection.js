import { vec2 } from 'gl-matrix';
import {
  createBoundingBox,
  getBoundingBoxSize,
  initBoundingBoxFromPoints,
  doBoundingBoxesOverlap,
} from './boundingBox';
import { sliceBezier } from './curves';
import buildReverseStack from './reverseStack';

const EPSILON = 0.01;

const doBoxesOverlap = (boxA, boxB) => {
  const xOverlap = boxA.max[0] > boxB.min[0] && boxA.min[0] < boxB.max[0];
  const yOverlap = boxA.max[1] > boxB.min[1] && boxA.min[1] < boxB.max[1];
  return xOverlap && yOverlap;
};
const collapseBoxesToPoint = (() => {
  const iA = vec2.create();
  const iB = vec2.create();

  return (box1, box2) => {
    vec2.lerp(iA, box1.min, box1.max, 0.5);
    vec2.lerp(iB, box2.min, box2.max, 0.5);
    return vec2.lerp(vec2.create(), iA, iB, 0.5);
  };
})();

const getBoxSize = box => (box.max[0] - box.min[0]) * (box.max[1] - box.min[1]);

const getLargestBoxEdge = (box1, box2) => {
  const differences = [box1, box2].map(b => [0, 1].map(index => b.max[index] - b.min[index]));
  return Math.max.apply(null, Array.prototype.concat.apply([], differences));
};
const getLargestBoxEdge2 = box => {
  return Math.max(box.max[0] - box.min[0], box.max[1] - box.min[1]);
}

const intersectBezierToBezierMk4 = (() => {
  const splitStack = buildReverseStack(() => Array.from({ length: 5 }, () => vec2.create()));
  const boxA = createBoundingBox();
  const boxB = createBoundingBox();

  return (bezier1, bezier2) => {
    initBoundingBoxFromPoints(boxA, bezier1);
    initBoundingBoxFromPoints(boxB, bezier2);
    if (!doBoundingBoxesOverlap(boxA, boxB)) return []

    const segmentSize1 = getLargestBoxEdge2(initBoundingBoxFromPoints(boxA, bezier1));
    const segmentSize2 = getLargestBoxEdge2(initBoundingBoxFromPoints(boxB, bezier2));

    let output;
    const split = splitStack.pop();

    if (segmentSize1 < EPSILON) {
      if (segmentSize2 < EPSILON) {
        output = collapseBoxesToPoint(boxA, boxB);
      } else {
        sliceBezier(split, bezier2[0], bezier2[1], bezier2[2], bezier2[3], 0.5);
        const subSegments = [
          [bezier2[0], ...split.slice(0, 3)],
          [...split.slice(2), bezier2[3]],
        ];
        if (doBoundingBoxesOverlap(boxA, initBoundingBoxFromPoints(boxB, subSegments[0]))) {
          output = intersectBezierToBezierMk4(bezier1, subSegments[0])
        } else {
          output = intersectBezierToBezierMk4(bezier1, subSegments[1])
        }
      }
    } else {
      if (segmentSize1 < segmentSize2) {
        sliceBezier(split, bezier2[0], bezier2[1], bezier2[2], bezier2[3], 0.5);
        const subSegments = [
          [bezier2[0], ...split.slice(0, 3)],
          [...split.slice(2), bezier2[3]],
        ];
        output = Array.prototype.concat.apply([], [
          intersectBezierToBezierMk4(subSegments[0], bezier1),
          intersectBezierToBezierMk4(subSegments[1], bezier1),
        ]);
      } else {
        sliceBezier(split, bezier1[0], bezier1[1], bezier1[2], bezier1[3], 0.5);
        const subSegments = [
          [bezier1[0], ...split.slice(0, 3)],
          [...split.slice(2), bezier1[3]],
        ];
        output = Array.prototype.concat.apply([], [
          intersectBezierToBezierMk4(subSegments[0], bezier2),
          intersectBezierToBezierMk4(subSegments[1], bezier2),
        ]);
      }
    }
    splitStack.push();
    return output;
  };
})();

const intersectBezierToBezier = (() => {
  const pointStack = buildReverseStack(() => Array.from({ length: 5 }, () => vec2.create()));
  const boxA = createBoundingBox();
  const boxB = createBoundingBox();

  return (bezier1, bezier2) => {
    initBoundingBoxFromPoints(boxA, bezier1);
    initBoundingBoxFromPoints(boxB, bezier2);

    const size = getLargestBoxEdge(boxA, boxB);
    console.log('size ', size);
    if (size < EPSILON) {
      return collapseBoxesToPoint(boxA, boxB);
    }

    const slicePoints1 = pointStack.pop();
    sliceBezier(slicePoints1, bezier1[0], bezier1[1], bezier1[2], bezier1[3], 0.5);

    const slicePoints2 = pointStack.pop();
    sliceBezier(slicePoints2, bezier2[0], bezier2[1], bezier2[2], bezier2[3], 0.5);

    const subPath1A = [bezier1[0], ...slicePoints1.slice(0, 3)];
    const subPath1B = [...slicePoints1.slice(2), bezier1[3]];

    const subPath2A = [bezier2[0], ...slicePoints2.slice(0, 3)];
    const subPath2B = [...slicePoints2.slice(2), bezier2[3]];

    const subPaths1 = [subPath1A, subPath1B];
    const subPaths2 = [subPath2A, subPath2B];

    const output = Array.prototype.concat.apply([], subPaths1.reduce((acc, path1) => {
      subPaths2.forEach(path2 => {
        initBoundingBoxFromPoints(boxA, path1);
        initBoundingBoxFromPoints(boxB, path2);
        if (doBoxesOverlap(boxA, boxB)) {
          //return intersectBezierToBezier(path1, path2);
          acc.push(intersectBezierToBezier(path1, path2));
        }
      });
      return acc;
    }, [])).filter(v => !!v);

//      const output = [].concat(
//        intersectBezierToBezier(
//          [bezier1[0], slicePoints1[0], slicePoints1[1], slicePoints1[2]],
//          [bezier2[0], slicePoints2[0], slicePoints2[1], slicePoints2[2]]),
//        intersectBezierToBezier(
//          [bezier1[0], slicePoints1[0], slicePoints1[1], slicePoints1[2]],
//          [slicePoints2[2], slicePoints2[3], slicePoints2[4], bezier2[3]]),
//        intersectBezierToBezier(
//          [slicePoints1[2], slicePoints1[3], slicePoints1[4], bezier1[3]],
//          [bezier2[0], slicePoints2[0], slicePoints2[1], slicePoints2[2]]),
//        intersectBezierToBezier(
//          [slicePoints1[2], slicePoints1[3], slicePoints1[4], bezier1[3]],
//          [slicePoints2[2], slicePoints2[3], slicePoints2[4], bezier2[3]]),
//      ).filter(v => !!v);

    pointStack.push();
    pointStack.push();
    return output;
  };
})();

export { intersectBezierToBezier, intersectBezierToBezierMk4 };
