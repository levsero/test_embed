import { createSlice } from '@reduxjs/toolkit'
import hostPageWindow from 'src/framework/utils/hostPageWindow'

const connectionStatus = createSlice({
  name: 'connectionStatus',
  initialState: {
    isOnline: true
  },
  reducers: {
    connectionStatusChanged: (state, action) => {
      state.isOnline = action.payload.isOnline
    }
  }
})

export const getIsOnline = state => state.connectionStatus.isOnline

export const { connectionStatusChanged } = connectionStatus.actions
export default connectionStatus.reducer

export const listenForOnlineOfflineEvents = reduxStore => {
  function updateOnlineStatus() {
    reduxStore.dispatch(connectionStatusChanged({ isOnline: hostPageWindow.navigator.onLine }))
  }

  hostPageWindow.addEventListener('online', updateOnlineStatus)
  hostPageWindow.addEventListener('offline', updateOnlineStatus)
}
