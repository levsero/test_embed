import airwaves from 'airwaves';
import _ from 'lodash';

import { settings } from 'service/settings';
import { isMobileBrowser } from 'utility/devices';
import { setScrollKiller,
         setWindowScroll,
         revertWindowScroll } from 'utility/scrollHacks';
import { isOnHelpCenterPage } from 'utility/pages';
import { emailValid } from 'utility/utils';

const c = new airwaves.Channel();

const submitTicket = 'ticketSubmissionForm';
const launcher = 'launcher';
const chat = 'zopimChat';
const helpCenter = 'helpCenterForm';
const state = {};

state[`${chat}.connectionPending`] = true;
state[`${launcher}.userHidden`] = false;
state[`${launcher}.clickActive`] = false;
state[`${submitTicket}.isVisible`] = false;
state[`${chat}.isVisible`] = false;
state[`${helpCenter}.isVisible`] = false;
state[`${helpCenter}.isAccessible`] = false;
state[`${helpCenter}.isSuppressed`] = false;
state[`${chat}.isOnline`] = false;
state[`${chat}.isSuppressed`] = false;
state[`${chat}.isAccessible`] = false;
state[`${chat}.unreadMsgs`] = 0;
state[`${chat}.userClosed`] = false;
state[`${chat}.chatEnded`] = false;
state['ipm.isVisible'] = false;
state['.hideOnClose'] = false;
state['.hasHidden'] = false;
state['.activatePending'] = false;

const helpCenterAvailable = () => {
  return state[`${helpCenter}.isAccessible`] && !state[`${helpCenter}.isSuppressed`];
};

const chatAvailable = () => {
  return state[`${chat}.isOnline`] && !state[`${chat}.isSuppressed`];
};

const submitTicketAvailable = () => {
  return state[`${submitTicket}.isAccessible`] && !state[`${submitTicket}.isSuppressed`];
};

const embedAvailable = () => {
  return helpCenterAvailable() || chatAvailable() || submitTicketAvailable();
};

const getShowAnimation = _.memoize(
  () => settings.get('position.vertical') === 'top' ? 'downShow' : 'upShow'
);

const getHideAnimation = _.memoize(
  () => settings.get('position.vertical') === 'top' ? 'upHide' : 'downHide'
);

const embedVisible = (_state) => _.some([
  _state[`${helpCenter}.isVisible`],
  _state[`${chat}.isVisible`],
  _state[`${submitTicket}.isVisible`]
]);

const resetActiveEmbed = () => {
  if (helpCenterAvailable()) {
    state.activeEmbed = helpCenter;
  } else if (chatAvailable()) {
    state.activeEmbed = chat;
  } else if (submitTicketAvailable()) {
    state.activeEmbed = submitTicket;
  } else {
    c.broadcast(`${launcher}.hide`, { transition: 'none' });
  }
};

const trackChatStarted = () => {
  c.broadcast('beacon.trackUserAction', 'chat', 'opened', chat);
};

const showEmbed = (_state, viaActivate = false) => {
  if (_state.activeEmbed === chat) {
    trackChatStarted();
  }

  if (_state.activeEmbed === chat && isMobileBrowser()) {
    c.broadcast(`${chat}.show`);
  } else {
    const options = {
      transition: getShowAnimation(),
      viaActivate
    };

    _state[`${_state.activeEmbed}.isVisible`] = true;
    c.broadcast(`${launcher}.hide`, isMobileBrowser() ? {} : { transition: getHideAnimation() } );
    c.broadcast(`${_state.activeEmbed}.show`, options);
    c.broadcast('webWidget.show', options);
  }

  if (isMobileBrowser() && _state.activeEmbed !== chat) {
    /**
     * This timeout ensures the embed is displayed
     * before the scrolling happens on the host page
     * so that the user doesn't see the host page jump
     */
    setTimeout(() => {
      setWindowScroll(0);
      setScrollKiller(true);
    }, 0);
  }
};

function init(embedsAccessible, params = {}) {
  const updateLauncherLabel = () => {
    if (chatAvailable()) {
      if (state[`${chat}.unreadMsgs`]) {
        c.broadcast(`${launcher}.setLabelUnreadMsgs`, state[`${chat}.unreadMsgs`]);
      }
      else if (helpCenterAvailable()) {
        c.broadcast(`${launcher}.setLabelChatHelp`);
      } else {
        c.broadcast(`${launcher}.setLabelChat`);
      }
    } else {
      c.broadcast(`${launcher}.setLabelHelp`);
    }
  };

  state['.hasHidden'] = params.hideLauncher;
  state[`${launcher}.userHidden`] = params.hideLauncher;
  state[`${submitTicket}.isAccessible`] = embedsAccessible.submitTicket;
  state[`${helpCenter}.isAccessible`] = embedsAccessible.helpCenter &&
    (!params.helpCenterSignInRequired || isOnHelpCenterPage());
  state[`${chat}.isAccessible`] = embedsAccessible.chat;
  state[`${helpCenter}.isSuppressed`] = settings.get('helpCenter.suppress');
  state[`${chat}.isSuppressed`] = settings.get('chat.suppress');
  state[`${submitTicket}.isSuppressed`] = settings.get('contactForm.suppress');

  resetActiveEmbed();

  c.intercept('.hide', () => {
    state[`${submitTicket}.isVisible`] = false;
    state[`${chat}.isVisible`] = false;
    state[`${helpCenter}.isVisible`] = false;
    state['.hasHidden'] = true;

    c.broadcast(`${chat}.hide`);
    c.broadcast(`${launcher}.hide`);
    c.broadcast('webWidget.hide');
  });

  c.intercept(`.show, ${chat}.onError`, () => {
    state[`${submitTicket}.isVisible`] = false;
    state[`${chat}.isVisible`] = false;
    state[`${helpCenter}.isVisible`] = false;
    state['.hasHidden'] = false;

    resetActiveEmbed();

    c.broadcast(`${chat}.hide`);
    c.broadcast('webWidget.hide');

    if (embedAvailable()) {
      c.broadcast(`${launcher}.show`);
    }
  });

  c.intercept('.activate', (__, options = {}) => {
    c.broadcast('beacon.trackUserAction', 'api', 'activate');

    if (!embedVisible(state)) {
      resetActiveEmbed();

      state['.hideOnClose'] = !!options.hideOnClose;

      if (embedAvailable() || (!embedAvailable() && state[`${chat}.isAccessible`])) {
        // When boot time zE.activate() is used with contact form & chat,
        // delay showing the embed so that chat has time to come online.
        if (state[`${chat}.connectionPending`] &&
            state[`${chat}.isAccessible`]) {
          state['.activatePending'] = true;
        } else {
          showEmbed(state, true);
        }
      }
    }
  });

  c.intercept('.logout', () => {
    c.broadcast('authentication.logout');
  });

  c.intercept('.zopimShow', () => {
    c.broadcast('webWidget.hide');

    /*
      zopim opens up in a seperate tab on mobile,
      we shouldn't hide launcher and,
      there is no concept of zopim visibility
    */
    if (!isMobileBrowser()) {
      c.broadcast(`${launcher}.hide`);
      state[`${chat}.isVisible`] = true;
    }

    state.activeEmbed = chat;
  });

  c.intercept('.zopimHide', () => {
    c.broadcast(`${launcher}.show`);
    state[`${chat}.isVisible`] = false;
    resetActiveEmbed();
  });

  c.intercept(`${chat}.onOnline`, () => {
    state[`${chat}.isOnline`] = true;

    if (!chatAvailable()) {
      return;
    }

    c.broadcast('webWidget.setZopimOnline', true);

    if ((state.activeEmbed === submitTicket || !state.activeEmbed) && !helpCenterAvailable()) {
      state.activeEmbed = chat;
    }

    if (helpCenterAvailable()) {
      c.broadcast(`${launcher}.setLabelChatHelp`);
    } else {
      c.broadcast(`${launcher}.setLabelChat`);
    }

    if (!submitTicketAvailable() && !helpCenterAvailable() && !state[`${chat}.connectionPending`]) {
      c.broadcast(`${launcher}.show`);
    }
  });

  c.intercept(`${chat}.onConnected`, () => {
    state[`${chat}.connectionPending`] = false;

    if (!embedAvailable() || state['ipm.isVisible'] || embedVisible(state)) return;

    if (state['.activatePending']) {
      showEmbed(state, true);
      if (isMobileBrowser()) {
        c.broadcast(`${launcher}.show`);
      }
    } else if (!state[`${launcher}.userHidden`]) {
      c.broadcast(`${launcher}.show`);
    }
  });

  c.intercept(`${chat}.onOffline`, () => {
    // On offline fires initially when chat is being set up. We only care
    // about when chat comes offline after being online
    if (state[`${chat}.isOnline`]) {
      state[`${chat}.isOnline`] = false;
      if (state.activeEmbed === chat) {
        resetActiveEmbed();
      }

      c.broadcast('webWidget.setZopimOnline', false);

      c.broadcast(`${launcher}.setLabelHelp`);
    }
  });

  c.intercept(`${chat}.onShow`, () => {
    state[`${chat}.isVisible`] = true;
    c.broadcast(`${launcher}.hide`);
  });

  c.intercept(`${chat}.onIsChatting`, () => {
    state.activeEmbed = chat;
    c.broadcast('webWidget.zopimChatStarted');
    state[`${chat}.isSuppressed`] = false;
  });

  c.intercept(`${chat}.onUnreadMsgs`, (__, count) => {
    if (state[`${chat}.connectionPending`]) {
      return;
    }

    state[`${chat}.unreadMsgs`] = count;

    if (count > 0 &&
        !embedVisible(state) &&
        !state[`${chat}.userClosed`] &&
        !isMobileBrowser()) {
      resetActiveEmbed();
      state.activeEmbed = chat;
      state[`${chat}.isVisible`] = true;
      c.broadcast(`${chat}.show`);
      c.broadcast('webWidget.zopimChatStarted');
      state[`${chat}.isSuppressed`] = false;
      c.broadcast(`${launcher}.hide`);
    }

    updateLauncherLabel();
  });

  c.intercept(`${helpCenter}.onNextClick`, () => {
    if (!isMobileBrowser()) {
      state[`${chat}.isVisible`] = true;
    } else {
      c.broadcast(`${launcher}.show`);
      setScrollKiller(false);
    }

    trackChatStarted();

    state.activeEmbed = chat;
    c.broadcast(`${chat}.show`);
  });

  c.intercept(`${submitTicket}.onCancelClick`, () => {
    state[`${submitTicket}.isVisible`] = false;
    c.broadcast('webWidget.hide', { transition: getHideAnimation() });

    if (!state['.hideOnClose']) {
      c.broadcast(`${launcher}.show`, { transition: getShowAnimation() });
    }
  });

  c.intercept(`${helpCenter}.onSearch`, (__, params) => {
    c.broadcast(`${submitTicket}.setLastSearch`, params);
  });

  c.intercept(`${launcher}.onClick`, () => {
    if (state[`${launcher}.clickActive`] === true) return;

    // Re-authenticate user if their oauth token is within 20 minutes of expiring
    if (helpCenterAvailable()) {
      c.broadcast('authentication.renew');
    }

    // When opening chat on mobile, directly broadcast a chat.show event.
    // Because zopim can open in a new tab, we need to make sure we don't make a call to `setScrollKiller`.
    // If we do the host page will be frozen when the user exits the zopim chat tab.
    // Note: `showEmbed` will invoke `setScrollKiller`.
    if (chatAvailable() && state[`${chat}.unreadMsgs`]) {
      state[`${chat}.unreadMsgs`] = 0;
    }

    /**
     * This timeout mitigates the Ghost Click produced when the launcher
     * button is on the left, using a mobile device with small screen
     * e.g. iPhone4. It's not a bulletproof solution, but it helps
     */
    setTimeout(() => showEmbed(state), 0);
  });

  c.intercept(`${chat}.onHide`, (_broadcast) => {
    state[`${chat}.isVisible`] = false;
    state[`${chat}.unreadMsgs`] = 0;

    // Reset .userClosed to false if chat ended
    // so that the next incoming message will pop open
    // chat again.
    state[`${chat}.userClosed`] = !state[`${chat}.chatEnded`];
    state[`${chat}.chatEnded`] = false;

    _broadcast();
  });

  c.intercept(`${chat}.onChatEnd`, () => {
    state[`${chat}.chatEnded`] = true;

    c.broadcast('webWidget.zopimChatEnded');

    if (state[`${helpCenter}.isAccessible`]) {
      state.activeEmbed = helpCenter;
    }
  });

  c.intercept('webWidget.onClose', (_broadcast) => {
    state[`${submitTicket}.isVisible`] = false;
    state[`${helpCenter}.isVisible`] = false;
    _broadcast();
  });

  c.subscribe(
    ['webWidget.onClose',
     `${chat}.onHide`].join(','),
    () => {
      if (isMobileBrowser()) {
        setScrollKiller(false);
        revertWindowScroll();

        // Fixes a condition where an unintended double click on
        // an embed on a mobile device causes the launcher to click as well.
        // The root cause of this is the click event is registered twice on
        // mobile devices and needs to be handled in a similar way to
        // clickBusterRegister/clickBusterHandler so that frameFactory#show does
        // not get fired twice
        state[`${launcher}.clickActive`] = true;
        setTimeout(
          () => state[`${launcher}.clickActive`] = false,
          100
        );
      }

      // Fix for when a pro-active message is recieved which opens the zopim window but the launcher
      // was previously hidden with zE.hide()
      if (!state['.hideOnClose'] && !state['.hasHidden']) {
        setTimeout(
          () => c.broadcast(`${launcher}.show`, { transition: getShowAnimation() }),
          isMobileBrowser() ? 200 : 0
        );
      }
    }
  );

  c.intercept(`${submitTicket}.onFormSubmitted`, () => {
    resetActiveEmbed();
  });

  c.intercept('.orientationChange', () => {
    c.broadcast('webWidget.update');
  });

  c.intercept('.onSetHelpCenterSuggestions', (__, params) => {
    c.broadcast(`${helpCenter}.setHelpCenterSuggestions`, params);
  });

  c.intercept('.onSetLocale', () => {
    c.broadcast(`${chat}.refreshLocale`);
    c.broadcast(`${launcher}.refreshLocale`);
    c.broadcast('webWidget.refreshLocale');
  });

  if (embedAvailable()) {
    c.subscribe(`${launcher}.show`, updateLauncherLabel);
  }

  initMessaging();
}

function initMessaging() {
  c.intercept('.onIdentify', (__, params) => {
    if (emailValid(params.email)) {
      c.broadcast('ipm.identifying', params);
      c.broadcast('beacon.identify', params);
      c.broadcast(`${submitTicket}.prefill`, params);
      c.broadcast(`${chat}.setUser`, params);
    } else {
      console.warn('invalid params passed into zE.identify', params); // eslint-disable-line no-console

      if (_.isString(params.name)) {
        c.broadcast(`${chat}.setUser`, { name: params.name });
        c.broadcast(`${submitTicket}.prefill`, { name: params.name });
      }
    }
  });

  c.intercept('authentication.onSuccess', () => {
    state[`${helpCenter}.isAccessible`] = true;
    if (!embedVisible(state) && helpCenterAvailable()) {
      resetActiveEmbed();

      if (!state[`${launcher}.userHidden`] &&
        !state[`${chat}.isAccessible`] &&
        !state['ipm.isVisible']) {
        c.broadcast(`${launcher}.show`);
      }
    }

    c.broadcast(`${helpCenter}.isAuthenticated`);
  });

  c.intercept('ipm.onActivate', () => {
    const maxRetries = 100;
    let retries = 0;

    const fn = () => {
      if (!embedVisible(state)) {
        c.broadcast('ipm.activate');
      } else if (retries < maxRetries) {
        retries++;
        setTimeout(fn, 300);
      }
    };

    fn();
  });

  c.intercept('ipm.onClose', () => {
    state['ipm.isVisible'] = false;

    if (!state['.hideOnClose'] && !state[`${launcher}.userHidden`]) {
      c.broadcast(`${launcher}.show`, { transition: 'upShow' });
    }
  });

  c.intercept('ipm.onShow', () => {
    state['ipm.isVisible'] = true;

    c.broadcast(`${launcher}.hide`);
  });
}

function initZopimStandalone() {
  // Intercept zE.hide() zE.show(), and zE.activate() API calls.
  // Make them an alias for zopims hide and show functions if the user is on a naked zopim configuration.
  // zE.hide() = $zopim.livechat.hideAll(),
  // zE.show() = $zopim.livechat.button.show(),
  // zE.activate() = $zopim.livechat.window.show().

  c.intercept('.hide', () => {
    state[`${chat}.isVisible`] = false;
    c.broadcast(`${chat}.hide`);
  });

  c.intercept('.show', () => {
    state[`${chat}.isVisible`] = true;
    c.broadcast(`${chat}.show`);
  });

  c.intercept('.activate', () => {
    state[`${chat}.isVisible`] = true;
    c.broadcast(`${chat}.activate`);
  });

  initMessaging();
}

export const mediator = {
  channel: c,
  init: init,
  initMessaging: initMessaging,
  initZopimStandalone: initZopimStandalone
};
