import { createReducer } from '@reduxjs/toolkit'
import { messengerConfigReceived } from 'messengerSrc/store/actions'

const header = createReducer(
  {
    name: '',
    description: '',
    avatar: '',
  },
  {
    [messengerConfigReceived]: (state, action) => {
      state.name = action.payload?.title || state.name
      state.description = action.payload?.description || state.description
      state.avatar = action.payload?.avatar || state.avatar
    },
  }
)

export const getHeaderValues = (state) => state.header

export default header
