import airwaves from 'airwaves';

import { isMobileBrowser } from 'utility/devices';
import { setScrollKiller,
         setWindowScroll,
         revertWindowScroll } from 'utility/scrollHacks';

const c = new airwaves.Channel();

function init(helpCenterAvailable, hideLauncher) {
  const submitTicket = 'ticketSubmissionForm';
  const launcher = 'launcher';
  const chat = 'zopimChat';
  const helpCenter = 'helpCenterForm';
  let state = {};
  const resetActiveEmbed = function() {
    if (state[`${helpCenter}.isAvailable`]) {
      state.activeEmbed = helpCenter;
    } else if (state[`${chat}.isOnline`]) {
      state.activeEmbed = chat;
    } else {
      state.activeEmbed = submitTicket;
    }
  };

  state[`${chat}.connectionPending`] = true;
  state[`${launcher}.userHidden`]    = hideLauncher;
  state[`${submitTicket}.isVisible`] = false;
  state[`${chat}.isVisible`]         = false;
  state[`${helpCenter}.isVisible`]   = false;
  state[`${helpCenter}.isAvailable`] = helpCenterAvailable;
  state[`${chat}.isOnline`]          = false;
  state[`${chat}.unreadMsgs`]        = 0;
  state[`${chat}.userClosed`]        = false;
  state['.hideOnClose']              = false;
  state['identify.pending']          = false;

  resetActiveEmbed();

  c.intercept('.hide', function() {
    state[`${submitTicket}.isVisible`] = false;
    state[`${chat}.isVisible`]         = false;
    state[`${helpCenter}.isVisible`]   = false;

    c.broadcast(`${submitTicket}.hide`);
    c.broadcast(`${chat}.hide`);
    c.broadcast(`${helpCenter}.hide`);
    c.broadcast(`${launcher}.hide`);
  });

  c.intercept('.show', function() {
    state[`${submitTicket}.isVisible`] = false;
    state[`${chat}.isVisible`]         = false;
    state[`${helpCenter}.isVisible`]   = false;

    resetActiveEmbed();

    c.broadcast(`${submitTicket}.hide`);
    c.broadcast(`${chat}.hide`);
    c.broadcast(`${helpCenter}.hide`);
    c.broadcast(`${launcher}.show`);
  });

  c.intercept('.activate', function(__, options = {}) {
    if (!state[`${submitTicket}.isVisible`] &&
        !state[`${chat}.isVisible`] &&
        !state[`${helpCenter}.isVisible`]) {

      resetActiveEmbed();

      c.broadcast(`${launcher}.hide`);

      if (options.hideOnClose) {
        state['.hideOnClose'] = true;
      }

      c.broadcast(`${state.activeEmbed}.showWithAnimation`);
      state[`${state.activeEmbed}.isVisible`] = true;
    }
  });

  c.intercept('.zopimShow', function() {
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

  c.intercept('.zopimHide', function() {
    c.broadcast(`${launcher}.show`);
    state[`${chat}.isVisible`] = false;
    resetActiveEmbed();
  });

  c.intercept(`${chat}.onOnline`, function() {
    state[`${chat}.isOnline`] = true;
    if (state.activeEmbed === submitTicket && !state[`${helpCenter}.isAvailable`]) {
      state.activeEmbed = chat;
    }

    if (state[`${helpCenter}.isAvailable`]) {
      c.broadcast(`${launcher}.setLabelChatHelp`);
    } else {
      c.broadcast(`${launcher}.setLabelChat`);
    }

    c.broadcast(`${helpCenter}.setNextToChat`);

    if (!state[`${launcher}.userHidden`] && state[`${chat}.connectionPending`]) {
      state[`${chat}.connectionPending`] = false;
      c.broadcast(`${launcher}.show`);
    }
  });

  c.intercept(`${chat}.onOffline`, function() {
    state[`${chat}.isOnline`] = false;

    if (state.activeEmbed === chat) {
      resetActiveEmbed();
    }

    c.broadcast(`${launcher}.setLabelHelp`);
    c.broadcast(`${helpCenter}.setNextToSubmitTicket`);

    if (!state[`${launcher}.userHidden`] && state[`${chat}.connectionPending`]) {
      state[`${chat}.connectionPending`] = false;
      setTimeout(function() {
        c.broadcast(`${launcher}.show`);
      }, 3000);
    }
  });

  c.intercept(`${chat}.onShow`, function() {
    state[`${chat}.isVisible`] = true;
    c.broadcast(`${launcher}.hide`);
  });

  c.intercept(`${chat}.onUnreadMsgs`, function(__, count) {
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

  c.intercept(`${helpCenter}.onNextClick`, function() {
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
      setTimeout(function() {
        c.broadcast(`${submitTicket}.show`);
      }, 0);
    }

    state[`${helpCenter}.isVisible`] = false;

    // Run this on a seperate `tick` from submitTicket.show
    setTimeout(function() {
      c.broadcast(`${helpCenter}.hide`);
    }, 0);

    if (isMobileBrowser()) {
      c.broadcast(`${submitTicket}.showBackButton`);
    }
  });

  c.intercept(`${helpCenter}.onSearch`, function(__, params) {
    c.broadcast(`${submitTicket}.setLastSearch`, params);
  });

  c.intercept(
    [`${launcher}.onClick`,
     `${helpCenter}.onClose`,
     `${chat}.onHide`,
     `${submitTicket}.onClose`].join(','),
    function() {
      if (_.any([state[`${chat}.isVisible`],
                 state[`${submitTicket}.isVisible`],
                 state[`${helpCenter}.isVisible`]])) {
        if (state[`${helpCenter}.isVisible`]) {
          c.broadcast(`${helpCenter}.hide`);
          state[`${helpCenter}.isVisible`] = false;
        }
        if (state[`${chat}.isVisible`]) {
          c.broadcast(`${chat}.hide`);
          state[`${chat}.isVisible`]  = false;
          state[`${chat}.userClosed`] = true;
        }
        if (state[`${submitTicket}.isVisible`]) {
          c.broadcast(`${submitTicket}.hide`);
          state[`${submitTicket}.isVisible`] = false;
        }

        if (isMobileBrowser()) {
          setScrollKiller(false);
          revertWindowScroll();
        }

        if (state['.hideOnClose']) {
          c.broadcast(`${launcher}.hide`);
        } else {
          c.broadcast(`${launcher}.show`);
        }
      } else {
        // chat opens in new window so hide isn't needed
        if (state.activeEmbed === chat && isMobileBrowser()) {
          c.broadcast(`${chat}.show`);
          c.broadcast(`${launcher}.show`);
        } else {
          c.broadcast(`${launcher}.hide`);
          state[`${state.activeEmbed}.isVisible`] = true;

          /**
           * This timeout mitigates the Ghost Click produced when the launcher
           * button is on the left, using a mobile device with small screen
           * e.g. iPhone4. It's not a bulletproof solution, but it helps
           */
          setTimeout(function() {
            c.broadcast(`${state.activeEmbed}.showWithAnimation`);
            if (isMobileBrowser()) {
              /**
               * This timeout ensures the embed is displayed
               * before the scrolling happens on the host page
               * so that the user doesn't see the host page jump
               */
              setTimeout(function() {
                setWindowScroll(0);
                setScrollKiller(true);
              }, 0);
            }
          }, 0);
        }
      }
    }
  );

  c.intercept(`${submitTicket}.onBackClick`, function() {
    state[`${submitTicket}.isVisible`] = false;
    state[`${helpCenter}.isVisible`]   = true;
    state.activeEmbed = helpCenter;

    // Run these two broadcasts on a seperate `ticks`
    // to mitigate ghost-clicking
    setTimeout(function() {
      c.broadcast(`${submitTicket}.hide`);
    }, 10); // delay hiding so we don't see host page flashing

    setTimeout(function() {
      c.broadcast(`${helpCenter}.show`);
    }, 0);
  });

  c.intercept(`${submitTicket}.onCancelClick`, function() {
    state[`${submitTicket}.isVisible`] = false;
    c.broadcast(`${submitTicket}.hide`);

    if (state[`${helpCenter}.isAvailable`]) {
      state[`${helpCenter}.isVisible`] = true;
      state.activeEmbed = helpCenter;
      c.broadcast(`${helpCenter}.show`);
    } else if (!state['.hideOnClose']) {
      c.broadcast(`${launcher}.show`);
    }
  });

  c.intercept(`${submitTicket}.onFormSubmitted`, function() {
    resetActiveEmbed();
  });

  c.intercept(`${chat}.onChatEnd`, function() {
    if (state[`${helpCenter}.isAvailable`]) {
      state.activeEmbed = helpCenter;
    } else {
      c.broadcast(`${launcher}.show`);
      c.broadcast(`${chat}.hide`);
      state[`${chat}.isVisible`] = false;
    }
  });

  c.intercept(`.onIdentify`, function(__, params) {
    state['identify.pending'] = true;

    c.broadcast(`beacon.identify`, params);
    c.broadcast(`${submitTicket}.prefill`, params);
  });

  c.intercept(`identify.onSuccess`, function(__, params) {
    state['identify.pending'] = false;

    c.broadcast(`nps.setSurvey`, params);
  });

  c.intercept(`nps.onActivate`, function() {
    const maxRetries = 100;
    let retries = 0;

    const fn = () => {
      if (!state['identify.pending']) {
        c.broadcast(`nps.activate`);
      } else if (retries < maxRetries) {
        retries++;
        setTimeout(fn, 300);
      }
    };

    fn();
  });
}

export var mediator = {
  channel: c,
  init: init
};
