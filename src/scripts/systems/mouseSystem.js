import { vec2 } from 'gl-matrix'

const mouseEventTypes = {
  begin: 'begin',
  move: 'move',
  complete: 'complete',
  terminate: 'terminate',
};

const mouseMethods = {
  mouseDownHandler: function(e) {
    this.isDragging = true;
    vec2.set(this.dragAnchor, e.clientX, e.clientY);
    vec2.set(this.dragPoint, e.clientX, e.clientY);
    this.triggerCallback(this.begin);
  },
  mouseUpHandler: function(e) {
    if (this.isDragging) {
      vec2.set(this.dragPoint, e.clientX, e.clientY);
      this.isDragging = false;
      this.triggerCallback(mouseEventTypes.complete);
    }
  },
  mouseOutHandler: function(e) {
    if (this.isDragging) {
      this.isDragging = false;
      this.triggerCallback(mouseEventTypes.terminate);
    }
  },
  mouseMoveHandler: function(e) {
    if (this.isDragging) {
      vec2.set(this.dragPoint, e.clientX, e.clientY);
      vec2.set(this.dragPoint, e.clientX, e.clientY);
      this.triggerCallback(mouseEventTypes.move);
    }
  },
  triggerCallback: function(eventType) {
    if (this.callback) {
      this.callback(eventType);
    }
  },
  subscribe: function(callback) {
    this.callback = callback;
  },
}

const bldMouseSystem = () => {
  const mouseState = {
    callback: null,
    isDragging: false,
    dragAnchor: vec2.create(),
    dragPoint: vec2.create(),
  };

  return Object.assign(Object.create(mouseMethods), mouseState);
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
export default bldMouseSystem;
