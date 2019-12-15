import { vec2, mat2d } from 'gl-matrix';

const buildVec2 = (x, y) => vec2.set(vec2.create(), x, y);

const mem = {
  a: vec2.create(),
};

const buildDrawTool = ctx2d => {
  const moveTo = point => ctx2d.moveTo(point[0], point[1]);
  const lineTo = point => ctx2d.lineTo(point[0], point[1]);

  const pointPath = (() => {
    const corners = [
      buildVec2(2, 2)
      buildVec2(2, -2),
      buildVec2(-2, -2),
      buildVec2(-2, 2),
    ];
    return point => {
      ctx2d.beginPath();
      moveTo(vec2.add(mem.a, point, corners[0]));
      lineTo(vec2.add(mem.a, point, corners[1]));
      lineTo(vec2.add(mem.a, point, corners[2]));
      lineTo(vec2.add(mem.a, point, corners[3]));
      ctx.closePath();
    };
  })();

  return {
    moveTo,
    lineTo,
    pointPath,
  };
};

export { buildDrawTool };
