import _ from 'lodash';

import { getAccountSettings,
         newAgentMessageReceived,
         getIsChatting } from 'src/redux/modules/chat';
import { updateActiveEmbed } from 'src/redux/modules/base';
import { IS_CHATTING } from 'src/redux/modules/chat/chat-action-types';
import { CONNECTION_STATUSES } from 'src/constants/chat';
import { audio } from 'service/audio';
import { mediator } from 'service/mediator';
import { getChatMessagesByAgent,
         getConnection,
         getOfflineFormSettings,
         getChatOnline,
         getChatStatus,
         getUserSoundSettings } from 'src/redux/modules/chat/chat-selectors';
import { getArticleDisplayed } from 'src/redux/modules/helpCenter/helpCenter-selectors';
import { getActiveEmbed,
         getWidgetShown } from 'src/redux/modules/base/base-selectors';
import { store } from 'service/persistence';

const showOnLoad = _.get(store.get('store'), 'widgetShown');
let chatAccountSettingsFetched = false;

const handleNotificationCounter = (nextState, dispatch) => {
  const activeEmbed = getActiveEmbed(nextState);
  const widgetShown = getWidgetShown(nextState);

  if (!widgetShown || (widgetShown && activeEmbed !== 'chat')) {
    dispatch(newAgentMessageReceived());
    if (!widgetShown) {
      mediator.channel.broadcast('newChat.newMessage');
    }
  }
};

const onChatConnected = (prevState, nextState, dispatch) => {
  if (getConnection(prevState) === CONNECTION_STATUSES.CONNECTING
      && getConnection(nextState) !== CONNECTION_STATUSES.CONNECTING
      && !chatAccountSettingsFetched) {
    dispatch(getAccountSettings());
    dispatch(getIsChatting());
    chatAccountSettingsFetched = true;
    mediator.channel.broadcast('newChat.connected', showOnLoad);
  }
};

const onChatStatus = (action = {}, dispatch) => {
  if (action.type === IS_CHATTING) {
    mediator.channel.broadcast('newChat.isChatting', action.payload, showOnLoad);
    if (action.payload) {
      let activeEmbed = _.get(store.get('store'), 'activeEmbed', '');

      if (activeEmbed === 'zopimChat') activeEmbed = 'chat';

      dispatch(updateActiveEmbed(activeEmbed));
    }
  }
};

const onNewChatMessage = (prevState, nextState, dispatch) => {
  const prevChats = getChatMessagesByAgent(prevState);
  const nextChats = getChatMessagesByAgent(nextState);
  const isIncomingChat = prevChats.length < nextChats.length;

  if (isIncomingChat) {
    if (getUserSoundSettings(nextState)) {
      audio.play('incoming_message');
    }

    handleNotificationCounter(nextState, dispatch);
  }
};

const onChatStatusChange = (prevState, nextState) => {
  if (getChatStatus(prevState) !== getChatStatus(nextState)) {
    if (getChatOnline(nextState)) {
      mediator.channel.broadcast('newChat.online');
    } else {
      const hideLauncher = !getOfflineFormSettings(nextState).enabled;

      mediator.channel.broadcast('newChat.offline', hideLauncher);
    }
  }
};

const onArticleDisplayed = (prevState, nextState) => {
  const prevDisplay = getArticleDisplayed(prevState);
  const nextDisplay = getArticleDisplayed(nextState);

  if (!prevDisplay && nextDisplay) {
    mediator.channel.broadcast('.hide', true);
    mediator.channel.broadcast('ipm.webWidget.show');
  }
};

export default function onStateChange(prevState, nextState, action, dispatch = () => {}) {
  onChatStatusChange(prevState, nextState);
  onChatConnected(prevState, nextState, dispatch);
  onNewChatMessage(prevState, nextState, dispatch);
  onArticleDisplayed(prevState, nextState, dispatch);
  onChatStatus(action, dispatch);
}
