import airwaves from 'airwaves';
import _ from 'lodash';

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

state[`${chat}.connectionPending`] = true;
state[`${launcher}.userHidden`]    = false;
state[`${submitTicket}.isVisible`] = false;
state[`${chat}.isVisible`]         = false;
state[`${helpCenter}.isVisible`]   = false;
state[`${helpCenter}.isAvailable`] = false;
state[`${chat}.isOnline`]          = false;
state[`${chat}.unreadMsgs`]        = 0;
state[`${chat}.userClosed`]        = false;
state['nps.isVisible']             = false;
state['ipm.isVisible']             = false;
state['.hideOnClose']              = false;
state['identify.pending']          = false;

function init(helpCenterAvailable, hideLauncher) {
  const resetActiveEmbed = () => {
    if (state[`${helpCenter}.isAvailable`]) {
      state.activeEmbed = helpCenter;
    } else if (state[`${chat}.isOnline`]) {
      state.activeEmbed = chat;
    } else {
      state.activeEmbed = submitTicket;
    }
  };

  state[`${launcher}.userHidden`]    = hideLauncher;
  state[`${helpCenter}.isAvailable`] = helpCenterAvailable;

  resetActiveEmbed();

  c.intercept('.hide', () => {
    state[`${submitTicket}.isVisible`] = false;
    state[`${chat}.isVisible`]         = false;
    state[`${helpCenter}.isVisible`]   = false;

    c.broadcast(`${submitTicket}.hide`);
    c.broadcast(`${chat}.hide`);
    c.broadcast(`${helpCenter}.hide`);
    c.broadcast(`${launcher}.hide`);
  });

  c.intercept('.show', () => {
    state[`${submitTicket}.isVisible`] = false;
    state[`${chat}.isVisible`]         = false;
    state[`${helpCenter}.isVisible`]   = false;

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
    if (state.activeEmbed === submitTicket &&
        !state[`${helpCenter}.isAvailable`]) {
      state.activeEmbed = chat;
    }

    if (state[`${helpCenter}.isAvailable`]) {
      c.broadcast(`${launcher}.setLabelChatHelp`);
    } else {
      c.broadcast(`${launcher}.setLabelChat`);
    }

    c.broadcast(`${helpCenter}.setNextToChat`);

    if (state[`${chat}.connectionPending`]) {
      state[`${chat}.connectionPending`] = false;

      if (!state[`${launcher}.userHidden`] &&
          !state['identify.pending'] &&
          !state['nps.isVisible'] &&
          !state['ipm.isVisible']) {
        c.broadcast(`${launcher}.show`);
      }
    }
  });

  c.intercept(`${chat}.onOffline`, () => {
    state[`${chat}.isOnline`] = false;

    if (state.activeEmbed === chat) {
      resetActiveEmbed();
    }

    c.broadcast(`${launcher}.setLabelHelp`);
    c.broadcast(`${helpCenter}.setNextToSubmitTicket`);

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

  c.intercept(`${chat}.onUnreadMsgs`, (__, count) => {
    state[`${chat}.unreadMsgs`] = count;

    if (state[`${chat}.isOnline`]) {
      c.broadcast(`${launcher}.setLabelUnreadMsgs`, count);

      if (state[`${chat}.userClosed`] === false && !isMobileBrowser()) {
        state[`${chat}.isVisible`] = true;
        state.activeEmbed = chat;
        c.broadcast(`${chat}.show`);
        c.broadcast(`${launcher}.hide`);
      }
    }
  });

  c.intercept(`${helpCenter}.onNextClick`, () => {
    if (state[`${chat}.isOnline`]) {

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

    // Run this on a seperate `tick` from submitTicket.show
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
    // chat opens in new window so hide isn't needed
    if (state.activeEmbed === chat && isMobileBrowser()) {
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
    state[`${chat}.isVisible`]  = false;
    state[`${chat}.userClosed`] = true;
    _broadcast();
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

      if (!state['.hideOnClose']) {
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

    if (state[`${helpCenter}.isAvailable`]) {
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

  c.intercept(`${chat}.onChatEnd`, () => {
    if (state[`${helpCenter}.isAvailable`]) {
      state.activeEmbed = helpCenter;
    } else {
      c.broadcast(`${launcher}.show`, { transition: 'upShow' });
      c.broadcast(`${chat}.hide`);
      state[`${chat}.isVisible`] = false;
    }
  });

  c.intercept(`.onSetHelpCenterSuggestions`, (__, params) => {
    c.broadcast(`${helpCenter}.setHelpCenterSuggestions`, params);
  });

  c.subscribe(`${launcher}.show`, () => {
    if (!state[`${chat}.isOnline`]) {
      c.broadcast(`${launcher}.setLabelHelp`);
    }
    if (state[`${chat}.isOnline`] && state[`${helpCenter}.isAvailable`]) {
      c.broadcast(`${launcher}.setLabelChatHelp`);
    }
    if (state[`${chat}.isOnline`] && !state[`${helpCenter}.isAvailable`]) {
      c.broadcast(`${launcher}.setLabelChat`);
    }
  });

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

    if (params.pendingCampaign) {
      c.broadcast(`ipm.setIpm`, params);
    } else if (params.npsSurvey) {
      c.broadcast(`nps.setSurvey`, params);
    }
  });

  c.intercept(`nps.onActivate`, () => {
    const maxRetries = 100;
    let retries = 0;

    const embedVisible = (_state) => {
      return _.any([
        _state[`${helpCenter}.isVisible`],
        _state[`${chat}.isVisible`],
        _state[`${submitTicket}.isVisible`]
      ]);
    };

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

    const embedVisible = (_state) => {
      return _.any([
        _state[`${helpCenter}.isVisible`],
        _state[`${chat}.isVisible`],
        _state[`${submitTicket}.isVisible`]
      ]);
    };

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

export const mediator = {
  channel: c,
  init: init,
  initMessaging: initMessaging
};
