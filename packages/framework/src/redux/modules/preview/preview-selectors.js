import { CHAT, CHAT_BADGE } from 'src/constants/preview'

export const getPreviewChoice = state => state.preview.choice
export const getIsPreviewEnabled = state => state.preview.enabled
export const getIsChatPreviewEnabled = state =>
  getIsPreviewEnabled(state) && getPreviewChoice(state) === CHAT
export const getPreviewShowWidget = state => getPreviewChoice(state) !== CHAT_BADGE
