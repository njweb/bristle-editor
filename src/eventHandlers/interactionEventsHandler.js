import {mat2d, vec2} from "gl-matrix";

export const buildInteractionEventsHandler = (interactionEventsHandler, boardState) => {

  const inverseBoardProjMat2d = mat2d.invert(
    [],
    mat2d.mul(
      [],
      mat2d.fromTranslation([], [250, 250]),
      mat2d.fromScaling([], [1, -1])
    )
  );

  // const tempPoint = [150, 0];
  // const tempOutput = vec2.transformMat2d([], tempPoint, inverseBoardProjMat2d);
  // console.log('OUTPUT: ', tempOutput);

  const interactionEventSource = event => {
    if (event.type === 'click') {

    }
  };

  const boardStateChangeSource = nextState => {

  };

  return {
    interactionEventSource,
    boardStateChangeSource
  };
};