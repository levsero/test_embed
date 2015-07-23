import airwaves from 'airwaves';

import { isMobileBrowser } from 'utility/devices';

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
    c.broadcast(`${launcher}.deactivate`);
    c.broadcast(`${launcher}.show`);
  });

  c.intercept('.activate', function(__, options = {}) {
    if (!state[`${submitTicket}.isVisible`] &&
        !state[`${chat}.isVisible`] &&
        !state[`${helpCenter}.isVisible`]) {

      resetActiveEmbed();

      if (!isMobileBrowser() && state.activeEmbed !== chat) {
        c.broadcast(`${launcher}.activate`);
      }
      c.broadcast(`${launcher}.show`);

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
    c.broadcast(`${launcher}.deactivate`);

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
    c.broadcast(`${launcher}.deactivate`);
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
        c.broadcast(`${launcher}.deactivate`);
      }

      state.activeEmbed = chat;
      c.broadcast(`${chat}.show`);
    } else {
      state[`${submitTicket}.isVisible`] = true;
      state.activeEmbed = submitTicket;
      c.broadcast(`${submitTicket}.show`);
    }

    state[`${helpCenter}.isVisible`] = false;
    c.broadcast(`${helpCenter}.hide`);
    c.broadcast(`${submitTicket}.showBackButton`);
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
        c.broadcast(`${launcher}.deactivate`);
        if (state['.hideOnClose']) {
          c.broadcast(`${launcher}.hide`);
        } else {
          c.broadcast(`${launcher}.show`);
        }
      } else {

        // hide launcher on mobile and chat so customers don't see
        // it underneith the embeds
        if ((state.activeEmbed === chat && !isMobileBrowser()) ||
            (isMobileBrowser() && state.activeEmbed !== chat)) {
          c.broadcast(`${launcher}.hide`);
        }

        // chat opens in new window so hide isn't needed
        if (state.activeEmbed === chat && isMobileBrowser()) {
          c.broadcast(`${chat}.show`);
        } else {
          state[`${state.activeEmbed}.isVisible`] = true;

          /**
           * This timeout mitigates the Ghost Click produced when the launcher
           * button is on the left, using a mobile device with small screen
           * e.g. iPhone4. It's not a bulletproof solution, but it helps
           */
          setTimeout(function() {
            c.broadcast(`${state.activeEmbed}.showWithAnimation`);
          }, 0);
        }

        // launcher only activates on desktop and is hidden for chat
        if (!isMobileBrowser() && state.activeEmbed !== chat) {
          c.broadcast(`${launcher}.activate`);
        }
      }
    }
  );

  c.intercept(`${submitTicket}.onBackClick`, function() {
    state[`${submitTicket}.isVisible`] = false;
    state[`${helpCenter}.isVisible`]   = true;
    state.activeEmbed = helpCenter;

    c.broadcast(`${submitTicket}.hide`);
    c.broadcast(`${helpCenter}.show`);
  });

  c.intercept(`${submitTicket}.onFormSubmitted`, function() {
    resetActiveEmbed();
  });

  c.intercept(`${chat}.onChatEnd`, function() {
    if (state[`${helpCenter}.isAvailable`]) {
      state.activeEmbed = helpCenter;
    } else {
      c.broadcast(`${launcher}.deactivate`);
      c.broadcast(`${launcher}.show`);
      c.broadcast(`${chat}.hide`);
      state[`${chat}.isVisible`] = false;
    }
  });

  c.subscribe(`${launcher}.deactivate`, function() {
    if (state[`${chat}.isOnline`]) {
      if (state[`${helpCenter}.isAvailable`]) {
        c.broadcast(`${launcher}.setLabelChatHelp`);
      } else {
        c.broadcast(`${launcher}.setLabelChat`);
      }
    } else {
      c.broadcast(`${launcher}.setLabelHelp`);
    }
  });
}

export var mediator = {
  channel: c,
  init: init
};
