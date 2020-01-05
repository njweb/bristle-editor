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

const EPSILON = 0.0000001;
const approximatelyEqual = (v1, v2) => Math.abs(v1 - v2) < EPSILON;
const acceptRoot = t => 0 <= t && t <= 1;
const cuberoot = v => {
  if (v<0) return -Math.pow(-v, 1/3);
  return Math.pow(v, 1/3);
};

const getLinearRoot = (c, b) => [-c / b].filter(acceptRoot);
const getQuadraticRoots = (a, b, c) => {
  const q = Math.sqrt(b * b - 4 * a * c);
  const aa = 2 * a;
  return [(q - b) / aa, (-b - q) / aa].filter(acceptRoot);
};
const getThreeRealRoots = (aD, p, p3, q, q2) => {
  const mp3 = -p / 3;
  const mp33 = mp3 * mp3 * mp3;
  const r = Math.sqrt(mp33);
  const t = -q / (2 * r);
  const cosphi = t < -1 ? -1 : t > 1 ? 1 : t;
  const phi = Math.acos(cosphi);
  const crtr = cuberoot(r);
  const t1 = 2 * crtr;
  const root1 = t1 * Math.cos(phi / 3) - (a / 3);
  const root2 = t1 * Math.cos((phi + 2 * pi) / 3) - (a / 3);
  const root3 = t1 * Math.cos((phi + 4 * pi) / 3) - (a / 3);
  return [root1, root2, root3].filter(acceptRoot);
};
const getTwoRealRoots = (aD, q2) => {
  const u1 = q2 < 0 ? cuberoot(-q2) : -cuberoot(q2);
  const root1 = 2 * u1 - aD / 3;
  const root2 = -u1 - aD / 3;
  return [root1, root2].filter(acceptRoot);
};
const getOneRealRoot = (aD, q2, discriminant) => {
  const sd = Math.sqrt(discriminant);
  const u1 = cuberoot(sd - q2);
  const v1 = cuberoot(sd + q2);
  const root1 = u1 - v1 - a/3;
  return [root1].filter(acceptRoot);
};

const getAllCubicRoots = (a, b, c, d) => {
  const aD = a / d;
  const bD = b / d;
  const cD = c / d;

  const p = (3 * bD - aD * aD) / 3;
  const p3 = p / 3;
  const q = (2 * aD * aD * aD - 9 * aD * bD + 27 * cD) / 27;
  const q2 = q / 2;
  const discriminant = q2 * q2 + p3 * p3 * p3;

  if (discriminant < 0) {
    return getThreeRealRoots(aD, p, p3, q, q2);
  } else if (discriminant === 0) {
    return getTwoRealRoots(aD, q2);
  }
  return getOneRealRoot(aD, q2, discriminant);
};

const getCubicRoots = (pA, c1, c2, pB) => {
  let a = (3 * pA) - (6 * c1) + (3 * c2);
  let b = (-3 * pA) - (3 * c1);
  let c = pA;
  let d = -pA + (3 * c1) - (3 * c2) + pB;

  // is !cubic
  if (approximatelyEqual(d, 0)) {
    // is !quadratic
    if (approximatelyEqual(a, 0)) {
      // is !linear
      if (approximatelyEqual(b, 0)) {
        return [];
      }
      return getLinearRoot(c, b);
    }
    return getQuadraticRoots(a, b ,c);
  }
  return getAllCubicRoots(a, b, c, d);
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
  isPointInBoundingBox,
  doBoundingBoxesOverlap,
  interpolateBezier,
};

