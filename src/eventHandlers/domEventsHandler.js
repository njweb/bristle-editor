export const buildDomEventsHandler = (interactionEventsListener) => {

  const interactionState = {
    touched: false,
    dragged: false,
    location: null,
  };

  return {
    mouseOutHandler: () => {
      interactionState.location = null;
      interactionState.touched = false;
    },
    mouseMoveHandler: e => {
      if(interactionState.location === null) {
        interactionState.location = [];
      }
      interactionState.location[0] = e.offsetX;
      interactionState.location[1] = e.offsetY;

      const {touched, dragged} = interactionState;
      if(touched && !dragged) {
        interactionState.dragged = true;

        interactionEventsListener({
          type: 'grabAt',
          payload: interactionState.location
        });
      } else if(dragged){
        interactionEventsListener({
          type: 'dragTo',
          payload: interactionState.location
        })
      }
    },
    mouseDownHandler: e => {
      e.preventDefault();
      e.stopPropagation();

      if(e.buttons === 1) {
        interactionState.touched = true;
      }
    },
    mouseUpHandler: () => {
      const {touched, dragged, location} = interactionState;
      if(dragged) {
        interactionEventsListener({
          type: 'dropAt',
          payload: interactionState.location
        })
      }
      else if(touched && location) {
        interactionEventsListener({
          type: 'click',
          payload: interactionState.location
        })
      }

      interactionState.dragged = false;
      interactionState.touched = false;
    },
  }
};