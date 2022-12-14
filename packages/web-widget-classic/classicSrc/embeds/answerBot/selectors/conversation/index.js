import { i18n } from 'classicSrc/app/webWidget/services/i18n'
import { getSessions } from 'classicSrc/embeds/answerBot/selectors/sessions'
import { getLocale } from 'classicSrc/redux/modules/base/base-selectors'
import _ from 'lodash'
import { createSelector } from 'reselect'

const getState = (state) => state.answerBot
const getConversation = (state) => state.answerBot.conversation
const getGroupMessages = (state, props) =>
  props.messageKeys.map((key) => getMessages(state).get(key))
const appendGroup = (groups, group) => {
  groups[Object.keys(groups).length] = group
}

const getRawMessages = createSelector([getState], (state) => state.messages)

export const getMessages = createSelector([getRawMessages, getLocale], (rawMessages, _locale) => {
  const translatedMessages = new Map()

  rawMessages.forEach((val, key) => {
    if (val.message && typeof val.message === 'object') {
      // a translation object is present
      translatedMessages.set(key, {
        ...val,
        message: i18n.t(val.message.key, val.message.interpolation),
      })
    } else {
      translatedMessages.set(key, val)
    }
  })
  return translatedMessages
})

export const getLastMessage = createSelector(getMessages, (messages) => {
  const size = messages.size

  return size === 0 ? null : Array.from(messages)[size - 1][1]
})

export const getLastMessageType = createSelector(getLastMessage, (message) =>
  _.get(message, 'type', '')
)

// Group consecutive messages by isVisitor.
// Only store the message keys
export const getMessageGroupKeys = createSelector(getMessages, (groupMessages) => {
  let groups = {}
  let currentGroup = { messageKeys: [], isVisitor: undefined }
  let feedbackMode = false
  let feedbackChain = []
  let lastEntry

  for (let entry of groupMessages) {
    const message = entry[1]

    lastEntry = entry
    if (message.type === 'botTyping') {
      continue
    }

    if (feedbackMode) {
      if (message.type === 'feedback' || message.feedbackRelated) {
        feedbackChain.push(entry)
        continue
      } else if (message.type !== 'feedbackRequested') {
        currentGroup = appendFeedback(feedbackChain, currentGroup, groups)
        feedbackMode = false
        feedbackChain = []
      }
    }

    if (message.type === 'feedbackRequested') {
      feedbackMode = true
      feedbackChain = []
      continue
    }

    currentGroup = updateGroups(currentGroup, groups, entry)
  }

  if (feedbackChain.length > 0) {
    currentGroup = appendFeedback(feedbackChain, currentGroup, groups)
  }
  if (lastEntry && lastEntry[1].type === 'botTyping') {
    currentGroup = updateGroups(currentGroup, groups, lastEntry)
  }
  appendGroup(groups, currentGroup)
  return groups
})

const userHasResponded = (message) => {
  return message && message[1].feedbackRelated && message[1].isVisitor
}

const appendFeedback = (feedbackChain, currentGroup, groups) => {
  _.forEach(feedbackChain, (msg, index) => {
    const current = msg[1]

    if (current.type === 'feedback') {
      const next = feedbackChain[index + 1]

      if (userHasResponded(next)) {
        return
      }
    }
    currentGroup = updateGroups(currentGroup, groups, msg)
  })

  return currentGroup
}

const updateGroups = (currentGroup, groups, entry) => {
  const message = entry[1]

  // If the message isVisitor state is different from the current group isVisitor state,
  // create a new group for that state
  if (message.isVisitor !== currentGroup.isVisitor) {
    if (currentGroup.messageKeys.length > 0) {
      appendGroup(groups, currentGroup)
    }
    currentGroup = {
      messageKeys: [],
      isVisitor: message.isVisitor,
    }
  }
  currentGroup.messageKeys.push(entry[0])

  return currentGroup
}

export const makeGetGroupMessages = () =>
  createSelector([getGroupMessages, getSessions], (messages, sessions) => {
    const messagesWithArticle = messages.map((m) => {
      if (m.type === 'results') {
        m.articles = sessions.get(m.sessionID).articles
      }
      return m
    })

    return messagesWithArticle
  })

export const getLastScroll = createSelector(
  [getConversation],
  (conversation) => conversation.lastScroll
)

export const getLastScreenClosed = createSelector(
  [getConversation],
  (conversation) => conversation.lastScreenClosed
)

export const getGetInTouchVisible = createSelector(
  getConversation,
  (conversation) => conversation.getInTouchVisible
)
