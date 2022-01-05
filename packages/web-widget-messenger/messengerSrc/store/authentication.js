import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { logger } from '@zendesk/widget-shared-services'
import {
  loginUser as loginUserSunco,
  logoutUser as logoutUserSunco,
  hasExistingConversation,
} from 'messengerSrc/api/sunco'
import { startConversation } from 'messengerSrc/features/suncoConversation/store'
import { userLoggedOut } from './actions'

const loginUser = createAsyncThunk('authentication/loginUser', (getJWTFn, { dispatch }) => {
  loginUserSunco(getJWTFn)
    .then((response) => {
      if (response?.hasExternalIdChanged) {
        dispatch(userLoggedOut())
      }
      if (hasExistingConversation()) {
        dispatch(startConversation())
      }
    })
    .catch((error) => {
      logger.error('Unable to login user', error)
    })
})

const logoutUser = createAsyncThunk('authentication/logoutUser', (_, { dispatch }) => {
  logoutUserSunco()
    .then(() => {
      dispatch(userLoggedOut())
    })
    .catch((error) => {
      logger.error('Unable to logout user', error)
    })
})

const authentication = createSlice({
  name: 'authentication',
  initialState: {},
  extraReducers: {},
})

export default authentication.reducer
export { loginUser, logoutUser }
