import { h } from 'preact';
import { useState, useCallback } from 'preact/hooks';
import RenderPlane from './RenderPlane';

const AppComponent = () => {
  const [size, setSize] = useState();

  const containerRef = useCallback(containerEl => {
    if (containerEl !== null) {
      const rect = containerEl.getBoundingClientRect();
      setSize([rect.width, rect.height]);
    }
  }, []);

  return (
    <div className="render-plane__container" ref={containerRef}>
      {
        size ?
        <RenderPlane size={size} /> : null
      }
    </div>
  );
};

export default AppComponent;
