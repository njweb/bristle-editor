import { vec2 } from 'gl-matrix';

const createBoundingBox = () => ({
  min: vec2.create(),
  max: vec2.create(),
});

const initBoundingBoxFromSegment = (out, s) => {
  out.min[0] = Math.min(s[0][0], s[1][0]);
  out.min[1] = Math.min(s[0][1], s[1][1]);
  out.max[0] = Math.max(s[0][0], s[1][0]);
  out.max[1] = Math.max(s[0][1], s[1][1]);
  return out;
};

const initBoundingBoxFromPoints = (out, pointsArr) => {
  out.min[0] = Math.min.apply(null, pointsArr.map(p => p[0]));
  out.min[1] = Math.min.apply(null, pointsArr.map(p => p[1]));
  out.max[0] = Math.max.apply(null, pointsArr.map(p => p[0]));
  out.max[1] = Math.max.apply(null, pointsArr.map(p => p[1]));
  return out;
};

const isPointInBoundingBox = (p, box) => {
  return p[0] >= box.min[0] && p[0] <= box.max[0] && p[1] >= box.min[1] && p[1] <= box.max[1];
};

const getBoundingBoxSize = box => (box.max[0] - box.min[0]) * (box.max[1] - box.min[1]);

const isPointAbove = (a, b) => a[0] >= b[0] && a[1] >= b[1];
const isPointBelow = (a, b) => a[0] <= b[0] && a[1] <= b[0];

const doBoundingBoxesOverlap = (boxA, boxB) => {
  const xOverlap = boxA.max[0] >= boxB.min[0] && boxA.min[0] <= boxB.max[0];
  const yOverlap = boxA.max[1] >= boxB.min[1] && boxA.min[1] <= boxB.max[1];
  return xOverlap && yOverlap;
};

const isBoundingBoxContained = (boxOuter, boxInner) => {
  return boxOuter.min[0] <= boxInner.min[0] && boxOuter.max[0] >= boxInner.max[0] &&
  boxOuter.min[1] <= boxInner.min[1] && boxOuter.max[1] >= boxInner.max[1];
};

const interpolateBezier = (() => {
  const iA = vec2.create();
  const iB = vec2.create();
  const iC = vec2.create();

  return (out, pA, c1, c2, pB, t) => {
    vec2.lerp(iA, pA, c1, t);
    vec2.lerp(iB, c1, c2, t);
    vec2.lerp(iC, c2, pB, t);
    vec2.lerp(iA, iA, iB, t);
    vec2.lerp(iB, iB, iC, t);
    return vec2.lerp(out, iA, iB, t);
  };
})();

export {
  createBoundingBox,
  initBoundingBoxFromSegment,
  initBoundingBoxFromPoints,
  isPointInBoundingBox,
  getBoundingBoxSize,
  doBoundingBoxesOverlap,
  isBoundingBoxContained,
  interpolateBezier,
};

