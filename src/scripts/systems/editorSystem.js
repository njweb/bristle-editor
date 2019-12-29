import { mat2d } from 'gl-matrix';
import drawUtilities from '../graphics/drawUtilities';

import buildCameraTool from '../tools/cameraTool';

const projectionMatrix = mat2d.create();

const editorSystemMethods = {
  attachViewport(viewport) {
    this.viewport = viewport;
    this.cameraTool = buildCameraTool({
      systems: { viewport },
      prepareRender: this.prepareRender.bind(this)
    });
    this.prepareRender();
  },
  attachEventSystem(eventSystem) {
    eventSystem.subscribe(this.eventHandler.bind(this));
  },
  eventHandler(event, system) {
    this.cameraTool.dispatch(event, system);
  },
  clearCanvas() {
    const { ctx2d } = this.viewport;

    ctx2d.fillStyle = 'white';
    ctx2d.fillRect(0, 0, ctx2d.canvas.width, ctx2d.canvas.height);
  },
  prepareRender() {
    if (!this.willRender) {
      this.willRender = true;
      window.requestAnimationFrame(this.boundRender);
    }
  },
  render() {
    this.willRender = false;
    if (this.viewport) {
      const { ctx2d } = this.viewport;
      this.clearCanvas();

      this.viewport.getProjectionMatrix(projectionMatrix);
      drawUtilities.referenceLines(ctx2d);
      drawUtilities.referenceCross(ctx2d, projectionMatrix);
      //graphicsSystem.render(this.viewport);
    }
  },
};

const buildEditorSystem = () => {
  const editorSystem = Object.assign(Object.create(editorSystemMethods), {
    viewport: null,
  });

  editorSystem.boundRender = editorSystem.render.bind(editorSystem);

  return editorSystem;
};

export default buildEditorSystem;
