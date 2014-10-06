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

  channel.intercept(`${chat}.onOnline`, function() {
    state[`${chat}.isOnline`] = true;
    channel.broadcast(`${launcher}.setLabelChat`);
  });

  channel.intercept(`${chat}.onOffline`, function() {
    state[`${chat}.isOnline`] = false;
    channel.broadcast(`${launcher}.setLabelHelp`);
  });

  channel.intercept(`${chat}.onShow`, function() {
    state[`${chat}.isVisible`] = true;
    channel.broadcast(`${launcher}.activate`);
  });

  channel.intercept(`${chat}.onUnreadMsgs`, function(b, count) {
    state[`${chat}.unreadMsgs`] = count;
    if (state[`${chat}.isOnline`]) {
      channel.broadcast(`${launcher}.setLabelUnreadMsgs`, count);
    }
  });

  channel.intercept(
    [`${launcher}.onClick`,
     `${ticketForm}.onClose`].join(','),
    function() {
      if (state[`${chat}.isVisible`] || state[`${ticketForm}.isVisible`]) {
        if (state[`${chat}.isVisible`]) {
          channel.broadcast(`${chat}.hide`);
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
  state['activeEmbed']             = helpCenter;

  channel.intercept(`${chat}.onOnline`, function() {
    state[`${chat}.isOnline`] = true;
    if (state['activeEmbed'] === ticketForm) {
      state['activeEmbed'] = chat;
    }
    channel.broadcast(`${launcher}.setLabelChat`);
  });

  channel.intercept(`${chat}.onOffline`, function() {
    state[`${chat}.isOnline`] = false;
    if (state['activeEmbed'] === chat) {
      state['activeEmbed'] = ticketForm;
    }
    channel.broadcast(`${launcher}.setLabelHelp`);
  });

  channel.intercept(`${chat}.onShow`, function() {
    state[`${chat}.isVisible`] = true;
    channel.broadcast(`${launcher}.activate`);
  });

  channel.intercept(`${chat}.onUnreadMsgs`, function(b, count) {
    state[`${chat}.unreadMsgs`] = count;
    if (state[`${chat}.isOnline`]) {
      channel.broadcast(`${launcher}.setLabelUnreadMsgs`, count);
    }
  });

  channel.intercept(
    `${helpCenter}.onNextClick`,
    function() {
      if (state[`${chat}.isOnline`]) {
        state[`${chat}.isVisible`] = true;
        state['activeEmbed'] = chat;
        channel.broadcast(`${chat}.show`);
      }
      else {
        state[`${ticketForm}.isVisible`] = true;
        state['activeEmbed'] = ticketForm;
        channel.broadcast(`${ticketForm}.show`);
      }

      state[`${helpCenter}.isVisible`] = false;
      channel.broadcast(`${helpCenter}.hide`);
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
        }
        if (state[`${ticketForm}.isVisible`]) {
          channel.broadcast(`${ticketForm}.hide`);
          state[`${ticketForm}.isVisible`] = false;
        }
        channel.broadcast(`${launcher}.deactivate`);
      }
      else {
        if (state['activeEmbed'] === chat ||
            state['activeEmbed'] === ticketForm) {
          state['activeEmbed'] = state[`${chat}.isOnline`]
                               ? chat
                               : ticketForm;
        }

        channel.broadcast(`${state['activeEmbed']}.show`);
        state[`${state['activeEmbed']}.isVisible`] = true;

        //if (state[`${chat}.isOnline`]) {
        //  channel.broadcast(`${chat}.show`);
        //  state[`${chat}.isVisible`] = true;
        //}
        //else {
        //  channel.broadcast(`${ticketForm}.show`);
        //  state[`${ticketForm}.isVisible`] = true;
        //}
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

export var mediator = {
  channel: channel,
  initTicketSubmissionMediator: initTicketSubmissionMediator,
  initChatTicketSubmissionMediator: initChatTicketSubmissionMediator,
  initHelpCenterChatTicketSubmissionMediator: initHelpCenterChatTicketSubmissionMediator
};

