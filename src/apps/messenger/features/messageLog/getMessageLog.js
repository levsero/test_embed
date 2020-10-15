import { getUserTyping } from 'src/apps/messenger/features/messageLog/Message/messages/TypingIndicator/store'
import { MESSAGE_STATUS } from 'src/apps/messenger/features/sunco-components/constants'
import { getFormsState } from 'src/apps/messenger/features/messageLog/Message/messages/FormStructuredMessage/store'
import { getAllMessages } from 'src/apps/messenger/features/messageLog/store'
import insertTimestampsInLog from './utils/insertTimestampsInLog'

import { createSelector } from '@reduxjs/toolkit'

const GROUPABLE_TYPES = { text: true, image: true, file: true }

const removeSubmittedForms = (messages, formsState) => {
  return messages.filter(message => {
    if (message.type !== 'form') {
      return true
    }

    return message.submitted !== true && formsState[message._id]?.status !== 'success'
  })
}

const retrieveFormDataForFormResponse = messages => {
  return messages.map(message => {
    if (message.type === 'formResponse') {
      const relatedForm = messages.find(
        otherMessage => otherMessage._id === message.quotedMessageId
      )

      return {
        ...message,
        name: relatedForm?.name ?? message.name,
        avatarUrl: relatedForm?.avatarUrl ?? message.avatarUrl,
        authorId: relatedForm?.authorId ?? message.authorId
      }
    }
    return message
  })
}

const withUserTyping = (log, userTyping) => {
  if (userTyping) {
    log.push({
      ...userTyping,
      _id: 'typingIndicator',
      isLocalMessageType: true,
      type: 'typingIndicator'
    })
  }

  return log
}

const areMessagesGroupable = (thisMessage, otherMessage) => {
  if (!GROUPABLE_TYPES[thisMessage.type]) return false
  if (!GROUPABLE_TYPES[(otherMessage?.type)]) return false

  const hasOtherFailed = otherMessage?.status === MESSAGE_STATUS.failed

  return !hasOtherFailed
}

const addMessagePositionsToGroups = messages => {
  let lastMessageThatHasntFailed

  const withPositions = messages.map((message, index) => {
    const previousMessage = messages[index - 1]
    const nextMessage = messages[index + 1]

    const isFirstInGroup =
      message.authorId !== previousMessage?.authorId ||
      !areMessagesGroupable(message, previousMessage)
    const isLastInGroup =
      message.authorId !== nextMessage?.authorId || !areMessagesGroupable(message, nextMessage)
    const isLastInLog = index === messages.length - 1

    const isFirstMessageInAuthorGroup = message.authorId !== previousMessage?.authorId
    const isLastMessageInAuthorGroup = message.authorId !== nextMessage?.authorId

    if (message.status !== MESSAGE_STATUS.failed) {
      lastMessageThatHasntFailed = index
    }

    return {
      ...message,
      isFirstInGroup,
      isLastInGroup,
      isLastInLog,
      isLastMessageInAuthorGroup,
      isFirstMessageInAuthorGroup,
      isLastMessageThatHasntFailed: false
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
