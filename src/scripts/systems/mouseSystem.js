import { vec2 } from 'gl-matrix'

// mouse event cycle
// down -> set timestamp
// up -> if duration < 0.7s -> click
// move -> drag
// up -> release

const mouseEventTypes = {
  click: 'click',
  grab: 'grab',
  drag: 'drag',
  release: 'release',
  cancel: 'cancel',
};

const isLeftButtonDown = buttons => (buttons & 1) !== 0;

const mouseMethods = {
  onDown(x, y, buttons) {
    if (!this.isDragging) {
      vec2.set(this.grabPoint, x, y);
    }
  },
  onUp(x, y, buttons) {
    if (this.isDragging && !isLeftButtonDown(buttons)) {
      this.isDragging = false;
      vec2.set(this.dragPoint, x, y);
      this.triggerCallback(mouseEventTypes.release);
    } else if (!isLeftButtonDown(buttons)) {
      vec2.set(this.clickPoint, x, y);
      this.triggerCallback(mouseEventTypes.click);
    }
  },
  onMove(x, y, buttons) {
    if (this.isDragging) {
      if (isLeftButtonDown(buttons)) {
        vec2.set(this.dragPoint, x, y);
        this.triggerCallback(mouseEventTypes.drag);
      } else {
        this.isDragging = false;
        this.triggerCallback(mouseEventTypes.cancel);
      }
    } else if (isLeftButtonDown(buttons)) {
      this.isDragging = true;
      vec2.set(this.dragPoint, x, y)
      this.triggerCallback(mouseEventTypes.grab);
    }
  },
  onEnter(x, y, buttons) {
    if (this.isDragging) {
      if (isLeftButtonDown(buttons)) {
        vec2.set(this.dragPoint, x, y);
        this.triggerCallback(mouseEventTypes.drag);
      } else {
        this.Dragging = false;
        this.triggerCallback(mouseEventTypes.cancel);
      }
    }
  },
  mouseDownHandler: function(e) {
    this.isDragging = true;
    vec2.set(this.grabPoint, e.clientX, e.clientY);
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
    grabPoint: vec2.create(),
    dragPoint: vec2.create(),
    clickPoint: vec2.create(),
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
