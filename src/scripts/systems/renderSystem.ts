import { vec2 } from 'gl-matrix';
import { InterfaceMemory } from './interfaceSystem';

const renderPoint = (ctx: CanvasRenderingContext2D, v: vec2) => {
  const offsetValue = 3;
  ctx.beginPath();
  ctx.moveTo(v[0] + offsetValue, v[1] + offsetValue);
  ctx.lineTo(v[0] + offsetValue, v[1] - offsetValue);
  ctx.lineTo(v[0] - offsetValue, v[1] - offsetValue);
  ctx.lineTo(v[0] - offsetValue, v[1] + offsetValue);
  ctx.closePath();
};

const cachePoints = [vec2.create()];
const renderConnection = (ctx: CanvasRenderingContext2D, vA: vec2, vB: vec2) => {
  const [midPoint] = cachePoints;
  vec2.set(midPoint, vA[0], vB[1]);

  ctx.beginPath();
  ctx.moveTo(vA[0], vA[1]);
  ctx.lineTo(midPoint[0], midPoint[1]);
  ctx.strokeStyle = '#2180CF';
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(midPoint[0], midPoint[1]);
  ctx.lineTo(vB[0], vB[1]);
  ctx.strokeStyle = '#CF3520';
  ctx.stroke();
};

export interface RenderSystem {
  memory: {
    pointA: vec2;
    isRenderCycleActive: boolean;
  };
  outputCtx: CanvasRenderingContext2D;
  renderInterfaceSystem: (interfaceMemory: InterfaceMemory) => void;
  // doRender: () => void;
  // renderCycle: () => void;
}

export const buildRenderSystem = ({
  ctx2d,
  rect,
}: {
  ctx2d: CanvasRenderingContext2D;
  rect: DOMRect;
}): RenderSystem => {
  return {
    memory: {
      pointA: vec2.create(),
      isRenderCycleActive: false,
    },
    outputCtx: ctx2d,
    renderInterfaceSystem(interfaceMemory: InterfaceMemory) {
      const { outputCtx } = this;
      const { isMouseActive, downPoint, mousePoint } = interfaceMemory;

      outputCtx.setTransform(1, 0, 0, 1, 0, 0);
      outputCtx.clearRect(0, 0, rect.width, rect.height);

      if (isMouseActive) {
        renderConnection(outputCtx, mousePoint, downPoint);

        renderPoint(outputCtx, downPoint);
        outputCtx.fillStyle = '#2180CF';
        outputCtx.fill();
        renderPoint(outputCtx, mousePoint);
        outputCtx.fillStyle = '#CF3520';
        outputCtx.fill();
      }
    },
    // renderInterfaceSystem(interfaceMemory: InterfaceMemory) {
    //   const { outputCtx } = this;
    //   const offsetValue = 3;

    //   outputCtx.beginPath();
    //   outputCtx.moveTo(
    //     interfaceMemory.downPoint[0] - offsetValue,
    //     interfaceMemory.downPoint[1] - offsetValue
    //   );
    //   outputCtx.lineTo(
    //     interfaceMemory.downPoint[0] + offsetValue,
    //     interfaceMemory.downPoint[1] - offsetValue
    //   );
    //   outputCtx.lineTo(
    //     interfaceMemory.downPoint[0] + offsetValue,
    //     interfaceMemory.downPoint[1] + offsetValue
    //   );
    //   outputCtx.lineTo(
    //     interfaceMemory.downPoint[0] - offsetValue,
    //     interfaceMemory.downPoint[1] + offsetValue
    //   );
    //   outputCtx.closePath();
    //   outputCtx.fillStyle = "#BA2378";
    //   outputCtx.fill();
    // },
    // doRender: function() {
    //   if (this.memory.isRenderCycleActive === false) {
    //     // this.memory.isRenderCycleActive = true;
    //     this.doRender();
    //   }
    // },
    // renderCycle: function() {
    //   const { outputCtx: ctx } = this;
    //   ctx.beginPath
    //   // if (this.memory.isRenderCycleActive === true) {
    //   //   window.requestAnimationFrame(this.doRender);
    //   // }
    // }
  };
};
