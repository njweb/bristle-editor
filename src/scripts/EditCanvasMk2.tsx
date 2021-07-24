import { h, FunctionComponent } from 'preact';
import { useEffect, useRef, Ref } from 'preact/hooks';
import { vec2 } from 'gl-matrix';

import styles from './app.module.styl';

interface InterfaceMemory {
  isMouseActive: boolean;
  mouseDownPoint: vec2;
}

enum RenderingEvent {
  interface = 1,
  editor,
}

const buildInterfaceSystem = (() => (interfaceMemory: InterfaceMemory) => ({
  mouseDownHandler: (e: MouseEvent) => console.log('E', e, interfaceMemory),
  mouseUpHandler: (e: MouseEvent) => console.log('E', e),
  mosueMoveHandler: (e: MouseEvent) => console.log('E', e),
  }))();

const buildRenderSystem = ({ interfaceMemory }: { interfaceMemory: InterfaceMemory }) => (renderEvent: RenderingEvent) => {
  console.log('interfaceMemory', interfaceMemory);
};

const EditCanvasMk2: FunctionComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement>();
  // const renderSystemRef = useRef<RenderSystem>();

  useEffect(() => {
    if (canvasRef.current) {
      const canvasEl = canvasRef.current;
      const ctx2d = canvasEl.getContext('2d');
      if (!ctx2d) {
        throw Error('Could get get canvas rendering context 2d');
      }

      // renderSystemRef.current = buildRenderSystem({ ctx2d });
    }
  }, [canvasRef.current]);

  useEffect(() => {
    // if (canvasRef.current && renderSystemRef.current) {
      // const canvasEl = canvasRef.current;
      // const interfaceSystem = interfaceSystemRef.current;
      // const renderSystem = renderSystemRef.current;
      // renderSystem.simpleRender();
      // interfaceSystem.setRenderCallback(renderSystem.renderInterfaceSystem.bind(renderSystem));

      // console.log('HOOKING UP EVENT LISTENERS');
      // canvasEl.addEventListener('mousemove', e => interfaceSystem.onMouseMove(e));
  }, [canvasRef.current]);

  return <canvas className={styles.mainCanvas} ref={canvasRef} width="1024" height="1024" />;
};

export default EditCanvasMk2;

