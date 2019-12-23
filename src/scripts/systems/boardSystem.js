import { vec2, mat2d } from 'gl-matrix';
import drawUtilites from '../graphics/drawUtilities';
import buildCameraTool from '../tools/cameraTool';

const localVec2 = vec2.create();
const buildVec2 = (x, y) => vec2.set(vec2.create(), x, y);
const projMatrix = mat2d.create();

const boardMethods = {
  render: function() {
    const {
      ctx2d,
      viewportSystem,
      points,
    } = this;

    this.clearCanvas();
    this.drawSelectionBox();

    drawUtilites.referenceLines(ctx2d);

    viewportSystem.getProjectionMatrix(projMatrix);
    drawUtilites.referenceCross(ctx2d, projMatrix);
    points.forEach(p => {
      drawUtilites.point(ctx2d, projMatrix, p);
    });

    this.willRender = false;
  },
  prepareRender(boundRenderFn) {
    if (!this.willRender) {
      window.requestAnimationFrame(boundRenderFn);
      this.willRender = true;
    }
  },
  clearCanvas: function() {
    const { ctx2d } = this;

    ctx2d.fillStyle = 'white';
    ctx2d.fillRect(0, 0, ctx2d.canvas.width, ctx2d.canvas.height);
  },
  drawSelectionBox: function() {
    const {
      mouseSystem,
      ctx2d,
    } = this;

    if (mouseSystem.isDragging) {
      vec2.sub(localVec2, mouseSystem.dragPoint, mouseSystem.grabPoint);

      ctx2d.strokeStyle = 'red';
      ctx2d.strokeRect(
        mouseSystem.grabPoint[0],
        mouseSystem.grabPoint[1],
        localVec2[0],
        localVec2[1]);
    }
  },
};

const buildBoardSystem = ({ ctx2d, mouseSystem, viewportSystem }) => {
  const boardState = {
    ctx2d,
    mouseSystem,
    viewportSystem,
    willRender: false,
    points: [
      buildVec2(0, 0),
      buildVec2(300, -180),
      buildVec2(-150, 50),
    ],
  };

  const cameraTool = buildCameraTool({ systems: { mouseSystem, viewportSystem } });

  const boardSystem = Object.assign(Object.create(boardMethods), boardState);
  mouseSystem.subscribe((msgType, sourceSystem) => {
    console.log('event', msgType, sourceSystem);
    boardSystem.prepareRender(boardSystem.render.bind(boardSystem))
  });

  return boardSystem;
};

export default buildBoardSystem;
