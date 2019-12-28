import { vec2 } from 'gl-matrix';

// boardSystem -> buildCameraStateMachine({ boardSystem, renderSystem, viewportSystem });
// cameraTool.dispatch(action) .. { type: mouseDown, point: [x, y] }
// cameraTool.handle(action) -> state.actionTypeHandler -> { nextState, output }???

const stateMachineMethods = {
  findHandler: function(actionType) {
    const { states, stateKey } = this;
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

      const nextState = this.states[nextStateKey];
      if (nextState._enter) {
        nextState._enter(this.memory, this.systems);
      }

      this.stateKey = nextStateKey;
    }
  },
  dispatch: function(action, source) {
    const handler = this.findHandler(action)
    if (handler) {
      this.updateStateKey(handler(action, source, this.memory, this.systems));
    }
  }
};

const buildStateMachine = ({ states, initialStateKey, memory, systems }) => {
  return Object.assign(Object.create(stateMachineMethods), {
    stateKey: initialStateKey,
    states,
    memory,
    systems
  });
};

const localVec2 = vec2.create();
const flipYVector = vec2.set(vec2.create(), 1, -1);
const buildCameraTool = ({ systems: { viewport } }) => {
  const memory = { cameraAnchorPoint: vec2.create() };
  const states = {
    disengaged: {
      grab: (action, mouseSystem, memory, systems) => {
        vec2.copy(memory.cameraAnchorPoint, systems.viewport.offset);
        return 'engaged';
      },
    },
    engaged: {
      drag: (action, mouseSystem, memory, systems) => {
        const { grabPoint, dragPoint } = mouseSystem;
        vec2.sub(localVec2, grabPoint, dragPoint);
        vec2.mul(localVec2, localVec2, flipYVector);
        systems.viewport.setOffset(
          vec2.add(localVec2, memory.cameraAnchorPoint, localVec2));
      },
      release: (action, mouseSystem, memory, systems) => {
        return 'disengaged';
      },
      cancel: (action, mouseSystem, memory, systems) => {
        return 'disengaged';
      },
    },
  };

  return buildStateMachine({
    states,
    initialStateKey: 'disengaged',
    memory,
    systems: { viewport },
  });
};

export default buildCameraTool;
