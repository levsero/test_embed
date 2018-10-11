import _ from 'lodash';

import { WIDGET_INITIALISED, ACTIVATE_RECIEVED } from 'src/redux/modules/base/base-action-types';
import { SDK_CONNECTION_UPDATE, SDK_ACCOUNT_STATUS } from 'src/redux/modules/chat/chat-action-types';
import { UPDATE_TALK_AGENT_AVAILABILITY } from 'src/redux/modules/talk/talk-action-types';
import { ZOPIM_CHAT_ON_STATUS_UPDATE, ZOPIM_HIDE } from 'src/redux/modules/zopimChat/zopimChat-action-types';
import { AUTHENTICATION_SUCCESS, AUTHENTICATION_FAILURE } from 'src/redux/modules/helpCenter/helpCenter-action-types';
import { updateActiveEmbed,
  updateBackButtonVisibility } from 'src/redux/modules/base';
import { chatStandalone } from 'src/redux/modules/base/base-selectors';
import { getChatAvailable,
  getTalkAvailable,
  getChannelChoiceAvailable,
  getHelpCenterAvailable,
  getShowTicketFormsBackButton,
  getIpmHelpCenterAllowed,
  getWebWidgetVisible } from 'src/redux/modules/selectors';
import { getArticleViewActive } from 'src/redux/modules/helpCenter/helpCenter-selectors';

const getActiveEmbed = (state, dispatch) => {
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
  } else if (getChatAvailable(state) || chatStandalone) {
    this.showChat();
  } else {
    activeEmbed = 'ticketSubmissionForm';
    backButton = getShowTicketFormsBackButton(state);
  }

  dispatch(updateActiveEmbed(activeEmbed));
  dispatch(updateBackButtonVisibility(backButton));
};

export default function queueCalls(prevState, nextState, action, dispatch = () => {}) {
  const { type } = action;
  const state = prevState;
  const actions = [
    SDK_CONNECTION_UPDATE,
    UPDATE_TALK_AGENT_AVAILABILITY,
    WIDGET_INITIALISED,
    ZOPIM_CHAT_ON_STATUS_UPDATE,
    SDK_ACCOUNT_STATUS,
    ZOPIM_HIDE,
    ACTIVATE_RECIEVED,
    AUTHENTICATION_SUCCESS,
    AUTHENTICATION_FAILURE
  ];

  if (!getWebWidgetVisible(state) && _.includes(actions, type)) {
    getActiveEmbed(state, dispatch);
  }
}
