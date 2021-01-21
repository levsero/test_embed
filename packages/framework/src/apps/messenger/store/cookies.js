import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { forgetUserAndDisconnect } from 'src/apps/messenger/api/sunco'

const cookiesDisabled = createAsyncThunk('cookies/disabled', () => {
  forgetUserAndDisconnect()
})

const cookies = createSlice({
  name: 'cookies',
  initialState: {
    enabled: true
  },
  reducers: {
    cookiesEnabled(state) {
      state.enabled = true
    }
  },
  extraReducers: {
    [cookiesDisabled.pending](state) {
      state.enabled = false
    }
  }
})

const { cookiesEnabled } = cookies.actions

const getAreCookiesEnabled = state => state.cookies.enabled

export default cookies.reducer
export { cookiesEnabled, cookiesDisabled, getAreCookiesEnabled }
