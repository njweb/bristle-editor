import { mat2d, vec2 } from 'gl-matrix'

export function printCircle(ctx, point, radius) {
  ctx.beginPath();
  ctx.arc(point[0] + radius, point[1], radius, 0, Math.PI * 2, true);
  ctx.fillStyle = '#4422AA';
  ctx.fill();
}

export class Point {
  constructor(x, y) {
    this.position = [x, y];
    this.radius = 10;
  }

  print(ctx, projMat2d) {
    const projectedPosition = vec2.transformMat2d([], this.position, projMat2d);
    console.log('MAT >>>> ', projMat2d);
    console.log('PP >>>>> ', projectedPosition);
    printCircle(ctx, projectedPosition, this.radius);
  }
}