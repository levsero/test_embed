import { createSlice } from '@reduxjs/toolkit'
import { messageReceived } from 'src/apps/messenger/features/messageLog/store'

const typingIndicatorsSlice = createSlice({
  name: 'typingIndicators',
  initialState: {
    typingUser: null,
  },
  reducers: {
    activityReceived: (state, action) => {
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
  },
  extraReducers: {
    [messageReceived](state, _action) {
      state.typingUser = null
    },
  },
})

const getUserTyping = (state) => state.typingIndicators.typingUser

export const { activityReceived } = typingIndicatorsSlice.actions
export { getUserTyping }

export default typingIndicatorsSlice.reducer
