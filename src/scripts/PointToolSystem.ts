import { vec2, mat2d } from 'gl-matrix';

export interface PointToolSystem {
  activePoint: vec2;
}

export const buildPointToolSystem = (): PointToolSystem => ({
  activePoint: vec2.create(),
});
