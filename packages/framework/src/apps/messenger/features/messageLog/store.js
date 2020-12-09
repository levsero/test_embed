import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { sendMessage as sendSuncoMessage, fetchMessages } from 'src/apps/messenger/api/sunco'
import { submitForm } from 'src/apps/messenger/features/messageLog/Message/messages/FormStructuredMessage/store'
import {
  fetchExistingConversation,
  startNewConversation
} from 'src/apps/messenger/features/suncoConversation/store'

const fetchPaginatedMessages = createAsyncThunk(
  'messageLog/fetchMessages',
  async ({ cursor, callback }) => {
    const response = await fetchMessages(cursor)

    if (callback) callback()

    return response.body
  }
)

// sendMessage sends a message optimistically via the Sunco JS client
// If retrying sending a message, provide its id via messageId
// If messageId not provided, the thunk requestId will be used as the messages optimistic id
const sendMessage = createAsyncThunk(
  'message/send',
  async ({ message, messageId: _, payload, metadata }) => {
    const response = await sendSuncoMessage(message, payload, metadata)

    if (Array.isArray(response.body.messages) && response.body.messages.length === 1) {
      return {
        message: response.body.messages[0]
      }
    }

    throw new Error('Message failed to send')
  }
)

const messagesAdapter = createEntityAdapter({
  selectId: message => message._id,
  sortComparer: (messageA, messageB) => messageA.received - messageB.received
})

const messagesSlice = createSlice({
  name: 'messages',
  initialState: messagesAdapter.getInitialState({
    hasPrevious: false,
    hasFetchedConversation: false,
    errorFetchingHistory: false,
    isFetchingHistory: false
  }),
  reducers: {
    messageReceived(state, action) {
      messagesAdapter.addOne(state, action.payload.message)
    }
  },
  extraReducers: {
    [startNewConversation.fulfilled](state, action) {
      state.hasFetchedConversation = true
      messagesAdapter.addMany(state, action.payload.messages)
    },
    [fetchPaginatedMessages.fulfilled](state, action) {
      state.isFetchingHistory = false
      state.errorFetchingHistory = false
      state.hasFetchedConversation = true
      state.hasPrevious = Boolean(action.payload.hasPrevious)
      messagesAdapter.addMany(state, action.payload.messages)
    },
    [fetchPaginatedMessages.pending](state) {
      state.isFetchingHistory = true
      state.errorFetchingHistory = false
    },
    [fetchPaginatedMessages.rejected](state) {
      state.isFetchingHistory = false
      state.errorFetchingHistory = true
    },
    [submitForm.fulfilled](state, action) {
      messagesAdapter.addMany(state, action.payload.messages)
    },
    [fetchExistingConversation.fulfilled](state, action) {
      state.hasFetchedConversation = true
      state.hasPrevious = Boolean(action.payload.hasPrevious)
      messagesAdapter.addMany(state, action.payload.messages)
    },
    [sendMessage.pending](state, action) {
      const messageId = action.meta.arg.messageId ?? action.meta.requestId

      // If message was already in store, just update its status
      if (state.entities[messageId]) {
        messagesAdapter.upsertOne(state, {
          _id: action.meta.arg.messageId,
          payload: action.meta.arg.payload,
          status: 'sending'
        })
        return
      }

      messagesAdapter.addOne(state, {
        _id: action.meta.arg.messageId ?? action.meta.requestId,
        payload: action.meta.arg.payload,
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

const getHasPrevious = state => state.messages.hasPrevious
const getErrorFetchingHistory = state => state.messages.errorFetchingHistory
const getIsFetchingHistory = state => state.messages.isFetchingHistory
const getHasFetchedConversation = state => state.messages.hasFetchedConversation
const getAllMessages = selectors.selectAll
const getMessage = selectors.selectById

export const { messageReceived } = messagesSlice.actions
export {
  getHasPrevious,
  getHasFetchedConversation,
  sendMessage,
  getErrorFetchingHistory,
  getIsFetchingHistory,
  fetchPaginatedMessages,
  getAllMessages,
  getMessage
}

export default messagesSlice.reducer