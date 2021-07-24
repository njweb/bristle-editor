import { vec2, mat2d } from "gl-matrix";
import { createContext } from "preact";
import { Ref } from "preact/hooks";

export interface EditorMemory {
  // ctx2d?: CanvasRenderingContext2D;
  points: vec2[];
  mouseStatus: {
    cursorPoint: vec2;
    downPoint: vec2;
    active: boolean;
  };
}

export interface EditorOutput {
  outputTarget?: CanvasRenderingContext2D;
  isCycleActive: boolean;
  activateOutputCycle: () => void;
  performOutput: () => void;
}

export interface EditorSystem {
  memory: EditorMemory;

  mouseMoveHandler: (e: MouseEvent) => void;
  mouseUpHandler: (e: MouseEvent) => void;
  mouseDownHandler: (e: MouseEvent) => void;
  mouseEnterHandler: (e: MouseEvent) => void;
  mouseLeaveHandler: (e: MouseEvent) => void;

  output: EditorOutput;
}

export const buildEditorSystem = (): EditorSystem => ({
  memory: {
    points: [vec2.create()],
    mouseStatus: {
      cursorPoint: vec2.create(),
      downPoint: vec2.create(),
      active: false,
    },
  },
  output: {
    outputTarget: undefined,
    isCycleActive: false,
    activateOutputCycle() {
      if (this.isCycleActive === false) {
        this.isCycleActive = true;
        this.performOutput();
      }
    },
    performOutput() {
      return undefined;
    },
  },

  mouseMoveHandler(e) {
    const { memory } = this;
    if (memory.mouseStatus.active === true) {
      vec2.set(memory.mouseStatus.cursorPoint, e.offsetX, e.offsetY);
      console.log("MOVE ", memory.mouseStatus.cursorPoint);
    }
  },
  mouseDownHandler(e) {
    const { memory } = this;
    vec2.set(memory.mouseStatus.downPoint, e.offsetX, e.offsetY);
    memory.mouseStatus.active = true;
    console.log("DOWN ", memory.mouseStatus.downPoint);
  },
  mouseUpHandler() {
    const { memory } = this;
    memory.mouseStatus.active = false;
  },
  mouseEnterHandler(e) {
    const { memory } = this;
    console.log("ENTER HANDLER ", e);
    if (memory.mouseStatus.active === true) {
      if (e.buttons === 0) {
        memory.mouseStatus.active = false;
      }
    }
  },
  mouseLeaveHandler(e) {
    const { memory } = this;
    if (memory.mouseStatus.active === true) {
      console.log("LEAVE HANDLER ", e);
    }
  },
});
