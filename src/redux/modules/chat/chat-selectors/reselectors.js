import _ from 'lodash';
import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';
import {
  AGENT_BOT,
  CHAT_MESSAGE_EVENTS,
  CHAT_SYSTEM_EVENTS,
  CHAT_CUSTOM_MESSAGE_EVENTS,
  WHITELISTED_SOCIAL_LOGINS,
  CONNECTION_STATUSES
} from 'constants/chat';

import { isPopout } from 'utility/globals';
import {
  getIsAuthenticated,
  getChatAccountSettingsPrechatForm,
  getRatingSettings,
  getLoginSettings,
  getZChatVendor,
  getChats,
  getOrderedAgents,
  getThemeMessageType,
  getChatVisitor,
  getOperatingHours,
  getShowOperatingHours,
  getDepartmentsList,
  getChatRating,
  getLastReadTimestamp,
  getIsChatting,
  getIsLoggingOut,
  getConnection,
  getLatestQuickReplyKey,
  getInactiveAgents,
  getChatOnline,isAgent,
} from './selectors';
import { isDefaultNickname } from 'utility/chat';

export const getPrechatFormRequired = createSelector(
  [getChatAccountSettingsPrechatForm],
  (accountSettingsPrechatForm) => {
    return accountSettingsPrechatForm.required;
  });

export const getAuthUrls = createSelector(
  [getLoginSettings, getIsAuthenticated, getZChatVendor],
  (loginSettingsObj, isAuthenticated, zChat) => {
    if (!_.get(zChat, 'getAuthLoginUrl') || isAuthenticated) return {};

    return _.reduce(loginSettingsObj.loginTypes, (accumulator, enabled, socialMedia) => {
      const whitelisted = _.includes(WHITELISTED_SOCIAL_LOGINS, socialMedia);

      if (enabled && whitelisted) {
        accumulator[socialMedia] = zChat.getAuthLoginUrl(socialMedia);
      }

      return accumulator;
    }, {});
  }
);

export const getActiveAgents = createSelector(
  getOrderedAgents,
  (orderedAgents) => {
    const arrAgents = Array.from(orderedAgents)
      .filter((agent) => agent[0] !== AGENT_BOT)
      .map((agent) => ({
        [agent[0]]: agent[1]
      }));

    return _.assign({}, ...arrAgents);
  }
);

export const getAllAgents = createSelector(
  [getActiveAgents, getInactiveAgents],
  (activeAgents, inactiveAgents) => {
    return _.extend({}, activeAgents, inactiveAgents);
  }
);

export const getAgentsTyping = (state) => {
  return _.filter(getActiveAgents(state), (agent, key) => agent.typing && key !== AGENT_BOT);
};

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
    switch (messageType) {
      case 'basic_avatar':
      case 'bubble_avatar': return true;
      default:
        return false;
    }
  }
);

export const getGroupedOperatingHours = createSelector(
  [getOperatingHours, getDepartmentsList, getShowOperatingHours],
  (operatingHours, departments, showOperatingHours) => {
    if (!showOperatingHours) {
      return { enabled: false };
    }

    if (operatingHours.department_schedule) {
      return {
        ...operatingHours,
        department_schedule: _.map(operatingHours.department_schedule, (schedule, key) => {
          const department = _.find(departments, (d) => d.id == key); // eslint-disable-line eqeqeq

          return {
            schedule,
            ...department
          };
        })
      };
    } else {
      return operatingHours;
    }
  }
);

export const getShowRatingScreen = createSelector(
  [getChatRating, getRatingSettings, getActiveAgents],
  (rating, ratingSettings, agents) => (
    !rating.value && ratingSettings.enabled && _.size(agents) > 0 && !rating.disableEndScreen
  )
);

/**
 * Return quickReplies if it is valid
 */
export const getQuickRepliesFromChatLog = createSelector(
  [getChats],
  (chats) => {
    const chatArr = Array.from(chats.values());

    return chatArr.reduce((quickReply, chat) => {
      if (chat.type === CHAT_CUSTOM_MESSAGE_EVENTS.CHAT_QUICK_REPLIES) {
        return chat;
      }

      if (quickReply &&
        _.includes(CHAT_MESSAGE_EVENTS, chat.type) ||
        chat.type === CHAT_SYSTEM_EVENTS.CHAT_EVENT_MEMBERLEAVE &&
        (
          chat.nick === (quickReply && quickReply.nick) ||
          !isAgent(chat.nick)
        )
      ) {
        quickReply = null;
      }

      return quickReply;
    }, null);
  }
);

export const getShowOfflineChat = createSelector(
  [getChatOnline, getIsChatting, getShowRatingScreen, getIsLoggingOut],
  (chatOnline, isChatting, showRatingScreen, isLoggingOut) => {
    return !chatOnline && !isChatting && !showRatingScreen && !isLoggingOut;
  }
);

export const getChatMessagesFromAgents = createSelector(
  [getChats],
  (chats) => {
    const chatsArr = Array.from(chats.values());

    return _.filter(chatsArr, (message) => (_.includes(message.nick, 'agent')
      && _.includes(CHAT_MESSAGE_EVENTS, message.type)));
  }
);

export const hasUnseenAgentMessage = createSelector(
  [getChatMessagesFromAgents, getLastReadTimestamp],
  (messages, timestamp) => !timestamp || !!_.find(messages, message => message.timestamp > timestamp)
);

export const getShowUpdateVisitorDetails = createSelector(
  getLoginSettings,
  getChatVisitor,
  (loginSettings, visitor) => {
    const visitorNameSet = visitor.display_name && !isDefaultNickname(visitor.display_name);
    const emailSet = !!visitor.email;

    return !!loginSettings.enabled && !(visitorNameSet || emailSet);
  }
);

export const getDepartment = (state, department) => {
  return _.find(getDepartmentsList(state), (dept) => {
    if (_.isString(department)) {
      return dept.name === department;
    } else {
      return dept.id === department;
    }
  });
};

export const getChatsLength = createSelector(
  [getChats],
  (chats) => chats.size
);

export const getGroupMessages = createCachedSelector(
  getChats,
  (state, messageKeys) => messageKeys,
  (chats, messageKeys) => _.map(messageKeys, (key) => chats.get(key))
)(
  (state, messageKeys) => messageKeys[messageKeys.length - 1]
);

export const getEventMessage = createCachedSelector(
  getChats,
  (state, messageKey) => messageKey,
  (chats, messageKey) => chats.get(messageKey)
)(
  (state, messageKey) => messageKey
);

export const getLatestQuickReply = createSelector(
  getChats,
  getLatestQuickReplyKey,
  (chats, latestQuickReply) => chats.get(latestQuickReply)
);

export const getIsPopoutAvailable = (state) =>
  !getIsAuthenticated(state) &&
  getChatOnline(state) &&
  !isPopout();

export const getChatConnected = (state) => getConnection(state) === CONNECTION_STATUSES.CONNECTED;
export const getChatConnectionClosed = (state) => getConnection(state) === CONNECTION_STATUSES.CLOSED;
// Chat connection will be closed when banned
export const getChatBanned = (state) => getChatConnectionClosed(state) && getZChatVendor(state).isBanned();
export const getConnectionClosedReason = (state) =>
  getChatConnectionClosed(state) ? getZChatVendor(state).getConnectionClosedReason() : '';
