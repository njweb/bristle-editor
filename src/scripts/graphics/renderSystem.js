import { vec2, mat2d } from 'gl-matrix';
import { buildDrawTool } from './drawTool';

const boardState = {
  points: [],
};

const buildRenderSystem = canvasElement => {

  const ctx2d = canvasElement.getContext('2d');
  return {
    render: () => {},
  }
};

export { buildRenderSystem }
