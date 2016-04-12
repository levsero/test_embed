import airwaves from 'airwaves';
import _ from 'lodash';

import { settings } from 'service/settings';
import { isMobileBrowser } from 'utility/devices';
import { setScrollKiller,
         setWindowScroll,
         revertWindowScroll } from 'utility/scrollHacks';

const c = new airwaves.Channel();

const submitTicket = 'ticketSubmissionForm';
const launcher = 'launcher';
const chat = 'zopimChat';
const helpCenter = 'helpCenterForm';
const state = {};

state[`${chat}.connectionPending`]  = true;
state[`${launcher}.userHidden`]     = false;
state[`${submitTicket}.isVisible`]  = false;
state[`${chat}.isVisible`]          = false;
state[`${helpCenter}.isVisible`]    = false;
state[`${helpCenter}.isAccessible`] = false;
state[`${helpCenter}.isSuppressed`] = false;
state[`${chat}.isOnline`]           = false;
state[`${chat}.isSuppressed`]       = false;
state[`${chat}.unreadMsgs`]         = 0;
state[`${chat}.userClosed`]         = false;
state[`${chat}.chatEnded`]          = false;
state['nps.isVisible']              = false;
state['ipm.isVisible']              = false;
state['.hideOnClose']               = false;
state['.hasHidden']                 = false;
state['identify.pending']           = false;

const helpCenterAvailable = () => {
  return state[`${helpCenter}.isAccessible`] && !state[`${helpCenter}.isSuppressed`];
};

const chatAvailable = () => {
  return state[`${chat}.isOnline`] && !state[`${chat}.isSuppressed`];
};

const isSuppressed = (embed) => {
  return settings.get('suppress') ? settings.get('suppress').indexOf(embed) !== -1 : false;
};

const embedVisible = (_state) => _.any([
  _state[`${helpCenter}.isVisible`],
  _state[`${chat}.isVisible`],
  _state[`${submitTicket}.isVisible`]
]);

const resetActiveEmbed = () => {
  if (helpCenterAvailable()) {
    state.activeEmbed = helpCenter;
  } else if (chatAvailable()) {
    state.activeEmbed = chat;
  } else {
    state.activeEmbed = submitTicket;
  }
};

function init(helpCenterAccessible, params = {}) {
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

  state['.hasHidden']                 = params.hideLauncher;
  state[`${launcher}.userHidden`]     = params.hideLauncher;
  state[`${helpCenter}.isAccessible`] = helpCenterAccessible && !params.helpCenterSignInRequired;
  state[`${helpCenter}.isSuppressed`] = isSuppressed('helpCenter');
  state[`${chat}.isSuppressed`]       = isSuppressed('chat');

  resetActiveEmbed();

  c.intercept('.hide', () => {
    state[`${submitTicket}.isVisible`] = false;
    state[`${chat}.isVisible`]         = false;
    state[`${helpCenter}.isVisible`]   = false;
    state['.hasHidden']                = true;

    c.broadcast(`${submitTicket}.hide`);
    c.broadcast(`${chat}.hide`);
    c.broadcast(`${helpCenter}.hide`);
    c.broadcast(`${launcher}.hide`);
  });

  c.intercept('.show', () => {
    state[`${submitTicket}.isVisible`] = false;
    state[`${chat}.isVisible`]         = false;
    state[`${helpCenter}.isVisible`]   = false;
    state['.hasHidden']                = false;

    resetActiveEmbed();

    c.broadcast(`${submitTicket}.hide`);
    c.broadcast(`${chat}.hide`);
    c.broadcast(`${helpCenter}.hide`);
    c.broadcast(`${launcher}.show`);
  });

  c.intercept('.activate', (__, options = {}) => {
    if (!state[`${submitTicket}.isVisible`] &&
        !state[`${chat}.isVisible`] &&
        !state[`${helpCenter}.isVisible`]) {
      resetActiveEmbed();

      c.broadcast(`${launcher}.hide`);

      state['.hideOnClose'] = (options.hideOnClose)
                            ? true
                            : false;

      c.broadcast(`${state.activeEmbed}.show`, { transition: 'upShow' });
      state[`${state.activeEmbed}.isVisible`] = true;
    }
  });

  c.intercept(`.logout`, () => {
    c.broadcast(`authentication.logout`);
  });

  c.intercept('.zopimShow', () => {
    c.broadcast(`${submitTicket}.hide`);
    c.broadcast(`${helpCenter}.hide`);

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

    if (state.activeEmbed === submitTicket && !helpCenterAvailable()) {
      state.activeEmbed = chat;
    }

    if (helpCenterAvailable()) {
      c.broadcast(`${launcher}.setLabelChatHelp`);
    } else {
      c.broadcast(`${launcher}.setLabelChat`);
    }

    c.broadcast(`${helpCenter}.setNextToChat`);

    if (state[`${chat}.connectionPending`]) {
      state[`${chat}.connectionPending`] = false;

      if (!state[`${launcher}.userHidden`] &&
          !embedVisible(state) &&
          !state['identify.pending'] &&
          !state['nps.isVisible'] &&
          !state['ipm.isVisible']) {
        c.broadcast(`${launcher}.show`);
      }
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

      c.broadcast(`${launcher}.setLabelHelp`);
      c.broadcast(`${helpCenter}.setNextToSubmitTicket`);
    }

    if (state[`${chat}.connectionPending`]) {
      state[`${chat}.connectionPending`] = false;

      setTimeout(() => {
        if (!state[`${launcher}.userHidden`] &&
            !state['identify.pending'] &&
            !state['nps.isVisible'] &&
            !state['ipm.isVisible']) {
          c.broadcast(`${launcher}.show`);
        }
      }, 3000);
    }
  });

  c.intercept(`${chat}.onShow`, () => {
    state[`${chat}.isVisible`] = true;
    c.broadcast(`${launcher}.hide`);
  });

  c.intercept(`${chat}.onIsChatting`, () => {
    state.activeEmbed = chat;
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
      c.broadcast(`${launcher}.hide`);
    }

    updateLauncherLabel();
  });

  c.intercept(`${helpCenter}.onNextClick`, () => {
    if (chatAvailable()) {
      if (!isMobileBrowser()) {
        state[`${chat}.isVisible`] = true;
        c.broadcast(`${launcher}.hide`);
      }

      if (isMobileBrowser()) {
        c.broadcast(`${launcher}.show`);
      }

      state.activeEmbed = chat;
      c.broadcast(`${chat}.show`);
    } else {
      state[`${submitTicket}.isVisible`] = true;
      state.activeEmbed = submitTicket;

      // Run this on a seperate `tick` from helpCenter.hide
      // to mitigate ghost-clicking
      setTimeout(() => {
        if (isMobileBrowser()) {
          c.broadcast(`${submitTicket}.show`);
        } else {
          c.broadcast(`${submitTicket}.show`, { transition: 'upShow' });
        }
      }, 0);
    }

    state[`${helpCenter}.isVisible`] = false;

    // Run this on a separate `tick` from submitTicket.show
    setTimeout(() => {
      if (isMobileBrowser()) {
        c.broadcast(`${helpCenter}.hide`);
      } else {
        c.broadcast(`${helpCenter}.hide`, { transition: 'upHide' });
      }
    }, 0);

    if (isMobileBrowser()) {
      c.broadcast(`${submitTicket}.showBackButton`);
    }
  });

  c.intercept(`${helpCenter}.onSearch`, (__, params) => {
    c.broadcast(`${submitTicket}.setLastSearch`, params);
  });

  c.intercept(`${launcher}.onClick`, () => {
    // Re-authenticate user if their oauth token is within 20 minutes of expiring
    if (helpCenterAvailable()) {
      c.broadcast('authentication.renew');
    }

    // chat opens in new window so hide isn't needed
    if (state.activeEmbed === chat && isMobileBrowser()) {
      c.broadcast(`${chat}.show`);
    } else if (chatAvailable() && state[`${chat}.unreadMsgs`]) {
      state[`${chat}.unreadMsgs`] = 0;
      state.activeEmbed = chat;

      /**
       *  In case you're wondering, `launcher.hide`
       *  is broadcasted by chat.onShow broadcast
       */
      c.broadcast(`${chat}.show`);
    } else {
      c.broadcast(`${launcher}.hide`, { transition: 'downHide' });
      state[`${state.activeEmbed}.isVisible`] = true;

      /**
       * This timeout mitigates the Ghost Click produced when the launcher
       * button is on the left, using a mobile device with small screen
       * e.g. iPhone4. It's not a bulletproof solution, but it helps
       */

      setTimeout(() => {
        c.broadcast(`${state.activeEmbed}.show`, { transition: 'upShow' });
        if (isMobileBrowser()) {
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
      }, 0);
    }
  });

  c.intercept(`${helpCenter}.onClose`, (_broadcast) => {
    state[`${helpCenter}.isVisible`] = false;
    _broadcast();
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

    if (state[`${helpCenter}.isAccessible`]) {
      state.activeEmbed = helpCenter;
    }
  });

  c.intercept(`${submitTicket}.onClose`, (_broadcast) => {
    state[`${submitTicket}.isVisible`] = false;
    _broadcast();
  });

  c.subscribe(
    [`${helpCenter}.onClose`,
     `${chat}.onHide`,
     `${submitTicket}.onClose`].join(','),
    () => {
      if (isMobileBrowser()) {
        setScrollKiller(false);
        revertWindowScroll();
      }

      // Fix for when a pro-active message is recieved which opens the zopim window but the launcher
      // was previously hidden with zE.hide()
      if (!state['.hideOnClose'] && !state['.hasHidden']) {
        c.broadcast(`${launcher}.show`, { transition: 'upShow' });
      }
    }
  );

  c.intercept(`${submitTicket}.onBackClick`, () => {
    state[`${submitTicket}.isVisible`] = false;
    state[`${helpCenter}.isVisible`]   = true;
    state.activeEmbed = helpCenter;

    // Run these two broadcasts on a seperate `ticks`
    // to mitigate ghost-clicking
    setTimeout(() => {
      c.broadcast(`${submitTicket}.hide`);
    }, 10); // delay hiding so we don't see host page flashing

    setTimeout(() => {
      c.broadcast(`${helpCenter}.show`);
    }, 0);
  });

  c.intercept(`${submitTicket}.onCancelClick`, () => {
    state[`${submitTicket}.isVisible`] = false;
    c.broadcast(`${submitTicket}.hide`, { transition: 'downHide' });

    if (helpCenterAvailable()) {
      state[`${helpCenter}.isVisible`] = true;
      state.activeEmbed = helpCenter;
      c.broadcast(`${helpCenter}.show`, { transition: 'downShow' });
    } else if (!state['.hideOnClose']) {
      c.broadcast(`${launcher}.show`, { transition: 'upShow' });
    }
  });

  c.intercept(`${submitTicket}.onFormSubmitted`, () => {
    resetActiveEmbed();
  });

  c.intercept('.orientationChange', () => {
    c.broadcast(`${submitTicket}.update`);
  });

  c.intercept(`.onSetHelpCenterSuggestions`, (__, params) => {
    c.broadcast(`${helpCenter}.setHelpCenterSuggestions`, params);
  });

  c.subscribe(`${launcher}.show`, updateLauncherLabel);

  initMessaging();
}

function initMessaging() {
  c.intercept(`.onIdentify`, (__, params) => {
    state['identify.pending'] = true;

    c.broadcast(`beacon.identify`, params);
    c.broadcast(`${submitTicket}.prefill`, params);
    c.broadcast(`${chat}.setUser`, params);
  });

  c.intercept(`identify.onSuccess`, (__, params) => {
    state['identify.pending'] = false;

    c.broadcast(`ipm.setIpm`, params);
    c.broadcast(`nps.setSurvey`, params);
  });

  c.intercept(`authentication.onSuccess`, () => {
    state[`${helpCenter}.isAccessible`] = true;
    if (!embedVisible(state) && state[`${helpCenter}.isAccessible`]) {
      resetActiveEmbed();
    }
  });

  c.intercept(`nps.onActivate`, () => {
    const maxRetries = 100;
    let retries = 0;

    const fn = () => {
      if (!state['identify.pending'] && !embedVisible(state)) {
        c.broadcast(`nps.activate`);
      } else if (retries < maxRetries) {
        retries++;
        setTimeout(fn, 300);
      }
    };

    fn();
  });

  c.intercept(`nps.onClose`, () => {
    state['nps.isVisible'] = false;

    if (!state['.hideOnClose']) {
      c.broadcast(`${launcher}.show`, { transition: 'upShow' });
    }
  });

  c.intercept(`nps.onShow`, () => {
    state['nps.isVisible'] = true;

    c.broadcast(`${launcher}.hide`);
  });

  c.intercept(`ipm.onActivate`, () => {
    const maxRetries = 100;
    let retries = 0;

    const fn = () => {
      if (!state['identify.pending'] && !embedVisible(state)) {
        c.broadcast(`ipm.activate`);
      } else if (retries < maxRetries) {
        retries++;
        setTimeout(fn, 300);
      }
    };

    fn();
  });

  c.intercept(`ipm.onClose`, () => {
    state['ipm.isVisible'] = false;

    if (!state['.hideOnClose']) {
      c.broadcast(`${launcher}.show`, { transition: 'upShow' });
    }
  });

  c.intercept(`ipm.onShow`, () => {
    state['ipm.isVisible'] = true;

    c.broadcast(`${launcher}.hide`);
  });
}

function initZopimStandalone() {
  // Intercept zE.hide() zE.show(), and zE.activate() API calls.
  // Make them an alias for zopims hide and show functions if the user is on a naked zopim configuration.
  // zE.hide() = $zopim.livechat.hideAll(),
  // zE.show() = $zopim.livechat.button.show().
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
