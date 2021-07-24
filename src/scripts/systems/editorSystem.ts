import { vec2, mat2d } from 'gl-matrix';
import { createContext } from 'preact';
import { StateUpdater, Ref } from 'preact/hooks';
import { InterfaceSystem } from './interfaceSystem';
import { RenderSystem } from './renderSystem';

export interface EditorMemory {
  points: vec2[];
}

export interface EditorOutput {
  outputTarget?: CanvasRenderingContext2D;
  isCycleActive: boolean;
  activateOutputCycle: () => void;
  performOutput: () => void;
}

export interface EditorSystem {
  memory: EditorMemory;
  handleAppEvent: () => void;
  handleInterfaceEvent: () => void;
  // interfaceSystem: InterfaceSystem;
  // attachInterfaceSystem: (interfaceSystem: InterfaceSystem) => void;
  // attachRenderSystem: (renderSystem: RenderSystem) => void;
}

export const buildEditorSystem = (setEvents: StateUpdater<string[]>): EditorSystem => ({
  memory: {
    points: [],
  },
  handleAppEvent: () => undefined,
  handleInterfaceEvent: () => undefined,
});
