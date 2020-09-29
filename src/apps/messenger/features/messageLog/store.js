import {
  createEntityAdapter,
  createSlice,
  createSelector,
  createAsyncThunk
} from '@reduxjs/toolkit'
import { getClient } from 'src/apps/messenger/suncoClient'
import {
  getFormsState,
  submitForm
} from 'src/apps/messenger/features/messageLog/Message/messages/FormStructuredMessage/store'

// sendMessage sends a message optimistically via the Sunco JS client
// If retrying sending a message, provide its id via messageId
// If messageId not provided, the thunk requestId will be used as the messages optimistic id
const sendMessage = createAsyncThunk('message/send', async ({ message, messageId: _ }) => {
  const response = await getClient().sendMessage(message)

  if (Array.isArray(response.body.messages) && response.body.messages.length === 1) {
    return {
      message: response.body.messages[0]
    }
  }

  throw new Error('Message failed to send')
})

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
    },
    [sendMessage.pending](state, action) {
      const messageId = action.meta.arg.messageId ?? action.meta.requestId

      // If message was already in store, just update its status
      if (state.entities[messageId]) {
        messagesAdapter.upsertOne(state, {
          _id: action.meta.arg.messageId,
          status: 'sending'
        })
        return
      }

      messagesAdapter.addOne(state, {
        _id: action.meta.arg.messageId ?? action.meta.requestId,
        type: 'text',
        role: 'appUser',
        received: Date.now() / 1000,
        text: action.meta.arg.message,
        isOptimistic: true,
        status: 'sending'
      })
    },
    [sendMessage.rejected](state, action) {
      messagesAdapter.upsertOne(state, {
        _id: action.meta.arg.messageId ?? action.meta.requestId,
        status: 'failed'
      })
    },
    [sendMessage.fulfilled](state, action) {
      messagesAdapter.upsertOne(state, {
        ...action.payload.message,
        _id: action.meta.arg.messageId ?? action.meta.requestId,
        status: 'sent'
      })
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
export const getMessage = selectors.selectById
export { getMessageLog, getHasPrevious, getHasFetchedConversation, sendMessage }

export default messagesSlice.reducer
