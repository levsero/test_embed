import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import { sendConversationRead } from 'messengerSrc/api/sunco'
import getMessageLog from 'messengerSrc/features/messageLog/getMessageLog'
import { startConversation } from 'messengerSrc/features/suncoConversation/store'

const markAsRead = createAsyncThunk('markAsRead', async () => {
  await sendConversationRead()
})

const unreadIndicator = createSlice({
  name: 'unreadIndicator',
  initialState: {
    lastReadTimestamp: null,
  },
  extraReducers: {
    [markAsRead.pending](state, action) {
      state.lastReadTimestamp = action.meta.arg.lastMessageTimestamp
    },
    [startConversation.fulfilled](state, action) {
      state.lastReadTimestamp = action.payload.lastRead
    },
  },
})

const getLastReadTimestamp = (state) => state.unreadIndicator.lastReadTimestamp

const getUnreadMessages = createSelector(
  getMessageLog,
  getLastReadTimestamp,
  (messageLog, lastReadTimestamp) => {
    return messageLog.filter((message) => {
      return (
        !message.isLocalMessageType &&
        (lastReadTimestamp ? message.received > lastReadTimestamp : message.received) &&
        message.role !== 'appUser'
      )
    })
  }
)

const getLastUnreadTimestamp = createSelector(getUnreadMessages, (unreadMessages) => {
  return unreadMessages[unreadMessages.length - 1]?.received
})

const getUnreadCount = createSelector(getUnreadMessages, (unreadMessages) => {
  return unreadMessages.length
})

export default unreadIndicator.reducer

export {
  getUnreadCount,
  getLastUnreadTimestamp,
  getLastReadTimestamp,
  markAsRead,
  getUnreadMessages,
}
