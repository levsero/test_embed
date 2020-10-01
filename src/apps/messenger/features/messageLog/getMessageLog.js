import { getUserTyping } from 'src/apps/messenger/features/messageLog/Message/messages/TypingIndicator/store'
import { MESSAGE_STATUS } from 'src/apps/messenger/features/sunco-components/constants'
import { getFormsState } from 'src/apps/messenger/features/messageLog/Message/messages/FormStructuredMessage/store'
import { getAllMessages } from 'src/apps/messenger/features/messageLog/store'
import insertTimestampsInLog from './utils/insertTimestampsInLog'

import { createSelector } from '@reduxjs/toolkit'

const removeSubmittedForms = (messages, formsState) => {
  return messages.filter(message => {
    if (message.type !== 'form') {
      return true
    }

    return message.submitted !== true && formsState[message._id]?.status !== 'success'
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

const addMessagePositionsToGroups = messages => {
  let lastMessageThatHasntFailed

  const withPositions = messages.map((message, index) => {
    const previousMessage = messages[index - 1]
    const nextMessage = messages[index + 1]

    const isFirstInGroup =
      message.role !== previousMessage?.role || message.type !== previousMessage?.type
    const isLastInGroup = message.role !== nextMessage?.role || message.type !== nextMessage?.type
    const isLastInLog = index === messages.length - 1

    if (message.status !== MESSAGE_STATUS.failed) {
      lastMessageThatHasntFailed = index
    }

    return {
      ...message,
      isFirstInGroup,
      isLastInGroup,
      isLastInLog,
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
    const withoutSubmittedForms = removeSubmittedForms(messages, formsState)

    const logWithTimestamps = insertTimestampsInLog(withoutSubmittedForms)

    const logWithUserTyping = withUserTyping(logWithTimestamps, userTyping)

    return addMessagePositionsToGroups(logWithUserTyping)
  }
)

export default getMessageLog
