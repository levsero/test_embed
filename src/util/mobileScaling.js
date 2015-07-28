import _ from 'lodash';

import { win,
         document as doc } from 'utility/globals';
import { renderer }        from 'service/renderer';
import { getDeviceZoom,
         getSizingRatio }  from 'utility/devices';
import { mediator }        from 'service/mediator';

var isPinching,
    lastTouchEnd = 0,
    propagateFontRatioChange = (isPinching) => {
      setTimeout(() => {
        renderer.hideByZoom(getDeviceZoom() > 2);
        mediator.channel.broadcast('.updateZoom', getSizingRatio(isPinching));
      }, 0);
    },
    zoomMonitor = (() => {
      var interval = null,
          iterations = 0,
          oldZoom,
          oldOffset = [0, 0],
          currentZoom = getDeviceZoom,
          currentOffset = () => {
            return [win.pageXOffset, win.pageYOffset];
          },
          zoomEqual = (a, b) => {
            return Math.abs(a - b) < 0.001;
          },
          offsetEqual = (a, b) => {
            return (a[0] === b[0]) && (a[1] === b[1]);
          },
          startMonitor = () => {
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
    isPinching = e.touches.length > 1;

    if (e.touches.length === 2) {
      renderer.hideByZoom(true);
    }
    zoomMonitor();
  }));

  win.addEventListener('touchend', Airbrake.wrap((e) => {
    var now = e.timeStamp;

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
    setTimeout(() => propagateFontRatioChange(true), 500);
  }, true);

  win.addEventListener('orientationchange', () => {
    var portrait = Math.abs(win.orientation) !== 90;

    if (portrait) {
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

  propagateFontRatioChange();
}

export {
  initMobileScaling
};
