import { vec2 } from 'gl-matrix';

// boardSystem -> buildCameraStateMachine({ boardSystem, renderSystem, viewportSystem });
// cameraTool.dispatch(action) .. { type: mouseDown, point: [x, y] }
// cameraTool.handle(action) -> state.actionTypeHandler -> { nextState, output }???

const stateMachineMethods = {
  findHandler: function(actionType) {
    const { states, stateKey } = this.stateMachine;
    const activeState = states[stateKey];

    if (activeState) {
      const handler = activeState[actionType];

      if (handler) return handler;
      else if (activeState._default) return activeState._defaultHandler;
      else if (states._defaultHandler) return states._defaultHandler;
    }

    return null;
  },
  updateStateKey: function(nextStateKey) {
    if (nextStateKey && this.stateKey !== nextStateKey) {
      const activeState = this.states[this.stateKey];
      if (activeState._leave) {
        activeState._leave(this.memory, this.systems);
      }

      const nextState = this.states[this.nextStateKey];
      if (nextState._enter) {
        nextState._enter(this.memory, this.systems);
      }

      this.stateKey = nextStateKey;
    }
  },
  dispatch: function(action) {
    const handler = this.findHandler(action.type)
    if (handler) {
      this.updateStateKey(handler(action, this.memory, this.systems));
    }
  }
};

const buildStateMachine = ({ states, initialStateKey, memory, systems }) => {
  Object.assign(Object.create(stateMachineMethods), {
    stateKey: initialStateKey,
    states,
    memory,
    systems
  });
};

const cameraStates = {
  disengaged: {
    mouseGrab: (action, memory, systems) => {
      vec2.copy(memory.cameraAnchorPoint, systems.viewportSystem.offset);
      return 'engaged';
    },
  },
  engaged: {
    mouseDrag: (action, memory, systems) => {
      const { mouseSystem: { dragAnchor, dragPoint } } = systems;
      vec2.sub(localVec2, dragPoint, dragAnchor);
      vec2.add(systems.viewportSystem.offset, memory.cameraAnchorPoint, localVec2);
      // systems.boardSystem.prepareRender();
    },
    mouseRelease: (action, memory, systems) => {
      return 'disengaged';
    },
    mouseTerminate: (action, memory, systems) => {
      return 'disengaged';
    },
  },
};

const localVec2 = vec2.create();
const buildCameraTool = ({ systems: { mouseSystem, viewportSystem } }) => {
  const memory = { cameraAnchorPoint: vec2.create() };
  const states = {
    disengaged: {
      mouseGrab: (action, memory, systems) => {
        vec2.copy(memory.cameraAnchorPoint, systems.viewportSystem.offset);
        return 'engaged';
      },
    },
    engaged: {
      mouseDrag: (action, memory, systems) => {
        const { mouseSystem: { dragAnchor, dragPoint } } = systems;
        vec2.sub(localVec2, dragPoint, dragAnchor);
        vec2.add(systems.viewportSystem.offset, memory.cameraAnchorPoint, localVec2);
        // systems.boardSystem.prepareRender();
      },
      mouseRelease: (action, memory, systems) => {
        return 'disengaged';
      },
      mouseTerminate: (action, memory, systems) => {
        return 'disengaged';
      },
    },
  };

  return buildStateMachine({
    states,
    initialStateKey: 'disengaged',
    memory,
    systems: {
      mouseSystem,
      viewportSystem,
    },
  });
};

export default buildCameraTool;
