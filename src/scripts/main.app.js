/* eslint-disable react/jsx-filename-extension */
import { h, render } from 'preact';
import RenderPlane from './RenderPlane';
import AppComponent from './AppComponent';

const MyApp = () => <RenderPlane />;

const doRender = state => {
  render(<AppComponent state={state} dispatch={() => {}} />,
    document.querySelector('.app-anchor'));
};

doRender({});
