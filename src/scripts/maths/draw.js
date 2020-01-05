import { vec2 } from 'gl-matrix';

const buildVector = (x, y) => vec2.set(vec2.create(), x, y);
const localVector = vec2.create();

const drawPoint = ctx2d => {
  const offset = buildVector(-2, -2);
  return (point, color = 'red') => {
    ctx2d.beginPath();
    vec2.add(localVector, point, offset);
    ctx2d.fillStyle = color;
    ctx2d.fillRect(localVector[0], localVector[1], 4, 4);
  };
}
const drawLine = ctx2d => (pA, pB, color='blue') => {
  ctx2d.beginPath();
  ctx2d.moveTo(pA[0], pA[1]);
  ctx2d.lineTo(pB[0], pB[1]);
  ctx2d.strokeStyle = color;
  ctx2d.stroke();
};

const drawSegment = ctx2d => (s, color='blue') => {
  const [pA, pB] = s;
  drawLine(ctx2d)(pA, pB, color);
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
    ctx2d.beginPath();
    ctx2d.rect(pA[0], pA[1], localVector[0], localVector[1]);
    ctx2d.strokeStyle = '#DDD';
    ctx2d.stroke();
  };
};

const drawShape = ctx2d => {
  return (points, color='black') => {
    ctx2d.beginPath();
    points.forEach((p, idx) => idx === 0 ? ctx2d.moveTo(p[0], p[1]) : ctx2d.lineTo(p[0], p[1]));
    ctx2d.lineTo(points[0][0], points[0][1]);
    ctx2d.strokeStyle = color;
    ctx2d.stroke();
  }
};

const drawQuad = ctx2d => {
  return (pA, c1, pB) => {
    ctx2d.beginPath();
    ctx2d.moveTo(pA[0], pA[1]);
    ctx2d.quadraticCurveTo(c1[0], c1[1], pB[0], pB[1]);
    ctx2d.strokeStyle = color;
    ctx2d.stroke();
  };
};
const drawBezier = ctx2d => {
  return (pA, c1, c2, pB, color='green') => {
    ctx2d.beginPath();
    ctx2d.moveTo(pA[0], pA[1]);
    ctx2d.bezierCurveTo(c1[0], c1[1], c2[0], c2[1], pB[0], pB[1]);
    ctx2d.strokeStyle = color;
    ctx2d.stroke();
  };
};

const buildDrawTool = () => {
  const canvas = document.querySelector('#demo');
  const ctx2d = canvas.getContext('2d');

  return {
    drawPoint: drawPoint(ctx2d),
    drawLine: drawLine(ctx2d),
    drawSegment: drawSegment(ctx2d),
    drawNormal: drawNormal(ctx2d),
    drawBox: drawBox(ctx2d),
    drawShape: drawShape(ctx2d),
    drawQuad: drawQuad(ctx2d),
    drawBezier: drawBezier(ctx2d),
  };
};

export default buildDrawTool;
