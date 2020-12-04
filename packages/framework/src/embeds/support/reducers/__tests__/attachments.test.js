import attachments from '../attachments'
import * as actionTypes from 'src/embeds/support/actions/action-types'
import { API_CLEAR_FORM } from 'src/redux/modules/base/base-action-types'
import { testReducer } from 'src/util/testHelpers'

const initialState = []
const upload1 = {
  id: 1,
  fileName: 'screenshot-1.png',
  fileSize: 42356,
  uploading: false,
  uploadProgress: 100,
  errorMessage: null,
  uploadToken: 'a35g4a3f5v1a6df5bv1a'
}
const upload2 = {
  id: 2,
  fileName: 'purchase-receipt.pdf',
  fileSize: 82354,
  uploading: false,
  uploadProgress: 100,
  errorMessage: 'failed',
  uploadToken: null
}
const upload3 = {
  id: 3,
  fileName: 'proof-of-damage.jpg',
  fileSize: 135468,
  uploading: true,
  uploadProgress: 0,
  errorMessage: null,
  uploadToken: null
}
const dummyState = [upload1, upload2, upload3]

testReducer(attachments, [
  {
    extraDesc: 'default value',
    action: { type: undefined },
    expected: initialState
  },
  {
    extraDesc: 'upload request',
    action: {
      type: actionTypes.ATTACHMENT_UPLOAD_REQUESTED,
      payload: upload3
    },
    initialState: [upload1],
    expected: [upload1, upload3]
  },
  {
    extraDesc: 'remove attachment: happy path',
    action: {
      type: actionTypes.ATTACHMENT_REMOVED,
      payload: { id: 2 }
    },
    initialState: dummyState,
    expected: [upload1, upload3]
  },
  {
    extraDesc: 'remove attachment: wrong id, returns current state',
    action: {
      type: actionTypes.ATTACHMENT_REMOVED,
      payload: { id: 999 }
    },
    initialState: dummyState,
    expected: dummyState
  },
  {
    extraDesc: 'remove attachment: no id, returns current state',
    action: {
      type: actionTypes.ATTACHMENT_REMOVED,
      payload: { derp: 'derp' }
    },
    initialState: dummyState,
    expected: dummyState
  },
  {
    extraDesc: 'upload success: happy path',
    action: {
      type: actionTypes.ATTACHMENT_UPLOAD_SUCCEEDED,
      payload: { id: 3, uploadToken: 'abc123', uploading: false }
    },
    initialState: dummyState,
    expected: [upload1, upload2, { ...upload3, uploadToken: 'abc123', uploading: false }]
  },
  {
    extraDesc: 'upload success: wrong id, returns current state',
    action: {
      type: actionTypes.ATTACHMENT_UPLOAD_SUCCEEDED,
      payload: { id: 999 }
    },
    initialState: dummyState,
    expected: dummyState
  },
  {
    extraDesc: 'upload success: no id, returns current state',
    action: {
      type: actionTypes.ATTACHMENT_UPLOAD_SUCCEEDED,
      payload: { derp: 'derp' }
    },
    initialState: dummyState,
    expected: dummyState
  },
  {
    extraDesc: 'upload failure: happy path',
    action: {
      type: actionTypes.ATTACHMENT_UPLOAD_FAILED,
      payload: { id: 3, errorMessage: 'oops', uploading: false }
    },
    initialState: dummyState,
    expected: [upload1, upload2, { ...upload3, errorMessage: 'oops', uploading: false }]
  },
  {
    extraDesc: 'upload failure: wrong id, returns current state',
    action: {
      type: actionTypes.ATTACHMENT_UPLOAD_FAILED,
      payload: { id: 999, errorMessage: 'oops', uploading: false }
    },
    initialState: dummyState,
    expected: dummyState
  },
  {
    extraDesc: 'upload failure: no id, returns current state',
    action: {
      type: actionTypes.ATTACHMENT_UPLOAD_FAILED,
      payload: { errorMessage: 'oops', uploading: false }
    },
    initialState: dummyState,
    expected: dummyState
  },
  {
    extraDesc: 'upload update: happy path',
    action: {
      type: actionTypes.ATTACHMENT_UPLOAD_UPDATED,
      payload: { id: 3, uploadProgress: 50 }
    },
    initialState: dummyState,
    expected: [upload1, upload2, { ...upload3, uploadProgress: 50 }]
  },
  {
    extraDesc: 'upload update: wrong id, returns current state',
    action: {
      type: actionTypes.ATTACHMENT_UPLOAD_UPDATED,
      payload: { id: 999, uploadProgress: 50 }
    },
    initialState: dummyState,
    expected: dummyState
  },
  {
    extraDesc: 'upload update: no id, returns current state',
    action: {
      type: actionTypes.ATTACHMENT_UPLOAD_UPDATED,
      payload: { uploadProgress: 50 }
    },
    initialState: dummyState,
    expected: dummyState
  },
  {
    extraDesc: 'attachment removal: happy path',
    action: {
      type: actionTypes.ATTACHMENT_REMOVED,
      payload: { id: 1 }
    },
    initialState: dummyState,
    expected: [upload2, upload3]
  },
  {
    extraDesc: 'attachment removal: wrong id, returns current state',
    action: {
      type: actionTypes.ATTACHMENT_REMOVED,
      payload: { id: 999 }
    },
    initialState: dummyState,
    expected: dummyState
  },
  {
    extraDesc: 'attachment removal: no id, returns current state',
    action: {
      type: actionTypes.ATTACHMENT_REMOVED,
      payload: { derp: 'derp' }
    },
    initialState: dummyState,
    expected: dummyState
  },
  {
    extraDesc: 'clearing attachments: returns initial state',
    action: { type: actionTypes.ATTACHMENTS_CLEARED },
    initialState: dummyState,
    expected: initialState
  },
  {
    extraDesc: 'does not respond to clear form API directly',
    action: { type: API_CLEAR_FORM },
    initialState: dummyState,
    expected: dummyState
  },
  {
    extraDesc: 'wrong action type: returns current state',
    action: { type: 'DERP DERP' },
    initialState: dummyState,
    expected: dummyState
  }
])
