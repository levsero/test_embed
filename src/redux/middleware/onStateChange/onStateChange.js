import _ from 'lodash';

import {
  getAccountSettings,
  newAgentMessageReceived,
  chatNotificationReset,
  getOperatingHours,
  getIsChatting,
  chatWindowOpenOnNavigate,
  chatConnected
} from 'src/redux/modules/chat';
import {
  updateActiveEmbed,
  updateBackButtonVisibility,
  activateRecieved
} from 'src/redux/modules/base';
import {
  IS_CHATTING,
  END_CHAT_REQUEST_SUCCESS,
  SDK_CHAT_MEMBER_LEAVE,
  CHAT_AGENT_INACTIVE,
  SDK_VISITOR_UPDATE,
  CHAT_SOCIAL_LOGIN_SUCCESS,
  CHAT_STARTED
} from 'src/redux/modules/chat/chat-action-types';
import { UPDATE_EMBEDDABLE_CONFIG } from 'src/redux/modules/base/base-action-types';
import { CONNECTION_STATUSES } from 'src/constants/chat';
import { audio } from 'service/audio';
import { mediator } from 'service/mediator';
import {
  getChatMessagesFromAgents,
  getConnection,
  getChatOnline,
  getChatStatus,
  getIsProactiveSession,
  getUserSoundSettings,
  getIsChatting as getIsChattingState,
  getActiveAgents,
  getLastReadTimestamp,
  hasUnseenAgentMessage
} from 'src/redux/modules/chat/chat-selectors';
import {
  getArticleDisplayed,
  getHasSearched
} from 'src/redux/modules/helpCenter/helpCenter-selectors';
import {
  getActiveEmbed,
  getWidgetShown,
  getIPMWidget,
  getHelpCenterEmbed,
  getSubmitTicketEmbed,
  getHasWidgetShown
} from 'src/redux/modules/base/base-selectors';
import { store } from 'service/persistence';
import { getSettingsMobileNotificationsDisabled } from 'src/redux/modules/settings/settings-selectors';
import { getAnswerBotAvailable } from 'src/redux/modules/selectors';
import { isMobileBrowser } from 'utility/devices';
import { resetShouldWarn } from 'src/util/nullZChat';
import onWidgetOpen from 'src/redux/middleware/onStateChange/onWidgetOpen';
import onChatOpen from 'src/redux/middleware/onStateChange/onChatOpen';
import onChannelChoiceTransition from 'src/redux/middleware/onStateChange/onChannelChoiceTransition';
import { onZopimChatStateChange } from 'src/redux/middleware/onStateChange/onZopimStateChange';
import { updateChatSettings } from 'src/redux/modules/settings/settings-actions';
import { isPopout } from 'utility/globals';

const showOnLoad = _.get(store.get('store'), 'widgetShown');
const storedActiveEmbed = _.get(store.get('store'), 'activeEmbed');
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
  const agentChats = getChatMessagesFromAgents(state);
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
  const hasWidgetShown = getHasWidgetShown(nextState);
  const otherEmbedOpen = widgetShown && activeEmbed !== 'chat';
  const agentMessage = getNewAgentMessage(nextState);
  const recentMessage = isRecentMessage(agentMessage);

  dispatch(newAgentMessageReceived(agentMessage));

  if (hasWidgetShown && recentMessage && getUserSoundSettings(nextState)) {
    audio.play('incoming_message');
  }

  if (!widgetShown || otherEmbedOpen) {
    const isMobileNotificationsDisabled = getSettingsMobileNotificationsDisabled(nextState);
    const isMobile = isMobileBrowser();

    if (_.size(getChatMessagesFromAgents(nextState)) === 1
      && !isMobile
      && activeEmbed === 'helpCenterForm'
      && !getHasSearched(nextState)) {
      dispatch(updateActiveEmbed('chat'));
    }

    startChatNotificationTimer(agentMessage);

    if (!widgetShown && recentMessage && agentMessage.proactive && !(isMobile && isMobileNotificationsDisabled)) {
      mediator.channel.broadcast('newChat.newMessage');
    }
  }
};

const onChatConnected = (prevState, nextState, dispatch) => {
  if (getConnection(prevState) === CONNECTION_STATUSES.CONNECTING
      && getConnection(nextState) === CONNECTION_STATUSES.CONNECTED) {
    dispatch(chatConnected());
    dispatch(updateChatSettings());

    if (!chatAccountSettingsFetched) {
      dispatch(getAccountSettings());
      dispatch(getIsChatting());
      dispatch(getOperatingHours());
      chatAccountSettingsFetched = true;
      mediator.channel.broadcast('newChat.connected', showOnLoad);
    }
  }
};

const onChatStatus = (action, dispatch) => {
  if (action.type === IS_CHATTING) {
    if (action.payload) {
      let activeEmbed = storedActiveEmbed;

      if (storedActiveEmbed === 'zopimChat') activeEmbed = 'chat';

      if (activeEmbed) {
        dispatch(updateActiveEmbed(activeEmbed));
      }

      if (showOnLoad) {
        dispatch(chatWindowOpenOnNavigate());
      }
    }
  }
};

const onNewChatMessage = (prevState, nextState, dispatch) => {
  const prev = getChatMessagesFromAgents(prevState);
  const next = getChatMessagesFromAgents(nextState);
  const newAgentMessage = next.length > prev.length;

  if (newAgentMessage && hasUnseenAgentMessage(nextState)) {
    handleNewAgentMessage(nextState, dispatch);
  }
};

const onLastReadTimestampChange = (prevState, nextState, dispatch) => {
  const prev = getLastReadTimestamp(prevState);
  const next = getLastReadTimestamp(nextState);

  if (prev !== next && !hasUnseenAgentMessage(nextState)) {
    dispatch(chatNotificationReset());
  }
};

const onChatStatusChange = (prevState, nextState, dispatch) => {
  if (getChatStatus(prevState) !== getChatStatus(nextState)) {
    if (!getChatOnline(nextState)) {
      if (
        getSubmitTicketEmbed(nextState)
        && !getIsChattingState(nextState)
        && getActiveEmbed(nextState) === 'chat'
        && !isPopout()) {
        dispatch(updateActiveEmbed('ticketSubmissionForm'));
      }
    }
  }
};

const onChatEnd = (nextState, action, dispatch) => {
  if (action.type === END_CHAT_REQUEST_SUCCESS) {
    if (
      !getChatOnline(nextState)
      && getSubmitTicketEmbed(nextState)
      && !isPopout()) {
      dispatch(updateActiveEmbed('ticketSubmissionForm'));
    }
    if (getAnswerBotAvailable(nextState)) {
      dispatch(updateBackButtonVisibility(true));
    }
  }
};

const onArticleDisplayed = (prevState, nextState, dispatch) => {
  const prevDisplay = getArticleDisplayed(prevState);
  const nextDisplay = getArticleDisplayed(nextState);

  if (!prevDisplay && nextDisplay) {
    const ipmWidget = getIPMWidget(prevState);
    const isBackButtonVisible = ipmWidget ? false : getHelpCenterEmbed(prevState);
    const widgetShown = getWidgetShown(prevState);

    dispatch(updateBackButtonVisibility(isBackButtonVisible));
    if (!widgetShown) dispatch(activateRecieved());
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

const onVisitorUpdate = ({ type, payload }, dispatch) => {
  const isVisitorUpdate = (type === SDK_VISITOR_UPDATE);
  const authObj = _.get(payload, 'detail.auth');
  const avatarPath = _.get(authObj, 'avatar$string');
  const isSociallyAuth = _.get(authObj, 'verified$bool');

  if (isVisitorUpdate && isSociallyAuth) {
    dispatch({
      type: CHAT_SOCIAL_LOGIN_SUCCESS,
      payload: avatarPath
    });
  }
};

const onChatStarted = (prevState, nextState, dispatch) => {
  const previouslyNotChatting = !getIsChattingState(prevState);
  const currentlyChatting = getIsChattingState(nextState);
  const answerBot = getAnswerBotAvailable(nextState);

  if (previouslyNotChatting && currentlyChatting) {
    dispatch({ type: CHAT_STARTED });

    if (answerBot) {
      dispatch(updateBackButtonVisibility(false));
    }
  }
};

const onUpdateEmbeddableConfig = (action) => {
  if (action.type === UPDATE_EMBEDDABLE_CONFIG) {
    if (action.payload) {
      if (!action.payload.newChat) {
        resetShouldWarn();
      }
    }
  }
};

export default function onStateChange(prevState, nextState, action = {}, dispatch = () => {}) {
  onChatStarted(prevState, nextState, dispatch);
  onChatStatusChange(prevState, nextState, dispatch);
  onZopimChatStateChange(prevState, nextState, dispatch);
  onChatConnected(prevState, nextState, dispatch);
  onNewChatMessage(prevState, nextState, dispatch);
  onLastReadTimestampChange(prevState, nextState, dispatch);
  onArticleDisplayed(prevState, nextState, dispatch);
  onChatStatus(action, dispatch);
  onChatEnd(nextState, action, dispatch);
  onAgentLeave(prevState, action, dispatch);
  onVisitorUpdate(action, dispatch);
  onWidgetOpen(prevState, nextState);
  onChatOpen(prevState, nextState, dispatch);
  onUpdateEmbeddableConfig(action);
  onChannelChoiceTransition(prevState, nextState, action, dispatch);
}
