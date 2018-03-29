import _ from 'lodash';
import { createSelector } from 'reselect';
import { CHAT_MESSAGE_EVENTS, CHAT_SYSTEM_EVENTS } from 'constants/chat';
import { CHATTING_SCREEN } from './chat-screen-types';

import { getActiveEmbed } from 'src/redux/modules/base/base-selectors';

const groupChatsByAgent = (state) => {
  const agentMsgs = getChatMessagesByAgent(state);

  return _.groupBy(agentMsgs, (chat) => chat.nick);
};

const getFormFields = (settings) => {
  const { form } = settings;

  return _.keyBy(_.values(form), 'name');
};

const isAgent = (nick) => nick ? nick.indexOf('agent:') > -1 : false;

const getChats = (state) => state.chat.chats;
const getNotification = (state) => state.chat.notification;
const getThemeMessageType = (state) => state.chat.accountSettings.theme.message_type;

export const getAgents = (state) => state.chat.agents;
export const getConciergeSettings = (state) => state.chat.accountSettings.concierge;
export const getConnection = (state) => state.chat.connection;
export const getCurrentMessage = (state) => state.chat.currentMessage;
export const getChatOnline = (state) => _.includes(['online', 'away'], getChatStatus(state));
export const getChatRating = (state) => state.chat.rating;
export const getChatScreen = (state) => state.chat.screen;
export const getChatStatus = (state) => state.chat.account_status;
export const getChatVisitor = (state) => state.chat.visitor;
export const getIsChatting = (state) => state.chat.is_chatting;
export const getNotificationCount = (state) => getNotification(state).count;
export const getPostchatFormSettings = (state) => state.chat.accountSettings.postchatForm;
export const getPrechatFormSettings = (state) => state.chat.accountSettings.prechatForm;
export const getOfflineFormSettings = (state) => state.chat.accountSettings.offlineForm;
export const getEmailTranscript = (state) => state.chat.emailTranscript;
export const getAttachmentsEnabled = (state) => state.chat.accountSettings.attachments.enabled;
export const getRatingSettings = (state) => state.chat.accountSettings.rating;
export const getQueuePosition = (state) => state.chat.queuePosition;
export const getUserSoundSettings = (state) => state.chat.userSettings.sound;
export const getChatOfflineForm = (state) => state.chat.formState.offlineForm;
export const getOfflineMessage = (state) => state.chat.offlineMessage;
export const getPreChatFormState = (state) => state.chat.formState.preChatForm;
export const getEditContactDetails = (state) => state.chat.editContactDetails;
export const getMenuVisible = (state) => state.chat.menuVisible;
export const getShowMenu = (state) => getActiveEmbed(state) === 'chat' && getChatScreen(state) === CHATTING_SCREEN;
export const getAgentJoined = (state) => state.chat.agentJoined;
export const getLastAgentMessageSeenTimestamp = (state) => state.chat.lastAgentMessageSeenTimestamp;
export const getOperatingHours = (state) => state.chat.operatingHours;
export const getLoginSettings = (state) => state.chat.accountSettings.login;

export const getThemeShowAvatar = createSelector(
  getThemeMessageType,
  (messageType) => {
    const CHAT_THEME_SHOW_AVATAR = {
      'basic_avatar': true,
      'bubble_avatar': true
    };

    return _.get(CHAT_THEME_SHOW_AVATAR, messageType, false);
  }
);

export const getChatNotification = createSelector(
  [getNotification, getAgents, groupChatsByAgent],
  (notification, agents, chats) => {
    const { nick } = notification;
    const agentChats = chats[nick];
    const proactive = !!(agentChats && agentChats.length === 1);

    return {
      ...notification,
      ...agents[notification.nick],
      proactive
    };
  }
);

export const getOfflineFormFields = createSelector(
  [getOfflineFormSettings],
  getFormFields
);

export const getDepartments = (state) => state.chat.departments;

const getDepartmentsList = (state) => _.values(state.chat.departments);

export const getPrechatFormFields = createSelector(
  [getPrechatFormSettings, getDepartmentsList],
  (prechatSettings, departments) => {
    const formsByKey = getFormFields(prechatSettings);
    const departmentOptions = _.map(
      departments,
      (department) => ({ ...department, value: department.id })
    );

    return _.extend({}, formsByKey, { departments: departmentOptions });
  }
);

export const getChatMessages = createSelector(
  [getChats],
  (chats) => {
    const chatsArr = Array.from(chats.values());

    return _.filter((chatsArr),
      (chat) =>
        _.includes(CHAT_MESSAGE_EVENTS, chat.type)
    );
  }
);

export const getChatMessagesByAgent = createSelector(
  [getChatMessages],
  (messages) => {
    return _.filter(messages, (message) => _.includes(message.nick, 'agent'));
  }
);

export const getChatEvents = createSelector(
  [getChats],
  (chats) => {
    const chatsArr = Array.from(chats.values());

    return _.filter((chatsArr),
      (chat) =>
        _.includes(CHAT_SYSTEM_EVENTS, chat.type)
    );
  }
);

export const getGroupedChatLog = createSelector(
  [getChats],
  (chats) => {
    const chatsArr = Array.from(chats.values());
    let lastUniqueMessageOrEvent;

    const isMessage = (messageOrEvent) => (
      _.includes(CHAT_MESSAGE_EVENTS, messageOrEvent.type)
    );

    const isEvent = (messageOrEvent) => (
      _.includes(CHAT_SYSTEM_EVENTS, messageOrEvent.type)
    );

    const getGroupTimestamp = (messageOrEvent, groupFirstMessageCandidate) => {
      if (isEvent(messageOrEvent)) {
        lastUniqueMessageOrEvent = messageOrEvent;
        return messageOrEvent.timestamp;
      }

      if (isMessage(messageOrEvent)) {
        if (groupFirstMessageCandidate && isMessage(groupFirstMessageCandidate)) {
          if (groupFirstMessageCandidate.nick === messageOrEvent.nick) {
            return groupFirstMessageCandidate.timestamp;
          }
        }
        lastUniqueMessageOrEvent = messageOrEvent;
        return messageOrEvent.timestamp;
      }

      return null;
    };

    return _.reduce(chatsArr, (function(groupedChatLog, messageOrEvent) {
      if (!messageOrEvent) { return groupedChatLog; }

      const groupTimestamp = getGroupTimestamp(messageOrEvent, lastUniqueMessageOrEvent);
      const { latestRating, latestRatingRequest, firstVisitorMessageSet } = this;

      if (groupTimestamp) {
        (groupedChatLog[groupTimestamp] || (groupedChatLog[groupTimestamp] = [])).push(messageOrEvent);
      }

      if (!firstVisitorMessageSet && isMessage(messageOrEvent) && !isAgent(messageOrEvent.nick)) {
        groupedChatLog[groupTimestamp].isFirstVisitorMessage = true;
        this.firstVisitorMessageSet = true;
      }

      if (messageOrEvent.type === 'chat.rating') {
        latestRating.isLastRating = false;
        messageOrEvent.isLastRating = true;
        this.latestRating = messageOrEvent;
      }

      if (messageOrEvent.type === 'chat.request.rating') {
        delete groupedChatLog[latestRatingRequest.timestamp];
        this.latestRatingRequest = messageOrEvent;
      }

      return groupedChatLog;
    }).bind({ latestRating: {}, latestRatingRequest: {}, firstVisitorMessageSet: false }), {});
  }
);

export const getShowRatingScreen = createSelector(
  [getChatRating, getRatingSettings, getAgents],
  (rating, ratingSettings, agents) => (
    !rating.value && ratingSettings.enabled && _.size(agents) > 0
  )
);

export const getLastAgentLeaveEvent = createSelector(
  [getGroupedChatLog],
  (chatLog) => {
    if (_.isEmpty(chatLog)) return;

    const logValues = _.values(chatLog);
    const payload = _.last(logValues)[0];
    const isLeaveEvent = payload.type === 'chat.memberleave';

    if (isLeaveEvent && isAgent(payload.nick)) { return payload; }
  }
);

export const getShowOfflineChat = createSelector(
  [getChatOnline, getIsChatting, getShowRatingScreen, getChats],
  (chatOnline, isChatting, showRatingScreen) => {
    return !chatOnline && !isChatting && !showRatingScreen;
  }
);
