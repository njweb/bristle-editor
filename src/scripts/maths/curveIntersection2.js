import { vec2 } from 'gl-matrix';
import {
  createBoundingBox,
  initBoundingBoxFromPoints,
  doBoundingBoxesOverlap,
} from './boundingBox';
import { sliceBezier } from './curves';
import buildReverseStack from './reverseStack';

const EPSILON = 0.01;

const getBoxSize = box => (box.max[0] - box.min[0]) * (box.max[1] - box.min[1]);

const doBezierCurvesOverlap = (() => {
  const boxA = createBoundingBox();
  const boxB = createBoundingBox();

  return (bezier1, bezier2) => {
    initBoundingBoxFromPoints(boxA, bezier1);
    initBoundingBoxFromPoints(boxB, bezier2);
    return doBoundingBoxesOverlap(boxA, boxB);
  };
})();

const copyBezier = (out, bezier) => {
  vec2.copy(out[0], bezier[0]);
  vec2.copy(out[1], bezier[1]);
  vec2.copy(out[2], bezier[2]);
  vec2.copy(out[3], bezier[3]);
  return out;
};
const reverseBezier = (out, bezier) => {
  vec2.copy(out[0], bezier[3]);
  vec2.copy(out[1], bezier[2]);
  vec2.copy(out[2], bezier[1]);
  vec2.copy(out[3], bezier[0]);
  return out;
};
const extractCurve = (() => {
  const sliceA = Array.from({ length: 5 }, () => vec2.create());
  const sliceB = Array.from({ length: 5 }, () => vec2.create());

  return (out, bezier, t1, t2) => {
    sliceBezier(sliceA, bezier[0], bezier[1], bezier[2], bezier[3], t1);
    sliceBezier(sliceB, sliceA[2], sliceA[3], sliceA[4], bezier[3], (t2 - t1)/(1 - t1));
    vec2.copy(out[0], sliceA[2]);
    vec2.copy(out[1], sliceB[0]);
    vec2.copy(out[2], sliceB[1]);
    vec2.copy(out[3], sliceB[2]);
    return out;
  };
})();

const intersectBezierToBezier = (() => {
  const curveA = Array.from({ length: 4 }, () => vec2.create());
  const curveB = Array.from({ length: 4 }, () => vec2.create());
  const boxA = createBoundingBox();
  const boxB = createBoundingBox();
  let sizeA = 0;
  let sizeB = 0;

  const searchFn = (bezier1, bezier2, seg1, seg2) => {
    extractCurve(curveA, bezier1, seg1[0], seg1[1]);
    extractCurve(curveB, bezier2, seg2[0], seg2[1]);
    initBoundingBoxFromPoints(boxA, curveA);
    initBoundingBoxFromPoints(boxB, curveB);

    if (doBoundingBoxesOverlap(boxA, boxB)) {
      sizeA = getBoxSize(boxA);
      sizeB = getBoxSize(boxB);

      if (sizeA > EPSILON && sizeB > EPSILON) {
        const half1 = seg1[0] + ((seg1[1] - seg1[0]) * 0.33);
        const half2 = seg2[0] + ((seg2[1] - seg2[0]) * 0.33);

        const split1Lower = [seg1[0], half1];
        const split1Upper = [half1, seg1[1]];

        const split2Lower = [seg2[0], half2];
        const split2Upper = [half2, seg2[1]];

        return [
          searchFn(bezier1, bezier2, split1Lower, split2Lower),
          searchFn(bezier1, bezier2, split1Lower, split2Upper),
          searchFn(bezier1, bezier2, split1Upper, split2Lower),
          searchFn(bezier1, bezier2, split1Upper, split2Upper),
        ].filter(v => !!v).flat();
      } else if (sizeA > EPSILON) {
        const half1 = seg1[0] + ((seg1[1] - seg1[0]) * 0.33);

        const split1Lower = [seg1[0], half1];
        const split1Upper = [half1, seg1[1]];

        return [
          searchFn(bezier1, bezier2, split1Lower, seg2),
          searchFn(bezier1, bezier2, split1Upper, seg2),
        ].filter(v => !!v).flat();
      } else if (sizeB > EPSILON) {
        const half2 = seg2[0] + ((seg2[1] - seg2[0]) * 0.33);

        const split2Lower = [seg2[0], half2];
        const split2Upper = [half2, seg2[1]];

        return [
          searchFn(bezier1, bezier2, seg1, split2Lower),
          searchFn(bezier1, bezier2, seg1, split2Upper),
        ].filter(v => !!v).flat();
      }
      return { t1: (seg1[0] + seg1[1]) / 2, t2: (seg2[0] + seg2[1]) / 2 };
    }
    return null;
  };
  return (bezier1, bezier2) => {
    const result = searchFn(bezier1, bezier2, [0, 1], [0, 1]);
    if (result.length < 2) return result;
    const diffSet = result.map(v => v.t1).map((v, idx, arr) => {
      return Math.abs(v - arr[(idx + 1) % arr.length]);
    });
    return result.filter((v, idx) => diffSet[idx] > EPSILON);
  };
})();

const intersectBezierToBezierMk3 = (() => {
  const curveA = Array.from({ length: 4 }, () => vec2.create());
  const curveB = Array.from({ length: 4 }, () => vec2.create());
  const boxA = createBoundingBox();
  const boxB = createBoundingBox();
  let sizeA = 0;
  let sizeB = 0;
  let dt; // TODO remove me

  const searchFn = (bezier1, bezier2, slice1, slice2) => {
    extractCurve(curveA, bezier1, slice1[0] - slice1[1], slice1[0] + slice1[1])
    initBoundingBoxFromPoints(boxA, curveA);
    sizeA = getBoxSize(boxA);

    extractCurve(curveB, bezier2, slice2[0] - slice2[1], slice2[0] + slice2[1])
    initBoundingBoxFromPoints(boxB, curveB);
    sizeB = getBoxSize(boxB);

    //if (sizeA <= EPSILON && sizeB <= EPSILON) console.log('values ', sizeA, sizeB);
    //if (sizeA < 0.001) throw Error(`too small ${EPSILON}`);

    let toggle = sizeA > sizeB;
    let indexA = 1;
    let indexB = 1;
    while(doBoundingBoxesOverlap(boxA, boxB)) { // TODO remove index check
      if (sizeA <= EPSILON && sizeB <= EPSILON) return { first: slice1[0], second: slice2[0] };
      if (toggle) {
        indexA += 1;
        const offset = slice1[1] / indexA;
        extractCurve(curveA, bezier1, slice1[0] - offset, slice1[0] + offset);

        initBoundingBoxFromPoints(boxA, curveA);
        sizeA = getBoxSize(boxA);
      } else {
        indexB += 1;
        const offset = slice2[1] / indexB;
        extractCurve(curveB, bezier2, slice2[0] - offset, slice2[0] + offset);

        initBoundingBoxFromPoints(boxB, curveB);
        sizeB = getBoxSize(boxB);
      }
      //console.log('sizes ', sizeA, sizeB);
      //console.log('index ', indexA, indexB);
      toggle = !toggle;
//      if(toggle && sizeB > EPSILON) toggle = !toggle;
//      if(!toggle && sizeA > EPSILON) toggle = !toggle;
    }

    if (indexA !== 1 && indexB !== 1) {
      const offset1 = slice1[1] / indexA;
      const offset2 = slice2[1] / indexB;
      const sliceInner1 = [slice1[0], offset1];
      const sliceInner2 = [slice2[0], offset2];

      const outer1 = slice1[0] + slice1[1];
      const inner1 = slice1[0] + offset1;
      const halfDiff1 = (outer1 - inner1) / 2;
      const slice1Lower = [slice1[0] - offset1 - halfDiff1, halfDiff1];
      const slice1Upper = [slice1[0] + offset1 + halfDiff1, halfDiff1];

      const outer2 = slice2[0] + slice2[1];
      const inner2 = slice2[0] + offset2;
      const halfDiff2 = (outer2 - inner2) / 2;
      const slice2Lower = [slice2[0] - offset2 - halfDiff2, halfDiff2];
      const slice2Upper = [slice2[0] + offset2 + halfDiff2, halfDiff2];

//      return Array.prototype.concat.apply([], [
//        searchFn(bezier1, bezier2, sliceInner1, slice2Lower),
//        searchFn(bezier1, bezier2, sliceInner1, slice2Upper),
//        searchFn(bezier1, bezier2, slice1Lower, sliceInner2),
//        searchFn(bezier1, bezier2, slice1Upper, sliceInner2),
//
//        searchFn(bezier1, bezier2, slice1Lower, slice2Lower),
//        searchFn(bezier1, bezier2, slice1Lower, slice2Upper),
//        searchFn(bezier1, bezier2, slice1Upper, slice2Lower),
//        searchFn(bezier1, bezier2, slice1Upper, slice2Upper),
//      ]);
      return Array.prototype.concat.apply([], [
        searchFn(bezier1, bezier2, sliceInner1, slice2Lower),
        searchFn(bezier1, bezier2, sliceInner1, slice2Upper),
        searchFn(bezier1, bezier2, slice1Lower, sliceInner2),
        searchFn(bezier1, bezier2, slice1Upper, sliceInner2),

        searchFn(bezier1, bezier2, slice1Lower, slice2Lower),
        searchFn(bezier1, bezier2, slice1Lower, slice2Upper),
        searchFn(bezier1, bezier2, slice1Upper, slice2Lower),
        searchFn(bezier1, bezier2, slice1Upper, slice2Upper),
      ].filter(v => !!v));
    }
    if (indexA !== 1) {
      const outer = slice1[0] + slice1[1];
      const offset = slice1[1] / indexA;
      const inner = slice1[0] + offset;
      const halfDiff = (outer - inner) / 2;
//      return Array.prototype.concat.apply([], [
//        searchFn(bezier1, bezier2, [slice1[0] - offset - halfDiff, halfDiff], slice2),
//        searchFn(bezier1, bezier2, [slice1[0] + offset + halfDiff, halfDiff], slice2),
//      ]);
      return Array.prototype.concat.apply([], [
        searchFn(bezier1, bezier2, [slice1[0] - offset - halfDiff, halfDiff], slice2),
        searchFn(bezier1, bezier2, [slice1[0] + offset + halfDiff, halfDiff], slice2),
      ].filter(v => !!v));
    }
    if (indexB !== 1) {
      const outer = slice2[0] + slice2[1];
      const offset = slice2[1] / indexB;
      const inner = slice2[0] + offset;
      const halfDiff = (outer - inner) / 2;
//      return Array.prototype.concat.apply([], [
//        searchFn(bezier1, bezier2, slice1, [slice2[0] - offset - halfDiff, halfDiff]),
//        searchFn(bezier1, bezier2, slice1, [slice2[0] + offset + halfDiff, halfDiff]),
//      ]);
      return Array.prototype.concat.apply([], [
        searchFn(bezier1, bezier2, slice1, [slice2[0] - offset - halfDiff, halfDiff]),
        searchFn(bezier1, bezier2, slice1, [slice2[0] + offset + halfDiff, halfDiff]),
      ].filter(v => !!v));
    }
    return null;
  }

  return (bezier1, bezier2, drawTool) => {
    dt = drawTool;
    return searchFn(bezier1, bezier2, [0.5, 0.5], [0.5, 0.5]);
  };
})()

const intersectBezierToBezierMk2 = (() => {
  const pathStack = buildReverseStack(() => Array.from({ length: 4 }, () => vec2.create()));
  const bezierA = Array.from({ length: 4 }, () => vec2.create());
  const bezierB = Array.from({ length: 4 }, () => vec2.create());
  const slicePoints = Array.from({ length: 5 }, () => vec2.create());

  const slice = (out, bezier, t) => {
    sliceBezier(slicePoints, bezier[0], bezier[1], bezier[2], bezier[3], t);
    vec2.copy(out[0], bezier[0]);
    vec2.copy(out[1], slicePoints[0]);
    vec2.copy(out[2], slicePoints[1]);
    vec2.copy(out[3], slicePoints[2]);
    return out;
  };

  return (bezier1, bezier2, drawTool) => { // TODO remove draw tool
    // split bezier1
    // check overlap for subsection 1
    // if no overlap
    // -> reverse paths and recurse
    // or flip section to shrink
    copyBezier(bezierA, bezier1);
    copyBezier(bezierB, bezier2);
    let splitA = true;
    let t1 = 1;
    let t2 = 1;

    let index = 0;
    while (doBezierCurvesOverlap(bezierA, bezierB) && index < 10) {
      index += 1; // TODO remove while-loop index tracking

      if (splitA) {
        t1 = t1 / 2;
        slice(bezierA, bezier1, t1);
      } else {
        t2 = t2 / 2;
        slice(bezierB, bezier2, t2);
      }
      splitA = !splitA;
    }
//    while(index < 7) {
//      index += 1;
//      if (doBezierCurvesOverlap(bezierA, bezierB)) {
//        if (splitA) {
//          t1 = t1 / 2;
//          slice(bezierA, bezier1, t1);
//          drawTool.drawPoint(bezierA[3], 'grey');
//        } else {
//          t2 = t2 / 2;
//          slice(bezierB, bezier2, t2);
//          drawTool.drawPoint(bezierB[3], 'grey');
//        }
//        splitA = !splitA;
//      } else {
//        splitA = !splitA;
//        if (splitA) {
//          t1 = t1 * 2;
//          slice(bezierA, bezier1, t1);
//          const bezierOut = pathStack.pop();
//          reverseBezier(bezierOut, bezierA);
//          bezierOut.forEach(p => drawTool.drawPoint(p, 'purple'));
//
//          // intersectBezierToBezier(bezier2, bezierOut)
//
//          pathStack.push();
//        } else {
//          t2 = t2 * 2;
//          console.log('b1 ', bezierB[3]);
//          slice(bezierB, bezier2, t2);
//          console.log('b2 ', bezierB[3]);
//          const bezierOut = pathStack.pop();
//          reverseBezier(bezierOut, bezierB);
//          bezierOut.forEach(p => drawTool.drawPoint(p, 'purple'));
//
//          pathStack.push();
//        }
//        // double the t value
//        // reslice
//        // flip the bezier
//        // recurse
//      }
//    }

    return [
      vec2.copy(vec2.create(), bezierA[3]),
      vec2.copy(vec2.create(), bezierB[3]),
    ];
  };
})();

export { intersectBezierToBezier };
