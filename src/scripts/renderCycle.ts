import { vec2, mat2d } from "gl-matrix";
import bristle, { BranchFunc } from "./bristle";

interface CyclePathState {
  t: number;
}

const buildDrawPath = (
  bristleTool: BranchFunc<CyclePathState>,
  projMat2d: mat2d
): ((duration: number) => void) => {
  // const vUnit = vec2.set(vec2.create(), 1, 1);

  const pOrigin = vec2.create();
  const pTop = vec2.set(vec2.create(), 0, 200);
  const pOuter = vec2.set(vec2.create(), 200, 0);

  const cA = vec2.create();

  return (duration) => {
    bristleTool((bCtx, state: CyclePathState) => {
      const ctx = bCtx.ctx2d;
      state.t += duration * 0.0005;
      if (state.t > 1) state.t -= Math.floor(state.t);
      const t = Math.sin((state.t * 2 - 1) * Math.PI);

      vec2.set(cA, 100 + t * 60, 100 + t * 60);

      ctx.beginPath();
      bCtx.m(pOrigin).p(pTop).c(cA).p(pOuter);
      ctx.closePath();
      ctx.fillStyle = "#7B1FA2";
      ctx.fill();
    }, projMat2d);
  };
};

export const startRenderCycle = (
  ctx: CanvasRenderingContext2D,
  rect: DOMRect
): void => {
  let prevTimestamp: number;
  let duration: number;
  let count = 0;

  const pathState: CyclePathState = { t: 0 };
  const bristleTool = bristle<CyclePathState>({ ctx2d: ctx, pathState });
  const projMat2d = mat2d.set(
    mat2d.create(),
    1,
    0,
    0,
    -1,
    rect.width * 0.5,
    rect.height * 0.5
  );
  const drawPath = buildDrawPath(bristleTool, projMat2d);

  const frameLoop = (timestamp: number | void) => {
    if (timestamp) {
      if (prevTimestamp) {
        duration = timestamp - prevTimestamp;
      }
      prevTimestamp = timestamp;
      if (duration) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, rect.width, rect.height);
        drawPath(duration);
      }
    }

    if (count < 1000) {
      count += 1;
      window.requestAnimationFrame(frameLoop);
    }
  };
  frameLoop();
};
