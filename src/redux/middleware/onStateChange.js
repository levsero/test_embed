import _ from 'lodash';

import { getAccountSettings,
  newAgentMessageReceived,
  updateLastAgentMessageSeenTimestamp,
  getOperatingHours,
  getIsChatting } from 'src/redux/modules/chat';
import { updateActiveEmbed } from 'src/redux/modules/base';
import { IS_CHATTING,
  END_CHAT_REQUEST_SUCCESS,
  SDK_CHAT_MEMBER_LEAVE,
  CHAT_AGENT_INACTIVE } from 'src/redux/modules/chat/chat-action-types';
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
  getIsProactiveSession,
  getUserSoundSettings,
  getIsChatting as getIsChattingState,
  getActiveAgents } from 'src/redux/modules/chat/chat-selectors';
import { getArticleDisplayed } from 'src/redux/modules/helpCenter/helpCenter-selectors';
import { getActiveEmbed,
  getWidgetShown,
  getSubmitTicketEmbed } from 'src/redux/modules/base/base-selectors';
import { CHATTING_SCREEN } from 'src/redux/modules/chat/chat-screen-types';
import { store } from 'service/persistence';

const showOnLoad = _.get(store.get('store'), 'widgetShown');
const createdAtTimestamp = Date.now();
let chatAccountSettingsFetched = false;
let chatNotificationTimeout = null;

const startChatNotificationTimer = ({ proactive }) => {
  if (chatNotificationTimeout) {
    clearTimeout(chatNotificationTimeout);
  }

  const timeout = proactive ? 5000 : 3000;

  chatNotificationTimeout = setTimeout(() => {
    mediator.channel.broadcast('webWidget.hideChatNotification');
  }, timeout);
};

const getNewAgentMessage = (state) => {
  const agentChats = getChatMessagesByAgent(state);
  const newAgentMessage = _.last(agentChats);
  const proactive = getIsProactiveSession(state);

  return { ...newAgentMessage, proactive };
};

const isRecentMessage = (agentMessage) => {
  return agentMessage.timestamp && (agentMessage.timestamp > createdAtTimestamp);
};

const handleNewAgentMessage = (nextState, dispatch) => {
  const activeEmbed = getActiveEmbed(nextState);
  const widgetShown = getWidgetShown(nextState);
  const otherEmbedOpen = widgetShown && activeEmbed !== 'chat';

  if (!widgetShown || otherEmbedOpen) {
    const agentMessage = getNewAgentMessage(nextState);
    const recentMessage = isRecentMessage(agentMessage);

    if (recentMessage && getUserSoundSettings(nextState)) {
      audio.play('incoming_message');
    }

    dispatch(newAgentMessageReceived(agentMessage));
    startChatNotificationTimer(agentMessage);

    if (!widgetShown && recentMessage && agentMessage.proactive) {
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
    dispatch(getOperatingHours());

    chatAccountSettingsFetched = true;
    mediator.channel.broadcast('newChat.connected', showOnLoad);
  }
};

const onChatStatus = (action, dispatch) => {
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
    return true;
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

const onChatScreenInteraction = (prevState, nextState, dispatch) => {
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
    handleNewAgentMessage(nextState, dispatch);
  }
};

const onChatStatusChange = (prevState, nextState, dispatch) => {
  if (getChatStatus(prevState) !== getChatStatus(nextState)) {
    if (getChatOnline(nextState)) {
      mediator.channel.broadcast('newChat.online');
    } else {
      const hideLauncher = !getOfflineFormSettings(nextState).enabled;

      mediator.channel.broadcast('newChat.offline', hideLauncher);
      if (getSubmitTicketEmbed(nextState) && !getIsChattingState(nextState) && getActiveEmbed(nextState) === 'chat') {
        dispatch(updateActiveEmbed('ticketSubmissionForm'));
      }
    }
  }
};

const onChatEnd = (nextState, action, dispatch) => {
  if (action.type === END_CHAT_REQUEST_SUCCESS) {
    if (!getChatOnline(nextState) && getSubmitTicketEmbed(nextState)) {
      dispatch(updateActiveEmbed('ticketSubmissionForm'));
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

const onAgentLeave = (prevState, { type, payload }, dispatch) => {
  const memberLeaveEvent = type === SDK_CHAT_MEMBER_LEAVE;
  const isAgent = _.get(payload, 'detail.nick', '')
    .indexOf('agent:') > -1;

  if (memberLeaveEvent && isAgent) {
    const agents = getActiveAgents(prevState);

    dispatch({
      type: CHAT_AGENT_INACTIVE,
      payload: agents[payload.detail.nick]
    });
  }
};

export default function onStateChange(prevState, nextState, action = {}, dispatch = () => {}) {
  onChatStatusChange(prevState, nextState, dispatch);
  onChatConnected(prevState, nextState, dispatch);
  onChatScreenInteraction(prevState, nextState, dispatch);
  onNewChatMessage(prevState, nextState, dispatch);
  onArticleDisplayed(prevState, nextState, dispatch);
  onChatStatus(action, dispatch);
  onChatEnd(nextState, action, dispatch);
  onAgentLeave(prevState, action, dispatch);
}
