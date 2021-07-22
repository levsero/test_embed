import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import { sendConversationRead } from 'src/apps/messenger/api/sunco'
import getMessageLog from 'src/apps/messenger/features/messageLog/getMessageLog'
import { fetchExistingConversation } from 'src/apps/messenger/features/suncoConversation/store'

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
    [fetchExistingConversation.fulfilled](state, action) {
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
        message.received > lastReadTimestamp &&
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

export { getUnreadCount, getLastUnreadTimestamp, getLastReadTimestamp, markAsRead }
