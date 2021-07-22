import _ from 'lodash'
import { USER_EVENT } from 'src/constants/event'
import { GA_CATEGORY } from 'src/constants/shared'
import { ARTICLE_SHOWN } from 'src/embeds/answerBot/actions/root/action-types'
import { getArticleForArticleAndSessionsID } from 'src/embeds/answerBot/selectors/root'
import {
  SEARCH_REQUEST_SUCCESS,
  ARTICLE_VIEWED,
  ORIGINAL_ARTICLE_CLICKED,
} from 'src/embeds/helpCenter/actions/action-types'
import { getSearchTerm } from 'src/embeds/helpCenter/selectors'
import { getCurrentActiveArticle, getArticles } from 'src/embeds/helpCenter/selectors/index'
import {
  TICKET_SUBMISSION_REQUEST_SUCCESS,
  FORM_OPENED,
} from 'src/embeds/support/actions/action-types'
import supportRoutes from 'src/embeds/support/routes'
import { getForm } from 'src/embeds/support/selectors'
import { CAPABILTY_NAMES } from 'src/embeds/talk/constants'
import { getCapability } from 'src/embeds/talk/selectors'
import { UPDATE_WIDGET_SHOWN, UPDATE_ACTIVE_EMBED } from 'src/redux/modules/base/base-action-types'
import { getActiveEmbed, getWebWidgetOpen } from 'src/redux/modules/base/base-selectors'
import {
  SDK_CHAT_MEMBER_JOIN,
  OFFLINE_FORM_REQUEST_SUCCESS,
  SDK_CHAT_RATING,
  SDK_CHAT_COMMENT,
  PRE_CHAT_FORM_SUBMIT,
} from 'src/redux/modules/chat/chat-action-types'
import { getDepartments } from 'src/embeds/chat/selectors'
import { getAnalyticsDisabled } from 'src/redux/modules/settings/settings-selectors'
import { TALK_CALLBACK_SUCCESS } from 'src/redux/modules/talk/talk-action-types'
import { GA } from 'src/service/analytics/googleAnalytics'
import * as callbacks from 'src/service/api/callbacks'
import { isAgent } from 'src/util/chat'

const loadtime = Date.now()
const getDepartmentName = (payload, prevState) => {
  const deptId = parseInt(payload.department)

  return _.get(getDepartments(prevState)[deptId], 'name')
}

let analyticsDisabled = false

const track = (action, label, category = GA_CATEGORY) => {
  callbacks.fireFor(USER_EVENT, [{ action, properties: label, category }])
  if (analyticsDisabled) return
  GA.track(action, label, category)
}

const trackChatShown = (embed) => {
  track('Chat Opened')
  track(embedAction[embed])
}

const trackTalkShown = (embed, state) => {
  const capability = CAPABILTY_NAMES[getCapability(state)]

  track(embedAction[embed], { contactOption: capability })
}

const defaultTracker = (embed) => {
  track(embedAction[embed])
}

const embedTracker = {
  chat: trackChatShown,
  helpCenterForm: defaultTracker,
  talk: trackTalkShown,
}

const embedAction = {
  chat: 'Chat Shown',
  helpCenterForm: 'Help Center Shown',
  talk: 'Talk Shown',
}

const trackEmbedShownOnUpdateEmbed = ({ payload, prevState }) => {
  const prevEmbed = getActiveEmbed(prevState)
  const visible = getWebWidgetOpen(prevState)

  if (visible && prevEmbed !== payload) {
    const tracker = embedTracker[payload]
    if (tracker) tracker(payload, prevState)
  }
}

const trackEmbedOnOpen = (state) => {
  const embed = getActiveEmbed(state)
  const tracker = embedTracker[embed]
  if (tracker) tracker(embed, state)
}

const trackChatServedByOperator = ({ payload, isAfterLoadTime }) => {
  if (isAgent(payload.detail.nick) && isAfterLoadTime) {
    track('Chat Served by Operator', { agent: payload.detail.display_name })
  }
}

const trackChatRating = ({ payload, isAfterLoadTime }) => {
  const rating = payload.detail.new_rating

  if (isAfterLoadTime) {
    if (rating) {
      track(`Chat Rating ${_.startCase(payload.detail.new_rating)}`)
    } else {
      track('Chat Rating Removed')
    }
  }
}

const trackChatComment = ({ isAfterLoadTime }) => {
  if (isAfterLoadTime) {
    track('Chat Comment Submitted')
  }
}

const trackChatRequestFormSubmitted = ({ payload, prevState }) => {
  track('Chat Request Form Submitted', { department: getDepartmentName(payload, prevState) })
}

const trackOfflineMessageSent = ({ payload, prevState }) => {
  track('Chat Offline Message Sent', { department: getDepartmentName(payload, prevState) })
}

const trackWidgetShown = ({ payload }) => {
  if (payload === true) {
    return track('Web Widget Opened')
  } else {
    track('Web Widget Minimised')
  }
}

const trackTicketShown = ({ payload, prevState }) => {
  const form = getForm(prevState, payload.id)
  if (!form) return track('Contact Form Shown', { name: payload.id })
  track('Contact Form Shown', { id: payload.id, name: form.name })
}

const trackTicketSubmitted = ({ payload, prevState }) => {
  if (payload.name === supportRoutes.defaultFormId) {
    return track('Contact Form Submitted', { name: supportRoutes.defaultFormId })
  }
  const formId = parseInt(payload.name)
  const { id, name } = getForm(prevState, formId)
  track('Contact Form Submitted', { id, name })
}

const trackSearchRequest = ({ prevState, payload }) => {
  if (payload.isFallback) return
  const searchTerm = getSearchTerm(prevState)
  track('Help Center Search', { term: searchTerm })
}

const trackArticleViewed = ({ payload }) => {
  track('Help Center Article Viewed', { id: payload.id, name: payload.name })
}

const trackViewOriginalArticleClicked = ({ prevState }) => {
  const activeArticle = getCurrentActiveArticle(prevState)
  const { id, name } = getArticles(prevState)[activeArticle]
  track('Help Center View Original Article Clicked', { id, name })
}

const trackTalkCallbackRequest = () => {
  track('Talk Callback Request Submitted')
}

const trackAnswerbotArticleViewed = ({ payload, prevState }) => {
  const article = getArticleForArticleAndSessionsID(prevState, payload)

  track('Answer Bot Article Viewed', { id: payload.articleID, name: article?.title })
}

const events = {
  [UPDATE_ACTIVE_EMBED]: trackEmbedShownOnUpdateEmbed,
  [SDK_CHAT_MEMBER_JOIN]: trackChatServedByOperator,
  [OFFLINE_FORM_REQUEST_SUCCESS]: trackOfflineMessageSent,
  [SDK_CHAT_RATING]: trackChatRating,
  [SDK_CHAT_COMMENT]: trackChatComment,
  [PRE_CHAT_FORM_SUBMIT]: trackChatRequestFormSubmitted,
  [UPDATE_WIDGET_SHOWN]: trackWidgetShown,
  [FORM_OPENED]: trackTicketShown,
  [SEARCH_REQUEST_SUCCESS]: trackSearchRequest,
  [ARTICLE_VIEWED]: trackArticleViewed,
  [ORIGINAL_ARTICLE_CLICKED]: trackViewOriginalArticleClicked,
  [TICKET_SUBMISSION_REQUEST_SUCCESS]: trackTicketSubmitted,
  [TALK_CALLBACK_SUCCESS]: trackTalkCallbackRequest,
  [ARTICLE_SHOWN]: trackAnswerbotArticleViewed,
}

export function trackAnalytics({ getState }) {
  return (next) => (action) => {
    const { type, payload } = action
    const prevState = getState()
    analyticsDisabled = getAnalyticsDisabled(prevState)

    // To avoid resending events during the replay when the page is refreshed.
    const isAfterLoadTime = _.get(payload, 'detail.timestamp') > loadtime
    events[type]?.({ payload, prevState, isAfterLoadTime })

    const result = next(action)
    const nextState = getState()

    if (!getWebWidgetOpen(prevState) && getWebWidgetOpen(nextState)) {
      trackEmbedOnOpen(nextState)
    }
    return result
  }
}
