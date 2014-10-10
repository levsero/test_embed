import { isMobileBrowser } from 'utility/devices';

module airwaves from 'airwaves';

var channel = new airwaves.Channel(),
    c = channel;

function initTicketSubmission() {
  var submitTicket = 'ticketSubmissionForm',
      launcher = 'ticketSubmissionLauncher',
      state = {};

  state[`${submitTicket}.isVisible`] = false;

  c.intercept(
    [`${launcher}.onClick`,
     `${submitTicket}.onClose`].join(','),
    function() {
      if (state[`${submitTicket}.isVisible`]) {
        c.broadcast(`${submitTicket}.hide`);
        c.broadcast(`${launcher}.deactivate`);
        state[`${submitTicket}.isVisible`] = false;
      }
      else {
        c.broadcast(`${submitTicket}.show`);
        c.broadcast(`${launcher}.activate`);
        state[`${submitTicket}.isVisible`] = true;
      }
    });
}

function initChatTicketSubmission() {
  var submitTicket = 'ticketSubmissionForm',
      launcher = 'chatLauncher',
      chat = 'zopimChat',
      state = {};

  state[`${submitTicket}.isVisible`] = false;
  state[`${chat}.isVisible`]         = false;
  state[`${chat}.isOnline`]          = false;
  state[`${chat}.unreadMsgs`]        = 0;
  state[`${chat}.userClosed`]        = false;

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

  c.intercept(`${chat}.onUnreadMsgs`, function(_, count) {
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
     `${submitTicket}.onClose`].join(','),
    function() {
      if (state[`${chat}.isVisible`] || state[`${submitTicket}.isVisible`]) {
        if (state[`${chat}.isVisible`]) {
          c.broadcast(`${chat}.hide`);
          state[`${chat}.userClosed`] = true;
          state[`${chat}.isVisible`] = false;
        }
        if (state[`${submitTicket}.isVisible`]) {
          c.broadcast(`${submitTicket}.hide`);
          state[`${submitTicket}.isVisible`] = false;
        }
        c.broadcast(`${launcher}.deactivate`);
      }
      else {
        if (state[`${chat}.isOnline`]) {
          c.broadcast(`${chat}.show`);
          state[`${chat}.isVisible`] = true;
        }
        else {
          c.broadcast(`${submitTicket}.show`);
          state[`${submitTicket}.isVisible`] = true;
        }
        c.broadcast(`${launcher}.activate`);
      }
    }
  );

  c.subscribe(`${launcher}.deactivate`, function() {
    if (state[`${chat}.isOnline`]) {
      c.broadcast(`${launcher}.setLabelChat`);
    }
    else {
      c.broadcast(`${launcher}.setLabelHelp`);
    }
  });
}

function initHelpCenterTicketSubmission() {
  var submitTicket = 'ticketSubmissionForm',
      launcher = 'hcLauncher',
      helpCenter = 'helpCenterForm',
      state = {};

  state[`${submitTicket}.isVisible`] = false;
  state[`${helpCenter}.isVisible`]   = false;
  state.activeEmbed                  = helpCenter;

  c.intercept(`${helpCenter}.onNextClick`, function() {
    state[`${helpCenter}.isVisible`] = false;
    c.broadcast(`${helpCenter}.hide`);

    state[`${submitTicket}.isVisible`] = true;
    state.activeEmbed = submitTicket;

    c.broadcast(`${submitTicket}.showBackButton`);
    c.broadcast(`${submitTicket}.show`);
  });

  c.intercept(
    [`${launcher}.onClick`,
     `${helpCenter}.onClose`,
     `${submitTicket}.onClose`].join(','),
    function() {
      if (_.any([state[`${submitTicket}.isVisible`],
                 state[`${helpCenter}.isVisible`]])) {
        if (state[`${helpCenter}.isVisible`]) {
          c.broadcast(`${helpCenter}.hide`);
          state[`${helpCenter}.isVisible`] = false;
        }
        if (state[`${submitTicket}.isVisible`]) {
          c.broadcast(`${submitTicket}.hide`);
          state[`${submitTicket}.isVisible`] = false;
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

  c.intercept(`${submitTicket}.onBackClick`, function() {
    state[`${submitTicket}.isVisible`] = false;
    state[`${helpCenter}.isVisible`] = true;
    state.activeEmbed = helpCenter;

    c.broadcast(`${submitTicket}.hide`);
    c.broadcast(`${helpCenter}.show`);
  });

  c.intercept(`${submitTicket}.onFormSubmitted`, function() {
    state.activeEmbed = helpCenter;
  });
}

function initHelpCenterChatTicketSubmission() {
  var submitTicket = 'ticketSubmissionForm',
      launcher = 'hcLauncher',
      chat = 'zopimChat',
      helpCenter = 'helpCenterForm',
      state = {};

  state[`${submitTicket}.isVisible`] = false;
  state[`${chat}.isVisible`]         = false;
  state[`${helpCenter}.isVisible`]   = false;
  state[`${chat}.isOnline`]          = false;
  state[`${chat}.unreadMsgs`]        = 0;
  state[`${chat}.userClosed`]        = false;
  state.activeEmbed                  = helpCenter;

  c.intercept(`${chat}.onOnline`, function() {
    state[`${chat}.isOnline`] = true;
    if (state.activeEmbed === submitTicket) {
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

  c.intercept(`${chat}.onUnreadMsgs`, function(_, count) {
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
      state[`${submitTicket}.isVisible`] = true;
      state.activeEmbed = submitTicket;
      c.broadcast(`${submitTicket}.show`);
    }

    state[`${helpCenter}.isVisible`] = false;
    c.broadcast(`${helpCenter}.hide`);
    c.broadcast(`${submitTicket}.showBackButton`);
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
          state[`${chat}.isVisible`] = false;
          state[`${chat}.userClosed`] = true;
        }
        if (state[`${submitTicket}.isVisible`]) {
          c.broadcast(`${submitTicket}.hide`);
          state[`${submitTicket}.isVisible`] = false;
        }
        c.broadcast(`${launcher}.deactivate`);
      }
      else {
        c.broadcast(`${state.activeEmbed}.show`);
        state[`${state.activeEmbed}.isVisible`] = true;

        c.broadcast(`${launcher}.activate`);
      }
    }
  );

  c.intercept(`${submitTicket}.onBackClick`, function() {
    state[`${submitTicket}.isVisible`] = false;
    state[`${helpCenter}.isVisible`] = true;
    state.activeEmbed = helpCenter;

    c.broadcast(`${submitTicket}.hide`);
    c.broadcast(`${helpCenter}.show`);
  });

  c.intercept(`${submitTicket}.onFormSubmitted`, function() {
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
  initTicketSubmission: initTicketSubmission,
  initChatTicketSubmission: initChatTicketSubmission,
  initHelpCenterTicketSubmission: initHelpCenterTicketSubmission,
  initHelpCenterChatTicketSubmission: initHelpCenterChatTicketSubmission
};
