import { h, FunctionComponent } from 'preact';
import { useState, useRef, useReducer } from 'preact/hooks';
import EditCanvas from './EditCanvas';
import { buildEditorMemory } from './editorMemory';
import { buildEditorSystem } from './editorSystem';

const App: FunctionComponent = () => {
  const [count, setCount] = useState(0);
  const [events, setEvents] = useState<string[]>([]);
  const editorSystemRef = useRef(buildEditorSystem());
  // const [appState, appDispatch] = useReducer();

  return (
    <div className="flex-col-center">
      <div className="flex rack-sm pad-y-sm">
        <div>
          <div className="font-size-sm">Output Channel</div>
          <ul>
            <li>mousedown 18.09 : 23.41</li>
          </ul>
        </div>
        <div className="flex-center">
          <EditCanvas editorSystem={editorSystemRef.current} />
        </div>
      </div>
    </div>
  );
};

export default App;
