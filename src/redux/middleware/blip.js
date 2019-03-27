import { TALK_CALLBACK_SUCCESS } from 'src/redux/modules/talk/talk-action-types';
import {
  UPDATE_ACTIVE_EMBED,
  UPDATE_WIDGET_SHOWN,
  LAUNCHER_CLICKED
} from 'src/redux/modules/base/base-action-types';
import {
  ARTICLE_CLICKED,
  ORIGINAL_ARTICLE_CLICKED,
  SEARCH_REQUEST_SUCCESS,
  SEARCH_REQUEST_FAILURE
} from 'src/redux/modules/helpCenter/helpCenter-action-types';
import { ARTICLE_SHOWN, SCREEN_CHANGED } from 'src/redux/modules/answerBot/root/action-types';
import { beacon } from 'service/beacon';
import {
  getEmbeddableConfig,
  getAgentAvailability,
  getFormState,
  getAverageWaitTime
} from 'src/redux/modules/talk/talk-selectors';
import {
  getTotalUserSearches,
  getResultsCount,
  getSearchTerm,
  getArticleClicked,
  getActiveArticle,
  getHasContextuallySearched
} from 'src/redux/modules/helpCenter/helpCenter-selectors';
import { getIsChatting } from 'src/redux/modules/chat/chat-selectors';
import { getWebWidgetVisible, getActiveEmbed } from 'src/redux/modules/base/base-selectors';
import { getSessionByID } from 'src/redux/modules/answerBot/sessions/selectors';
import {
  getCurrentArticleID,
  getCurrentQuery,
  getCurrentDeflection,
  getCurrentScreen
} from 'src/redux/modules/answerBot/root/selectors';
import { ZOPIM_ON_OPEN } from 'src/redux/modules/zopimChat/zopimChat-action-types';
import { i18n } from 'service/i18n';

import { ARTICLE_SCREEN, CONVERSATION_SCREEN } from 'src/constants/answerBot';

let talkOpenedBlipSent = false;
let chatOpenedBlipSent = false;

const createTalkBlipData = (state, phone) => {
  const { nickname, supportedCountries } = getEmbeddableConfig(state);

  return {
    supportedCountries: supportedCountries,
    nickname: nickname,
    phoneNumber: phone,
    averageWaitTime: getAverageWaitTime(state),
    agentAvailability: getAgentAvailability(state),
    locale: i18n.getLocale()
  };
};

const getArticleClickValues = (state, activeArticle) => {
  const resultsCount = getResultsCount(state);
  const trackPayload = {
    query: getSearchTerm(state),
    resultsCount: (resultsCount > 3) ? 3 : resultsCount,
    uniqueSearchResultClick: !getArticleClicked(state),
    articleId: activeArticle.id,
    locale: i18n.getLocale(),
    contextualSearch: getHasContextuallySearched(state)
  };

  return trackPayload;
};

const sendTalkCallbackRequestBlip = (state) => {
  const { phone, name, email, description } = getFormState(state);
  let value = createTalkBlipData(state, phone);

  value.user = {
    description: description,
    name: name,
    email: email
  };
  beacon.trackUserAction('talk', 'request', {
    label: 'callbackForm',
    value: value
  });
};

const sendTalkOpenedBlip = (state) => {
  const value = createTalkBlipData(state, getEmbeddableConfig(state).phoneNumber);

  beacon.trackUserAction('talk', 'opened', {
    label: 'phoneNumber',
    value: value
  });
};

const sendChatOpenedBlip = () => {
  beacon.trackUserAction('chat', 'opened', { label: 'newChat' });
};

const sendZopimChatOpenedBlip = () => {
  beacon.trackUserAction('chat', 'opened', { label: 'zopimChat' });
};

const sendHelpCenterFirstSearchBlip = (state) => {
  if (getTotalUserSearches(state) === 0) {
    beacon.trackUserAction('helpCenter', 'search', {
      label: 'helpCenterForm',
      value: getSearchTerm(state)
    });
  }
};

const sendArticleClickedBlip = (state, latestArticle) => {
  if (latestArticle) {
    beacon.trackUserAction('helpCenter', 'click', {
      label: 'helpCenterForm',
      value: getArticleClickValues(state, latestArticle)
    });
  }
};

const sendOriginalArticleClickedBlip = (state) => {
  const value = getArticleClickValues(state, getActiveArticle(state));

  beacon.trackUserAction('helpCenter', 'viewOriginalArticle', {
    label: 'helpCenterForm',
    value: value
  });
};

const sendAnswerBotUserNavigation = (prevState, payload) => {
  const prevAnswerBotScreen = getCurrentScreen(prevState);

  if (prevAnswerBotScreen === ARTICLE_SCREEN && payload === CONVERSATION_SCREEN) {
    const blipValue = {
      from: ARTICLE_SCREEN,
      to: CONVERSATION_SCREEN
    };

    beacon.trackUserAction('answerBot', 'userNavigation', {
      label: 'journey',
      value: blipValue
    });
  }
};

const sendAnswerBotArticleClickedBlip = (state, payload) => {
  const { sessionID, articleID } = payload;
  const session = getSessionByID(state, sessionID);
  const trackPayload = {
    query: session.query,
    resultsCount: session.articles.length,
    articleId: articleID,
    locale: i18n.getLocale(),
    deflectionId: session.deflection.id,
    uniqueSearchResultClick: false,
    answerBot: true
  };

  beacon.trackUserAction('helpCenter', 'click', {
    label: 'helpCenterForm',
    value: trackPayload
  });
};

const sendChannelChoiceBlip = (state, payload) => {
  if (getActiveEmbed(state) === 'answerBot') {
    const deflection = getCurrentDeflection(state);

    beacon.trackUserAction('answerBot', 'channelClicked', {
      label: 'channelChoice',
      value: {
        query: getCurrentQuery(state),
        deflectionId: deflection && deflection.id,
        channel: payload
      }
    });
  }
};

const sendArticleClosedBlip = (state) => {
  const screen = getCurrentScreen(state);

  if (screen === ARTICLE_SCREEN) {
    beacon.trackUserAction('answerBot', 'articleClosed', {
      label: 'helpCenterForm',
      value: {
        articleId: getCurrentArticleID(state)
      }
    });
  }
};

const sendLauncherClickBlip = (state) => {
  const activeEmbed = getActiveEmbed(state);

  beacon.trackUserAction('launcher', 'click', {
    label: 'launcher',
    value: { embedOpen: activeEmbed }
  });
};

export const sendZopimImplicitConsentBlip = () => {
  beacon.trackUserAction('chat', 'cookieLaw', {
    label: 'zopimChat',
    value: 'implicitConsent',
    channel: 'zopim'
  });
};

export const sendZopimComplyBlip = () => {
  beacon.trackUserAction('chat', 'cookieLaw', {
    label: 'zopimChat',
    value: 'comply',
    channel: 'zopim'
  });
};

export function sendBlips({ getState }) {
  return (next) => (action) => {
    const { type, payload } = action;
    const prevState = getState();

    switch (type) {
      case SCREEN_CHANGED:
        sendAnswerBotUserNavigation(prevState, payload);
        break;
      case ARTICLE_SHOWN:
        sendAnswerBotArticleClickedBlip(prevState, payload);
        break;
      case TALK_CALLBACK_SUCCESS:
        sendTalkCallbackRequestBlip(prevState);
        break;
      case UPDATE_ACTIVE_EMBED:
        if (!getWebWidgetVisible(prevState)) {
          break;
        }

        if (payload === 'talk' && !talkOpenedBlipSent) {
          sendTalkOpenedBlip(prevState);
          talkOpenedBlipSent = true;
        }

        const isChatting = getIsChatting(prevState);

        if (!isChatting && payload === 'chat' && !chatOpenedBlipSent) {
          sendChatOpenedBlip();
          chatOpenedBlipSent = true;
        }
        sendChannelChoiceBlip(prevState, payload);
        break;
      case ARTICLE_CLICKED:
        sendArticleClickedBlip(prevState, payload);
        break;
      case SEARCH_REQUEST_SUCCESS:
      case SEARCH_REQUEST_FAILURE:
        sendHelpCenterFirstSearchBlip(prevState);
        break;
      case LAUNCHER_CLICKED:
        sendLauncherClickBlip(prevState);
        break;
      case  ZOPIM_ON_OPEN:
        if (!chatOpenedBlipSent) {
          sendZopimChatOpenedBlip();
          chatOpenedBlipSent = true;
        }
        break;
      case ORIGINAL_ARTICLE_CLICKED:
        sendOriginalArticleClickedBlip(prevState);
        break;
      case UPDATE_WIDGET_SHOWN:
        if (payload === false) {
          sendArticleClosedBlip(prevState);
        }
        break;
    }
    return next(action);
  };
}
