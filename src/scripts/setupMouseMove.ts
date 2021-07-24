import { vec2, mat2d } from 'gl-matrix';

const moveTo = (ctx: CanvasRenderingContext2D, vec: vec2) => ctx.moveTo(vec[0], vec[1]);
const lineTo = (ctx: CanvasRenderingContext2D, vec: vec2) => ctx.lineTo(vec[0], vec[1]);

const buildMouseMoveHandler = (ctx: CanvasRenderingContext2D, rect: DOMRect) => (e: MouseEvent) => {
  const offsetPoint = vec2.set(vec2.create(), e.offsetX, e.offsetY);
  const transformMat = mat2d.fromValues(1, 0, 0, -1, rect.width * 0.5, rect.height * 0.5);
  const invMat = mat2d.invert(mat2d.create(), transformMat);

  const pointA = vec2.create();
  const pointB = vec2.set(vec2.create(), 0, 40);
  // const pointC = vec2.set(vec2.create(), 20, 0);
  const pointMouse = vec2.transformMat2d(vec2.create(), offsetPoint, invMat);

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, rect.width, rect.height);
  ctx.setTransform(1, 0, 0, -1, rect.width * 0.5, rect.height * 0.5);
  ctx.beginPath();
  moveTo(ctx, pointA);
  lineTo(ctx, pointB);
  lineTo(ctx, pointMouse);
  // ctx.moveTo(0, 0);
  // ctx.lineTo.apply(ctx, pointA);
  // ctx.lineTo(20, 0);
  ctx.closePath();
  ctx.fillStyle = '#7B1FA2';
  ctx.fill();
};

const setupMouseMoveHandler = (canvasEl: HTMLCanvasElement): () => void => {
  const rect = canvasEl.getBoundingClientRect();
  const ctx = canvasEl.getContext('2d');
  if (!ctx) {
    return () => undefined;
  }

  const moveHandler = buildMouseMoveHandler(ctx, rect);
  canvasEl.addEventListener('mousemove', moveHandler);

  return () => canvasEl.removeEventListener('mousemove', moveHandler);
};

export default setupMouseMoveHandler;
