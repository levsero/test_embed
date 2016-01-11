import _ from 'lodash';

import { win,
         document as doc } from 'utility/globals';
import { renderer }        from 'service/renderer';
import { getDeviceZoom,
         getZoomSizingRatio,
         isLandscape }      from 'utility/devices';
import { mediator }        from 'service/mediator';
import { setScrollKiller } from 'utility/scrollHacks';
import { cappedIntervalCall } from 'utility/utils';

let lastTouchEnd = 0;

const propagateFontRatioChange = () => {
  setTimeout(() => {
    const hideWidget = getDeviceZoom() > 2  || isLandscape();

    if (hideWidget) {
      setScrollKiller(false);
    }

    renderer.hideByZoom(hideWidget);

    if (!isLandscape()) {
      mediator.channel.broadcast('.updateZoom', getZoomSizingRatio());
    }
  }, 0);
};
const zoomMonitor = (() => {
  let oldZoom;
  let interval = null;
  let iterations = 0;
  let oldOffset = [0, 0];
  let currentZoom = getDeviceZoom;
  const currentOffset = () => {
    return [win.pageXOffset, win.pageYOffset];
  };
  const zoomEqual = (a, b) => {
    return Math.abs(a - b) < 0.001;
  };
  const offsetEqual = (a, b) => {
    return (a[0] === b[0]) && (a[1] === b[1]);
  };
  const startMonitor = () => {
    if (interval !== null) {
      clearInterval(interval);
    }

    iterations = 0;
    interval = setInterval(() => {
      if (iterations > 10000 || zoomEqual(oldZoom, currentZoom()) &&
          offsetEqual(oldOffset, currentOffset())) {
        clearInterval(interval);
        interval = null;
        // show
        propagateFontRatioChange(true);
      } else {
        oldZoom = currentZoom();
        oldOffset = currentOffset();
        iterations++;
      }
    }, 300);
  };

  return _.debounce(startMonitor, 10);
})();

function initMobileScaling() {
  win.addEventListener('touchstart', Airbrake.wrap((e) => {
    if (e.touches.length === 2) {
      renderer.hideByZoom(true);
    }
    zoomMonitor();
  }));

  win.addEventListener('touchmove', Airbrake.wrap((e) => {
    if (e.touches.length === 2) {
      renderer.hideByZoom(true);
    }
    zoomMonitor();
  }));

  win.addEventListener('touchend', Airbrake.wrap((e) => {
    const now = e.timeStamp;

    // If touchend's fire within 250ms of each other,
    // we're treating it as double-tap zoom.
    // Therefore, hide the widget.
    if ((now - lastTouchEnd) < 250) {
      renderer.hideByZoom(true);
    }
    lastTouchEnd = now;

    zoomMonitor();
  }));

  // Recalc ratio when user focus on field
  // delay by 500ms so browser zoom is done
  doc.addEventListener('focus', () => {
    setTimeout(() => propagateFontRatioChange(), 500);
  }, true);

  win.addEventListener('orientationchange', () => {
    if (!isLandscape()) {
      setTimeout(() => {
        propagateFontRatioChange();
      }, 1000);
    } else {
      propagateFontRatioChange();
    }
  });

  win.addEventListener('load', () => {
    propagateFontRatioChange();
  }, false);

  doc.addEventListener('DOMContentLoaded', () => {
    propagateFontRatioChange();
  }, false);

  cappedIntervalCall(propagateFontRatioChange, 500, 10);
}

export {
  initMobileScaling
};
