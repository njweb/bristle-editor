import { h } from 'preact';
import { useState, useCallback, useMemo } from 'preact/hooks';
import { vec2 } from 'gl-matrix';
import buildMouseSystem from './systems/mouseSystem';
import buildViewportSystem from './systems/viewportSystem';
import buildBoardSystem from './systems/boardSystem';

const RenderPlane = ({ size }) => {
  const [boardSystem, setBoardSystem] = useState();
  const [viewportSystem, setViewportSystem] = useState();
  const mouseSystem = useMemo(() => {
    return buildMouseSystem();
  }, []);

  const mouseEventHandlers = useMemo(() => (
    ['onDown', 'onUp', 'onMove', 'onEnter'].reduce((accHandlers, handlerKey) => (
      Object.defineProperty(
        accHandlers,
        handlerKey,
        { value: e => mouseSystem[handlerKey](e.clientX, e.clientY, e.buttons) })
    ), {})
  ));

  const canvasRef = useCallback(canvasEl => {
//    if (canvasEl !== null) {
//      const ctx2d = canvasEl.getContext('2d');
//
//      const viewportSystem = buildViewportSystem({ ctx2d });
//      setViewportSystem(viewportSystem);
//
//      const newBoardSystem = buildBoardSystem({ ctx2d, mouseSystem, viewportSystem });
//      setBoardSystem(newBoardSystem);
//      newBoardSystem.render();
//    }
  }, []);

  return (
    <canvas
      width={size[0]}
      height={size[1]}
      className="render-place__canvas"
      ref={canvasRef}
      onMouseDown={mouseEventHandlers.onDown}
      onMouseUp={mouseEventHandlers.onUp}
      onMouseMove={mouseEventHandlers.onMove}
      onMouseEnter={e => mouseEventHandlers.onEnter}
    />
  );
};

export default RenderPlane;
