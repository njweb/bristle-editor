/*
* interaction status
 */

import {h, render, Component} from 'preact'
import * as timm from 'timm'
import { vec2, mat2d } from 'gl-matrix'
import { Point } from './ctx2dTools'
import {buildDomEventsHandler} from "./eventHandlers/domEventsHandler";
import {buildInteractionEventsHandler} from "./eventHandlers/interactionEventsHandler";
import {createStore} from 'redux'

const store = createStore((state, action) => state, { thing: 'abc' });

// const pointCoordinatesArrayBuffer = new ArrayBuffer(20 * 1000 * Int32Array.BYTES_PER_ELEMENT);

const boardState = {
  points: [new Point(20, 80)],
  segments: [],
  paths: [],
  projMat2d: null,
  canvasSize: [100, 100]
};

const interactionEventHandler = e => {
  console.log('iEVENT: ', JSON.stringify(e));
  // if(e.type === 'click') {
  //   boardState.points[0]
  // }
};

const domEventsHandlers = buildDomEventsHandler(interactionEventHandler);
const interactionEventsHandler = buildInteractionEventsHandler(() => {}, boardState);

const pointA = new Point(20, 80);

class Root extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const canvasHalfSize = [this.canvas.width / 2, this.canvas.height / 2];
    this.context2d = this.canvas.getContext('2d');
    boardState.projMat2d = mat2d.mul([], mat2d.fromTranslation([], canvasHalfSize), mat2d.fromScaling([], [1, -1]));

    this.renderBoardState();
  }

  componentDidUpdate(prevProps) {
    if(prevProps.appState.points !== this.props.boardState.points) {
      this.renderBoardState();
    }
  }

  renderBoardState() {
    boardState.points.forEach(p => p.print(this.context2d, boardState.projMat2d));
  }

  render({appState}) {
    return (
      <div id="root" className="global-centered root">
        <div>Bristle Board</div>
        <canvas
          width={appState.canvasSize[0]}
          height={appState.canvasSize[1]}
          onMouseOut={domEventsHandlers.mouseOutHandler}
          onMouseUp={domEventsHandlers.mouseUpHandler}
          onMouseDown={domEventsHandlers.mouseDownHandler}
          onMouseMove={domEventsHandlers.mouseMoveHandler}
          ref={el => this.canvas = el}
        />
      </div>
    )
  }
}

const state = {};

const renderRoot = () => {
  render(<Root appState={boardState}/>, document.body, document.querySelector('#root'));
};
renderRoot();


