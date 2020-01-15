import { vec2 } from 'gl-matrix';
import buildDrawTool from './draw';
import {
  createBoundingBox,
  initBoundingBoxFromSegment,
  initBoundingBoxFromPoints,
  isPointInBoundingBox,
  doBoundingBoxesOverlap,
} from './boundingBox';
import {
  interpolateBezier,
  sliceBezier,
  findBezierBoundingBox,
} from './curves';
import {
  //intersectBezierToBezier,
  intersectBezierToBezierMk4,
} from './curveIntersection';
import {
  intersectBezierToBezier,
} from './curveIntersection2';
import { intersectSegments } from './intersectionSegment';
import { buildShape, findIntersections } from './shapeIntersection';

const drawTool = buildDrawTool();

const buildVector = (x, y) => vec2.set(vec2.create(), x, y);
const bv2 = buildVector;

const segmentA = [buildVector(100, 120), buildVector(200, 140)];
const segmentB = [buildVector(160, 80), buildVector(180, 180)];
//const segmentB = [buildVector(120, 120), buildVector(210, 210)];

const renderSimpleIntersection = () => {
  drawTool.drawSegment(segmentA);
  drawTool.drawSegment(segmentB);

  const myBoxA = initBoundingBoxFromSegment(createBoundingBox(), segmentA);
  drawTool.drawBox(myBoxA.min, myBoxA.max);

  const myBoxB = initBoundingBoxFromSegment(createBoundingBox(), segmentB);
  drawTool.drawBox(myBoxB.min, myBoxB.max);

  const answer = intersectSegments(segmentA, segmentB);
  console.log('answer ', answer);
  if (answer.length > 0) drawTool.drawPoint(answer[0]);
};
const renderShapeIntersection = () => {
  const pathA = [buildVector(100, 100), buildVector(140, 60), buildVector(140, 120)];
  const pathB = [buildVector(120, 100), buildVector(180, 80), buildVector(120, 120)];

  const shapeA = buildShape(pathA);
  const shapeB = buildShape(pathB);

  drawTool.drawShape(pathA, 'blue');
  drawTool.drawShape(pathB, 'red');

  const intersections = findIntersections(shapeA, shapeB);
  console.log('inter ', intersections);
  intersections.forEach(i => drawTool.drawPoint(i));
};

const renderCurves = () => {
  const pA = bv2(40, 40);
  const pB = bv2(100, 160);
  const c1 = bv2(220, 40);
  const c2 = bv2(0, 210);

  const bezier1 = [pA, c1, c2, pB];
  const bezier2 = [bv2(110, 30), bv2(30, 150), bv2(30, 170), bv2(220, 180)];

  //initBoundingBoxFromPoints(bb, [pA, pB, c1, c2]);
  const bb = findBezierBoundingBox(pA, c1, c2, pB);
  drawTool.drawBox(bb.min, bb.max);

  drawTool.drawBezier(
    pA,
    c1,
    c2,
    pB);
  drawTool.drawBezier.apply(null, bezier2);
  drawTool.drawPoint(pA);
  drawTool.drawPoint(pB);
  drawTool.drawPoint(c1);
  drawTool.drawPoint(c2);

  drawTool.drawLine(bv2(100, 0), pB);
  drawTool.drawLine(bv2(0, 160), pB);

  const sliceArr = Array.from({ length: 5 }, () => vec2.create());
  sliceBezier(sliceArr, pA, c1, c2, pB, 0.5);

  console.time('inter');
  const result = intersectBezierToBezier(bezier1, bezier2);
  console.timeEnd('inter');
  console.log('intersections ', result);
  result.forEach(r => {
    const point1 = interpolateBezier(
      vec2.create(),
      bezier1[0],
      bezier1[1],
      bezier1[2],
      bezier1[3],
      r.t1);
    const point2 = interpolateBezier(
      vec2.create(),
      bezier2[0],
      bezier2[1],
      bezier2[2],
      bezier2[3],
      r.t2);
    drawTool.drawPoint(point1, 'rgba(255,0,0,0.8)');
    drawTool.drawPoint(point2, 'rgba(0,0,255,0.8)');
  });

  console.time('inter');
  const result2 = intersectBezierToBezier(bezier1, bezier2);
  console.timeEnd('inter');

//  result.forEach(p => drawTool.drawPoint(p));
//  drawTool.drawBezier(result[0], result[1], result[2], result[3], 'blue');
//  console.timeEnd('inter');
//  console.log('inter ', result);
//  result.forEach(p => drawTool.drawPoint(p));

  //sliceArr.forEach(p => drawTool.drawPoint(p));
  //drawTool.drawBezier(pA, sliceArr[0], sliceArr[1], sliceArr[2], 'purple');
  //drawTool.drawBezier(sliceArr[2], sliceArr[3], sliceArr[4], pB, 'purple');

//  const oneThirdPoint = interpolateBezier(vec2.create(), pA, c1, c2, pB, 1/3);
//  drawTool.drawPoint(oneThirdPoint);
//
//  const twoThirdPoint = interpolateBezier(vec2.create(), pA, c1, c2, pB, 2/3);
//  drawTool.drawPoint(twoThirdPoint);
};

const doStuff = () => {
  //renderSimpleIntersection();
  //renderShapeIntersection();
  renderCurves();

  console.log('shape ', buildShape([[-10, 0], [0, 10], [5, 0]]));
};

export default doStuff;
