import { i18n } from 'classicSrc/app/webWidget/services/i18n'
import { ANSWER_BOT_ORIGINAL_ARTICLE_CLICKED } from 'classicSrc/embeds/answerBot/actions/article/action-types'
import {
  CONTEXTUAL_ARTICLE_SHOWN,
  ARTICLE_SHOWN,
  SCREEN_CHANGED,
} from 'classicSrc/embeds/answerBot/actions/root/action-types'
import { ARTICLE_SCREEN, CONVERSATION_SCREEN } from 'classicSrc/embeds/answerBot/constants'
import {
  getCurrentArticleID,
  getCurrentQuery,
  getCurrentDeflection,
  getCurrentScreen,
} from 'classicSrc/embeds/answerBot/selectors/root'
import { getSessionByID } from 'classicSrc/embeds/answerBot/selectors/sessions'
import { getIsChatting } from 'classicSrc/embeds/chat/selectors'
import {
  ARTICLE_VIEWED,
  ORIGINAL_ARTICLE_CLICKED,
  SEARCH_REQUEST_SUCCESS,
  SEARCH_REQUEST_FAILURE,
} from 'classicSrc/embeds/helpCenter/actions/action-types'
import {
  getTotalUserSearches,
  getResultsCount,
  getSearchId,
  getSearchTerm,
  getCurrentActiveArticle,
  getHasContextuallySearched,
} from 'classicSrc/embeds/helpCenter/selectors'
import { TALK_CALLBACK_SUCCESS } from 'classicSrc/embeds/talk/action-types'
import {
  getTalkEmbeddableConfig,
  getAgentAvailability,
  getFormState,
  getAverageWaitTime,
} from 'classicSrc/embeds/talk/selectors'
import {
  UPDATE_ACTIVE_EMBED,
  UPDATE_WIDGET_SHOWN,
  LAUNCHER_CLICKED,
} from 'classicSrc/redux/modules/base/base-action-types'
import { getWebWidgetOpen, getActiveEmbed } from 'classicSrc/redux/modules/base/base-selectors'
import { CHAT_STARTED } from 'classicSrc/redux/modules/chat/chat-action-types'
import { getDefaultSelectedDepartment } from 'classicSrc/redux/modules/selectors'
import hcStats from 'classicSrc/service/hcStats'
import { beacon } from '@zendesk/widget-shared-services/beacon'

let talkOpenedBlipSent = false
let chatOpenedBlipSent = false

const createTalkBlipData = (state, phone) => {
  const { nickname, supportedCountries } = getTalkEmbeddableConfig(state)

  return {
    supportedCountries: supportedCountries,
    nickname: nickname,
    phoneNumber: phone,
    averageWaitTime: getAverageWaitTime(state),
    agentAvailability: getAgentAvailability(state),
    locale: i18n.getLocale(),
  }
}

const getArticleClickValues = (state, articleId, answerBot) => {
  const resultsCount = getResultsCount(state)
  const searchId = getSearchId(state)
  const trackPayload = {
    query: getSearchTerm(state),
    resultsCount: resultsCount,
    uniqueSearchResultClick: !getCurrentActiveArticle(state),
    articleId,
    locale: i18n.getLocale(),
    searchId: searchId,
    contextualSearch: getHasContextuallySearched(state),
    answerBot: Boolean(answerBot),
  }

  return trackPayload
}

const sendTalkCallbackRequestBlip = (state) => {
  const { phone, name, email, description } = getFormState(state)
  let value = createTalkBlipData(state, phone)

  value.user = {
    description: description,
    name: name,
    email: email,
  }
  beacon.trackUserAction('talk', 'request', {
    label: 'callbackForm',
    value: value,
  })
}

const sendTalkOpenedBlip = (state) => {
  const value = createTalkBlipData(state, getTalkEmbeddableConfig(state).phoneNumber)

  beacon.trackUserAction('talk', 'opened', {
    label: 'phoneNumber',
    value: value,
  })
}

const sendChatOpenedBlip = () => {
  beacon.trackUserAction('chat', 'opened', { label: 'newChat' })
}

const sendHelpCenterFirstSearchBlip = (state) => {
  if (getTotalUserSearches(state) === 0) {
    beacon.trackUserAction('helpCenter', 'search', {
      label: 'helpCenterForm',
      value: getSearchTerm(state),
    })
  }
}

const sendArticleClickedBlip = (state, latestArticle) => {
  if (latestArticle) {
    const values = getArticleClickValues(state, latestArticle.id)
    Object.assign(values, { rank: latestArticle.rank, url: latestArticle.url })

    beacon.trackUserAction('helpCenter', 'click', {
      label: 'helpCenterForm',
      value: values,
    })

    hcStats.articleViewed(latestArticle.id, latestArticle.locale, values)
  }
}

const sendHelpCenterOriginalArticleClickedBlip = (state) => {
  const article = getCurrentActiveArticle(state)

  sendOriginalArticleClickedBlip(state, article)
}

const sendOriginalArticleClickedBlip = (state, articleId, answerBot) => {
  const value = getArticleClickValues(state, articleId, answerBot)

  beacon.trackUserAction('helpCenter', 'viewOriginalArticle', {
    label: 'helpCenterForm',
    value: value,
  })
}

const sendAnswerBotUserNavigation = (prevState, payload) => {
  const prevAnswerBotScreen = getCurrentScreen(prevState)

  if (prevAnswerBotScreen === ARTICLE_SCREEN && payload === CONVERSATION_SCREEN) {
    const blipValue = {
      from: ARTICLE_SCREEN,
      to: CONVERSATION_SCREEN,
    }

    beacon.trackUserAction('answerBot', 'userNavigation', {
      label: 'journey',
      value: blipValue,
    })
  }
}

const sendAnswerBotContextualArticleClickedBlip = (state, payload) => {
  const { articleID } = payload
  const trackPayload = {
    query: getSearchTerm(state),
    resultsCount: getResultsCount(state),
    contextualSearch: true,
    articleId: articleID,
    locale: i18n.getLocale(),
    uniqueSearchResultClick: false,
    answerBot: true,
  }

  beacon.trackUserAction('helpCenter', 'click', {
    label: 'helpCenterForm',
    value: trackPayload,
  })
}

const sendAnswerBotArticleClickedBlip = (state, payload) => {
  const { articleID, sessionID } = payload
  const session = getSessionByID(state, sessionID)
  const trackPayload = {
    query: session.query,
    resultsCount: session.articles.length,
    deflectionId: session.deflection.id,
    articleId: articleID,
    locale: i18n.getLocale(),
    uniqueSearchResultClick: false,
    answerBot: true,
  }

  beacon.trackUserAction('helpCenter', 'click', {
    label: 'helpCenterForm',
    value: trackPayload,
  })
}

const sendChannelChoiceBlip = (state, payload) => {
  if (getActiveEmbed(state) === 'answerBot') {
    const deflection = getCurrentDeflection(state)

    beacon.trackUserAction('answerBot', 'channelClicked', {
      label: 'channelChoice',
      value: {
        query: getCurrentQuery(state),
        deflectionId: deflection && deflection.id,
        channel: payload,
      },
    })
  }
}

const sendArticleClosedBlip = (state) => {
  const screen = getCurrentScreen(state)

  if (screen === ARTICLE_SCREEN) {
    beacon.trackUserAction('answerBot', 'articleClosed', {
      label: 'helpCenterForm',
      value: {
        articleId: getCurrentArticleID(state),
      },
    })
  }
}

const sendLauncherClickBlip = (state) => {
  const activeEmbed = getActiveEmbed(state)

  beacon.trackUserAction('launcher', 'click', {
    label: 'launcher',
    value: { embedOpen: activeEmbed },
  })
}

const sendChatStartedBlip = (state) => {
  const department = getDefaultSelectedDepartment(state)

  beacon.trackUserAction('chat', 'chatStarted', {
    label: 'newChat',
    value: {
      departmentName: department ? department.name : null,
      departmentId: department ? department.id : null,
    },
  })
}

export function sendBlips({ getState }) {
  return (next) => (action) => {
    const { type, payload } = action
    const prevState = getState()

    switch (type) {
      case SCREEN_CHANGED:
        sendAnswerBotUserNavigation(prevState, payload)
        break
      case CONTEXTUAL_ARTICLE_SHOWN:
        sendAnswerBotContextualArticleClickedBlip(prevState, payload)
        break
      case ARTICLE_SHOWN:
        sendAnswerBotArticleClickedBlip(prevState, payload)
        break
      case CHAT_STARTED:
        sendChatStartedBlip(getState())
        break
      case TALK_CALLBACK_SUCCESS:
        sendTalkCallbackRequestBlip(prevState)
        break
      case UPDATE_ACTIVE_EMBED:
        if (!getWebWidgetOpen(prevState)) {
          break
        }

        if (payload === 'talk' && !talkOpenedBlipSent) {
          sendTalkOpenedBlip(prevState)
          talkOpenedBlipSent = true
        }

        const isChatting = getIsChatting(prevState)

        if (!isChatting && payload === 'chat' && !chatOpenedBlipSent) {
          sendChatOpenedBlip()
          chatOpenedBlipSent = true
        }
        sendChannelChoiceBlip(prevState, payload)
        break
      case ARTICLE_VIEWED:
        sendArticleClickedBlip(prevState, payload)
        break
      case SEARCH_REQUEST_SUCCESS:
      case SEARCH_REQUEST_FAILURE:
        sendHelpCenterFirstSearchBlip(prevState)
        break
      case LAUNCHER_CLICKED:
        sendLauncherClickBlip(prevState)
        break
      case ORIGINAL_ARTICLE_CLICKED:
        sendHelpCenterOriginalArticleClickedBlip(prevState)
        break
      case ANSWER_BOT_ORIGINAL_ARTICLE_CLICKED:
        sendOriginalArticleClickedBlip(prevState, action.payload.articleId, true)
        break
      case UPDATE_WIDGET_SHOWN:
        if (payload === false) {
          sendArticleClosedBlip(prevState)
        }
        break
    }
    return next(action)
  }
}
