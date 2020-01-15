import _ from 'lodash'

import * as actionTypes from './action-types'
import attachmentSender from 'src/embeds/support/utils/attachment-sender'
import { i18n } from 'service/i18n'
import { getMaxFileSize, getMaxFileCount, getValidAttachments } from 'src/embeds/support/selectors'
import formatRequestData from 'src/embeds/support/utils/requestFormatter'
import { http } from 'service/transport'
import withRateLimiting from 'utility/rateLimiting'
import { FORM_PREFILLED } from 'embeds/support/actions/action-types'
import history from 'service/history'
import routes from 'embeds/support/routes'
import { getNewSupportEmbedEnabled } from 'embeds/support/selectors'

let attachmentUploaders = {}

export const submitForm = state => ({
  type: actionTypes.SUBMITTED_FORM,
  payload: { state }
})

export const attachmentLimitExceeded = () => ({
  type: actionTypes.ATTACHMENT_LIMIT_EXCEEDED
})

export const clearLimitExceededError = () => ({
  type: actionTypes.CLEAR_LIMIT_EXCEEDED_ERROR
})

export const setActiveFormName = name => ({
  type: actionTypes.SET_ACTIVE_FORM_NAME,
  payload: { name }
})

export const clearActiveFormName = () => ({
  type: actionTypes.CLEARED_ACTIVE_FORM_NAME
})

export const setFormState = (name, newFormState) => ({
  type: actionTypes.SET_FORM_STATE,
  payload: { name, newFormState }
})

export const clearFormStates = () => ({ type: actionTypes.CLEARED_FORM_STATES })

export const clearFormState = name => ({
  type: actionTypes.CLEARED_FORM_STATE,
  payload: { name }
})

const uploadAttachmentRequest = attachment => ({
  type: actionTypes.ATTACHMENT_UPLOAD_REQUESTED,
  payload: attachment
})

const uploadAttachmentSuccess = (id, response) => {
  let payload = { id, uploading: false }

  try {
    const uploadToken = JSON.parse(response.text).upload.token

    if (uploadToken) {
      payload = { ...payload, uploadToken }
    } else {
      throw new Error()
    }
  } catch {
    payload = {
      ...payload,
      errorMessage: i18n.t('embeddable_framework.chat.attachments.error.unknown_error')
    }
  }

  return {
    type: actionTypes.ATTACHMENT_UPLOAD_SUCCEEDED,
    payload
  }
}

const uploadAttachmentFailure = (id, error) => ({
  type: actionTypes.ATTACHMENT_UPLOAD_FAILED,
  payload: {
    id,
    uploading: false,
    errorMessage:
      error.message || i18n.t('embeddable_framework.chat.attachments.error.unknown_error')
  }
})

const uploadAttachmentUpdate = (id, progress) => ({
  type: actionTypes.ATTACHMENT_UPLOAD_UPDATED,
  payload: {
    id,
    uploadProgress: progress.percent || 100
  }
})

const removeAttachment = id => ({
  type: actionTypes.ATTACHMENT_REMOVED,
  payload: { id }
})

export const clearAttachments = () => (dispatch, _getState) => {
  attachmentUploaders = {}

  dispatch({ type: actionTypes.ATTACHMENTS_CLEARED })
}

export const deleteAttachment = id => (dispatch, _getState) => {
  try {
    attachmentUploaders[id].abort()
    delete attachmentUploaders[id]
  } catch {}

  dispatch(removeAttachment(id))
}

export const uploadAttachment = file => (dispatch, getState) => {
  const maxFileSize = getMaxFileSize(getState())
  const maxSize = Math.round(maxFileSize / 1024 / 1024)
  const fileOversize = file.size >= maxFileSize
  const errorMessage = fileOversize
    ? i18n.t('embeddable_framework.submitTicket.attachments.error.size', { maxSize })
    : null
  const id = _.uniqueId()
  const fileType = file.type || 'application/octet-stream'
  const onUploadComplete = response => dispatch(uploadAttachmentSuccess(id, response))
  const onUploadFailure = error => dispatch(uploadAttachmentFailure(id, error))
  const onUploadUpdate = progress => dispatch(uploadAttachmentUpdate(id, progress))
  const attachment = {
    id,
    fileName: file.name,
    fileSize: file.size,
    fileType,
    errorMessage,
    fileUrl: null,
    uploading: !fileOversize,
    uploadProgress: 0,
    uploadToken: null
  }

  dispatch(uploadAttachmentRequest(attachment))

  if (!fileOversize) {
    attachmentUploaders[id] = attachmentSender(
      file,
      onUploadComplete,
      onUploadFailure,
      onUploadUpdate
    )
  }
}

export function submitTicket(formState, formTitle) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      const state = getState()
      const attachments = [] // Will update once https://zendesk.atlassian.net/browse/EWW-992 is done
      const params = formatRequestData(state, formState, attachments, formTitle)

      const payload = {
        method: 'post',
        path: '/api/v2/requests',
        params: params,
        callbacks: {
          done(res) {
            dispatch({
              type: actionTypes.TICKET_SUBMISSION_REQUEST_SUCCESS,
              payload: JSON.parse(res.text)
            })
            if (getNewSupportEmbedEnabled(state)) {
              history.replace(routes.success())
            }
            resolve()
          },
          fail(err) {
            dispatch({
              type: actionTypes.TICKET_SUBMISSION_REQUEST_FAILURE,
              payload: err.timeout
                ? i18n.t('embeddable_framework.submitTicket.notify.message.timeout')
                : i18n.t('embeddable_framework.submitTicket.notify.message.error')
            })
            reject()
          }
        }
      }

      dispatch({
        type: actionTypes.TICKET_SUBMISSION_REQUEST_SENT
      })

      withRateLimiting(http.send, payload, 'TICKET_SUBMISSION_REQUEST', () => {
        dispatch({
          type: actionTypes.TICKET_SUBMISSION_REQUEST_FAILURE,
          payload: i18n.t('embeddable_framework.common.error.form_submission_disabled')
        })
      })
    })
  }
}

export const uploadAttachedFiles = files => (dispatch, getState) => {
  const state = getState()
  const maxFileCount = getMaxFileCount(state)
  const validAttachments = getValidAttachments(state)

  const numAttachments = validAttachments.length
  const numFilesToAdd = maxFileCount - numAttachments

  _.slice(files, 0, numFilesToAdd).forEach(file => {
    dispatch(uploadAttachment(file))
  })

  if (numAttachments + files.length > maxFileCount) {
    dispatch(attachmentLimitExceeded())
  }
}

export const formPrefilled = (formId, prefillId) => ({
  type: FORM_PREFILLED,
  payload: {
    formId,
    prefillId
  }
})
