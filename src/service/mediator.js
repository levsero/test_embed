import airwaves from 'airwaves';
import _ from 'lodash';

import { settings } from 'service/settings';
import { isMobileBrowser } from 'utility/devices';
import { setScrollKiller } from 'utility/scrollHacks';
import { isOnHelpCenterPage } from 'utility/pages';
import { emailValid } from 'utility/utils';

const c = new airwaves.Channel();

const submitTicket = 'ticketSubmissionForm';
const launcher = 'launcher';
const chat = 'zopimChat';
const helpCenter = 'helpCenterForm';
const channelChoice = 'channelChoice';
const talk = 'talk';
const state = {};
let chatOpenedBlipSent = false;

state[`${launcher}.userHidden`] = false;
state[`${launcher}.chatHidden`] = false;
state[`${submitTicket}.isVisible`] = false;
state[`${helpCenter}.isVisible`] = false;
state[`${helpCenter}.isAccessible`] = false;
state[`${channelChoice}.isAccessible`] = false;
state[`${chat}.isVisible`] = false;
state[`${chat}.isOnline`] = false;
state[`${chat}.isChatting`] = false;
state[`${chat}.isSuppressed`] = false;
state[`${chat}.isAccessible`] = false;
state[`${chat}.unreadMsgs`] = 0;
state[`${chat}.userClosed`] = false;
state[`${chat}.chatEnded`] = false;
state[`${talk}.isAccessible`] = false;
state[`${talk}.enabled`] = false;
state[`${talk}.isVisible`] = false;
state['.newChat'] = false;

const talkAvailable = () => {
  return !settings.get('talk.suppress') &&
          state[`${talk}.isAccessible`] &&
          state[`${talk}.enabled`];
};

const helpCenterAvailable = () => {
  return state[`${helpCenter}.isAccessible`] && !settings.get('helpCenter.suppress');
};

const chatAvailable = () => {
  return (state['.newChat'] || state[`${chat}.isOnline`]) && !state[`${chat}.isSuppressed`];
};

const submitTicketAvailable = () => {
  return state[`${submitTicket}.isAccessible`] && !settings.get('contactForm.suppress');
};

const channelChoiceAvailable = () => {
  return state[`${channelChoice}.isAccessible`]
    && !helpCenterAvailable()
    && chatAvailable()
    && submitTicketAvailable();
};

const embedVisible = (_state) => _.some([
  _state[`${helpCenter}.isVisible`],
  _state[`${chat}.isVisible`],
  _state[`${submitTicket}.isVisible`],
  _state[`${talk}.isVisible`]
]);

const trackChatStarted = () => {
  if (!chatOpenedBlipSent) {
    c.broadcast('beacon.trackUserAction', 'chat', 'opened', chat);
    chatOpenedBlipSent = true;
  }
};

function init(embedsAccessible, params = {}) {
  state[`${launcher}.userHidden`] = params.hideLauncher;
  state['.newChat'] = params.newChat;
  state[`${submitTicket}.isAccessible`] = embedsAccessible.submitTicket;
  state[`${helpCenter}.isAccessible`] = embedsAccessible.helpCenter &&
    (!params.helpCenterSignInRequired || isOnHelpCenterPage());
  state[`${chat}.isAccessible`] = embedsAccessible.chat;
  state[`${channelChoice}.isAccessible`] = embedsAccessible.channelChoice;
  state[`${chat}.isSuppressed`] = settings.get('chat.suppress');
  state[`${talk}.isAccessible`] = embedsAccessible.talk;

  c.intercept('newChat.newMessage', () => {
    if (!state[`${chat}.userClosed`]) {
      c.broadcast('webWidget.proactiveChat');
      c.broadcast(`${launcher}.hide`);
    }
  });

  c.intercept('newChat.online', () => {
    state[`${chat}.isOnline`] = true;
  });

  c.intercept('newChat.offlineFormOn', () => {
    state[`${launcher}.chatHidden`] = false;
  });

  c.intercept('newChat.offline', (_, hideLauncher) => {
    state[`${chat}.isOnline`] = false;

    if (hideLauncher &&
        !submitTicketAvailable() &&
        !helpCenterAvailable() &&
        !talkAvailable()) {
      c.broadcast(`${launcher}.hide`);
      state[`${launcher}.chatHidden`] = true;
    }
  });

  c.intercept('talk.enabled', (_, enabled) => {
    state[`${talk}.enabled`] = enabled;
  });

  c.intercept('talk.agentAvailability', (_, availability) => {
    state[`${talk}.isAccessible`] = availability;
  });

  c.intercept(`${chat}.onOnline`, () => {
    state[`${chat}.isOnline`] = true;

    if (!chatAvailable()) {
      return;
    }

    if (state[`${launcher}.userHidden`]) {
      return;
    }

    if ((state.activeEmbed === submitTicket || !state.activeEmbed) && !helpCenterAvailable()) {
      state.activeEmbed = channelChoiceAvailable() ? channelChoice : chat;
    }
  });

  c.intercept(`${chat}.onOffline`, () => {
    // On offline fires initially when chat is being set up. We only care
    // about when chat comes offline after being online
    if (!state[`${chat}.isChatting`] && state[`${chat}.isOnline`]) {
      state[`${chat}.isOnline`] = false;
    }
  });

  c.intercept(`${chat}.onShow`, () => {
    state[`${chat}.isVisible`] = true;
    c.broadcast(`${launcher}.hide`);
  });

  c.intercept(`${chat}.onIsChatting`, () => {
    state.activeEmbed = chat;
    c.broadcast('webWidget.zopimChatStarted');
    state[`${chat}.isChatting`] = true;
    state[`${chat}.isSuppressed`] = false;
  });

  c.intercept(`${chat}.onUnreadMsgs`, (__, count) => {
    state[`${chat}.unreadMsgs`] = count;

    c.broadcast(`${launcher}.setUnreadMsgs`, state[`${chat}.unreadMsgs`]);

    if (count > 0 &&
        !embedVisible(state) &&
        !state[`${chat}.userClosed`] &&
        !isMobileBrowser()) {
      state.activeEmbed = chat;
      state[`${chat}.isVisible`] = true;
      c.broadcast(`${chat}.show`);
      c.broadcast('webWidget.zopimChatStarted');
      state[`${chat}.isSuppressed`] = false;
      c.broadcast(`${launcher}.hide`);
    }
  });

  c.intercept(`${helpCenter}.onNextClick`, () => {
    c.broadcast(`${chat}.show`);
  });

  c.intercept(`${submitTicket}.onCancelClick`, () => {
    state[`${submitTicket}.isVisible`] = false;
    c.broadcast('webWidget.hide');

    if (!state['.hideOnClose']) {
      c.broadcast(`${launcher}.show`);
    }
  });

  c.intercept(`${launcher}.onClick`, () => {
    if (chatAvailable() && state[`${chat}.unreadMsgs`]) {
      state[`${chat}.unreadMsgs`] = 0;
    }
  });

  c.intercept(`${chat}.onHide`, (_broadcast) => {
    state[`${chat}.isVisible`] = false;
    state[`${chat}.unreadMsgs`] = 0;

    // Reset .userClosed to false if chat ended
    // so that the next incoming message will pop open
    // chat again.
    state[`${chat}.userClosed`] = !state[`${chat}.chatEnded`];
    state[`${chat}.chatEnded`] = false;

    _broadcast();
  });

  c.intercept(`${chat}.onChatEnd`, () => {
    state[`${chat}.chatEnded`] = true;
    state[`${chat}.isChatting`] = false;

    c.broadcast('webWidget.zopimChatEnded');

    if (state[`${helpCenter}.isAccessible`]) {
      state.activeEmbed = helpCenter;
    }
  });

  c.intercept(`${chat}.onChatStart`, () => {
    state[`${chat}.isChatting`] = true;
  });

  c.intercept('webWidget.onClose', (_broadcast) => {
    state[`${submitTicket}.isVisible`] = false;
    state[`${helpCenter}.isVisible`] = false;
    state[`${talk}.isVisible`] = false;
    state[`${chat}.userClosed`] = true;
    _broadcast();
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
    state[`${chat}.isVisible`] = false;
    c.broadcast(`${chat}.hide`);
  });

  c.intercept('.show', () => {
    state[`${chat}.isVisible`] = true;
    c.broadcast(`${chat}.show`);
  });

  c.intercept('.activate', () => {
    state[`${chat}.isVisible`] = true;
    c.broadcast(`${chat}.activate`);
  });

  initMessaging();
}

function initIPMStandalone() {
  c.intercept('ipm.webWidget.onClose', () => {
    show(state);
  });
}

export const mediator = {
  channel: c,
  init: init,
  initMessaging: initMessaging,
  initZopimStandalone: initZopimStandalone,
  initIPMStandalone: initIPMStandalone
};
