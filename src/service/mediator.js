import { isMobileBrowser } from 'utility/devices';

module airwaves from 'airwaves';

var channel = new airwaves.Channel();

function initTicketSubmissionMediator() {
  var ticketForm = 'ticketSubmissionForm',
      launcher = 'ticketSubmissionLauncher',
      c = channel,
      state = {};

  state[`${ticketForm}.isVisible`] = false;

  channel.intercept(
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

  channel.intercept(`${chat}.onOnline`, function() {
    state[`${chat}.isOnline`] = true;
    channel.broadcast(`${launcher}.setLabelChat`);
  });

  channel.intercept(`${chat}.onOffline`, function() {
    state[`${chat}.isOnline`] = false;
    channel.broadcast(`${launcher}.setLabelHelp`);
  });

  channel.intercept(`${chat}.onChatEnd`, function() {
      state[`${chat}.isVisible`] = false;

      channel.broadcast(`${launcher}.deactivate`);
      channel.broadcast(`${chat}.hide`);
    });

  channel.intercept(`${chat}.onShow`, function() {
    state[`${chat}.isVisible`] = true;
    channel.broadcast(`${launcher}.activate`);
  });

  channel.intercept(`${chat}.onIsChatting`, function() {
      state[`${chat}.isVisible`] = true;

      channel.broadcast(`${chat}.show`);
      channel.broadcast(`${launcher}.activate`);
    });

  channel.intercept(`${chat}.onUnreadMsgs`, function(b, count) {
    state[`${chat}.unreadMsgs`] = count;

    if (state[`${chat}.isOnline`]) {
      channel.broadcast(`${launcher}.setLabelUnreadMsgs`, count);

      if (state[`${chat}.userClosed`] === false) {
        state[`${chat}.isVisible`] = true;
        state.activeEmbed = chat;
        channel.broadcast(`${chat}.show`);
        channel.broadcast(`${launcher}.activate`);
      }
    }
  });

  channel.intercept(
    [`${launcher}.onClick`,
     `${ticketForm}.onClose`].join(','),
    function() {
      if (state[`${chat}.isVisible`] || state[`${ticketForm}.isVisible`]) {
        if (state[`${chat}.isVisible`]) {
          channel.broadcast(`${chat}.hide`);
          state[`${chat}.userClosed`] = true;
          state[`${chat}.isVisible`] = false;
        }
        if (state[`${ticketForm}.isVisible`]) {
          channel.broadcast(`${ticketForm}.hide`);
          state[`${ticketForm}.isVisible`] = false;
        }
        channel.broadcast(`${launcher}.deactivate`);
      }
      else {
        if (state[`${chat}.isOnline`]) {
          channel.broadcast(`${chat}.show`);
          state[`${chat}.isVisible`] = true;
        }
        else {
          channel.broadcast(`${ticketForm}.show`);
          state[`${ticketForm}.isVisible`] = true;
        }
        channel.broadcast(`${launcher}.activate`);
      }
    });

  channel.subscribe(`${launcher}.deactivate`, function() {
    if (state[`${chat}.isOnline`]) {
      channel.broadcast(`${launcher}.setLabelChat`);
    }
    else {
      channel.broadcast(`${launcher}.setLabelHelp`);
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

  channel.intercept(`${helpCenter}.onNextClick`, function() {
    state[`${helpCenter}.isVisible`] = false;
    channel.broadcast(`${helpCenter}.hide`);

    state[`${ticketForm}.isVisible`] = true;
    state.activeEmbed = ticketForm;

    channel.broadcast(`${ticketForm}.showBackButton`);
    channel.broadcast(`${ticketForm}.show`);
  });

  channel.intercept(
    [`${launcher}.onClick`,
     `${helpCenter}.onClose`,
     `${ticketForm}.onClose`].join(','),
    function() {
      if (_.any([state[`${ticketForm}.isVisible`],
                 state[`${helpCenter}.isVisible`]])) {
        if (state[`${helpCenter}.isVisible`]) {
          channel.broadcast(`${helpCenter}.hide`);
          state[`${helpCenter}.isVisible`] = false;
        }
        if (state[`${ticketForm}.isVisible`]) {
          channel.broadcast(`${ticketForm}.hide`);
          state[`${ticketForm}.isVisible`] = false;
        }
        channel.broadcast(`${launcher}.deactivate`);
      }
      else {
        channel.broadcast(`${state.activeEmbed}.show`);
        state[`${state.activeEmbed}.isVisible`] = true;

        channel.broadcast(`${helpCenter}.setNextToSubmitTicket`);
        channel.broadcast(`${launcher}.activate`);
      }
    });

  channel.intercept(`${ticketForm}.onBackClick`, function() {
    state[`${ticketForm}.isVisible`] = false;
    state[`${helpCenter}.isVisible`] = true;
    state.activeEmbed = helpCenter;

    channel.broadcast(`${ticketForm}.hide`);
    channel.broadcast(`${helpCenter}.show`);
  });

  channel.intercept(`${ticketForm}.onFormSubmitted`, function() {
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

  channel.intercept(`${chat}.onOnline`, function() {
    state[`${chat}.isOnline`] = true;
    if (state.activeEmbed === ticketForm) {
      state.activeEmbed = chat;
    }
    channel.broadcast(`${launcher}.setLabelChatHelp`);
    channel.broadcast(`${helpCenter}.setNextToChat`);
  });

  channel.intercept(`${chat}.onOffline`, function() {
    state[`${chat}.isOnline`] = false;
    if (state.activeEmbed === chat) {
      state.activeEmbed = helpCenter;
    }
    channel.broadcast(`${launcher}.setLabelHelp`);
    channel.broadcast(`${helpCenter}.setNextToSubmitTicket`);
  });

  channel.intercept(`${chat}.onShow`, function() {
    state[`${chat}.isVisible`] = true;
    channel.broadcast(`${launcher}.activate`);
  });

  channel.intercept(`${chat}.onUnreadMsgs`, function(b, count) {
    state[`${chat}.unreadMsgs`] = count;

    if (state[`${chat}.isOnline`]) {
      channel.broadcast(`${launcher}.setLabelUnreadMsgs`, count);

      if (state[`${chat}.userClosed`] === false && !isMobileBrowser()) {
        state[`${chat}.isVisible`] = true;
        state.activeEmbed = chat;
        channel.broadcast(`${chat}.show`);
        channel.broadcast(`${launcher}.activate`);
      }
    }
  });

  channel.intercept(`${helpCenter}.onNextClick`, function() {
      if (state[`${chat}.isOnline`]) {
        state[`${chat}.isVisible`] = true;
        state.activeEmbed = chat;
        channel.broadcast(`${chat}.show`);
      }
      else {
        state[`${ticketForm}.isVisible`] = true;
        state.activeEmbed = ticketForm;
        channel.broadcast(`${ticketForm}.show`);
      }

      state[`${helpCenter}.isVisible`] = false;
      channel.broadcast(`${helpCenter}.hide`);
      channel.broadcast(`${ticketForm}.showBackButton`);
    });

  channel.intercept(`${chat}.onChatEnd`, function() {
      state.activeEmbed = helpCenter;
    });

  channel.intercept(`${chat}.onIsChatting`, function() {
      state[`${chat}.isVisible`] = true;
      state.activeEmbed = chat;

      channel.broadcast(`${chat}.show`);
      channel.broadcast(`${launcher}.activate`);
    });

  channel.intercept(
    [`${launcher}.onClick`,
     `${helpCenter}.onClose`,
     `${chat}.onHide`,
     `${ticketForm}.onClose`].join(','),
    function() {
      if (_.any([state[`${chat}.isVisible`],
                 state[`${ticketForm}.isVisible`],
                 state[`${helpCenter}.isVisible`]])) {
        if (state[`${helpCenter}.isVisible`]) {
          channel.broadcast(`${helpCenter}.hide`);
          state[`${helpCenter}.isVisible`] = false;
        }
        if (state[`${chat}.isVisible`]) {
          channel.broadcast(`${chat}.hide`);
          state[`${chat}.isVisible`] = false;
          state[`${chat}.userClosed`] = true;
        }
        if (state[`${ticketForm}.isVisible`]) {
          channel.broadcast(`${ticketForm}.hide`);
          state[`${ticketForm}.isVisible`] = false;
        }
        channel.broadcast(`${launcher}.deactivate`);
      }
      else {
        channel.broadcast(`${state.activeEmbed}.show`);
        state[`${state.activeEmbed}.isVisible`] = true;

        channel.broadcast(`${launcher}.activate`);
      }
    });

  channel.intercept(`${ticketForm}.onBackClick`, function() {
    state[`${ticketForm}.isVisible`] = false;
    state[`${helpCenter}.isVisible`] = true;
    state.activeEmbed = helpCenter;

    channel.broadcast(`${ticketForm}.hide`);
    channel.broadcast(`${helpCenter}.show`);
  });

  channel.intercept(`${ticketForm}.onFormSubmitted`, function() {
    state.activeEmbed = helpCenter;
  });

  channel.subscribe(`${launcher}.deactivate`, function() {
    if (state[`${chat}.isOnline`]) {
      channel.broadcast(`${launcher}.setLabelChatHelp`);
    }
    else {
      channel.broadcast(`${launcher}.setLabelHelp`);
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
