import { vec2 } from 'gl-matrix'

const mouseEventTypes = {
  begin: 'begin',
  move: 'move',
  complete: 'complete',
  terminate: 'terminate',
};

const buildMouseSystem = () => {
  const mouseDynamicState = {
    callback: null,
    isDragging: false,
    dragAnchor: vec2.create(),
    dragPoint: vec2.create(),
  };
  const eventTrigger = eventType => {
    if (mouseDynamicState.callback) {
      mouseDynamicState.callback(eventType);
    }
  }

  const mouseEventHandlers = {
    mouseDownHandler: e => {
      mouseDynamicState.isDragging = true;
      vec2.set(mouseDynamicState.dragAnchor, e.clientX, e.clientY);
      vec2.set(mouseDynamicState.dragPoint, e.clientX, e.clientY);
      eventTrigger(mouseEventTypes.begin);
    },
    mouseUpHandler: e => {
      if (mouseDynamicState.isDragging) {
        vec2.set(mouseDynamicState.dragPoint, e.clientX, e.clientY);
        mouseDynamicState.isDragging = false;
        eventTrigger(mouseEventTypes.complete);
      }
    },
    mouseOutHandler: () => {
      if (mouseDynamicState.isDragging) {
        mouseDynamicState.isDragging = false;
        eventTrigger(mouseEventTypes.terminate);
      }
    },
    mouseMoveHandler: e => {
      if (mouseDynamicState.isDragging) {
        vec2.set(mouseDynamicState.dragPoint, e.clientX, e.clientY);
        vec2.set(mouseDynamicState.dragPoint, e.clientX, e.clientY);
        eventTrigger(mouseEventTypes.move);
      }
    },
  };

  return {
    eventHandlers: mouseEventHandlers,
    state: mouseDynamicState,
    subscribe: callback => { mouseDynamicState.callback = callback; },
  };
};

export { mouseEventTypes };
export default buildMouseSystem;
