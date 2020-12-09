import { createSlice } from '@reduxjs/toolkit'
import { onBrowserComingBackOnline, onBrowserGoingOffline } from 'src/apps/messenger/utils/browser'

const onlineStatus = createSlice({
  name: 'onlineStatus',
  initialState: {
    isOnline: true
  },
  reducers: {
    onlineStatusChanged: (state, action) => {
      state.isOnline = action.payload.isOnline
    }
  }
})

export const getIsOnline = state => state.onlineStatus.isOnline

export const { onlineStatusChanged } = onlineStatus.actions
export default onlineStatus.reducer

export const listenForOnlineOfflineEvents = reduxStore => {
  onBrowserComingBackOnline(() => {
    reduxStore.dispatch(onlineStatusChanged({ isOnline: true }))
  })

  onBrowserGoingOffline(() => {
    reduxStore.dispatch(onlineStatusChanged({ isOnline: false }))
  })
}
