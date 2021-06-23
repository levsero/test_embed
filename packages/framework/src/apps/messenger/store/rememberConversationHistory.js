import { createSlice } from '@reduxjs/toolkit'
import { messengerConfigReceived } from 'src/apps/messenger/store/actions'

const rememberConversationHistory = createSlice({
  name: 'rememberConversationHistory',
  initialState: false,
  extraReducers: {
    [messengerConfigReceived]: (_state, action) => {
      const { payload } = action

      return payload?.conversationHistory === 'remember'
    },
  },
})

const getRememberConversationHistory = (state) => state.rememberConversationHistory
export { getRememberConversationHistory }

export default rememberConversationHistory.reducer
