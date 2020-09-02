import { createEntityAdapter, createSlice, createSelector } from '@reduxjs/toolkit'

const messagesAdapter = createEntityAdapter({
  selectId: message => message._id,
  sortComparer: (messageA, messageB) => messageA.received - messageB.received
})

const messagesSlice = createSlice({
  name: 'messages',
  initialState: messagesAdapter.getInitialState(),
  reducers: {
    messageReceived(state, action) {
      messagesAdapter.addOne(state, action.payload.message)
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

const getMessageLog = createSelector(
  selectors.selectAll,
  messages => {
    return addMessagePositionsToGroups(messages)
  }
)

export const { messageReceived } = messagesSlice.actions
export { getMessageLog }

export default messagesSlice.reducer
