import { vec2, mat2d } from 'gl-matrix';

const buildVec2 = (x, y) => vec2.set(vec2.create(), x, y);
const moveTo = (ctx2d, point) => ctx2d.moveTo(point[0], point[1]);
const lineTo = (ctx2d, point) => ctx2d.lineTo(point[0], point[1]);
const localVec2 = vec2.create();
const projMatrix = mat2d.create();

const renderUtilities = {
  point: (() => {
    const offsetA = [2, 2];
    const offsetB = [2, -2];
    const offsetC = [-2, -2];
    const offsetD = [-2, 2];
    const outVec = vec2.create();

    return (ctx2d, transformMatrix, point) => {
      ctx2d.beginPath();

      moveTo(ctx2d, vec2.transformMat2d(outVec,
        vec2.add(outVec, point, offsetA), transformMatrix)),
        lineTo(ctx2d, vec2.transformMat2d(outVec,
          vec2.add(outVec, point, offsetB), transformMatrix)),
        lineTo(ctx2d, vec2.transformMat2d(outVec,
          vec2.add(outVec, point, offsetC), transformMatrix)),
        lineTo(ctx2d, vec2.transformMat2d(outVec,
          vec2.add(outVec, point, offsetD), transformMatrix)),

        ctx2d.closePath();
      ctx2d.fillStyle = 'black';
      ctx2d.strokeStyle = 'black';
      ctx2d.stroke();
      //ctx2d.fill();
    };
  })(),
  segment: (() => {
    const scaleValue = 6;
    const normal = vec2.create();
    const perpendicular = vec2.create();
    const backVec = vec2.create();
    const cornerVec = vec2.create();
    const outVec = vec2.create();

    return (ctx2d, transformMatrix, pointA, pointB) => {
      vec2.normalize(normal, vec2.sub(outVec, pointB, pointA));
      vec2.set(perpendicular, -normal[1], normal[0]);
      vec2.add(backVec, pointB, vec2.scale(outVec, normal, -scaleValue));
      vec2.add(cornerVec, backVec, vec2.scale(outVec, perpendicular, -scaleValue * 0.5));

      ctx2d.beginPath();
      moveTo(ctx2d, pointA);
      lineTo(ctx2d, pointB);
      lineTo(ctx2d, cornerVec);
      lineTo(ctx2d, backVec);
      ctx2d.strokeStyle = 'blue';
      ctx2d.fillStyle = 'none';
      ctx2d.stroke();
    };
  })(),
  referenceLines: ctx2d => {
    const { canvas } = ctx2d;
    const halfSize = buildVec2(canvas.width * 0.5, canvas.height * 0.5);

    ctx2d.beginPath();
    ctx2d.moveTo(0, halfSize[1]);
    ctx2d.lineTo(canvas.width, halfSize[1]);

    ctx2d.moveTo(halfSize[0], 0);
    ctx2d.lineTo(halfSize[0], canvas.height);

    ctx2d.strokeStyle = 'green';
    ctx2d.stroke();
  },
  referenceCross: (() => {
    const points = [
      buildVec2(0, 25),
      buildVec2(0, -25),
      buildVec2(25, 0),
      buildVec2(-25, 0),
    ];

    return (ctx2d, transformMatrix) => {
      ctx2d.beginPath();
      moveTo(ctx2d, vec2.transformMat2d(localVec2, points[0], transformMatrix));
      lineTo(ctx2d, vec2.transformMat2d(localVec2, points[1], transformMatrix));

      moveTo(ctx2d, vec2.transformMat2d(localVec2, points[2], transformMatrix));
      lineTo(ctx2d, vec2.transformMat2d(localVec2, points[3], transformMatrix));

      ctx2d.strokeStyle = 'blue';
      ctx2d.stroke();
    };
  })(),
};

const boardMethods = {
  render: function() {
    const {
      mouseSystem: { state: mouseState},
      ctx2d,
      viewportSystem,
      points,
    } = this;

    this.clearCanvas();
    this.drawSelectionBox();

    renderUtilities.referenceLines(ctx2d);

    viewportSystem.getProjectionMatrix(projMatrix);
    renderUtilities.referenceCross(ctx2d, projMatrix);
    points.forEach(p => {
      renderUtilities.point(ctx2d, projMatrix, p);
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
      mouseSystem: { state: mouseState},
      ctx2d,
    } = this;

    if (mouseState.isDragging) {
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
