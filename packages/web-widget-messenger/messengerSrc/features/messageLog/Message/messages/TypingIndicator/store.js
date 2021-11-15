import { createSlice } from '@reduxjs/toolkit'
import { messageReceived, activityReceived } from 'messengerSrc/features/suncoConversation/store'

const typingIndicatorsSlice = createSlice({
  name: 'typingIndicators',
  initialState: {
    typingUser: null,
  },
  extraReducers: {
    [activityReceived]: (state, action) => {
      const {
        payload: {
          activity: {
            type,
            data: { name, avatarUrl },
          },
        },
      } = action

      switch (type) {
        case 'typing:start':
          {
            state.typingUser = {
              name,
              avatarUrl,
            }
          }
          break
        case 'typing:stop': {
          state.typingUser = null
        }
      }
    },
    [messageReceived](state, _action) {
      state.typingUser = null
    },
  },
})

const getUserTyping = (state) => state.typingIndicators.typingUser

export { getUserTyping }

export default typingIndicatorsSlice.reducer
