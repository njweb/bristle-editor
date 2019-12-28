/* eslint-disable react/jsx-filename-extension */
import { h, render } from 'preact';
import EditorCanvas from './EditorCanvas';

import buildEditorSystem from './systems/editorSystem';

const editorSystem = buildEditorSystem();

const doRender = state => {
  render(<EditorCanvas editorSystem={editorSystem} />,
    document.querySelector('.app-anchor'));
};

doRender({});
