import { vec2 } from 'gl-matrix';
import buildDrawTool from './draw';
import {
  createBoundingBox,
  initBoundingBoxFromSegment,
  isPointInBoundingBox,
  doBoundingBoxesOverlap,
} from './boundingBox';

import { intersectSegments } from './intersectionSegment';

const drawTool = buildDrawTool();

const buildVector = (x, y) => vec2.set(vec2.create(), x, y);

const segmentA = [buildVector(100, 120), buildVector(200, 140)];
const segmentB = [buildVector(160, 80), buildVector(180, 180)];
//const segmentB = [buildVector(120, 120), buildVector(210, 210)];

drawTool.drawSegment(segmentA);
drawTool.drawSegment(segmentB);

const myBoxA = initBoundingBoxFromSegment(createBoundingBox(), segmentA);
drawTool.drawBox(myBoxA.min, myBoxA.max);

const myBoxB = initBoundingBoxFromSegment(createBoundingBox(), segmentB);
drawTool.drawBox(myBoxB.min, myBoxB.max);

const doStuff = () => {
  const answer = intersectSegments(segmentA, segmentB);
  console.log('answer ', answer);
  if (answer.length > 0) drawTool.drawPoint(answer[0]);
};

export default doStuff;
