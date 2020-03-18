import _ from 'lodash'
import { GA } from 'service/analytics/googleAnalytics'
import { UPDATE_WIDGET_SHOWN, UPDATE_ACTIVE_EMBED } from 'src/redux/modules/base/base-action-types'
import {
  SEARCH_REQUEST_SUCCESS,
  ARTICLE_VIEWED,
  ORIGINAL_ARTICLE_CLICKED
} from 'embeds/helpCenter/actions/action-types'
import {
  SDK_CHAT_MEMBER_JOIN,
  OFFLINE_FORM_REQUEST_SUCCESS,
  SDK_CHAT_RATING,
  SDK_CHAT_COMMENT,
  PRE_CHAT_FORM_SUBMIT
} from 'src/redux/modules/chat/chat-action-types'
import { getCurrentActiveArticle, getArticles } from 'src/embeds/helpCenter/selectors/index'
import { TALK_CALLBACK_SUCCESS } from 'src/redux/modules/talk/talk-action-types'
import { getDepartments } from 'src/redux/modules/chat/chat-selectors'
import { getAnalyticsDisabled } from 'src/redux/modules/settings/settings-selectors'
import { getActiveEmbed, getWebWidgetVisible } from 'src/redux/modules/base/base-selectors'
import { isAgent } from 'src/util/chat'
import {
  TICKET_SUBMISSION_REQUEST_SUCCESS,
  FORM_OPENED
} from 'src/embeds/support/actions/action-types'
import { CAPABILTY_NAMES } from 'src/embeds/talk/constants'
import { getSearchTerm } from 'embeds/helpCenter/selectors'
import { getCapability } from 'src/embeds/talk/selectors/selectors'
import { getForm } from 'src/embeds/support/selectors'
const loadtime = Date.now()
const getDepartmentName = (payload, prevState) => {
  const deptId = parseInt(payload.department)

  return _.get(getDepartments(prevState)[deptId], 'name')
}

const trackChatShown = embed => {
  GA.track('Chat Opened')
  GA.track(embedAction[embed])
}

const trackTalkShown = (embed, state) => {
  const capability = CAPABILTY_NAMES[getCapability(state)]

  GA.track(embedAction[embed], capability)
}

const defaultTracker = embed => {
  GA.track(embedAction[embed])
}

const embedTracker = {
  chat: trackChatShown,
  helpCenterForm: defaultTracker,
  talk: trackTalkShown
}

const embedAction = {
  chat: 'Chat Shown',
  helpCenterForm: 'Help Center Shown',
  talk: 'Talk Shown'
}

const trackEmbedShownOnUpdateEmbed = (payload, prevState) => {
  const prevEmbed = getActiveEmbed(prevState)
  const visible = getWebWidgetVisible(prevState)

  if (visible && prevEmbed !== payload) {
    const tracker = embedTracker[payload]
    if (tracker) tracker(payload, prevState)
  }
}

const trackEmbedOnOpen = state => {
  const embed = getActiveEmbed(state)
  const tracker = embedTracker[embed]
  if (tracker) tracker(embed, state)
}

const trackChatServedByOperator = (payload, isAfterLoadTime) => {
  if (isAgent(payload.detail.nick) && isAfterLoadTime) {
    GA.track('Chat Served by Operator', payload.detail.display_name)
  }
}

const trackChatRating = (payload, isAfterLoadTime) => {
  const rating = payload.detail.new_rating

  if (isAfterLoadTime) {
    if (rating) {
      GA.track(`Chat Rating ${_.startCase(payload.detail.new_rating)}`)
    } else {
      GA.track('Chat Rating Removed')
    }
  }
}

const trackChatComment = isAfterLoadTime => {
  if (isAfterLoadTime) {
    GA.track('Chat Comment Submitted')
  }
}

const trackChatRequestFormSubmitted = (payload, prevState) => {
  GA.track('Chat Request Form Submitted', getDepartmentName(payload, prevState))
}

const trackOfflineMessageSent = (payload, prevState) => {
  GA.track('Chat Offline Message Sent', getDepartmentName(payload, prevState))
}

const trackWidgetShown = payload => {
  if (payload === true) {
    return GA.track('Web Widget Opened')
  } else {
    GA.track('Web Widget Minimised')
  }
}

const trackTicketShown = (payload, prevState) => {
  const form = getForm(prevState, payload.id)
  if (!form) return GA.track('Contact Form Shown', { id: payload.id })
  GA.track('Contact Form Shown', { id: payload.id, name: form.name })
}

const trackTicketSubmitted = (payload, state) => {
  const formId = parseInt(payload.name)
  const { id, name } = getForm(state, formId)
  GA.track('Contact Form Submitted', { id, name })
}

const trackSearchRequest = (payload, state) => {
  const searchTerm = getSearchTerm(state)
  GA.track('Help Center Search', searchTerm)
}

const trackArticleViewed = payload => {
  GA.track('Help Center Article Viewed', { id: payload.id, name: payload.name })
}

const trackViewOriginalArticleClicked = (payload, state) => {
  const activeArticle = getCurrentActiveArticle(state)
  const { id, name } = getArticles(state)[activeArticle]
  GA.track('Help Center View Original Article Clicked', { id, name })
}

const trackTalkCallbackRequest = () => {
  GA.track('Talk Callback Request Submitted')
}

export function trackAnalytics({ getState }) {
  return next => action => {
    const { type, payload } = action
    const prevState = getState()

    if (getAnalyticsDisabled(prevState)) {
      return next(action)
    }

    // To avoid resending events during the replay when the page is refreshed.
    const isAfterLoadTime = _.get(payload, 'detail.timestamp') > loadtime

    switch (type) {
      case UPDATE_ACTIVE_EMBED:
        trackEmbedShownOnUpdateEmbed(payload, prevState)
        break
      case SDK_CHAT_MEMBER_JOIN:
        trackChatServedByOperator(payload, isAfterLoadTime)
        break
      case OFFLINE_FORM_REQUEST_SUCCESS:
        trackOfflineMessageSent(payload, prevState)
        break
      case SDK_CHAT_RATING:
        trackChatRating(payload, isAfterLoadTime)
        break
      case SDK_CHAT_COMMENT:
        trackChatComment(isAfterLoadTime)
        break
      case PRE_CHAT_FORM_SUBMIT:
        trackChatRequestFormSubmitted(payload, prevState)
        break
      case UPDATE_WIDGET_SHOWN:
        trackWidgetShown(payload, prevState)
        break
      case FORM_OPENED:
        trackTicketShown(payload, prevState)
        break
      case SEARCH_REQUEST_SUCCESS:
        trackSearchRequest(payload, prevState)
        break
      case ARTICLE_VIEWED:
        trackArticleViewed(payload)
        break
      case ORIGINAL_ARTICLE_CLICKED:
        trackViewOriginalArticleClicked(payload, prevState)
        break
      case TICKET_SUBMISSION_REQUEST_SUCCESS:
        trackTicketSubmitted(payload, prevState)
        break
      case TALK_CALLBACK_SUCCESS:
        trackTalkCallbackRequest()
        break
    }
    const result = next(action)
    const nextState = getState()

    if (!getWebWidgetVisible(prevState) && getWebWidgetVisible(nextState)) {
      trackEmbedOnOpen(nextState)
    }
    return result
  }
}
