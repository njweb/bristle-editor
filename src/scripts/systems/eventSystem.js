import { vec2 } from 'gl-matrix';

const mouseEventTypes = {
  click: 'click',
  grab: 'grab',
  drag: 'drag',
  release: 'release',
  cancel: 'cancel',
};

const isLeftButtonDown = buttons => (buttons & 1) !== 0;

const eventSystemMethods = {
  subscribe(callback) {
    this.callback = callback;
  },
  triggerCallback(eventType) {
    if (this.callback) {
      this.callback(eventType, this);
    }
  },
  mouseMove(x, y, buttons) {
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
  mouseDown(x, y, buttons) {
    if (!this.isDragging) {
      vec2.set(this.grabPoint, x, y);
    }
  },
  mouseUp(x, y, buttons) {
    if (this.isDragging && !isLeftButtonDown(buttons)) {
      this.isDragging = false;
      vec2.set(this.dragPoint, x, y);
      this.triggerCallback(mouseEventTypes.release);
    } else if (!isLeftButtonDown(buttons)) {
      vec2.set(this.clickPoint, x, y);
      this.triggerCallback(mouseEventTypes.click);
    }
  },
  mouseEnter(x, y, buttons) {
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
};

const buildEventSystem = () => {
  const eventSystem = Object.assign(Object.create(eventSystemMethods), {
    callback: null,
    isDragging: false,
    grabPoint: vec2.create(),
    dragPoint: vec2.create(),
    clickPoint: vec2.create(),
  });

  return eventSystem;
};

export default buildEventSystem;
