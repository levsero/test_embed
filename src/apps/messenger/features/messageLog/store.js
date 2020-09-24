import { createEntityAdapter, createSlice, createSelector } from '@reduxjs/toolkit'
import { submitForm } from 'src/apps/messenger/features/messageLog/Message/messages/FormStructuredMessage/actions'
import { getFormsState } from 'src/apps/messenger/features/messageLog/Message/messages/FormStructuredMessage/slice'

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
  },
  extraReducers: {
    [submitForm.fulfilled](state, action) {
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

const removeSubmittedForms = (messages, formsState) => {
  return messages.filter(message => {
    if (message.type !== 'form') {
      return true
    }

    return message.submitted !== true && formsState[message._id]?.status !== 'success'
  })
}

const getMessageLog = createSelector(
  selectors.selectAll,
  getFormsState,
  (messages, formsState) => {
    const withoutSubmittedForms = removeSubmittedForms(messages, formsState)

    return addMessagePositionsToGroups(withoutSubmittedForms)
  }
)

const getHasPrevious = state => state.messages.hasPrevious
const getHasFetchedConversation = state => state.messages.hasFetchedConversation

export const { messageReceived, messagesReceived } = messagesSlice.actions
export { getMessageLog, getHasPrevious, getHasFetchedConversation }

export default messagesSlice.reducer
