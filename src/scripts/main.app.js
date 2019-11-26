/* eslint-disable react/jsx-filename-extension */
import { h, render } from 'preact';

const MyApp = () => <div>App</div>;

const doRender = state => {
  render(<MyApp state={state} dispatch={() => {}} />,
    document.querySelector('.timeline-anchor'));
};

doRender(appStore.getState());
