import { vec2 } from 'gl-matrix';

export interface InterfaceMemory {
  downPoint: vec2;
  mousePoint: vec2;
  isMouseActive: boolean;
  mouseActiveTimestamp: number;
  isClickActive: boolean;
  isDragActive: boolean;
}

type InterfaceCallbackFn = (interfaceMemory: InterfaceMemory) => void;
export interface InterfaceSystem {
  memory: InterfaceMemory;

  // setRenderCallback: (callback: (interfaceMemory: InterfaceMemory) => void) => void;
  // renderCallback: (intefaceMemory: InterfaceMemory) => void;
  // editorCallback: (intefaceMemory: InterfaceMemory) => void;
  callbackFn: InterfaceCallbackFn;
  attachCallback: (callback: InterfaceCallbackFn) => void;
  onMouseMove: (event: MouseEvent) => void;
  onMouseUp: (event: MouseEvent) => void;
  onMouseDown: (event: MouseEvent) => void;
  onMouseEnter: (event: MouseEvent) => void;
  onMouseLeave: (event: MouseEvent) => void;
}

export const buildInterfaceSystem = (): InterfaceSystem => {
  return {
    memory: {
      downPoint: vec2.create(),
      mousePoint: vec2.create(),
      isMouseActive: false,
      mouseActiveTimestamp: 0,
      isClickActive: false,
      isDragActive: false,
    },

    // setRenderCallback(callback: (interfaceMemory: InterfaceMemory) => void) {
    //   this.renderCallback = callback;
    // },
    // renderCallback: () => undefined,
    // editorCallback: () => undefined,

    callbackFn: () => undefined,
    attachCallback(callback: InterfaceCallbackFn) {
      this.callbackFn = callback;
    },
    onMouseMove(event: MouseEvent) {
      if (this.memory.isMouseActive) {
        vec2.set(this.memory.mousePoint, event.offsetX, event.offsetY);
        this.callbackFn(this.memory);
      }
    },
    onMouseDown(event: MouseEvent) {
      if (!this.memory.isMouseActive) {
        this.memory.isMouseActive = true;
        this.memory.mouseActiveTimestamp = Date.now();
        vec2.set(this.memory.downPoint, event.offsetX, event.offsetY);
        vec2.set(this.memory.mousePoint, event.offsetX, event.offsetY);
        this.callbackFn(this.memory);
      }
    },
    onMouseUp() {
      this.memory.isMouseActive = false;
    },
    onMouseEnter() {
      return undefined;
    },
    onMouseLeave() {
      return undefined;
    },
  };
};
