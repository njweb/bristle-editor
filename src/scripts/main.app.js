/* eslint-disable react/jsx-filename-extension */
import { h, render } from 'preact';
import RenderPlane from './RenderPlane';
import EditorCanvas from './EditorCanvas';
import AppComponent from './AppComponent';

import buildEditorSystem from './systems/editorSystem';

const editorSystem = buildEditorSystem();
//const MyApp = () => <RenderPlane />;

const doRender = state => {
//  render(<AppComponent state={state} dispatch={() => {}} />,
//    document.querySelector('.app-anchor'));
  render(<EditorCanvas editorSystem={editorSystem} />,
    document.querySelector('.app-anchor'));
};

doRender({});
