import { vec2, mat2d } from 'gl-matrix';
import drawUtilites from '../graphics/drawUtilities';

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
      vec2.sub(localVec2, mouseState.dragPoint, mouseState.dragAnchor);

      ctx2d.strokeStyle = 'red';
      ctx2d.strokeRect(
        mouseState.dragAnchor[0],
        mouseState.dragAnchor[1],
        localVec2[0],
        localVec2[1]);
    }
  },
  prepareRender: function() {
    if (!this.willRender) {
      window.requestAnimationFrame(render);
      this.willRender = true;
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

  const boardSystem = Object.assign(Object.create(boardMethods), boardState);
  mouseSystem.subscribe(() => boardSystem.prepareRender());

  return boardSystem;
};

export default buildBoardSystem;
