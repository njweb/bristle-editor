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

const isPointInBoundingBox = (p, box) => {
  return p[0] >= box.min[0] && p[0] <= box.max[0] && p[1] >= box.min[1] && p[1] <= box.max[1];
};

const isPointAbove = (a, b) => a[0] >= b[0] && a[1] >= b[1];
const isPointBelow = (a, b) => a[0] <= b[0] && a[1] <= b[0];
const doBoundingBoxesOverlap = (boxA, boxB) => {
  const xOverlap = boxA.max[0] >= boxB.min[0] && boxA.min[0] <= boxB.max[0];
  const yOverlap = boxA.max[1] >= boxB.min[1] && boxA.min[1] <= boxB.max[1];
  return xOverlap && yOverlap;
};


export {
  createBoundingBox,
  initBoundingBoxFromSegment,
  isPointInBoundingBox,
  doBoundingBoxesOverlap,
};

