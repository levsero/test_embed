import _ from 'lodash';

import {
  WIDGET_INITIALISED,
  ACTIVATE_RECEIVED,
  AUTHENTICATION_SUCCESS,
  API_RESET_WIDGET } from 'src/redux/modules/base/base-action-types';
import { SDK_CONNECTION_UPDATE, SDK_ACCOUNT_STATUS, CHAT_CONNECTED } from 'src/redux/modules/chat/chat-action-types';
import {
  TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT,
  TALK_AGENT_AVAILABILITY_SOCKET_EVENT } from 'src/redux/modules/talk/talk-action-types';
import { GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS } from 'src/redux/modules/chat/chat-action-types';
import {
  ZOPIM_CHAT_ON_STATUS_UPDATE,
  ZOPIM_END_CHAT,
  ZOPIM_HIDE,
  ZOPIM_CONNECTED } from 'src/redux/modules/zopimChat/zopimChat-action-types';
import { updateActiveEmbed,
  updateBackButtonVisibility } from 'src/redux/modules/base';
import { getChatStandalone, getZopimChatEmbed, getActiveEmbed } from 'src/redux/modules/base/base-selectors';
import { getChatAvailable,
  getTalkOnline,
  getChannelChoiceAvailable,
  getHelpCenterAvailable,
  getShowTicketFormsBackButton,
  getIpmHelpCenterAllowed,
  getSubmitTicketAvailable,
  getAnswerBotAvailable,
  getWebWidgetVisible } from 'src/redux/modules/selectors';
import { getArticleViewActive } from 'src/redux/modules/helpCenter/helpCenter-selectors';
import { getZopimChatOnline, getZopimIsChatting } from 'src/redux/modules/zopimChat/zopimChat-selectors';
import { getIsChatting } from 'src/redux/modules/chat/chat-selectors';
import { isPopout } from 'utility/globals';

const shouldResetForChat = (type, state) => {
  const activeEmbed = getActiveEmbed(state);
  const eligibleChatActions = [
    SDK_CONNECTION_UPDATE,
    SDK_ACCOUNT_STATUS
  ];
  const eligibleActiveEmbeds = [
    'chat',
    'channelChoice',
    'ticketSubmissionForm'
  ];
  const isChatActionEligible = _.includes(eligibleChatActions, type);
  const isActiveEmbedEligible = _.includes(eligibleActiveEmbeds, activeEmbed);

  return isChatActionEligible && isActiveEmbedEligible;
};

const shouldResetForZopimChat = (type, state) => {
  const activeEmbed = getActiveEmbed(state);
  const eligibleZopimChatActions = [
    ZOPIM_CHAT_ON_STATUS_UPDATE
  ];
  const isZopimChatActionEligible = _.includes(eligibleZopimChatActions, type);
  const isChatting = getZopimIsChatting(state);
  const zopimChatGoneOffline = !isChatting && !getZopimChatOnline(state);

  if (zopimChatGoneOffline
      && isZopimChatActionEligible
      && (activeEmbed === 'zopimChat' || activeEmbed === 'channelChoice')) {
    return true;
  }
  if (isZopimChatActionEligible && (activeEmbed === 'ticketSubmissionForm' || activeEmbed === '')) {
    return true;
  }
  return false;
};

const getChatActiveEmbed = (state) => {
  // old chat
  if (getZopimChatEmbed(state)) {
    return 'zopimChat';
  } else {
    return 'chat';
  }
};

const setNewActiveEmbed = (state, dispatch) => {
  let backButton = false;
  let activeEmbed = '';
  const articleViewActive = getArticleViewActive(state);

  if (isPopout()) {
    activeEmbed = 'chat';
  } else if (getAnswerBotAvailable(state)) {
    activeEmbed = 'answerBot';
    if (articleViewActive) {
      activeEmbed = 'helpCenterForm';
      backButton = true;
    } else if (getZopimIsChatting(state)) {
      activeEmbed = getChatActiveEmbed(state);
    } else {
      activeEmbed = 'answerBot';
      backButton = false;
    }
  } else if (getHelpCenterAvailable(state)) {
    activeEmbed = 'helpCenterForm';
    backButton = articleViewActive;
  } else if (getIpmHelpCenterAllowed(state) && articleViewActive) {
    // we only go into this condition if HC is injected by IPM
    activeEmbed = 'helpCenterForm';
    backButton = false;
  } else if (getChannelChoiceAvailable(state)) {
    activeEmbed = 'channelChoice';
  } else if (getTalkOnline(state)) {
    activeEmbed = 'talk';
  } else if (getChatAvailable(state) || getChatStandalone(state)) {
    activeEmbed = getChatActiveEmbed(state);
  } else if (getSubmitTicketAvailable(state)) {
    activeEmbed = 'ticketSubmissionForm';
    backButton = getShowTicketFormsBackButton(state);
  }

  dispatch(updateActiveEmbed(activeEmbed));
  dispatch(updateBackButtonVisibility(backButton));
};

export default function resetActiveEmbed(prevState, nextState, action, dispatch = () => {}) {
  const { type } = action;
  const state = nextState;
  const updateActions = [
    TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT,
    TALK_AGENT_AVAILABILITY_SOCKET_EVENT,
    WIDGET_INITIALISED,
    ZOPIM_HIDE,
    ACTIVATE_RECEIVED,
    AUTHENTICATION_SUCCESS,
    CHAT_CONNECTED,
    ZOPIM_CONNECTED,
    ZOPIM_END_CHAT,
    API_RESET_WIDGET,
    GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS
  ];

  const isZopimChatting = getZopimIsChatting(state) && getActiveEmbed(state) === 'zopimChat';
  const isNewChatChatting = getIsChatting(state) && getActiveEmbed(state) === 'chat';
  const shouldReset = _.includes(updateActions, type) && !isZopimChatting && !isNewChatChatting;
  const chatReset = shouldResetForChat(type, nextState);
  const zopimChatReset = shouldResetForZopimChat(type, nextState);

  if (!getWebWidgetVisible(state) && (shouldReset || chatReset || zopimChatReset)) {
    setNewActiveEmbed(state, dispatch);
  }
}
