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
      const actions = actionsForMessage(action.payload.message)

      messagesAdapter.addOne(state, { ...action.payload.message, ...actions })
    },
    messagesReceived(state, action) {
      const messages = action.payload.messages?.map(message => {
        const actions = actionsForMessage(message)
        return { ...message, ...actions }
      })
      messagesAdapter.addMany(state, messages)
    }
  }
})

const selectors = messagesAdapter.getSelectors(state => state.messages)

const actionsForMessage = message => {
  let actions = {}
  message?.actions?.forEach(action => {
    actions[action.type] = actions[action.type] || []
    actions[action.type].push(action)
  })
  return actions
}

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

const extractReplies = messages => {
  if (messages.length === 0) return messages
  const lastMessage = messages[messages.length - 1]
  if (!lastMessage.reply) return messages

  return messages.concat({
    id: lastMessage.reply.map(quickReply => quickReply._id).join('-'),
    type: 'replies',
    replies: lastMessage.reply
  })
}

const getMessageLog = createSelector(
  selectors.selectAll,
  messages => {
    const messagesWithPosition = addMessagePositionsToGroups(messages)
    const messagesWithReplies = extractReplies(messagesWithPosition)
    return messagesWithReplies
  }
)

export const { messageReceived, messagesReceived } = messagesSlice.actions
export { getMessageLog }

export default messagesSlice.reducer
