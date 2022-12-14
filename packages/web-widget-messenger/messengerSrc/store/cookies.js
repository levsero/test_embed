import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { persistence, identity } from '@zendesk/widget-shared-services'
import { forgetUserAndDisconnect, getClient } from 'messengerSrc/api/sunco'

const cookiesDisabled = createAsyncThunk('cookies/disabled', () => {
  try {
    forgetUserAndDisconnect()
  } catch {}
  persistence.disable()
})

const cookies = createSlice({
  name: 'cookies',
  initialState: {
    enabled: true,
  },
  reducers: {
    cookiesEnabled(state) {
      state.enabled = true
      persistence.enable()
      getClient()?.setClientId(identity.getBuid())
    },
  },
  extraReducers: {
    [cookiesDisabled.pending](state) {
      state.enabled = false
    },
  },
})

const { cookiesEnabled } = cookies.actions

const getAreCookiesEnabled = (state) => state.cookies.enabled

export default cookies.reducer
export { cookiesEnabled, cookiesDisabled, getAreCookiesEnabled }
