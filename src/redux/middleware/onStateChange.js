import _ from 'lodash';

import { getAccountSettings,
         newAgentMessageReceived,
         getIsChatting } from 'src/redux/modules/chat';
import { updateActiveEmbed } from 'src/redux/modules/base';
import { IS_CHATTING } from 'src/redux/modules/chat/chat-action-types';
import { audio } from 'service/audio';
import { mediator } from 'service/mediator';
import { getChatMessagesByAgent,
         getConnection,
         getChatOnline,
         getUserSoundSettings } from 'src/redux/modules/chat/chat-selectors';
import { getArticleDisplayed } from 'src/redux/modules/helpCenter/helpCenter-selectors';
import { getActiveEmbed,
         getWidgetShown } from 'src/redux/modules/base/base-selectors';
import { store } from 'service/persistence';

const showOnLoad = _.get(store.get('store'), 'widgetShown');

const handleNotificationCounter = (nextState, dispatch) => {
  const activeEmbed = getActiveEmbed(nextState);
  const widgetShown = getWidgetShown(nextState);

  if (!widgetShown || (widgetShown && activeEmbed !== 'chat')) {
    dispatch(newAgentMessageReceived());
    mediator.channel.broadcast('newChat.newMessage');
  }
};

const onChatConnected = (prevState, nextState, dispatch) => {
  if (getConnection(prevState) === 'connecting' && getConnection(nextState) !== 'connecting') {
    dispatch(getAccountSettings());
    dispatch(getIsChatting());
    mediator.channel.broadcast('newChat.connected', showOnLoad);
  }
};

const onChatStatus = (action = {}, dispatch) => {
  if (action.type === IS_CHATTING) {
    mediator.channel.broadcast('newChat.isChatting', action.payload, showOnLoad);
    if (action.payload) {
      dispatch(updateActiveEmbed(_.get(store.get('store'), 'activeEmbed', '')));
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
  const nextChatStatusOnline = getChatOnline(nextState);

  if (getChatOnline(prevState) !== nextChatStatusOnline) {
    if (nextChatStatusOnline) {
      mediator.channel.broadcast('newChat.online');
    } else {
      mediator.channel.broadcast('newChat.offline');
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
