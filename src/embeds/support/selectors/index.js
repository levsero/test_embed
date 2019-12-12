import { createSelector } from 'reselect'

export const getSupportConfig = state => state.support.config
export const getNewSupportEmbedEnabled = state =>
  getSupportConfig(state).webWidgetReactRouterSupport
export const getMaxFileCount = state => getSupportConfig(state).maxFileCount
export const getMaxFileSize = state => getSupportConfig(state).maxFileSize
export const getActiveFormName = state => state.support.activeFormName
export const getFormState = (state, name) => state.support.formStates[name]
export const getAllAttachments = state => state.support.attachments

export const getValidAttachments = createSelector(
  getAllAttachments,
  attachments =>
    attachments.filter(
      attachment => !attachment.uploading && !attachment.errorMessage && attachment.uploadToken
    )
)

export const getAttachmentTokens = createSelector(
  getValidAttachments,
  attachments => attachments.map(attachment => attachment.uploadToken)
)

export const getAttachmentsReady = createSelector(
  [getAllAttachments, getValidAttachments],
  (allAttachments, validAttachments) => allAttachments.length === validAttachments.length
)
