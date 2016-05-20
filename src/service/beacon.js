import _ from 'lodash';

import { i18n } from 'service/i18n';
import { mediator } from 'service/mediator';
import { store } from 'service/persistence';
import { transport } from 'service/transport';
import { win,
         document as doc,
         navigator } from 'utility/globals';
import { parseUrl,
         getFrameworkLoadTime,
         cappedIntervalCall,
         isOnHelpCenterPage } from 'utility/utils';

const sendPageView = () => {
  const now = Date.now();
  const referrer = parseUrl(doc.referrer);
  const previousTime = store.get('currentTime', true) || 0;
  const url = win.location.origin;
  const timeOnLastPage = () => {
    return referrer.origin === url && previousTime ? (now - previousTime) : 0;
  };
  const params = {
    pageView: {
      referrer: referrer.href,
      time: timeOnLastPage(),
      loadTime: getFrameworkLoadTime(),
      navigatorLanguage: navigator.language,
      pageTitle: doc.title,
      userAgent: navigator.userAgent,
      helpCenterDedup: isOnHelpCenterPage()
    }
  };
  const payload = {
    method: 'POST',
    path: '/embeddable/blips',
    params: params
  };

  transport.sendWithMeta(payload);
};

function init() {
  const now = Date.now();

  store.set('currentTime', now, true);

  // Some end-users may still have a email left over in their session-storage,
  // we need to ensure that we clear it.
  if (store.get('identifyEmail', true)) {
    store.remove('identifyEmail', true);
  }

  mediator.channel.subscribe('beacon.identify', identify);
  mediator.channel.subscribe('beacon.trackUserAction', trackUserAction);

  // We need to delay `sendPageView()` for help center host pages.
  // This is because we check for the `HelpCenter` object on the host page,
  // but the script that defines it may not be loaded yet.
  cappedIntervalCall(() => {
    if (win.HelpCenter) {
      sendPageView();
      return true;
    }
  }, 100, 10);
}

function sendConfigLoadTime(time) {
  const params = {
    performance: { configLoadTime: time }
  };
  const payload = {
    method: 'POST',
    path: '/embeddable/blips',
    params: params
  };

  transport.sendWithMeta(payload);
}

function trackUserAction(params = {}) {
  if (_.isUndefined(params.action) || _.isUndefined(params.category)) {
    return false;
  }

  const validParams = ['action', 'category', 'name', 'value', 'label'];
  const userAction = _.pick(params, validParams);
  const payload = {
    method: 'POST',
    path: '/embeddable/blips',
    params: { userAction }
  };

  transport.sendWithMeta(payload);
}

function identify(user) {
  user.localeId = i18n.getLocaleId();
  const payload = {
    method: 'POST',
    path: '/embeddable/identify',
    params:  {
      user: user,
      userAgent: navigator.userAgent
    },
    callbacks: {
      done: (res) => {
        mediator.channel.broadcast('identify.onSuccess', res.body);
      }
    }
  };

  transport.sendWithMeta(payload);
}

export const beacon = {
  init: init,
  trackUserAction: trackUserAction,
  identify: identify,
  sendConfigLoadTime: sendConfigLoadTime
};
