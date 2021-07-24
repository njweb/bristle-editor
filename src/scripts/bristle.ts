import { vec2, mat2d } from "gl-matrix";

const ERR_MSG_NO_OUTPUT_TARGET = "Must provide a canvas 2d context";
const ERR_MSG_TOO_MANY_CONTROL_POINTS = "Too many active control points";

const IDENTITY = mat2d.create();

interface SequenceFunc<T> {
  // eslint-disable-next-line no-use-before-define
  (pathContext: PathContext<T>, pathState: T): void;
}

export interface BranchFunc<T> {
  // eslint-disable-next-line no-use-before-define
  (sequenceFunc: SequenceFunc<T>, transform?: mat2d): PathContext<T>;
}

export interface PathContext<T> {
  ctx2d: CanvasRenderingContext2D;
  moveTo(point: vec2): this;
  pathTo(point: vec2): this;
  setControl(point: vec2): this;
  branch: BranchFunc<T>;
  localToGlobal(out: vec2, point: vec2): vec2;
  globalToLocal(out: vec2, point: vec2): vec2;
  m(point: vec2): this;
  p(point: vec2): this;
  c(point: vec2): this;
  b: BranchFunc<T>;
}

const buildCanvasCommands = (ctx2d: CanvasRenderingContext2D) => ({
  moveTo: (p: vec2): void => ctx2d.moveTo(p[0], p[1]),
  lineTo: (p: vec2): void => ctx2d.lineTo(p[0], p[1]),
  quadTo: (c: vec2, p: vec2): void =>
    ctx2d.quadraticCurveTo(c[0], c[1], p[0], p[1]),
  bezierTo: (c1: vec2, c2: vec2, p: vec2): void =>
    ctx2d.bezierCurveTo(c1[0], c1[1], c2[0], c2[1], p[0], p[1]),
  setTransform: (m: mat2d): void =>
    ctx2d.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]),
});

const bristle = <T>({
  ctx2d,
  pathState,
}: {
  ctx2d: CanvasRenderingContext2D;
  pathState: T;
}): BranchFunc<T> => {
  if (!ctx2d) throw Error(ERR_MSG_NO_OUTPUT_TARGET);

  const cachedMat2d = mat2d.create();

  const bristleState = {
    branchDepth: 0,
    transformStack: [mat2d.create()],

    controlCount: 0,
    controlPoints: [vec2.create(), vec2.create()],
  };

  const commands = buildCanvasCommands(ctx2d);

  const getActiveTransform = () =>
    bristleState.branchDepth === 0
      ? IDENTITY
      : bristleState.transformStack[bristleState.branchDepth];

  const pushTransform = (nextTransform: mat2d) => {
    const { transformStack, branchDepth } = bristleState;

    if (transformStack.length <= bristleState.branchDepth) {
      transformStack.push(mat2d.create());
    }
    if (branchDepth === 0) {
      mat2d.copy(transformStack[0], nextTransform);
    } else {
      mat2d.mul(
        transformStack[branchDepth],
        transformStack[branchDepth - 1],
        nextTransform
      );
    }
    // if (branchDepth === 0) {
    //   mat2d.copy(transformStack[0], nextTransform);
    // } else {
    //   if (transformStack.length >= bristleState.branchDepth + 1) {
    //     // if there is not enough existing space on the transform stack, push a new matrix
    //     transformStack.push(mat2d.create());
    //   }
    //   mat2d.mul(
    //     transformStack[branchDepth + 1],
    //     transformStack[branchDepth],
    //     nextTransform
    //   );
    // }

    bristleState.branchDepth += 1;

    commands.setTransform(transformStack[branchDepth]);
  };

  const popTransform = () => {
    bristleState.branchDepth = Math.max(0, bristleState.branchDepth - 1);
    if (bristleState.branchDepth > 0) {
      commands.setTransform(
        bristleState.transformStack[bristleState.branchDepth]
      );
    } else {
      commands.setTransform(IDENTITY);
    }
  };

  const pathActions = [
    (point: vec2) => {
      // line
      commands.lineTo(point);
    },
    (point: vec2) => {
      // quad
      commands.quadTo(bristleState.controlPoints[0], point);
      bristleState.controlCount = 0;
    },
    (point: vec2) => {
      // bezier
      commands.bezierTo(
        bristleState.controlPoints[0],
        bristleState.controlPoints[1],
        point
      );
      bristleState.controlCount = 0;
    },
  ];

  const pathContext: PathContext<T> = {
    ctx2d,
    moveTo(point) {
      commands.moveTo(point);
      return this;
    },
    pathTo(point) {
      pathActions[bristleState.controlCount](point);
      return this;
    },
    setControl(point) {
      if (bristleState.controlCount > 1)
        throw Error(ERR_MSG_TOO_MANY_CONTROL_POINTS);

      vec2.copy(bristleState.controlPoints[bristleState.controlCount], point);
      bristleState.controlCount += 1;
      return this;
    },
    branch(sequenceFn, transform) {
      if (transform) {
        pushTransform(transform);
      }
      sequenceFn(pathContext, pathState);
      if (transform) {
        popTransform();
      }
      return this;
    },
    localToGlobal: (out: vec2, point: vec2): vec2 =>
      vec2.transformMat2d(out, point, getActiveTransform()),
    globalToLocal: (out: vec2, point: vec2): vec2 => {
      mat2d.invert(cachedMat2d, getActiveTransform());
      return vec2.transformMat2d(out, point, cachedMat2d);
    },
    // prepare alias function keys
    m() {
      return this;
    },
    p() {
      return this;
    },
    c() {
      return this;
    },
    b() {
      return this;
    },
  };

  // setup aliases
  pathContext.m = pathContext.moveTo;
  pathContext.p = pathContext.pathTo;
  pathContext.c = pathContext.setControl;
  pathContext.b = pathContext.branch;

  return pathContext.branch;
};

export default bristle;
