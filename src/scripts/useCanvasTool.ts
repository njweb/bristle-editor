import { vec2, mat2d } from 'gl-matrix';
import { useEffect, Ref } from 'preact/hooks';
import bristle from './bristle';

const canvasTool = (canvasEl: HTMLCanvasElement): void => {
  const rect = canvasEl.getBoundingClientRect();
  const ctx = canvasEl.getContext('2d');
  if (!ctx) return undefined;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, rect.width, rect.height);

  const pathState = {};
  const br = bristle({ ctx2d: ctx, pathState });

  const projMat2d = mat2d.set(mat2d.create(), 1, 0, 0, -1, rect.width * 0.5, rect.height * 0.5);

  br((bCtx, state) => {
    bCtx.ctx2d.beginPath();
    // bCtx.m([0, 0]).c([60, 150]).p([80, 0]);
    bCtx.m([0, 0]).c([60, 150]).p([80, 0]);
    bCtx.ctx2d.closePath();

    bCtx.ctx2d.fillStyle = '#7B1FA2';
    bCtx.ctx2d.fill();
  }, projMat2d);

  return undefined;
};

export const useCanvasTool = (canvasRef: Ref<HTMLCanvasElement>): void => {
  useEffect(() => {
    if (canvasRef.current) {
      return canvasTool(canvasRef.current);
    }
    return undefined;
  }, [canvasRef.current]);
};
