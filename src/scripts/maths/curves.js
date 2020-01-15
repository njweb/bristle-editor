import { vec2 } from 'gl-matrix';
import {
  createBoundingBox,
  isPointInBoundingBox,
  initBoundingBoxFromPoints,
} from './boundingBox';
import buildReverseStack from './reverseStack';

const interpolateQuad = (() => {
  const iA = vec2.create();
  const iB = vec2.create();
  return (out, pA, c, pB, t) => {
    vec2.lerp(iA, pA, c, t);
    vec2.lerp(iB, c, pB, t);
    return vec2.lerp(out, iA, iB, t);
  };
})();

const interpolateBezier = (() => {
  const iA = vec2.create();
  const iB = vec2.create();
  const iC = vec2.create();

  return (out, pA, c1, c2, pB, t) => {
    vec2.lerp(iA, pA, c1, t);
    vec2.lerp(iB, c1, c2, t);
    vec2.lerp(iC, c2, pB, t);
    return interpolateQuad(out, iA, iB, iC, t);
  };
})();

const sliceQuad = (outArr, pA, c, pB, t) => {
  if (outArr.length < 3) throw Error('Output array must provide at least 3 vector2 elements');

  vec2.lerp(outArr[0], pA, c, t);
  vec2.lerp(outArr[2], c, pB, t);
  vec2.lerp(outArr[1], outArr[0], outArr[2], t);
  return outArr;
};

const sliceBezier = (() => {
  const iA = vec2.create();

  return (outArr, pA, c1, c2, pB, t) => {
    if (outArr.length < 5) throw Error('Output array must provide at least 5 vector2 elements');

    vec2.lerp(outArr[0], pA, c1, t);
    vec2.lerp(iA, c1, c2, t);
    vec2.lerp(outArr[4], c2, pB, t);

    vec2.lerp(outArr[1], outArr[0], iA, t);
    vec2.lerp(outArr[3], iA, outArr[4], t);

    vec2.lerp(outArr[2], outArr[1], outArr[3], t);

    return outArr;
  };
})();

const findBezierBoundingBox = (() => {
  const sliceStack = [];
  let stackIndex = 0;
  const reverseStack = buildReverseStack(() => Array.from({ length: 5 }, () => vec2.create()));

  return (pA, c1, c2, pB) => {
    const box = initBoundingBoxFromPoints(createBoundingBox(), [pA, pB]);
    if (isPointInBoundingBox(c1, box) && isPointInBoundingBox(c2, box)) return box;

    const slicePoints = reverseStack.pop();
    sliceBezier(slicePoints, pA, c1, c2, pB, 0.5);

    const sliceBoxes = [
      findBezierBoundingBox(pA, slicePoints[0], slicePoints[1], slicePoints[2]),
      findBezierBoundingBox(slicePoints[2], slicePoints[3], slicePoints[4], pB),
    ];
    reverseStack.push();

    //console.log('stack index ', stackIndex);
    return initBoundingBoxFromPoints(
      createBoundingBox(), [].concat(sliceBoxes.map(b => b.min), sliceBoxes.map(b => b.max)));
  };
})();

//const findBezierBoundingBox = (pA, c1, c2, pB) => {
//  const box = initBoundingBoxFromPoints(createBoundingBox(), [pA, pB]);
//  if (isPointInBoundingBox(c1, box) && isPointInBoundingBox(c2, box)) return box;
//
//  const slicePoints = Array.from({ length: 5 }, () => vec2.create());
//  sliceBezier(slicePoints, pA, c1, c2, pB, 0.5);
//
//  const sliceBoxes = [
//    findBezierBoundingBox(pA, slicePoints[0], slicePoints[1], slicePoints[2]),
//    findBezierBoundingBox(slicePoints[2], slicePoints[3], slicePoints[4], pB),
//  ];
//
//  return initBoundingBoxFromPoints(
//    createBoundingBox(), [].concat(sliceBoxes.map(b => b.min), sliceBoxes.map(b => b.max)));
//};

export {
  interpolateQuad,
  interpolateBezier,
  sliceBezier,
  findBezierBoundingBox,
};
