/* eslint-disable no-console */

(function setupDevWebsocket() {
  console.warn('Setting up websocket connection to dev server');
  const devSocket = new WebSocket(`ws://${window.location.host}`);
  devSocket.onerror = err => {
    console.error('Error while using the dev socket: ', err);
  };
  devSocket.onclose = msg => {
    console.warn(`Dev socket closed${msg.reason ? `: ${msg.reason}` : ''}`);
  };
  devSocket.onmessage = event => {
    console.log('WS EVENT: ', event.data);
    if (event.data === 'source-changed') {
      devSocket.close();
      setTimeout(() => window.location.reload(), 100);
    }
  };
}());
