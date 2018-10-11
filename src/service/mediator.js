import airwaves from 'airwaves';
import _ from 'lodash';

import { emailValid } from 'utility/utils';
import { proactiveMessageRecieved } from 'src/redux/modules/chat';

const c = new airwaves.Channel();

const launcher = 'launcher';
const chat = 'zopimChat';
const helpCenter = 'helpCenterForm';
const state = {};

state[`${chat}.unreadMsgs`] = 0;
state[`${chat}.userClosed`] = false;
state[`${chat}.chatEnded`] = false;

function init() {
  c.intercept('newChat.newMessage', (dispatch) => {
    if (!state[`${chat}.userClosed`]) {
      c.broadcast('webWidget.proactiveChat');
      dispatch(proactiveMessageRecieved());
    }
  });

  c.intercept(`${chat}.onUnreadMsgs`, (__, count) => {
    state[`${chat}.unreadMsgs`] = count;

    c.broadcast(`${launcher}.setUnreadMsgs`, state[`${chat}.unreadMsgs`]);
  });

  c.intercept(`${chat}.onIsChatting`, () => {
    c.broadcast('webWidget.zopimChatStarted');
  });

  c.intercept(`${helpCenter}.onNextClick`, () => {
    c.broadcast(`${chat}.show`);
  });

  c.intercept(`${launcher}.onClick`, () => {
    if (state[`${chat}.unreadMsgs`]) {
      state[`${chat}.unreadMsgs`] = 0;
    }
  });

  c.intercept(`${chat}.onHide`, () => {
    state[`${chat}.isVisible`] = false;
    state[`${chat}.unreadMsgs`] = 0;

    // Reset .userClosed to false if chat ended
    // so that the next incoming message will pop open
    // chat again.
    state[`${chat}.userClosed`] = !state[`${chat}.chatEnded`];
  });

  c.intercept(`${chat}.onChatEnd`, () => {
    state[`${chat}.chatEnded`] = true;

    c.broadcast('webWidget.zopimChatEnded');
  });

  c.intercept('webWidget.onClose', () => {
    state[`${chat}.userClosed`] = true;
  });

  c.intercept('.onSetLocale', () => {
    c.broadcast(`${chat}.refreshLocale`);
    c.broadcast(`${launcher}.refreshLocale`);
    c.broadcast('webWidget.refreshLocale');
  });

  initMessaging();
}

function initMessaging() {
  c.intercept('.onIdentify', (__, params) => {
    if (emailValid(params.email)) {
      c.broadcast('beacon.identify', params);
      c.broadcast(`${chat}.setUser`, params);
    } else {
      console.warn('invalid params passed into zE.identify', params); // eslint-disable-line no-console

      if (_.isString(params.name)) {
        c.broadcast(`${chat}.setUser`, { name: params.name });
      }
    }
  });
}

function initZopimStandalone() {
  // Intercept zE.hide() zE.show(), and zE.activate() API calls.
  // Make them an alias for zopims hide and show functions if the user is on a naked zopim configuration.
  // zE.hide() = $zopim.livechat.hideAll(),
  // zE.show() = $zopim.livechat.button.show(),
  // zE.activate() = $zopim.livechat.window.show().

  c.intercept('.hide', () => {
    c.broadcast(`${chat}.hide`);
  });

  c.intercept('.show', () => {
    c.broadcast(`${chat}.show`);
  });

  c.intercept('.activate', () => {
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
