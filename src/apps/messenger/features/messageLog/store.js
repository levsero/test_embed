import { createEntityAdapter, createSlice, createSelector } from '@reduxjs/toolkit'

const messagesAdapter = createEntityAdapter({
  selectId: message => message._id,
  sortComparer: (messageA, messageB) => messageA.received - messageB.received
})

const messagesSlice = createSlice({
  name: 'messages',
  initialState: messagesAdapter.getInitialState({
    hasPrevious: false,
    hasFetchedConversation: false
  }),
  reducers: {
    messageReceived(state, action) {
      messagesAdapter.addOne(state, action.payload.message)
    },
    messagesReceived(state, action) {
      state.hasFetchedConversation = true
      state.hasPrevious = Boolean(action.payload.hasPrevious)

      messagesAdapter.addMany(state, action.payload.messages)
    }
  }
})

const selectors = messagesAdapter.getSelectors(state => state.messages)

const addMessagePositionsToGroups = messages =>
  messages.map((message, index) => {
    const previousMessage = messages[index - 1]
    const nextMessage = messages[index + 1]

    const isFirstInGroup =
      message.role !== previousMessage?.role || message.type !== previousMessage?.type
    const isLastInGroup = message.role !== nextMessage?.role || message.type !== nextMessage?.type
    const isLastInLog = index === messages.length - 1

    return {
      ...message,
      isFirstInGroup,
      isLastInGroup,
      isLastInLog
    }
  })

const isFormResponsePresent = (formMessageId, messages) => {
  return !!messages.find(
    message => message.type === 'formResponse' && message.quotedMessageId === formMessageId
  )
}

const filterSubmittedForms = messages => {
  return messages.filter(message => {
    if (message.type !== 'form') return true

    const messagePreviouslySubmitted = message.submitted
    const messageFormResponsePresent = isFormResponsePresent(message._id, messages)

    if (messagePreviouslySubmitted || messageFormResponsePresent) return false

    return true
  })
}

const filterUnsubmittedFormsBlockingInput = messages => {
  const unsubmittedForms = messages.filter(message =>
    filterSubmittedForms(messages).includes(message)
  )

  return unsubmittedForms.filter(message => message.blockChatInput)
}

const getIsComposerEnabled = createSelector(
  selectors.selectAll,
  messages => {
    return filterUnsubmittedFormsBlockingInput(messages).length === 0
  }
)

const getMessageLog = createSelector(
  selectors.selectAll,
  messages => {
    const filteredMessages = filterSubmittedForms(messages)
    return addMessagePositionsToGroups(filteredMessages)
  }
)

const getHasPrevious = state => state.messages.hasPrevious
const getHasFetchedConversation = state => state.messages.hasFetchedConversation

export const { messageReceived, messagesReceived } = messagesSlice.actions
export { getMessageLog, getIsComposerEnabled, getHasPrevious, getHasFetchedConversation }

export default messagesSlice.reducer
