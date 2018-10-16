import _ from 'lodash';

import {
  WIDGET_INITIALISED,
  ACTIVATE_RECIEVED,
  AUTHENTICATION_SUCCESS } from 'src/redux/modules/base/base-action-types';
import { SDK_CONNECTION_UPDATE, SDK_ACCOUNT_STATUS } from 'src/redux/modules/chat/chat-action-types';
import { UPDATE_TALK_AGENT_AVAILABILITY } from 'src/redux/modules/talk/talk-action-types';
import {
  ZOPIM_CHAT_ON_STATUS_UPDATE,
  ZOPIM_END_CHAT,
  ZOPIM_HIDE } from 'src/redux/modules/zopimChat/zopimChat-action-types';
import { updateActiveEmbed,
  updateBackButtonVisibility } from 'src/redux/modules/base';
import { getChatStandalone, getZopimChatEmbed, getActiveEmbed } from 'src/redux/modules/base/base-selectors';
import { getChatAvailable,
  getTalkAvailable,
  getChannelChoiceAvailable,
  getHelpCenterAvailable,
  getShowTicketFormsBackButton,
  getIpmHelpCenterAllowed,
  getWebWidgetVisible } from 'src/redux/modules/selectors';
import { getArticleViewActive } from 'src/redux/modules/helpCenter/helpCenter-selectors';
import { getZopimChatOnline, getZopimIsChatting } from 'src/redux/modules/zopimChat/zopimChat-selectors';

const shouldResetForChat = (type, state) => {
  const activeEmbed = getActiveEmbed(state);
  const chatActions = [
    SDK_CONNECTION_UPDATE,
    SDK_ACCOUNT_STATUS
  ];

  if (_.includes(chatActions, type) && (activeEmbed === 'chat' || activeEmbed === 'channelChoice')) {
    return true;
  }
  return false;
};

const shouldResetForZopimChat = (type, state) => {
  const activeEmbed = getActiveEmbed(state);
  const zopimChatActions = [
    ZOPIM_CHAT_ON_STATUS_UPDATE,
    ZOPIM_END_CHAT
  ];
  const zopimChatGoneOffline = _.includes(zopimChatActions, type) && !getZopimChatOnline(state);
  const isChatting = getZopimIsChatting(state);

  if ((zopimChatGoneOffline && !isChatting) && (activeEmbed === 'zopimChat' || activeEmbed === 'channelChoice')) {
    return true;
  }
  return false;
};

const setNewActiveEmbed = (state, dispatch) => {
  let backButton = false;
  let activeEmbed = '';
  const articleViewActive = getArticleViewActive(state);

  if (getHelpCenterAvailable(state)) {
    activeEmbed = 'helpCenterForm';
    backButton = articleViewActive;
  } else if (getIpmHelpCenterAllowed(state) && articleViewActive) {
    // we only go into this condition if HC is injected by IPM
    activeEmbed = 'helpCenterForm';
    backButton = false;
  } else if (getChannelChoiceAvailable(state)) {
    activeEmbed = 'channelChoice';
  } else if (getTalkAvailable(state)) {
    activeEmbed = 'talk';
  } else if (getChatAvailable(state) || getChatStandalone(state)) {
    // old chat
    if (getZopimChatEmbed(state)) {
      activeEmbed = 'zopimChat';
    } else {
      activeEmbed = 'chat';
    }
  } else {
    activeEmbed = 'ticketSubmissionForm';
    backButton = getShowTicketFormsBackButton(state);
  }

  dispatch(updateActiveEmbed(activeEmbed));
  dispatch(updateBackButtonVisibility(backButton));
};

export default function resetActiveEmbed(prevState, nextState, action, dispatch = () => {}) {
  const { type } = action;
  const state = prevState;
  const alwaysUpdateActions = [
    UPDATE_TALK_AGENT_AVAILABILITY,
    WIDGET_INITIALISED,
    ZOPIM_HIDE,
    ACTIVATE_RECIEVED,
    AUTHENTICATION_SUCCESS
  ];

  const chatReset = shouldResetForChat(type, nextState);
  const zopimChatReset = shouldResetForZopimChat(type, nextState);

  if (!getWebWidgetVisible(state) && (_.includes(alwaysUpdateActions, type) || chatReset || zopimChatReset)) {
    setNewActiveEmbed(state, dispatch);
  }
}
