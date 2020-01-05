import { vec2 } from 'gl-matrix';
import buildDrawTool from './draw';
import {
  createBoundingBox,
  initBoundingBoxFromSegment,
  isPointInBoundingBox,
  doBoundingBoxesOverlap,
  interpolateBezier,
} from './boundingBox';

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

  drawTool.drawBezier(
    pA,
    c1,
    c2,
    pB);
  drawTool.drawPoint(pA);
  drawTool.drawPoint(pB);

  drawTool.drawLine(bv2(100, 0), pB);
  drawTool.drawLine(bv2(0, 160), pB);

  const oneThirdPoint = interpolateBezier(vec2.create(), pA, c1, c2, pB, 1/3);
  drawTool.drawPoint(oneThirdPoint);

  const twoThirdPoint = interpolateBezier(vec2.create(), pA, c1, c2, pB, 2/3);
  drawTool.drawPoint(twoThirdPoint);
};

const doStuff = () => {
  //renderSimpleIntersection();
  //renderShapeIntersection();
  renderCurves();

  console.log('shape ', buildShape([[-10, 0], [0, 10], [5, 0]]));
};

export default doStuff;
