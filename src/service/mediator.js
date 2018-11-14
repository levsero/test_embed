import airwaves from 'airwaves';

import { nameValid, emailValid } from 'utility/utils';
import { proactiveMessageRecieved } from 'src/redux/modules/chat';
import { zopimProactiveMessageRecieved } from 'src/redux/modules/zopimChat';
import { isMobileBrowser } from 'utility/devices';

const c = new airwaves.Channel();

const launcher = 'launcher';
const chat = 'zopimChat';
const helpCenter = 'helpCenterForm';
const state = {};

state[`${chat}.unreadMsgs`] = 0;
state[`${chat}.userClosed`] = false;
state[`${chat}.chatEnded`] = false;

function init() {
  c.intercept('newChat.newMessage', (_, dispatch) => {
    if (!state[`${chat}.userClosed`]) {
      c.broadcast('webWidget.proactiveChat');
      dispatch(proactiveMessageRecieved());
    }
  });

  c.intercept(`${chat}.onUnreadMsgs`, (__, count, store) => {
    state[`${chat}.unreadMsgs`] = count;

    c.broadcast(`${launcher}.setUnreadMsgs`, state[`${chat}.unreadMsgs`]);

    if (count > 0 && !state[`${chat}.userClosed`] && !isMobileBrowser()) {
      store.dispatch(zopimProactiveMessageRecieved());
    }
  });

  c.intercept(`${chat}.onIsChatting`, (__, display) => {
    c.broadcast('webWidget.zopimChatStarted');
    if (display) {
      c.broadcast(`${chat}.show`);
    }
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
    state[`${chat}.unreadMsgs`] = 0;

    // Reset .userClosed to false if chat ended
    // so that the next incoming message will pop open
    // chat again.
    state[`${chat}.userClosed`] = !state[`${chat}.chatEnded`];
  });

  c.intercept(`${chat}.onChatEnd`, () => {
    state[`${chat}.chatEnded`] = true;
  });

  c.intercept(`${chat}.onHide`, () => {
    state[`${chat}.chatEnded`] = true;
  });

  c.intercept('webWidget.onClose', () => {
    state[`${chat}.userClosed`] = true;
  });

  c.intercept('.clear', () => {
    c.broadcast('webWidget.clearAttachments');
  });

  c.intercept('.onSetLocale', () => {
    c.broadcast(`${chat}.refreshLocale`);
    c.broadcast(`${launcher}.refreshLocale`);
    c.broadcast('webWidget.refreshLocale');
  });

  c.intercept('.onUpdateSettings', () => {
    c.broadcast('webWidget.updateSettings');
    c.broadcast(`${launcher}.updateSettings`);
  });

  c.intercept('.show', () => {
    c.broadcast(`${chat}.hide`);
  });
  initMessaging();
}

function initMessaging() {
  c.intercept('.onIdentify', (__, params) => {
    const isEmailValid = emailValid(params.email),
      isNameValid = nameValid(params.name);

    if (isEmailValid && isNameValid) {
      c.broadcast('beacon.identify', params);
      c.broadcast(`${chat}.setUser`, params);
    } else if (isEmailValid) {
      console.warn('invalid name passed into zE.identify', params.name); // eslint-disable-line no-console
      c.broadcast(`${chat}.setUser`, params);
    } else if (isNameValid) {
      console.warn('invalid email passed into zE.identify', params.email); // eslint-disable-line no-console
      c.broadcast(`${chat}.setUser`, params);
    } else {
      console.warn('invalid params passed into zE.identify', params); // eslint-disable-line no-console
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
