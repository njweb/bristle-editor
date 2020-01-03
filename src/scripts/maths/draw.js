import { vec2 } from 'gl-matrix';

const buildVector = (x, y) => vec2.set(vec2.create(), x, y);
const localVector = vec2.create();

const drawPoint = ctx2d => {
  const offset = buildVector(-2, -2);
  return point => {
    ctx2d.beginPath();
    vec2.add(localVector, point, offset);
    ctx2d.fillStyle = 'red';
    ctx2d.fillRect(localVector[0], localVector[1], 4, 4);
  };
}
const drawSegment = ctx2d => s => {
  const [pA, pB] = s;
  ctx2d.beginPath();
  ctx2d.moveTo(pA[0], pA[1]);
  ctx2d.lineTo(pB[0], pB[1]);
  ctx2d.strokeStyle = 'blue';
  ctx2d.stroke();

  drawPoint(ctx2d)(pA);
  drawPoint(ctx2d)(pB);
};

const drawNormal = ctx2d => {
  const perpVec = vec2.create();
  const cornerVec = vec2.create();
  const lipVec = vec2.create();
  const tipVec = vec2.create();
  const lineTo = p => {
    ctx2d.lineTo(p[0], p[1]);
  };

  return (anchor, normal) => {
    vec2.set(perpVec, normal[1], -normal[0]);
    vec2.add(cornerVec, anchor, vec2.scale(cornerVec, normal, 14));
    vec2.add(lipVec, cornerVec, vec2.scale(localVector, perpVec, 3));
    vec2.add(tipVec, anchor, vec2.scale(tipVec, normal, 22));

    ctx2d.beginPath();
    ctx2d.moveTo(anchor[0], anchor[1]);
    lineTo(cornerVec);
    lineTo(lipVec);
    lineTo(tipVec);
    ctx2d.strokeStyle = 'green';
    ctx2d.stroke();
  };
};

const drawBox = ctx2d => {
  return (pA, pB) => {
    vec2.sub(localVector, pB, pA);
    ctx2d.rect(pA[0], pA[1], localVector[0], localVector[1]);
    ctx2d.strokeStyle = '#DDD';
    ctx2d.stroke();
  };
};

const buildDrawTool = () => {
  const canvas = document.querySelector('#demo');
  const ctx2d = canvas.getContext('2d');

  return {
    drawPoint: drawPoint(ctx2d),
    drawSegment: drawSegment(ctx2d),
    drawNormal: drawNormal(ctx2d),
    drawBox: drawBox(ctx2d),
  };
};

export default buildDrawTool;
