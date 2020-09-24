import { createSelector } from '@reduxjs/toolkit'
import { getMessageLog } from 'src/apps/messenger/features/messageLog/store'

const getIsComposerEnabled = createSelector(
  getMessageLog,
  messages => {
    const lastMessage = messages[messages.length - 1]

    if (lastMessage?.type === 'form') {
      return !lastMessage?.blockChatInput === true && lastMessage.submitted === false
    }

    return true
  }
)

export { getIsComposerEnabled }
