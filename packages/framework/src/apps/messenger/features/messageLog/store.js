import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { MESSAGE_STATUS } from '@zendesk/conversation-components'
import { SuncoAPIError } from '@zendesk/sunco-js-client'
import {
  sendMessage as sendSuncoMessage,
  fetchMessages,
  sendFile as sendSuncoFile,
} from 'src/apps/messenger/api/sunco'
import { submitForm } from 'src/apps/messenger/features/messageLog/Message/messages/FormStructuredMessage/store'
import {
  fileUploadMessageReceived,
  messageReceived,
  startConversation,
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
        message: response.body.messages[0],
      }
    }

    throw new Error('Message failed to send')
  }
)

const retryFileStorage = {}

const sendFile = createAsyncThunk(
  'file/send',
  async ({ file, messageId, failDueToTooMany }, { requestId, rejectWithValue }) => {
    if (file) {
      retryFileStorage[requestId] = file
    }

    const fileToUpload = file || retryFileStorage[messageId]

    try {
      if (failDueToTooMany) {
        return rejectWithValue({
          errorReason: 'tooMany',
        })
      }

      const response = await sendSuncoFile(fileToUpload)

      if (!response.body.messageId) {
        return rejectWithValue({
          errorReason: 'unknown',
        })
      }

      delete retryFileStorage[messageId || requestId]

      return {
        messageId: response.body.messageId,
      }
    } catch (err) {
      if (err instanceof SuncoAPIError) {
        return rejectWithValue({ errorReason: err.suncoErrorInfo?.reason || 'unknown' })
      }
      return rejectWithValue({
        errorReason: 'unknown',
      })
    }
  }
)

const messagesAdapter = createEntityAdapter({
  selectId: (message) => message._id,
  sortComparer: (messageA, messageB) => messageA.received - messageB.received,
})

const messagesSlice = createSlice({
  name: 'messages',
  initialState: messagesAdapter.getInitialState({
    hasPrevious: false,
    hasFetchedConversation: false,
    errorFetchingHistory: false,
    isFetchingHistory: false,
    tempFiles: {},
  }),
  extraReducers: {
    [messageReceived](state, action) {
      messagesAdapter.addOne(state, action.payload.message)
    },
    [startConversation.fulfilled](state, action) {
      state.errorFetchingHistory = false
      state.hasFetchedConversation = true
      state.hasPrevious = Boolean(action.payload.hasPrevious)
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
    [sendMessage.pending](state, action) {
      const messageId = action.meta.arg.messageId ?? action.meta.requestId

      // If message was already in store, just update its status
      if (state.entities[messageId]) {
        messagesAdapter.upsertOne(state, {
          _id: action.meta.arg.messageId,
          payload: action.meta.arg.payload,
          status: 'sending',
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
        status: 'sending',
      })
    },
    [sendMessage.rejected](state, action) {
      messagesAdapter.upsertOne(state, {
        _id: action.meta.arg.messageId ?? action.meta.requestId,
        status: 'failed',
      })
    },
    [sendMessage.fulfilled](state, action) {
      messagesAdapter.upsertOne(state, {
        ...action.payload.message,
        _id: action.meta.arg.messageId ?? action.meta.requestId,
        status: 'sent',
      })
    },
    [sendFile.pending](state, action) {
      const messageId = action.meta.arg.messageId ?? action.meta.requestId

      // If file was already in store, just update its status
      if (state.entities[messageId]) {
        messagesAdapter.upsertOne(state, {
          _id: action.meta.arg.messageId,
          status: 'sending',
        })
        return
      }

      const file = action.meta.arg.file
      const type = file.type.startsWith('image/') ? 'image' : 'file'

      messagesAdapter.addOne(state, {
        _id: file.messageId ?? action.meta.requestId,
        payload: action.meta.arg.payload,
        type,
        role: 'appUser',
        received: Date.now() / 1000,
        isOptimistic: true,
        status: 'sending',
        mediaSize: file.size,
        mediaUrl: URL.createObjectURL(file),
        altText: file.name,
      })
    },
    [sendFile.rejected](state, action) {
      messagesAdapter.upsertOne(state, {
        _id: action.meta.arg.messageId ?? action.meta.requestId,
        status: 'failed',
        errorReason: action.payload?.errorReason,
        isRetryable: action.payload?.errorReason !== 'fileSize',
      })
    },
    [sendFile.fulfilled](state, action) {
      const id = action.meta?.arg?.messageId ?? action.meta.requestId

      // if the socket event for the file came through before the API fulfilled
      // get the media url from the stored file
      if (state.tempFiles[action.payload.messageId]) {
        messagesAdapter.upsertOne(state, {
          _id: id,
          externalId: action.payload.messageId,
          mediaUrl: state.tempFiles[action.payload.messageId].mediaUrl,
          blobMediaUrl: state.entities[id]?.mediaUrl,
          status: MESSAGE_STATUS.sent,
        })

        delete state.tempFiles[action.payload.messageId]
        return
      }

      messagesAdapter.upsertOne(state, {
        _id: id,
        externalId: action.payload.messageId,
        // don't mark file as sent until we have the mediaUrl from the socket event
      })
    },
    [fileUploadMessageReceived](state, action) {
      const fileMessage = Object.values(state.entities).find(
        (message) => message.externalId === action.payload.message._id
      )

      // If theres no file message this suggests that the socket event
      // came through before the send file API fulfilled
      if (!fileMessage) {
        state.tempFiles[action.payload.message._id] = action.payload.message
        return
      }

      messagesAdapter.upsertOne(state, {
        _id: fileMessage._id,
        status: MESSAGE_STATUS.sent,
        mediaUrl: action.payload.message.mediaUrl,
        blobMediaUrl: state.entities[fileMessage._id]?.mediaUrl,
      })
    },
  },
})

const selectors = messagesAdapter.getSelectors((state) => state.messages)

const getHasPrevious = (state) => state.messages.hasPrevious
const getErrorFetchingHistory = (state) => state.messages.errorFetchingHistory
const getIsFetchingHistory = (state) => state.messages.isFetchingHistory
const getHasFetchedConversation = (state) => state.messages.hasFetchedConversation
const getAllMessages = selectors.selectAll
const getMessage = selectors.selectById

export {
  getHasPrevious,
  getHasFetchedConversation,
  sendMessage,
  getErrorFetchingHistory,
  getIsFetchingHistory,
  fetchPaginatedMessages,
  getAllMessages,
  getMessage,
  sendFile,
}

export default messagesSlice.reducer
