/* eslint-disable react/jsx-filename-extension */
import { h, render } from 'preact';
import RenderPlane from './RenderPlane';
import AppComponent from './AppComponent';

import buildCameraTool from './tools/cameraTool';

const MyApp = () => <RenderPlane />;

const doRender = state => {
  render(<AppComponent state={state} dispatch={() => {}} />,
    document.querySelector('.app-anchor'));
};

doRender({});
