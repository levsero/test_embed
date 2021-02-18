import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { forgetUserAndDisconnect } from 'src/apps/messenger/api/sunco'
import { store as persistence } from 'src/framework/services/persistence'

const cookiesDisabled = createAsyncThunk('cookies/disabled', () => {
  try {
    forgetUserAndDisconnect()
  } catch {}
  persistence.clear()
})

const cookies = createSlice({
  name: 'cookies',
  initialState: {
    enabled: true,
  },
  reducers: {
    cookiesEnabled(state) {
      state.enabled = true
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
