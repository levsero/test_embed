import _ from 'lodash'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import * as actions from '..'
import * as actionTypes from '../action-types'
import attachmentSender from 'src/embeds/support/utils/attachment-sender'
import * as supportSelectors from 'src/embeds/support/selectors'
import { http } from 'service/transport'
import formatRequestData from 'src/embeds/support/utils/requestFormatter'
import { queuesReset } from 'utility/rateLimiting/helpers'
import { formPrefilled } from '..'
import { FORM_PREFILLED } from '../action-types'

jest.mock('lodash')
jest.mock('service/transport')
jest.mock('src/embeds/support/utils/attachment-sender')
jest.mock('src/embeds/support/utils/requestFormatter')

const mockId = 42
const mockFileBlob = { name: 'blah.txt', size: 1024, type: 'text/plain' }
const mockStore = configureMockStore([thunk])
const dispatchAction = action => {
  const store = mockStore()

  store.dispatch(action)
  return store.getActions()
}

beforeEach(() => {
  jest.spyOn(_, 'uniqueId').mockReturnValue(mockId)
  jest.spyOn(supportSelectors, 'getMaxFileSize').mockReturnValue(5 * 1024 * 1024)
})

describe('submitForm', () => {
  it('returns the expected value', () => {
    const expected = {
      type: actionTypes.SUBMITTED_FORM,
      payload: { state: 'blap' }
    }

    expect(actions.submitForm('blap')).toEqual(expected)
  })
})

describe('setActiveFormName', () => {
  it('returns the expected value', () => {
    const expected = {
      type: actionTypes.SET_ACTIVE_FORM_NAME,
      payload: { name: 'blap' }
    }

    expect(actions.setActiveFormName('blap')).toEqual(expected)
  })
})

describe('setFormState', () => {
  it('returns the expected value', () => {
    const expected = {
      type: actionTypes.SET_FORM_STATE,
      payload: { name: 'hello', newFormState: { fieldA: 'friend' } }
    }

    expect(actions.setFormState('hello', { fieldA: 'friend' })).toEqual(expected)
  })
})

describe('clearFormState', () => {
  it('return the expected type', () => {
    expect(actions.clearFormState('boop')).toEqual({
      type: actionTypes.CLEARED_FORM_STATE,
      payload: { name: 'boop' }
    })
  })
})

describe('clearFormStates', () => {
  it('return the expected type', () => {
    expect(actions.clearFormStates()).toEqual({ type: actionTypes.CLEARED_FORM_STATES })
  })
})

describe('deleteAttachment', () => {
  let store
  const abortSpy = jest.fn()

  beforeEach(() => {
    attachmentSender.mockReturnValue({ abort: abortSpy })

    store = mockStore()
    store.dispatch(actions.uploadAttachment(mockFileBlob))
  })

  describe('when called with a valid id', () => {
    beforeEach(() => {
      store.dispatch(actions.deleteAttachment(mockId))
    })

    it('calls abort on the fileSender', () => {
      expect(abortSpy).toHaveBeenCalled()
    })

    it('dispatches removeAttachment with the passed id', () => {
      const dispatchedActions = store.getActions()

      expect(dispatchedActions[1]).toEqual({
        type: actionTypes.ATTACHMENT_REMOVED,
        payload: { id: mockId }
      })
    })
  })

  describe('when called with an invalid id', () => {
    beforeEach(() => {
      store.dispatch(actions.deleteAttachment(999))
    })

    it('does not call abort', () => {
      expect(abortSpy).not.toHaveBeenCalled()
    })

    it('does not throw an error', () => {
      expect(actions.deleteAttachment).not.toThrow()
    })
  })
})

describe('uploadAttachment', () => {
  describe('on initial execution', () => {
    it('dispatches an ATTACHMENT_UPLOAD_REQUESTED action', () => {
      const dispatchedActions = dispatchAction(actions.uploadAttachment(mockFileBlob))

      expect(dispatchedActions[0]).toEqual({
        type: actionTypes.ATTACHMENT_UPLOAD_REQUESTED,
        payload: {
          id: mockId,
          fileName: mockFileBlob.name,
          fileSize: mockFileBlob.size,
          fileType: mockFileBlob.type,
          fileUrl: null,
          uploading: true,
          uploadProgress: 0,
          errorMessage: null,
          uploadToken: null
        }
      })
    })

    describe('when the file is of an unknown type', () => {
      const mockFileBlob = { name: 'blah.txt', size: 1024, type: undefined }

      it('falls back to "appliction/octet-stream', () => {
        const dispatchedActions = dispatchAction(actions.uploadAttachment(mockFileBlob))

        expect(dispatchedActions[0].payload.fileType).toEqual('application/octet-stream')
      })
    })

    describe('when the file is within size limit', () => {
      it('calls the attachmentSender, passing the file and callbacks', () => {
        dispatchAction(actions.uploadAttachment(mockFileBlob))

        expect(attachmentSender).toHaveBeenCalledWith(
          mockFileBlob,
          expect.any(Function),
          expect.any(Function),
          expect.any(Function)
        )
      })
    })

    describe('when the file exceeds size limit', () => {
      beforeEach(() => {
        jest.spyOn(supportSelectors, 'getMaxFileSize').mockReturnValue(0)
      })

      it('does not call the attachment sender', () => {
        dispatchAction(actions.uploadAttachment(mockFileBlob))

        expect(attachmentSender).not.toHaveBeenCalled()
      })

      it('sets uploading to "false" and errorMessage to "file too big"', () => {
        const dispatchedActions = dispatchAction(actions.uploadAttachment(mockFileBlob))

        expect(dispatchedActions[0]).toEqual({
          type: actionTypes.ATTACHMENT_UPLOAD_REQUESTED,
          payload: {
            id: mockId,
            fileName: mockFileBlob.name,
            fileSize: mockFileBlob.size,
            fileType: mockFileBlob.type,
            fileUrl: null,
            uploading: false,
            uploadProgress: 0,
            errorMessage: 'The file is too big. Please attach files that are less than 0 MB.',
            uploadToken: null
          }
        })
      })
    })
  })

  describe('when the upload is in progress', () => {
    it('dispatches uploadAttachmentUpdate', () => {
      attachmentSender.mockImplementation((_file, _onComplete, _onFailure, onUpdate) => {
        onUpdate({ percent: 50 })
      })

      const dispatchedActions = dispatchAction(actions.uploadAttachment(mockFileBlob))

      expect(dispatchedActions[1]).toEqual({
        type: actionTypes.ATTACHMENT_UPLOAD_UPDATED,
        payload: { id: mockId, uploadProgress: 50 }
      })
    })
  })

  describe('when the upload completes successfully', () => {
    describe('when the response includes parsable JSON with an upload token', () => {
      it('dispatches ATTACHMENT_UPLOAD_SUCCEEDED and includes that in the payload', () => {
        attachmentSender.mockImplementation((_file, onComplete, _onFailure, _onUpdate) => {
          onComplete({
            text: JSON.stringify({
              upload: { token: 'abc123' }
            })
          })
        })

        const dispatchedActions = dispatchAction(actions.uploadAttachment(mockFileBlob))

        expect(dispatchedActions[1]).toEqual({
          type: actionTypes.ATTACHMENT_UPLOAD_SUCCEEDED,
          payload: { id: 42, uploading: false, uploadToken: 'abc123' }
        })
      })
    })

    describe('when the response does not include an upload token', () => {
      it('dispatches ATTACHMENT_UPLOAD_SUCCEEDED and returns a generic error message in the payload', () => {
        attachmentSender.mockImplementation((_file, onComplete, _onFailure, _onUpdate) => {
          onComplete({
            text: JSON.stringify({
              upload: { foo: 'bar' }
            })
          })
        })

        const dispatchedActions = dispatchAction(actions.uploadAttachment(mockFileBlob))

        expect(dispatchedActions[1]).toEqual({
          type: actionTypes.ATTACHMENT_UPLOAD_SUCCEEDED,
          payload: {
            id: 42,
            uploading: false,
            errorMessage: 'Upload failed. Something went wrong. Please try again.'
          }
        })
      })
    })

    describe('when the response JSON is unparsable', () => {
      it('dispatches ATTACHMENT_UPLOAD_SUCCEEDED and returns a generic error message in the payload', () => {
        attachmentSender.mockImplementation((_file, onComplete, _onFailure, _onUpdate) => {
          onComplete({ text: 'this is not valid JSON' })
        })

        const dispatchedActions = dispatchAction(actions.uploadAttachment(mockFileBlob))

        expect(dispatchedActions[1]).toEqual({
          type: actionTypes.ATTACHMENT_UPLOAD_SUCCEEDED,
          payload: {
            id: 42,
            uploading: false,
            errorMessage: 'Upload failed. Something went wrong. Please try again.'
          }
        })
      })
    })
  })

  describe('when the upload fails', () => {
    describe('when an error message is provided in the response', () => {
      it('dispatches ATTACHMENT_UPLOAD_FAILED and provides an error message explaining why', () => {
        attachmentSender.mockImplementation((_file, _onComplete, onFailure, _onUpdate) => {
          onFailure({ message: 'oops!' })
        })

        const dispatchedActions = dispatchAction(actions.uploadAttachment(mockFileBlob))

        expect(dispatchedActions[1]).toEqual({
          type: actionTypes.ATTACHMENT_UPLOAD_FAILED,
          payload: { id: 42, uploading: false, errorMessage: 'oops!' }
        })
      })
    })

    describe('when no error message is provided in the response', () => {
      it('dispatches ATTACHMENT_UPLOAD_FAILED and provides a generic error message', () => {
        attachmentSender.mockImplementation((_file, _onComplete, onFailure, _onUpdate) => {
          onFailure({ foo: 'bar' })
        })

        const dispatchedActions = dispatchAction(actions.uploadAttachment(mockFileBlob))

        expect(dispatchedActions[1]).toEqual({
          type: actionTypes.ATTACHMENT_UPLOAD_FAILED,
          payload: {
            id: 42,
            uploading: false,
            errorMessage: 'Upload failed. Something went wrong. Please try again.'
          }
        })
      })
    })
  })
})

describe('clearAttachments', () => {
  it('dispatches an ATTACHMENTS_CLEARED action', () => {
    const dispatchedActions = dispatchAction(actions.clearAttachments())

    expect(dispatchedActions).toEqual([{ type: actionTypes.ATTACHMENTS_CLEARED }])
  })

  it('removes references to previous attachmentSenders', () => {
    const store = mockStore()
    const abortSpy = jest.fn()

    attachmentSender.mockReturnValue({ abort: abortSpy })
    store.dispatch(actions.uploadAttachment(mockFileBlob))
    store.dispatch(actions.clearAttachments())
    store.dispatch(actions.deleteAttachment(mockId))

    expect(abortSpy).not.toHaveBeenCalled()
  })
})

describe('submitTicket', () => {
  beforeEach(() => {
    formatRequestData.mockReturnValue('params')
    queuesReset()
  })

  it('sends the expected request and action', () => {
    const store = mockStore()

    store.dispatch(actions.submitTicket([1, 2, 3], 'contact-form'))
    expect(http.send).toHaveBeenCalledWith({
      callbacks: { done: expect.any(Function), fail: expect.any(Function) },
      method: 'post',
      params: 'params',
      path: '/api/v2/requests'
    })
    expect(store.getActions()[0]).toEqual({ type: actionTypes.TICKET_SUBMISSION_REQUEST_SENT })
  })

  it('dispatches expected actions on successful request', () => {
    const store = mockStore()

    store.dispatch(actions.submitTicket([1, 2, 3], 'contact-form'))

    const cb = http.send.mock.calls[0][0].callbacks.done

    cb({ text: JSON.stringify({ a: 123 }) })

    expect(store.getActions()[1]).toEqual({
      type: actionTypes.TICKET_SUBMISSION_REQUEST_SUCCESS,
      payload: { a: 123 }
    })
  })

  it('dispatches expected actions on failed timeout request', () => {
    const store = mockStore()

    store.dispatch(actions.submitTicket([1, 2, 3], 'contact-form'))

    const cb = http.send.mock.calls[0][0].callbacks.fail

    cb({ timeout: true })

    expect(store.getActions()[1]).toEqual({
      type: actionTypes.TICKET_SUBMISSION_REQUEST_FAILURE,
      payload: 'There was a problem. Please try again.'
    })
  })

  it('dispatches expected actions on failed error request', () => {
    const store = mockStore()

    store.dispatch(actions.submitTicket([1, 2, 3], 'contact-form'))

    const cb = http.send.mock.calls[0][0].callbacks.fail

    cb({ something: 'else' })

    expect(store.getActions()[1]).toEqual({
      type: actionTypes.TICKET_SUBMISSION_REQUEST_FAILURE,
      payload: 'There was an error processing your request. Please try again later.'
    })
  })
})

describe('formPrefilled', () => {
  it('returns a redux actions that describes a form has just updated with prefill values', () => {
    const result = formPrefilled(123, 456)

    expect(result).toEqual({
      type: FORM_PREFILLED,
      payload: {
        formId: 123,
        prefillId: 456
      }
    })
  })
})
