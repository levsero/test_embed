import { createReducer } from '@reduxjs/toolkit'
import { configReceived } from 'src/apps/messenger/store/actions'

const header = createReducer(
  {
    name: '',
    description: '',
    avatar:
      'https://www.vhv.rs/dpng/d/263-2633009_transparent-zendesk-logo-white-hd-png-download.png'
  },
  {
    [configReceived]: (state, action) => {
      state.name = action.payload?.title || state.name
      state.description = action.payload?.description || state.description
    }
  }
)

export const getHeaderValues = state => state.header

export default header
