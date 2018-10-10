import airwaves from 'airwaves';
import _ from 'lodash';

import { settings } from 'service/settings';
import { isMobileBrowser } from 'utility/devices';
import { setScrollKiller,
  setWindowScroll,
  revertWindowScroll } from 'utility/scrollHacks';
import { isOnHelpCenterPage } from 'utility/pages';
import { emailValid } from 'utility/utils';

const c = new airwaves.Channel();

const submitTicket = 'ticketSubmissionForm';
const launcher = 'launcher';
const chat = 'zopimChat';
const newChat = 'newChat';
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
state[`${chat}.connectionPending`] = true;
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
state[`${talk}.connectionPending`] = true;
state[`${talk}.isVisible`] = false;
state['.hideOnClose'] = false;
state['.activatePending'] = false;
state['.newChat'] = false;

const talkAvailable = () => {
  return !settings.get('talk.suppress') &&
          state[`${talk}.isAccessible`] &&
          state[`${talk}.enabled`] &&
          !state[`${talk}.connectionPending`];
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

const embedAvailable = () => {
  return helpCenterAvailable() || chatAvailable() || submitTicketAvailable() || talkAvailable();
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

const show = (_state, options = {}) => {
  if (_state['.activatePending']) {
    showEmbed(_state, true);
    if (isMobileBrowser()) {
      c.broadcast(`${launcher}.show`, options);
    }
  } else if (options.showOnLoad && options.isChatting) {
    showEmbed(_state, false);
  } else if (!_state[`${launcher}.userHidden`] && !_state[`${launcher}.chatHidden`]) {
    c.broadcast(`${launcher}.show`, options);
  }
};

const showEmbed = (_state, viaActivate = false) => {
  if (_state.activeEmbed === chat) {
    trackChatStarted();
  }

  if (_state.activeEmbed === chat && isMobileBrowser()) {
    c.broadcast(`${chat}.show`);
  } else {
    const options = {
      viaActivate
    };

    _state[`${_state.activeEmbed}.isVisible`] = true;
    c.broadcast(`${launcher}.hide`);

    if (_state.activeEmbed === chat) {
      c.broadcast(`${chat}.show`, options);
    } else {
      c.broadcast('webWidget.show', options);
    }
  }

  if (isMobileBrowser() && _state.activeEmbed !== chat) {
    /**
     * This timeout ensures the embed is displayed
     * before the scrolling happens on the host page
     * so that the user doesn't see the host page jump
     */
    setTimeout(() => {
      setWindowScroll(0);
      setScrollKiller(true);
    }, 0);
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
  state[`${chat}.connectionPending`] = embedsAccessible.chat;
  state[`${talk}.isAccessible`] = embedsAccessible.talk;
  state[`${talk}.connectionPending`] = embedsAccessible.talk;

  const connectionPending = () => state[`${chat}.connectionPending`]
                               || state[`${talk}.connectionPending`];

  if (connectionPending()) {
    // This is to handle zopim errors where onConnected or onError
    // both don't fire for some reason after chat connects and
    // connectionPending state just hangs.
    setTimeout(() => {
      if (connectionPending() && embedAvailable()) {
        show(state);
        state[`${chat}.connectionPending`] = false;
        state[`${talk}.connectionPending`] = false;
      }
    }, 5000);
  }

  c.intercept('newChat.connected', (_, showOnLoad) => {
    state[`${chat}.connectionPending`] = false;

    // When showOnLoad is true we need to wait for the SDK to tell us
    // if it's chatting or not. The widget will be shown then.
    if (!state[`${talk}.connectionPending`] && !showOnLoad) {
      show(state);
    }
  });

  c.intercept('newChat.isChatting', (_, isChatting, showOnLoad) => {
    state[`${chat}.connectionPending`] = false;

    if (isMobileBrowser()) showOnLoad = false;

    show(state, { isChatting, showOnLoad });
  });

  c.intercept('newChat.newMessage', () => {
    if (!state[`${chat}.userClosed`]) {
      c.broadcast('webWidget.proactiveChat');
      c.broadcast(`${launcher}.hide`);
    }
  });

  c.intercept('newChat.online', () => {
    state[`${chat}.isOnline`] = true;

    if (!submitTicketAvailable() && !helpCenterAvailable() && !talkAvailable() && !state[`${chat}.connectionPending`]) {
      state[`${launcher}.chatHidden`] = false;
      if (!state[`${newChat}.isVisible`]) {
        show(state);
      }
    }
  });

  c.intercept('newChat.offlineFormOn', () => {
    state[`${launcher}.chatHidden`] = false;
    show(state);
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

  c.intercept('.hide', (_, viaIPM = false) => {
    if (!viaIPM) {
      c.broadcast('beacon.trackUserAction', 'api', 'hide');
    }

    state[`${submitTicket}.isVisible`] = false;
    state[`${chat}.isVisible`] = false;
    state[`${helpCenter}.isVisible`] = false;
    state[`${talk}.isVisible`] = false;
    state[`${launcher}.userHidden`] = !viaIPM;

    c.broadcast(`${chat}.hide`);
    c.broadcast(`${launcher}.hide`);
    c.broadcast('webWidget.hide');
  });

  c.intercept('talk.enabled', (_, enabled) => {
    state[`${talk}.enabled`] = enabled;
    state[`${talk}.connectionPending`] = false;
  });

  c.intercept('talk.agentAvailability', (_, availability) => {
    state[`${talk}.isAccessible`] = availability;

    if (!embedVisible(state)) {
      if (embedAvailable() && !state[`${chat}.connectionPending`]) {
        show(state);
      }
    }
  });

  c.intercept(`.show, ${chat}.onError`, () => {
    c.broadcast('beacon.trackUserAction', 'api', 'show');

    state[`${submitTicket}.isVisible`] = false;
    state[`${chat}.isVisible`] = false;
    state[`${helpCenter}.isVisible`] = false;
    state[`${launcher}.userHidden`] = false;
    state[`${talk}.isVisible`] = false;

    c.broadcast(`${chat}.hide`);
    c.broadcast('webWidget.hide');

    if (embedAvailable()) {
      c.broadcast(`${launcher}.show`);
    }
  });

  c.intercept('.activate', (__, options = {}) => {
    c.broadcast('beacon.trackUserAction', 'api', 'activate');

    if (!embedVisible(state)) {
      state['.hideOnClose'] = !!options.hideOnClose;
      // New chat might still be connecting when activate on page is processed.
      if (embedAvailable() || (state[`${chat}.connectionPending`] && state['.newChat'])) {
        const chatPending = state[`${chat}.connectionPending`] && state[`${chat}.isAccessible`];
        const talkPending = state[`${talk}.connectionPending`] && state[`${talk}.isAccessible`];

        // When boot time zE.activate() is used with contact form, talk & chat,
        // delay showing the embed so that talk and chat has time to come online.
        (chatPending || talkPending)
          ? state['.activatePending'] = true
          : showEmbed(state, true);
      }
    }
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

    if (!submitTicketAvailable() && !helpCenterAvailable() && !talkAvailable() && !state[`${chat}.connectionPending`]) {
      c.broadcast(`${launcher}.show`);
    }
  });

  c.intercept(`${chat}.onConnected`, () => {
    state[`${chat}.connectionPending`] = false;

    if (!embedVisible(state) && !state[`${chat}.isChatting`]) {
      if (embedAvailable() && !state[`${talk}.connectionPending`]) {
        show(state);
      }
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
    if (state[`${chat}.connectionPending`]) {
      return;
    }

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
    if (!isMobileBrowser()) {
      state[`${chat}.isVisible`] = true;
    } else {
      if (!state[`${launcher}.userHidden`]) {
        c.broadcast(`${launcher}.show`);
      }
      setScrollKiller(false);
    }

    trackChatStarted();

    state[`${helpCenter}.isVisible`] = false;
    state.activeEmbed = chat;
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
    // When opening chat on mobile, directly broadcast a chat.show event.
    // Because zopim can open in a new tab, we need to make sure we don't make a call to `setScrollKiller`.
    // If we do the host page will be frozen when the user exits the zopim chat tab.
    // Note: `showEmbed` will invoke `setScrollKiller`.
    if (chatAvailable() && state[`${chat}.unreadMsgs`]) {
      state[`${chat}.unreadMsgs`] = 0;
    }

    /**
     * This timeout mitigates the Ghost Click produced when the launcher
     * button is on the left, using a mobile device with small screen
     * e.g. iPhone4. It's not a bulletproof solution, but it helps
     */
    setTimeout(() => showEmbed(state), 0);
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

  c.subscribe(
    ['webWidget.onClose',
      `${chat}.onHide`].join(','),
    () => {
      if (isMobileBrowser()) {
        setScrollKiller(false);
        revertWindowScroll();

        setTimeout(
          () => state[`${launcher}.clickActive`] = false,
          100
        );
      }

      // Fix for when a pro-active message is recieved which opens the zopim window but the launcher
      // was previously hidden with zE.hide()
      if (!state['.hideOnClose'] && !state[`${launcher}.userHidden`] && !state[`${launcher}.chatHidden`]) {
        setTimeout(
          () => c.broadcast(`${launcher}.show`),
          isMobileBrowser() ? 200 : 0
        );
      }
    }
  );

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

  c.intercept('authentication.onSuccess', () => {
    state[`${helpCenter}.isAccessible`] = true;
    if (!embedVisible(state) && helpCenterAvailable()) {
      if (!state[`${launcher}.userHidden`] && !state[`${chat}.isAccessible`])  {
        c.broadcast(`${launcher}.show`);
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
