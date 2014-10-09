import { isMobileBrowser } from 'utility/devices';

module airwaves from 'airwaves';

var channel = new airwaves.Channel(),
    c = channel;

function initTicketSubmissionMediator() {
  var ticketForm = 'ticketSubmissionForm',
      launcher = 'ticketSubmissionLauncher',
      state = {};

  state[`${ticketForm}.isVisible`] = false;

  c.intercept(
    [`${launcher}.onClick`,
     `${ticketForm}.onClose`].join(','),
    function() {
      if (state[`${ticketForm}.isVisible`]) {
        c.broadcast(`${ticketForm}.hide`);
        c.broadcast(`${launcher}.deactivate`);
        state[`${ticketForm}.isVisible`] = false;
      }
      else {
        c.broadcast(`${ticketForm}.show`);
        c.broadcast(`${launcher}.activate`);
        state[`${ticketForm}.isVisible`] = true;
      }
    });
}

function initChatTicketSubmissionMediator() {
  var ticketForm = 'ticketSubmissionForm',
      launcher = 'chatLauncher',
      chat = 'zopimChat',
      state = {};

  state[`${ticketForm}.isVisible`] = false;
  state[`${chat}.isVisible`]       = false;
  state[`${chat}.isOnline`]        = false;
  state[`${chat}.unreadMsgs`]      = 0;
  state[`${chat}.userClosed`]      = false;

  c.intercept(`${chat}.onOnline`, function() {
    state[`${chat}.isOnline`] = true;
    c.broadcast(`${launcher}.setLabelChat`);
  });

  c.intercept(`${chat}.onOffline`, function() {
    state[`${chat}.isOnline`] = false;
    c.broadcast(`${launcher}.setLabelHelp`);
  });

  c.intercept(`${chat}.onChatEnd`, function() {
      state[`${chat}.isVisible`] = false;

      c.broadcast(`${launcher}.deactivate`);
      c.broadcast(`${chat}.hide`);
    });

  c.intercept(`${chat}.onShow`, function() {
    state[`${chat}.isVisible`] = true;
    c.broadcast(`${launcher}.activate`);
  });

  c.intercept(`${chat}.onIsChatting`, function() {
      state[`${chat}.isVisible`] = true;

      c.broadcast(`${chat}.show`);
      c.broadcast(`${launcher}.activate`);
    });

  c.intercept(`${chat}.onUnreadMsgs`, function(b, count) {
    state[`${chat}.unreadMsgs`] = count;

    if (state[`${chat}.isOnline`]) {
      c.broadcast(`${launcher}.setLabelUnreadMsgs`, count);

      if (state[`${chat}.userClosed`] === false) {
        state[`${chat}.isVisible`] = true;
        state.activeEmbed = chat;
        c.broadcast(`${chat}.show`);
        c.broadcast(`${launcher}.activate`);
      }
    }
  });

  c.intercept(
    [`${launcher}.onClick`,
     `${ticketForm}.onClose`].join(','),
    function() {
      if (state[`${chat}.isVisible`] || state[`${ticketForm}.isVisible`]) {
        if (state[`${chat}.isVisible`]) {
          c.broadcast(`${chat}.hide`);
          state[`${chat}.userClosed`] = true;
          state[`${chat}.isVisible`] = false;
        }
        if (state[`${ticketForm}.isVisible`]) {
          c.broadcast(`${ticketForm}.hide`);
          state[`${ticketForm}.isVisible`] = false;
        }
        c.broadcast(`${launcher}.deactivate`);
      }
      else {
        if (state[`${chat}.isOnline`]) {
          c.broadcast(`${chat}.show`);
          state[`${chat}.isVisible`] = true;
        }
        else {
          c.broadcast(`${ticketForm}.show`);
          state[`${ticketForm}.isVisible`] = true;
        }
        c.broadcast(`${launcher}.activate`);
      }
    });

  c.subscribe(`${launcher}.deactivate`, function() {
    if (state[`${chat}.isOnline`]) {
      c.broadcast(`${launcher}.setLabelChat`);
    }
    else {
      c.broadcast(`${launcher}.setLabelHelp`);
    }
  });
}

function initHelpCenterTicketSubmissionMediator() {
  var ticketForm = 'ticketSubmissionForm',
      launcher = 'hcLauncher',
      helpCenter = 'helpCenterForm',
      state = {};

  state[`${ticketForm}.isVisible`] = false;
  state[`${helpCenter}.isVisible`] = false;
  state.activeEmbed                = helpCenter;

  c.intercept(`${helpCenter}.onNextClick`, function() {
    state[`${helpCenter}.isVisible`] = false;
    c.broadcast(`${helpCenter}.hide`);

    state[`${ticketForm}.isVisible`] = true;
    state.activeEmbed = ticketForm;

    c.broadcast(`${ticketForm}.showBackButton`);
    c.broadcast(`${ticketForm}.show`);
  });

  c.intercept(
    [`${launcher}.onClick`,
     `${helpCenter}.onClose`,
     `${ticketForm}.onClose`].join(','),
    function() {
      if (_.any([state[`${ticketForm}.isVisible`],
                 state[`${helpCenter}.isVisible`]])) {
        if (state[`${helpCenter}.isVisible`]) {
          c.broadcast(`${helpCenter}.hide`);
          state[`${helpCenter}.isVisible`] = false;
        }
        if (state[`${ticketForm}.isVisible`]) {
          c.broadcast(`${ticketForm}.hide`);
          state[`${ticketForm}.isVisible`] = false;
        }
        c.broadcast(`${launcher}.deactivate`);
      }
      else {
        c.broadcast(`${state.activeEmbed}.show`);
        state[`${state.activeEmbed}.isVisible`] = true;

        c.broadcast(`${helpCenter}.setNextToSubmitTicket`);
        c.broadcast(`${launcher}.activate`);
      }
    });

  c.intercept(`${ticketForm}.onBackClick`, function() {
    state[`${ticketForm}.isVisible`] = false;
    state[`${helpCenter}.isVisible`] = true;
    state.activeEmbed = helpCenter;

    c.broadcast(`${ticketForm}.hide`);
    c.broadcast(`${helpCenter}.show`);
  });

  c.intercept(`${ticketForm}.onFormSubmitted`, function() {
    state.activeEmbed = helpCenter;
  });
}

function initHelpCenterChatTicketSubmissionMediator() {
  var ticketForm = 'ticketSubmissionForm',
      launcher = 'hcLauncher',
      chat = 'zopimChat',
      helpCenter = 'helpCenterForm',
      state = {};

  state[`${ticketForm}.isVisible`] = false;
  state[`${chat}.isVisible`]       = false;
  state[`${helpCenter}.isVisible`] = false;
  state[`${chat}.isOnline`]        = false;
  state[`${chat}.unreadMsgs`]      = 0;
  state[`${chat}.userClosed`]      = false;
  state.activeEmbed                = helpCenter;

  c.intercept(`${chat}.onOnline`, function() {
    state[`${chat}.isOnline`] = true;
    if (state.activeEmbed === ticketForm) {
      state.activeEmbed = chat;
    }
    c.broadcast(`${launcher}.setLabelChatHelp`);
    c.broadcast(`${helpCenter}.setNextToChat`);
  });

  c.intercept(`${chat}.onOffline`, function() {
    state[`${chat}.isOnline`] = false;
    if (state.activeEmbed === chat) {
      state.activeEmbed = helpCenter;
    }
    c.broadcast(`${launcher}.setLabelHelp`);
    c.broadcast(`${helpCenter}.setNextToSubmitTicket`);
  });

  c.intercept(`${chat}.onShow`, function() {
    state[`${chat}.isVisible`] = true;
    c.broadcast(`${launcher}.activate`);
  });

  c.intercept(`${chat}.onUnreadMsgs`, function(b, count) {
    state[`${chat}.unreadMsgs`] = count;

    if (state[`${chat}.isOnline`]) {
      c.broadcast(`${launcher}.setLabelUnreadMsgs`, count);

      if (state[`${chat}.userClosed`] === false && !isMobileBrowser()) {
        state[`${chat}.isVisible`] = true;
        state.activeEmbed = chat;
        c.broadcast(`${chat}.show`);
        c.broadcast(`${launcher}.activate`);
      }
    }
  });

  c.intercept(`${helpCenter}.onNextClick`, function() {
      if (state[`${chat}.isOnline`]) {
        state[`${chat}.isVisible`] = true;
        state.activeEmbed = chat;
        c.broadcast(`${chat}.show`);
      }
      else {
        state[`${ticketForm}.isVisible`] = true;
        state.activeEmbed = ticketForm;
        c.broadcast(`${ticketForm}.show`);
      }

      state[`${helpCenter}.isVisible`] = false;
      c.broadcast(`${helpCenter}.hide`);
      c.broadcast(`${ticketForm}.showBackButton`);
    });

  c.intercept(`${chat}.onChatEnd`, function() {
      state.activeEmbed = helpCenter;
    });

  c.intercept(`${chat}.onIsChatting`, function() {
      state[`${chat}.isVisible`] = true;
      state.activeEmbed = chat;

      c.broadcast(`${chat}.show`);
      c.broadcast(`${launcher}.activate`);
    });

  c.intercept(
    [`${launcher}.onClick`,
     `${helpCenter}.onClose`,
     `${chat}.onHide`,
     `${ticketForm}.onClose`].join(','),
    function() {
      if (_.any([state[`${chat}.isVisible`],
                 state[`${ticketForm}.isVisible`],
                 state[`${helpCenter}.isVisible`]])) {
        if (state[`${helpCenter}.isVisible`]) {
          c.broadcast(`${helpCenter}.hide`);
          state[`${helpCenter}.isVisible`] = false;
        }
        if (state[`${chat}.isVisible`]) {
          c.broadcast(`${chat}.hide`);
          state[`${chat}.isVisible`] = false;
          state[`${chat}.userClosed`] = true;
        }
        if (state[`${ticketForm}.isVisible`]) {
          c.broadcast(`${ticketForm}.hide`);
          state[`${ticketForm}.isVisible`] = false;
        }
        c.broadcast(`${launcher}.deactivate`);
      }
      else {
        c.broadcast(`${state.activeEmbed}.show`);
        state[`${state.activeEmbed}.isVisible`] = true;

        c.broadcast(`${launcher}.activate`);
      }
    });

  c.intercept(`${ticketForm}.onBackClick`, function() {
    state[`${ticketForm}.isVisible`] = false;
    state[`${helpCenter}.isVisible`] = true;
    state.activeEmbed = helpCenter;

    c.broadcast(`${ticketForm}.hide`);
    c.broadcast(`${helpCenter}.show`);
  });

  c.intercept(`${ticketForm}.onFormSubmitted`, function() {
    state.activeEmbed = helpCenter;
  });

  c.subscribe(`${launcher}.deactivate`, function() {
    if (state[`${chat}.isOnline`]) {
      c.broadcast(`${launcher}.setLabelChatHelp`);
    }
    else {
      c.broadcast(`${launcher}.setLabelHelp`);
    }
  });

}

export var mediator = {
  channel: channel,
  initTicketSubmissionMediator: initTicketSubmissionMediator,
  initChatTicketSubmissionMediator: initChatTicketSubmissionMediator,
  initHelpCenterTicketSubmissionMediator: initHelpCenterTicketSubmissionMediator,
  initHelpCenterChatTicketSubmissionMediator: initHelpCenterChatTicketSubmissionMediator,
};
