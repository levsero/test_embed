import _ from 'lodash';
import { createSelector } from 'reselect';
import { AGENT_BOT, CHAT_MESSAGE_EVENTS, CHAT_SYSTEM_EVENTS } from 'constants/chat';
import { CHATTING_SCREEN } from './chat-screen-types';

import { i18n } from 'service/i18n';
import { getActiveEmbed } from 'src/redux/modules/base/base-selectors';

const getFormFields = (settings) => {
  const { form } = settings;

  return _.keyBy(_.values(form), 'name');
};

const isAgent = (nick) => nick ? nick.indexOf('agent:') > -1 : false;

const getChats = (state) => state.chat.chats;
const getNotification = (state) => state.chat.notification;
const getThemeMessageType = (state) => state.chat.accountSettings.theme.message_type;
const getOrderedAgents = (state) => state.chat.agents;
const getFirstAgent = (state) => getOrderedAgents(state).values().next().value;
const getConciergeSettings = (state) => state.chat.accountSettings.concierge;

export const getAgentsTyping = (state) => _.filter(getAgents(state), (agent, key) => agent.typing && key !== AGENT_BOT);
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
export const getStandaloneMobileNotificationVisible = (state) => state.chat.standaloneMobileNotificationVisible;

export const getAgents = createSelector(
  getOrderedAgents,
  (orderedAgents) => {
    const arrAgents = Array.from(orderedAgents)
        .map((agent) => ({ [agent[0]]: agent[1] }));

    return Object.assign({}, ...arrAgents);
  }
);

export const getCurrentConcierge = createSelector(
  [getFirstAgent, getConciergeSettings],
  (firstAgent, conciergeSettings) => {
    if (!firstAgent) {
      return conciergeSettings;
    }
    if (!firstAgent.avatar_path) {
      return {
        ...firstAgent,
        avatar_path: conciergeSettings.avatar_path
      };
    }
    return firstAgent;
  }
);

export const getIsProactiveSession = (state) => {
  const chats = Array.from(getChats(state).values());
  let foundAgentMessage = false;

  // start from most recent message and go back in time until we can determine if session is proactive
  for (let i = chats.length - 1; i >= 0; i--) {
    const msg = chats[i];
    const isVisitor = msg.nick && msg.nick.indexOf('visitor') > -1;

    if (isVisitor) {
      // if a visitor leaves, chat session has ended and we check foundAgentMessage to determine if proactive
      if (msg.type === CHAT_SYSTEM_EVENTS.CHAT_EVENT_MEMBERLEAVE) break;
      // any event except for memberjoin from a visitor means visitor has interacted, hence session is not proactive
      if (msg.type !== CHAT_SYSTEM_EVENTS.CHAT_EVENT_MEMBERJOIN) return false;
    }

    if (_.includes(CHAT_MESSAGE_EVENTS, msg.type) && isAgent(msg.nick)) {
      foundAgentMessage = true;
    }
  }

  return foundAgentMessage;
};

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
  [getNotification, getAgents],
  (notification, agents) => ({ ...notification, ...agents[notification.nick] })
);

export const getOfflineFormFields = createSelector(
  [getOfflineFormSettings],
  getFormFields
);

export const getDepartments = (state) => state.chat.departments;

const getDepartmentsList = (state) => _.values(state.chat.departments);

export const getPrechatFormFields = createSelector(
  [getPrechatFormSettings, getDepartmentsList, getOfflineFormSettings],
  (prechatSettings, departments, offlineFormSettings) => {
    const formsByKey = getFormFields(prechatSettings);
    const departmentOptions = _.map(departments, (department) => {
      let dept = {
        ...department,
        value: department.id
      };

      if (department.status === 'offline') {
        if (!offlineFormSettings.enabled) {
          dept.disabled = true;
        }
        dept.name = i18n.t('embeddable_framework.chat.department.offline.label', { department: department.name });
      }

      return dept;
    });

    return _.extend({}, formsByKey, { departments: departmentOptions });
  }
);

export const getGroupedOperatingHours = createSelector(
  [getOperatingHours, getDepartmentsList],
  (operatingHours, departments) => {
    if (operatingHours.department_schedule) {
      return {
        ...operatingHours,
        department_schedule: _.map(operatingHours.department_schedule, (schedule, key) => {
          const department = _.find(departments, (d) => d.id == key); // eslint-disable-line eqeqeq

          return {
            ...schedule,
            ...department
          };
        })
      };
    } else {
      return operatingHours;
    }
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
