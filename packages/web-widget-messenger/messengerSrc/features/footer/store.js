import { createSelector, createSlice } from '@reduxjs/toolkit'
import getMessageLog from 'messengerSrc/features/messageLog/getMessageLog'

const composer = createSlice({
  name: 'composer',
  initialState: {
    draft: '',
  },
  reducers: {
    saveDraft(state, action) {
      state.draft = action.payload.message
    },
  },
})

const getIsComposerEnabled = createSelector(getMessageLog, (messages) => {
  const lastMessage = messages[messages.length - 1]

  if (lastMessage?.type === 'form') {
    return lastMessage?.blockChatInput !== true && lastMessage.submitted === false
  }

  return true
})

const getComposerDraft = (state) => state.composer.draft

const { saveDraft } = composer.actions

export default composer.reducer

export { getIsComposerEnabled, saveDraft, getComposerDraft }
