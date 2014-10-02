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
    console.log('unreadMsg', count);
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


export var mediator = {
  channel: channel,
  initTicketSubmissionMediator: initTicketSubmissionMediator,
  initChatTicketSubmissionMediator: initChatTicketSubmissionMediator
};
