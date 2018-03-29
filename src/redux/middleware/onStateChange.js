import _ from 'lodash';

import { getAccountSettings,
         newAgentMessageReceived,
         incrementNewAgentMessageCounter,
         updateLastAgentMessageSeenTimestamp,
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
         getChatScreen,
         getLastAgentMessageSeenTimestamp,
         getUserSoundSettings } from 'src/redux/modules/chat/chat-selectors';
import { getArticleDisplayed } from 'src/redux/modules/helpCenter/helpCenter-selectors';
import { getActiveEmbed,
         getWidgetShown } from 'src/redux/modules/base/base-selectors';
import { CHATTING_SCREEN } from 'src/redux/modules/chat/chat-screen-types';
import { store } from 'service/persistence';

const showOnLoad = _.get(store.get('store'), 'widgetShown');
let chatAccountSettingsFetched = false;

const handleNewAgentMessage = (nextState, dispatch) => {
  const activeEmbed = getActiveEmbed(nextState);
  const widgetShown = getWidgetShown(nextState);
  const otherEmbedOpen = widgetShown && activeEmbed !== 'chat';

  if (!widgetShown || otherEmbedOpen) {
    dispatch(incrementNewAgentMessageCounter());

    if (!widgetShown) {
      mediator.channel.broadcast('newChat.newMessage');
    }

    if (otherEmbedOpen) {
      const messages = getChatMessagesByAgent(nextState);
      const newAgentMessage = messages[messages.length-1];

      dispatch(newAgentMessageReceived(newAgentMessage));
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

      const timestamp = _.get(store.get('store'), 'lastAgentMessageSeenTimestamp');

      if (timestamp) {
        dispatch(updateLastAgentMessageSeenTimestamp(timestamp));
      }

      dispatch(updateActiveEmbed(activeEmbed));
    }
  }
};

const hasUnseenAgentMessage = (state) => {
  const timestamp = _.get(store.get('store'), 'lastAgentMessageSeenTimestamp');

  if (!timestamp) {
    return false;
  }

  // check if any of the agent messages came after the last stored timestamp
  return _.find(getChatMessagesByAgent(state), message => message.timestamp > timestamp);
};

const inChattingScreen = (state) => {
  const screen = getChatScreen(state);
  const embed = getActiveEmbed(state);
  const widgetShown = getWidgetShown(state);

  return widgetShown && screen === CHATTING_SCREEN && embed === 'chat';
};

const storeLastAgentMessageSeen = (state, dispatch) => {
  const timestamp = _.get(_.last(getChatMessagesByAgent(state)), 'timestamp');
  const previousTimestamp = getLastAgentMessageSeenTimestamp(state);

  if (timestamp && timestamp > previousTimestamp) {
    dispatch(updateLastAgentMessageSeenTimestamp(timestamp));
  }
};

const onNewAgentMessage = (prevState, nextState, dispatch) => {
  // only store the last message seen timestamp if user is chatting on the chat screen
  if (inChattingScreen(nextState)) {
    storeLastAgentMessageSeen(nextState, dispatch);
  }
};

const onNewChatMessage = (prevState, nextState, dispatch) => {
  const prev = getChatMessagesByAgent(prevState);
  const next = getChatMessagesByAgent(nextState);
  const newAgentMessage = next.length > prev.length;

  if (newAgentMessage && hasUnseenAgentMessage(nextState)) {
    if (getUserSoundSettings(nextState)) {
      audio.play('incoming_message');
    }

    handleNewAgentMessage(nextState, dispatch);
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
  onNewAgentMessage(prevState, nextState, dispatch);
  onNewChatMessage(prevState, nextState, dispatch);
  onArticleDisplayed(prevState, nextState, dispatch);
  onChatStatus(action, dispatch);
}
