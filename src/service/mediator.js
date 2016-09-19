import airwaves from 'airwaves';
import _ from 'lodash';

import { settings } from 'service/settings';
import { isMobileBrowser } from 'utility/devices';
import { setScrollKiller,
         setWindowScroll,
         revertWindowScroll } from 'utility/scrollHacks';
import { isOnHelpCenterPage } from 'utility/pages';

const c = new airwaves.Channel();

const submitTicket = 'ticketSubmissionForm';
const launcher = 'launcher';
const chat = 'zopimChat';
const helpCenter = 'helpCenterForm';
const channelChoice = 'channelChoice';
const state = {};

state[`${chat}.connectionPending`]  = true;
state[`${launcher}.userHidden`]     = false;
state[`${submitTicket}.isVisible`]  = false;
state[`${chat}.isVisible`]          = false;
state[`${helpCenter}.isVisible`]    = false;
state[`${helpCenter}.isAccessible`] = false;
state[`${helpCenter}.isSuppressed`] = false;
state[`${channelChoice}.isVisible`] = false;
state[`${channelChoice}.isAccessible`] = false;
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

const channelChoiceAvailable = () => {
  return state[`${channelChoice}.isAccessible`]
    && !state[`${helpCenter}.isAccessible`]
    && chatAvailable()
    && submitTicketAvailable();
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
  _state[`${channelChoice}.isVisible`],
  _state[`${chat}.isVisible`],
  _state[`${submitTicket}.isVisible`]
]);

const resetActiveEmbed = () => {
  if (helpCenterAvailable()) {
    state.activeEmbed = helpCenter;
  } else if (channelChoiceAvailable()) {
    state.activeEmbed = channelChoice;
  } else if (chatAvailable()) {
    state.activeEmbed = chat;
  } else if (submitTicketAvailable()) {
    state.activeEmbed = submitTicket;
  } else {
    c.broadcast(`${launcher}.hide`);
  }
};

const trackChatStarted = () => {
  c.broadcast('beacon.trackUserAction', 'chat', 'opened', chat);
};

function init(embedsAccessible, params = {}) {
  const updateLauncherLabel = () => {
    if (chatAvailable()) {
      if (state[`${chat}.unreadMsgs`]) {
        c.broadcast(`${launcher}.setLabelUnreadMsgs`, state[`${chat}.unreadMsgs`]);
      }
      else if (helpCenterAvailable() || channelChoiceAvailable()) {
        c.broadcast(`${launcher}.setLabelChatHelp`);
      } else {
        c.broadcast(`${launcher}.setLabelChat`);
      }
    } else {
      c.broadcast(`${launcher}.setLabelHelp`);
    }
  };

  state['.hasHidden']                   = params.hideLauncher;
  state[`${launcher}.userHidden`]       = params.hideLauncher;
  state[`${submitTicket}.isAccessible`] = embedsAccessible.submitTicket;
  state[`${helpCenter}.isAccessible`]   = embedsAccessible.helpCenter &&
                                         (!params.helpCenterSignInRequired ||
                                         isOnHelpCenterPage());
  state[`${channelChoice}.isAccessible`] = embedsAccessible.channelChoice;
  state[`${helpCenter}.isSuppressed`]   = settings.get('helpCenter.suppress');
  state[`${chat}.isSuppressed`]         = settings.get('chat.suppress');
  state[`${submitTicket}.isSuppressed`] = settings.get('contactForm.suppress');

  if (!submitTicketAvailable()) {
    c.broadcast(`${helpCenter}.showNextButton`, false);
  }

  resetActiveEmbed();

  c.intercept('.hide', () => {
    state[`${submitTicket}.isVisible`] = false;
    state[`${channelChoice}.isVisible`] = false;
    state[`${chat}.isVisible`]         = false;
    state[`${helpCenter}.isVisible`]   = false;
    state['.hasHidden']                = true;

    c.broadcast(`${submitTicket}.hide`);
    c.broadcast(`${chat}.hide`);
    c.broadcast(`${helpCenter}.hide`);
    c.broadcast(`${launcher}.hide`);
  });

  c.intercept(`.show, ${chat}.onError`, () => {
    state[`${submitTicket}.isVisible`] = false;
    state[`${channelChoice}.isVisible`] = false;
    state[`${chat}.isVisible`]         = false;
    state[`${helpCenter}.isVisible`]   = false;
    state['.hasHidden']                = false;

    resetActiveEmbed();

    c.broadcast(`${submitTicket}.hide`);
    c.broadcast(`${channelChoice}.hide`);
    c.broadcast(`${chat}.hide`);
    c.broadcast(`${helpCenter}.hide`);

    if (embedAvailable()) {
      c.broadcast(`${launcher}.show`);
    }
  });

  c.intercept('.activate', (__, options = {}) => {
    if (!state[`${submitTicket}.isVisible`] &&
        !state[`${channelChoice}.isVisible`] &&
        !state[`${chat}.isVisible`] &&
        !state[`${helpCenter}.isVisible`]) {
      resetActiveEmbed();

      c.broadcast(`${launcher}.hide`);

      state['.hideOnClose'] = !!options.hideOnClose;

      if (embedAvailable()) {
        c.broadcast(`${state.activeEmbed}.show`, {
          transition: getShowAnimation(),
          viaActivate: true
        });
        state[`${state.activeEmbed}.isVisible`] = true;
      }
    }
  });

  c.intercept('.logout', () => {
    c.broadcast('authentication.logout');
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

  c.intercept(`${channelChoice}.onClose`, (_broadcast) => {
    state[`${channelChoice}.isVisible`] = false;
    _broadcast();
  });

  c.intercept(`${chat}.onOnline`, () => {
    state[`${chat}.isOnline`] = true;

    if (!chatAvailable()) {
      return;
    }

    if (!submitTicketAvailable()) {
      c.broadcast(`${helpCenter}.showNextButton`, true);
    }

    if ((state.activeEmbed === submitTicket || !state.activeEmbed) && !helpCenterAvailable()) {
      state.activeEmbed = channelChoiceAvailable() ? channelChoice : chat;
    }

    if (helpCenterAvailable() || channelChoiceAvailable()) {
      c.broadcast(`${launcher}.setLabelChatHelp`);
    } else {
      c.broadcast(`${launcher}.setLabelChat`);
    }

    c.broadcast(`${helpCenter}.setNextToChat`);

    if (!submitTicketAvailable() && !helpCenterAvailable()) {
      c.broadcast(`${launcher}.show`);
    }

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
      if (state.activeEmbed === chat || state.activeEmbed === channelChoice) {
        resetActiveEmbed();
      }

      c.broadcast(`${launcher}.setLabelHelp`);
      c.broadcast(`${helpCenter}.setNextToSubmitTicket`);
    }

    if (!submitTicketAvailable()) {
      c.broadcast(`${helpCenter}.showNextButton`, false);
    }

    if (state[`${chat}.connectionPending`]) {
      state[`${chat}.connectionPending`] = false;

      setTimeout(() => {
        if (!state[`${launcher}.userHidden`] &&
            !state['identify.pending'] &&
            !state['nps.isVisible'] &&
            !state['ipm.isVisible'] &&
            embedAvailable()) {
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
      state[`${chat}.isSuppressed`] = false;
      c.broadcast(`${launcher}.hide`);
    }

    updateLauncherLabel();
  });

  c.intercept(
    [`${helpCenter}.onNextClick`,
     `${channelChoice}.onNextClick`].join(','),
    (__, embed) => {
      const currentEmbed = state.activeEmbed;

      if (embed === 'chat' || (!embed && chatAvailable())) {
        if (!isMobileBrowser()) {
          state[`${chat}.isVisible`] = true;
          c.broadcast(`${launcher}.hide`);
        } else {
          c.broadcast(`${launcher}.show`);
        }

        trackChatStarted();

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

      state[`${currentEmbed}.isVisible`] = false;

      // Run this on a separate `tick` from submitTicket.show
      setTimeout(() => {
        if (isMobileBrowser()) {
          c.broadcast(`${currentEmbed}.hide`);
        } else {
          c.broadcast(`${currentEmbed}.show`, { transition: getShowAnimation() });
        }
      }, 0);

      if (isMobileBrowser()) {
        c.broadcast(`${helpCenter}.hide`);
        c.broadcast(`${submitTicket}.showBackButton`);
      } else {
        c.broadcast(`${helpCenter}.hide`, { transition: getHideAnimation() });
      }
    }
  );

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
      c.broadcast(`${launcher}.hide`, { transition: getHideAnimation() });
      state[`${state.activeEmbed}.isVisible`] = true;

      /**
       * This timeout mitigates the Ghost Click produced when the launcher
       * button is on the left, using a mobile device with small screen
       * e.g. iPhone4. It's not a bulletproof solution, but it helps
       */

      if (state.activeEmbed === chat) {
        trackChatStarted();
      }

      setTimeout(() => {
        c.broadcast(`${state.activeEmbed}.show`, { transition: getShowAnimation() });
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
     `${channelChoice}.onClose`,
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
        c.broadcast(`${launcher}.show`, { transition: getShowAnimation() });
      }
    }
  );

  c.intercept(`${submitTicket}.onBackClick`, () => {
    const activeEmbed = helpCenterAvailable() ? helpCenter : channelChoice;

    state[`${submitTicket}.isVisible`] = false;
    state[`${activeEmbed}.isVisible`] = true;
    state.activeEmbed = activeEmbed;

    // Run these two broadcasts on a seperate `ticks`
    // to mitigate ghost-clicking
    setTimeout(() => {
      c.broadcast(`${submitTicket}.hide`);
    }, 10); // delay hiding so we don't see host page flashing

    setTimeout(() => {
      c.broadcast(`${activeEmbed}.show`);
    }, 0);
  });

  c.intercept(`${submitTicket}.onCancelClick`, () => {
    state[`${submitTicket}.isVisible`] = false;
    c.broadcast(`${submitTicket}.hide`, { transition: getHideAnimation() });

    if (helpCenterAvailable()) {
      state[`${helpCenter}.isVisible`] = true;
      state.activeEmbed = helpCenter;
      c.broadcast(`${helpCenter}.show`, { transition: getShowAnimation() });
    } else if (channelChoiceAvailable()) {
      state[`${channelChoice}.isVisible`] = true;
      state.activeEmbed = channelChoice;
      c.broadcast(`${channelChoice}.show`, { transition: 'downShow' });
    } else if (!state['.hideOnClose']) {
      c.broadcast(`${launcher}.show`, { transition: getShowAnimation() });
    }
  });

  c.intercept(`${submitTicket}.onFormSubmitted`, () => {
    resetActiveEmbed();
  });

  c.intercept('.orientationChange', () => {
    c.broadcast(`${submitTicket}.update`);
  });

  c.intercept('.onSetHelpCenterSuggestions', (__, params) => {
    c.broadcast(`${helpCenter}.setHelpCenterSuggestions`, params);
  });

  if (embedAvailable()) {
    c.subscribe(`${launcher}.show`, updateLauncherLabel);
  }

  initMessaging();
}

function initMessaging() {
  c.intercept('.onIdentify', (__, params) => {
    state['identify.pending'] = true;

    c.broadcast('beacon.identify', params);
    c.broadcast(`${submitTicket}.prefill`, params);
    c.broadcast(`${chat}.setUser`, params);
  });

  c.intercept('identify.onSuccess', (__, params) => {
    state['identify.pending'] = false;

    c.broadcast('ipm.setIpm', params);
    c.broadcast('nps.setSurvey', params);
  });

  c.intercept('authentication.onSuccess', () => {
    state[`${helpCenter}.isAccessible`] = true;
    if (!embedVisible(state) && state[`${helpCenter}.isAccessible`]) {
      resetActiveEmbed();
    }

    c.broadcast(`${helpCenter}.isAuthenticated`);
  });

  c.intercept('nps.onActivate', () => {
    const maxRetries = 100;
    let retries = 0;

    const fn = () => {
      if (!state['identify.pending'] && !embedVisible(state)) {
        c.broadcast('nps.activate');
      } else if (retries < maxRetries) {
        retries++;
        setTimeout(fn, 300);
      }
    };

    fn();
  });

  c.intercept('nps.onClose', () => {
    state['nps.isVisible'] = false;

    if (!state['.hideOnClose']) {
      c.broadcast(`${launcher}.show`, { transition: 'upShow' });
    }
  });

  c.intercept('nps.onShow', () => {
    state['nps.isVisible'] = true;

    c.broadcast(`${launcher}.hide`);
  });

  c.intercept('ipm.onActivate', () => {
    const maxRetries = 100;
    let retries = 0;

    const fn = () => {
      if (!state['identify.pending'] && !embedVisible(state)) {
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
