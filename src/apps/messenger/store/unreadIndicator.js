import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import getMessageLog from 'src/apps/messenger/features/messageLog/getMessageLog'
import { getClient } from 'src/apps/messenger/suncoClient'

const markAsRead = createAsyncThunk('markAsRead', async () => {
  await getClient()?.activity?.conversationRead()
})

const unreadIndicator = createSlice({
  name: 'unreadIndicator',
  initialState: {
    lastReadTimestamp: null
  },
  extraReducers: {
    [markAsRead.pending](state, action) {
      state.lastReadTimestamp = action.meta.arg.lastMessageTimestamp
    }
  }
})

const getLastReadTimestamp = state => state.unreadIndicator.lastReadTimestamp

const getUnreadMessages = createSelector(
  getMessageLog,
  getLastReadTimestamp,
  (messageLog, lastReadTimestamp) => {
    return messageLog.filter(
      message =>
        !message.isLocalMessageType &&
        message.received > lastReadTimestamp &&
        message.role !== 'appUser'
    )
  }
)

const getLastUnreadTimestamp = createSelector(
  getUnreadMessages,
  unreadMessages => {
    return unreadMessages[unreadMessages.length - 1]?.received
  }
)

const getUnreadCount = createSelector(
  getUnreadMessages,
  unreadMessages => {
    return unreadMessages.length
  }
)

export default unreadIndicator.reducer

export { getUnreadCount, getLastUnreadTimestamp, getLastReadTimestamp, markAsRead }
