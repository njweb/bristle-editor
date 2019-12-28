import { vec2, mat2d } from 'gl-matrix';

const localVec2 = vec2.create();
const localMatrix = mat2d.create();

const updateCameraMatrix = viewportState => {
  const { offset, scale, rotation, cameraMatrix, viewportMatrix } = viewportState;

  mat2d.fromRotation(cameraMatrix, rotation);

  mat2d.fromScaling(localMatrix, vec2.set(localVec2, scale, scale));
  mat2d.mul(cameraMatrix, localMatrix, cameraMatrix);

  mat2d.fromTranslation(localMatrix, vec2.negate(localVec2, offset));
  mat2d.mul(cameraMatrix, localMatrix, cameraMatrix);

  return cameraMatrix;
};

const viewportMethods = {
  projectPoint: function(out, point) {
    return vec2.transformMat2d(out, point, this.getProjectionMatrix(localMatrix));
  },
  getProjectionMatrix: function(out) {
    //return mat2d.mul(out, this.cameraMatrix, this.viewportMatrix);
    return mat2d.mul(out, this.viewportMatrix, this.cameraMatrix);
  },
  setOffset(newOffset) {
    vec2.copy(this.offset, newOffset);
    updateCameraMatrix(this);
  },
  setScale(newScale) {
  },
  setRotation(newRotation) {
  },
};

const buildViewportSystem = ({ ctx2d }) => {
  const canvasHalfSize = vec2.scale(vec2.create(), [ctx2d.canvas.width, ctx2d.canvas.height], 0.5);

  const scaleMatrix = (matrix, scale) => (
    mat2d.fromScaling(matrix, vec2.set(localVec2, scale, scale)));

  const viewportState = {
    offset: [0, 0],
    scale: 1,
    rotation: 0,
    ctx2d,
    cameraMatrix: mat2d.create(),
  };
  viewportState.transforms = {
    flipY: mat2d.fromScaling(mat2d.create(), [1, -1]),
    recenter: mat2d.fromTranslation(mat2d.create(), canvasHalfSize),
    offset: mat2d.fromTranslation(mat2d.create(), viewportState.offset),
    scale: mat2d.fromScaling(mat2d.create(), [viewportState.scale, viewportState.scale]),
    rotation: mat2d.fromRotation(mat2d.create(), viewportState.rotation),
  };
  viewportState.viewportMatrix = mat2d.mul(
    mat2d.create(),
    viewportState.transforms.recenter,
    viewportState.transforms.flipY);

  const viewport = Object.assign(Object.create(viewportMethods), viewportState);
  updateCameraMatrix(viewport);

  return viewport;
};

export default buildViewportSystem;
