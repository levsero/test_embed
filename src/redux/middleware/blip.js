import { TALK_CALLBACK_SUCCESS } from 'src/redux/modules/talk/talk-action-types';
import { UPDATE_ACTIVE_EMBED } from 'src/redux/modules/base/base-action-types';
import { ARTICLE_CLICKED,
         ORIGINAL_ARTICLE_CLICKED,
         SEARCH_REQUEST_SUCCESS,
         SEARCH_REQUEST_FAILURE } from 'src/redux/modules/helpCenter/helpCenter-action-types';
import { beacon } from 'service/beacon';
import { getEmbeddableConfig,
         getAgentAvailability,
         getFormState,
         getAverageWaitTime } from 'src/redux/modules/talk/talk-selectors';
import { getTotalUserSearches,
         getResultsCount,
         getSearchTerm,
         getArticleClicked,
         getActiveArticle } from 'src/redux/modules/helpCenter/helpCenter-selectors';
import { i18n } from 'service/i18n';

const createTalkBlipData = (state, phone) => {
  const { keywords, groupName, supportedCountries } = getEmbeddableConfig(state);

  return {
    supportedCountries: supportedCountries,
    groupName: groupName,
    keywords: keywords,
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
    locale: i18n.getLocale()
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
  beacon.trackUserAction('talk', 'request', 'callbackForm', value);
};

const sendTalkOpenedBlip = (state) => {
  const value = createTalkBlipData(state, getEmbeddableConfig(state).phoneNumber);

  beacon.trackUserAction('talk', 'opened', 'phoneNumber', value);
};

const sendHelpCenterFirstSearchBlip = (state) => {
  if (getTotalUserSearches(state) === 0) {
    beacon.trackUserAction('helpCenter', 'search', 'helpCenterForm', getSearchTerm(state));
  }
};

const sendArticleClickedBlip = (state, latestArticle) => {
  if (latestArticle) {
    beacon.trackUserAction('helpCenter', 'click', 'helpCenterForm', getArticleClickValues(state, latestArticle));
  }
};

const sendOriginalArticleClickedBlip = (state) => {
  const value = getArticleClickValues(state, getActiveArticle(state));

  beacon.trackUserAction('helpCenter', 'viewOriginalArticle', 'helpCenterForm', value);
};

export function sendBlips({ getState }) {
  return (next) => (action) => {
    const { type, payload } = action;
    const prevState = getState();

    switch (type) {
      case TALK_CALLBACK_SUCCESS:
        sendTalkCallbackRequestBlip(prevState);
        break;
      case UPDATE_ACTIVE_EMBED:
        if (payload === 'talk') {
          sendTalkOpenedBlip(prevState);
        }
        break;
      case ARTICLE_CLICKED:
        sendArticleClickedBlip(prevState, payload);
        break;
      case SEARCH_REQUEST_SUCCESS:
      case SEARCH_REQUEST_FAILURE:
        sendHelpCenterFirstSearchBlip(prevState);
        break;
      case ORIGINAL_ARTICLE_CLICKED:
        sendOriginalArticleClickedBlip(prevState);
        break;
    }
    return next(action);
  };
}
