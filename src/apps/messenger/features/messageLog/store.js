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
    },
    messagesReceived(state, action) {
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

const extractReplyActions = messages => {
  if (messages.length === 0) return messages
  const lastMessage = messages[messages.length - 1]
  if (lastMessage.type !== 'text' || !lastMessage.actions) return messages

  const replies = lastMessage.actions.filter(action => action.type === 'reply')
  return messages.concat({
    id: replies.map(reply => reply._id).join('-'),
    type: 'replies',
    replies
  })
}

const getMessageLog = createSelector(
  selectors.selectAll,
  messages => {
    const messagesWithPosition = addMessagePositionsToGroups(messages)
    const messagesWithReplies = extractReplyActions(messagesWithPosition)
    return messagesWithReplies
  }
)

export const { messageReceived, messagesReceived } = messagesSlice.actions
export { getMessageLog }

export default messagesSlice.reducer
