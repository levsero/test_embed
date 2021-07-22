import { createSelector } from '@reduxjs/toolkit'
import { MESSAGE_STATUS, FORM_MESSAGE_STATUS } from '@zendesk/conversation-components'
import { getFormsState } from 'src/apps/messenger/features/messageLog/Message/messages/FormStructuredMessage/store'
import { getUserTyping } from 'src/apps/messenger/features/messageLog/Message/messages/TypingIndicator/store'
import { getAllMessages } from 'src/apps/messenger/features/messageLog/store'
import insertTimestampsInLog from './utils/insertTimestampsInLog'

const GROUPABLE_TYPES = { text: true, image: true, file: true, typingIndicator: true }

const removeSubmittedForms = (messages, formsState) => {
  return messages.filter((message) => {
    if (message.type !== 'form') {
      return true
    }

    return (
      message.submitted !== true &&
      formsState[message._id]?.formSubmissionStatus !== FORM_MESSAGE_STATUS.success
    )
  })
}

const retrieveFormDataForFormResponse = (messages) => {
  return messages.map((message) => {
    if (message.type === 'formResponse') {
      const relatedForm = messages.find(
        (otherMessage) => otherMessage._id === message.quotedMessageId
      )

      return {
        ...message,
        name: relatedForm?.name ?? message.name,
        avatarUrl: relatedForm?.avatarUrl ?? message.avatarUrl,
        authorId: relatedForm?.authorId ?? message.authorId,
      }
    }
    return message
  })
}

const isLastMessageAQuickReply = (log = []) => {
  const [lastMessage] = log.slice(-1)
  return (
    lastMessage?.type === 'text' &&
    lastMessage.actions?.filter((action) => action.type === 'reply')?.length > 0
  )
}

const withUserTyping = (log, userTyping) => {
  if (userTyping && !isLastMessageAQuickReply(log)) {
    log.push({
      ...userTyping,
      _id: 'typingIndicator',
      isLocalMessageType: true,
      type: 'typingIndicator',
    })
  }

  return log
}

const areMessagesGroupable = (thisMessage, otherMessage) => {
  if (!GROUPABLE_TYPES[thisMessage.type]) return false
  if (!GROUPABLE_TYPES[otherMessage?.type]) return false

  const hasOtherFailed = otherMessage?.status === MESSAGE_STATUS.failed

  return !hasOtherFailed
}

const areSameAuthor = (first, second) => {
  if (first.type === 'typingIndicator' || second?.type === 'typingIndicator') {
    if (first.name === second?.name && first.avatarUrl === second?.avatarUrl) {
      return true
    }
  }

  if (first.role === 'appUser' && second?.role === 'appUser') {
    return true
  }

  return (
    first.authorId === second?.authorId &&
    first.name === second?.name &&
    first.role === second?.role &&
    first.avatarUrl === second?.avatarUrl
  )
}

const addMessagePositionsToGroups = (messages) => {
  let lastMessageThatHasntFailed

  const withPositions = messages.map((message, index) => {
    const previousMessage = messages[index - 1]
    const nextMessage = messages[index + 1]

    const isPreviousSameAuthor = areSameAuthor(message, previousMessage)
    const isNextSameAuthor = areSameAuthor(message, nextMessage)

    const isFirstInGroup = !isPreviousSameAuthor || !areMessagesGroupable(message, previousMessage)
    const isLastInGroup = !isNextSameAuthor || !areMessagesGroupable(message, nextMessage)
    const isLastInLog = index === messages.length - 1

    if (message.status !== MESSAGE_STATUS.failed) {
      lastMessageThatHasntFailed = index
    }

    return {
      ...message,
      isFirstInGroup,
      isLastInGroup,
      isLastInLog,
      isFirstMessageInAuthorGroup: !isPreviousSameAuthor,
      isLastMessageInAuthorGroup: !isNextSameAuthor,
      isLastMessageThatHasntFailed: false,
    }
  })

  if (lastMessageThatHasntFailed !== undefined) {
    withPositions[lastMessageThatHasntFailed].isLastMessageThatHasntFailed = true
  }

  return withPositions
}

const getMessageLog = createSelector(
  getAllMessages,
  getFormsState,
  getUserTyping,
  (messages, formsState, userTyping) => {
    const updatedFormResponses = retrieveFormDataForFormResponse(messages, formsState)
    const withoutSubmittedForms = removeSubmittedForms(updatedFormResponses, formsState)

    const logWithTimestamps = insertTimestampsInLog(withoutSubmittedForms)

    const logWithUserTyping = withUserTyping(logWithTimestamps, userTyping)

    return addMessagePositionsToGroups(logWithUserTyping)
  }
)

export default getMessageLog
