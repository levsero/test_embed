import _ from 'lodash';
import { win } from 'utility/globals';
import { GA_CATEGORY } from 'constants/shared';

let ga = null;

const trackNewGAEvent = (action, label, category, value) => {
  ga(function() {
    const trackers = ga.getAll() || [];

    const payload = {
      hitType: 'event',
      eventCategory: category || GA_CATEGORY,
      eventAction: action,
      eventLabel: label,
      eventValue: value
    };

    if (trackers.length > 0) {
      _.forEach(trackers, (tracker) => {
        tracker.send('event', payload);
      });
    } else {
      ga('send', payload);
    }
  });
};

const trackOldGAEvent = (action, label, category, value) => {
  ga.gaq.push(() => {
    const gat = ga.gat;
    const trackers = gat._getTrackers() || [ gat._getTrackerByName() ];

    _.forEach(trackers, (tracker) => {
      tracker._trackEvent(category || GA_CATEGORY, action, label, value);
    });
  });
};

function init() {
  // new GA
  const analyticsName = win.GoogleAnalyticsObject || 'ga';

  if (_.isFunction(win[analyticsName])) {
    ga = win[analyticsName];
    return;
  }

  // old GA
  if (win._gaq && win._gat) {
    ga = {
      gaq: win._gaq,
      gat: win._gat
    };
  }
}

function track(action, label, category, value) {
  if (!ga) return null;

  if (_.isFunction(ga)) {
    trackNewGAEvent(action, label, category, value);
  } else {
    trackOldGAEvent(action, label, category, value);
  }
}

export const GA = {
  init,
  track
};
