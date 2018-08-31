import _ from 'lodash';
import { renderer } from 'service/renderer';

// TODO: move other listeners to this file
function initResizeMonitor(win) {
  // Will trigger for both window resize and window zoom
  win.addEventListener('resize', _.debounce(() => {
    renderer.onZoom();
  }, 10));
}

export {
  initResizeMonitor
};
