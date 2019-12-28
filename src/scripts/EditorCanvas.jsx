import { h } from 'preact';
import buildEventSystem from './systems/eventSystem';
import { useState, useMemo, useCallback } from 'preact/hooks';
import buildViewportSystem from './systems/viewportSystem';

const EditorCanvas = ({ editorSystem }) => {
  const [size, setSize] = useState();
  const containerRef = useCallback(containerEl => {
    if (containerEl !== null) {
      const rect = containerEl.getBoundingClientRect();
      setSize([rect.width, rect.height]);
    }
  }, []);

  const eventSystem = useMemo(() => {
    const eventSystem = buildEventSystem()
    editorSystem.attachEventSystem(eventSystem);
    return eventSystem;
  }, []);

  const canvasRef = useCallback(canvasEl => {
    if (canvasEl) {
      const ctx2d = canvasEl.getContext('2d');
      const viewportSystem = buildViewportSystem({ ctx2d });
      editorSystem.attachViewport(viewportSystem);
    }
  }, []);
  const mouseHandlers = useMemo(() => {
    return ['mouseDown', 'mouseUp', 'mouseMove', 'mouseEnter']
      .reduce((handlers, key) => {
        const handler = eventSystem[key].bind(eventSystem);
        return Object.defineProperty(handlers, key,
          { value: e => handler(e.clientX, e.clientY, e.buttons) })
      }, {});
  }, []);

  return (
    <div className="render-plane__container" ref={containerRef}>
      {
        size ?
        <canvas
          width={size[0]}
          height={size[1]}
          ref={canvasRef}
          onMouseDown={mouseHandlers.mouseDown}
          onMouseUp={mouseHandlers.mouseUp}
          onMouseMove={mouseHandlers.mouseMove}
          onMouseEnter={mouseHandlers.mouseEnter}
        /> : null
      }
    </div>
  )
};

export default EditorCanvas;
