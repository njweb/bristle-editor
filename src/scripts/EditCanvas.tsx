import { h, FunctionComponent } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
// import {
//   useState, useEffect, useRef, EffectCallback,
// } from 'preact/hooks';
// import setupMouseMoveHandler from "./setupMouseMove";
import { EditorSystem } from './editorSystem';
import { buildRenderSystem, RenderSystem } from './systems/renderSystem';
import { buildInterfaceSystem, InterfaceSystem } from './systems/interfaceSystem';

import styles from './app.module.styl';

const EditCanvas: FunctionComponent<{ editorSystem: EditorSystem }> = ({ editorSystem }) => {
  const canvasRef = useRef<HTMLCanvasElement>();
  const editorSystemRef = useRef<EditorSystem>();
  const renderSystemRef = useRef<RenderSystem>();
  const interfaceSystemRef = useRef<InterfaceSystem>(buildInterfaceSystem());

  useEffect(() => {
    if (canvasRef.current) {
      const canvasEl = canvasRef.current;
      const rect = canvasEl.getBoundingClientRect();
      const ctx2d = canvasEl.getContext('2d');
      if (!ctx2d) {
        throw Error('Could get get canvas rendering context 2d');
      }

      renderSystemRef.current = buildRenderSystem({ ctx2d, rect });
    }
  }, [canvasRef.current]);

  useEffect(() => {
    if (canvasRef.current && renderSystemRef.current) {
      const canvasEl = canvasRef.current;
      const interfaceSystem = interfaceSystemRef.current;
      const renderSystem = renderSystemRef.current;
      // interfaceSystem.setRenderCallback(renderSystem.renderInterfaceSystem.bind(renderSystem));

      console.log('HOOKING UP EVENT LISTENERS');
      canvasEl.addEventListener('mousemove', e => interfaceSystem.onMouseMove(e));
      canvasEl.addEventListener('mouseup', e => interfaceSystem.onMouseUp(e));
      canvasEl.addEventListener('mousedown', e => interfaceSystem.onMouseDown(e));
      canvasEl.addEventListener('mouseenter', e => interfaceSystem.onMouseEnter(e));
      canvasEl.addEventListener('mouseleave', e => interfaceSystem.onMouseLeave(e));
      return () => {
        console.log('REMOVING EVENT LISTENERS');
        canvasEl.removeEventListener('mousemove', interfaceSystem.onMouseMove);
        canvasEl.removeEventListener('mouseup', interfaceSystem.onMouseUp);
        canvasEl.removeEventListener('mousedown', interfaceSystem.onMouseDown);
        canvasEl.removeEventListener('mouseenter', interfaceSystem.onMouseEnter);
        canvasEl.removeEventListener('mouseleave', interfaceSystem.onMouseLeave);
      };
    }
    return undefined;
  }, [canvasRef.current, renderSystemRef.current, editorSystem]);

  return <canvas className={styles.mainCanvas} ref={canvasRef} width="1024" height="1024" />;
};

export default EditCanvas;
