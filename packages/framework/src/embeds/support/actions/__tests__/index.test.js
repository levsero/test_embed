import _ from 'lodash'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { ATTACHMENT_ERRORS } from 'src/embeds/support/constants'
import routes from 'src/embeds/support/routes'
import * as supportSelectors from 'src/embeds/support/selectors'
import attachmentSender from 'src/embeds/support/utils/attachment-sender'
import formatRequestData from 'src/embeds/support/utils/requestFormatter'
import { clearFormState } from 'src/redux/modules/form/actions'
import history from 'src/service/history'
import { http } from 'src/service/transport'
import { queuesReset } from 'utility/rateLimiting/helpers'
import * as actions from '..'
import { formPrefilled } from '..'
import * as actionTypes from '../action-types'
import { FORM_PREFILLED } from '../action-types'

jest.mock('src/service/transport')
jest.mock('src/embeds/support/utils/attachment-sender')
jest.mock('src/embeds/support/utils/requestFormatter')
jest.mock('src/service/history')
jest.mock('src/embeds/webWidget/selectors/feature-flags')
jest.mock('src/embeds/support/utils/track-ticket-submitted')

const mockFileBlob2 = {
  name: 'blah2.txt',
  size: 1024,
  type: 'text/plain',
  uploading: false,
  uploadToken: '123',
  id: '1',
}
const mockFileBlob3 = {
  name: 'blah3.txt',
  size: 1024,
  type: 'text/plain',
  uploading: false,
  uploadToken: '123',
  id: '2',
}
const mockFileBlob4 = {
  name: 'blah4.txt',
  size: 1024,
  type: 'text/plain',
  uploading: false,
  uploadToken: '123',
  id: '3',
}
const mockFileBlob5 = {
  name: 'blah5.txt',
  size: 1024,
  type: 'text/plain',
  uploading: false,
  uploadToken: '123',
  id: '4',
}
const mockFileBlob6 = {
  name: 'blah6.txt',
  size: 1024,
  type: 'text/plain',
  uploading: false,
  uploadToken: '123',
  id: '5',
}
const fiveFiles = [mockFileBlob2, mockFileBlob3, mockFileBlob4, mockFileBlob5, mockFileBlob6]

export { mockFileBlob2, mockFileBlob3, mockFileBlob4, mockFileBlob5, mockFileBlob6, fiveFiles }

const mockId = 42
const mockFileBlob = {
  name: 'blah.txt',
  size: 1024,
  type: 'text/plain',
  uploading: false,
  uploadToken: '123',
  id: '42',
}

const mockStore = configureMockStore([thunk])
const dispatchAction = (action) => {
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
      payload: { state: 'blap' },
    }

    expect(actions.submitForm('blap')).toEqual(expected)
  })
})

describe('setActiveFormName', () => {
  it('returns the expected value', () => {
    const expected = {
      type: actionTypes.SET_ACTIVE_FORM_NAME,
      payload: { name: 'blap' },
    }

    expect(actions.setActiveFormName('blap')).toEqual(expected)
  })
})

describe('deleteAttachment', () => {
  let store
  const abortSpy = jest.fn()

  beforeEach(() => {
    attachmentSender.mockReturnValue({ abort: abortSpy })

    store = mockStore()
    store.dispatch(actions.uploadAttachment(mockFileBlob, mockId))
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
        payload: { id: mockId },
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
      const dispatchedActions = dispatchAction(actions.uploadAttachment(mockFileBlob, mockId))

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
          uploadToken: null,
        },
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
        const dispatchedActions = dispatchAction(actions.uploadAttachment(mockFileBlob, mockId))

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
            errorMessage: ATTACHMENT_ERRORS.TOO_LARGE,
            uploadToken: null,
          },
        })
      })
    })
  })

  describe('when the upload is in progress', () => {
    it('dispatches uploadAttachmentUpdate', () => {
      attachmentSender.mockImplementation((_file, _onComplete, _onFailure, onUpdate) => {
        onUpdate({ percent: 50 })
      })

      const dispatchedActions = dispatchAction(actions.uploadAttachment(mockFileBlob, mockId))

      expect(dispatchedActions[1]).toEqual({
        type: actionTypes.ATTACHMENT_UPLOAD_UPDATED,
        payload: { id: mockId, uploadProgress: 50 },
      })
    })
  })

  describe('when the upload completes successfully', () => {
    describe('when the response includes parsable JSON with an upload token', () => {
      it('dispatches ATTACHMENT_UPLOAD_SUCCEEDED and includes that in the payload', () => {
        attachmentSender.mockImplementation((_file, onComplete, _onFailure, _onUpdate) => {
          onComplete({
            text: JSON.stringify({
              upload: { token: 'abc123' },
            }),
          })
        })

        const dispatchedActions = dispatchAction(actions.uploadAttachment(mockFileBlob, mockId))

        expect(dispatchedActions[1]).toEqual({
          type: actionTypes.ATTACHMENT_UPLOAD_SUCCEEDED,
          payload: { id: 42, uploading: false, uploadToken: 'abc123' },
        })
      })
    })

    describe('when the response does not include an upload token', () => {
      it('dispatches ATTACHMENT_UPLOAD_SUCCEEDED and returns a generic error message in the payload', () => {
        attachmentSender.mockImplementation((_file, onComplete, _onFailure, _onUpdate) => {
          onComplete({
            text: JSON.stringify({
              upload: { foo: 'bar' },
            }),
          })
        })

        const dispatchedActions = dispatchAction(actions.uploadAttachment(mockFileBlob, mockId))

        expect(dispatchedActions[1]).toEqual({
          type: actionTypes.ATTACHMENT_UPLOAD_SUCCEEDED,
          payload: {
            id: 42,
            uploading: false,
            errorMessage: ATTACHMENT_ERRORS.UPLOAD_ERROR,
          },
        })
      })
    })

    describe('when the response JSON is unparsable', () => {
      it('dispatches ATTACHMENT_UPLOAD_SUCCEEDED and returns a generic error message in the payload', () => {
        attachmentSender.mockImplementation((_file, onComplete, _onFailure, _onUpdate) => {
          onComplete({ text: 'this is not valid JSON' })
        })

        const dispatchedActions = dispatchAction(actions.uploadAttachment(mockFileBlob, mockId))

        expect(dispatchedActions[1]).toEqual({
          type: actionTypes.ATTACHMENT_UPLOAD_SUCCEEDED,
          payload: {
            id: 42,
            uploading: false,
            errorMessage: ATTACHMENT_ERRORS.UPLOAD_ERROR,
          },
        })
      })
    })
  })

  describe('when the upload fails', () => {
    describe('when an error message is provided in the response', () => {
      it('dispatches ATTACHMENT_UPLOAD_FAILED and provides an error message explaining why', () => {
        attachmentSender.mockImplementation((_file, _onComplete, onFailure, _onUpdate) => {
          onFailure({ message: ATTACHMENT_ERRORS.UPLOAD_ERROR })
        })

        const dispatchedActions = dispatchAction(actions.uploadAttachment(mockFileBlob, mockId))

        expect(dispatchedActions[1]).toEqual({
          type: actionTypes.ATTACHMENT_UPLOAD_FAILED,
          payload: { id: 42, uploading: false, errorMessage: ATTACHMENT_ERRORS.UPLOAD_ERROR },
        })
      })
    })

    describe('when no error message is provided in the response', () => {
      it('dispatches ATTACHMENT_UPLOAD_FAILED and provides a generic error message', () => {
        attachmentSender.mockImplementation((_file, _onComplete, onFailure, _onUpdate) => {
          onFailure({ foo: 'bar' })
        })

        const dispatchedActions = dispatchAction(actions.uploadAttachment(mockFileBlob, mockId))

        expect(dispatchedActions[1]).toEqual({
          type: actionTypes.ATTACHMENT_UPLOAD_FAILED,
          payload: {
            id: 42,
            uploading: false,
            errorMessage: ATTACHMENT_ERRORS.UPLOAD_ERROR,
          },
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

describe('uploadAttachedFiles', () => {
  describe('when using old forms', () => {
    it('dispatches attachmentLimitExceeded when already max attachments', () => {
      const store = mockStore({
        support: { config: { maxFileCount: 5 }, attachments: fiveFiles },
      })
      store.dispatch(actions.uploadAttachedFiles([mockFileBlob], undefined, {}))

      const dispatchedActions = store.getActions()

      expect(dispatchedActions[0]).toEqual({
        type: actionTypes.ATTACHMENT_LIMIT_EXCEEDED,
      })
    })

    it('dispatches uploadAttachment for files', () => {
      const store = mockStore({
        support: { config: { maxFileCount: 5 }, attachments: [] },
      })
      store.dispatch(actions.uploadAttachedFiles([mockFileBlob2, mockFileBlob3], undefined, {}))
      const dispatchedActions = store.getActions()

      expect(dispatchedActions).toMatchInlineSnapshot(`
        Array [
          Object {
            "payload": Object {
              "errorMessage": null,
              "fileName": "blah2.txt",
              "fileSize": 1024,
              "fileType": "text/plain",
              "fileUrl": null,
              "id": 42,
              "uploadProgress": 0,
              "uploadToken": null,
              "uploading": true,
            },
            "type": "widget/support/ATTACHMENT_UPLOAD_REQUESTED",
          },
          Object {
            "payload": Object {
              "errorMessage": null,
              "fileName": "blah3.txt",
              "fileSize": 1024,
              "fileType": "text/plain",
              "fileUrl": null,
              "id": 42,
              "uploadProgress": 0,
              "uploadToken": null,
              "uploading": true,
            },
            "type": "widget/support/ATTACHMENT_UPLOAD_REQUESTED",
          },
        ]
      `)
    })

    it('with existing attachments handles additional attachments', () => {
      const store = mockStore({
        support: {
          config: { maxFileCount: 5 },
          attachments: [mockFileBlob2, mockFileBlob3],
        },
      })
      store.dispatch(actions.uploadAttachedFiles(fiveFiles, undefined, {}))
      const dispatchedActions = store.getActions()

      expect(dispatchedActions[0].type).toEqual(actionTypes.ATTACHMENT_UPLOAD_REQUESTED)
      expect(dispatchedActions[1].type).toEqual(actionTypes.ATTACHMENT_UPLOAD_REQUESTED)
      expect(dispatchedActions[2].type).toEqual(actionTypes.ATTACHMENT_UPLOAD_REQUESTED)
      expect(dispatchedActions[3].type).toEqual(actionTypes.ATTACHMENT_LIMIT_EXCEEDED)
    })
  })

  describe('when using new forms', () => {
    let updateFinalForm
    beforeEach(() => {
      updateFinalForm = jest.fn()
    })
    it('updates final form when already max attachments', () => {
      const store = mockStore({
        support: { config: { maxFileCount: 5 }, attachments: fiveFiles },
      })
      store.dispatch(
        actions.uploadAttachedFiles([mockFileBlob], updateFinalForm, {
          ids: ['1', '2', '3', '4', '5'],
        })
      )

      const dispatchedActions = store.getActions()

      expect(updateFinalForm).toHaveBeenCalledWith({
        ids: ['1', '2', '3', '4', '5'],
        limitExceeded: true,
      })
      expect(dispatchedActions).toEqual([])
    })

    it('dispatches uploadAttachment for files', () => {
      const store = mockStore({
        support: { config: { maxFileCount: 5 }, attachments: [] },
      })
      store.dispatch(
        actions.uploadAttachedFiles([mockFileBlob2, mockFileBlob3], updateFinalForm, { ids: [] })
      )
      const dispatchedActions = store.getActions()

      expect(dispatchedActions).toMatchInlineSnapshot(`
        Array [
          Object {
            "payload": Object {
              "errorMessage": null,
              "fileName": "blah2.txt",
              "fileSize": 1024,
              "fileType": "text/plain",
              "fileUrl": null,
              "id": 42,
              "uploadProgress": 0,
              "uploadToken": null,
              "uploading": true,
            },
            "type": "widget/support/ATTACHMENT_UPLOAD_REQUESTED",
          },
          Object {
            "payload": Object {
              "errorMessage": null,
              "fileName": "blah3.txt",
              "fileSize": 1024,
              "fileType": "text/plain",
              "fileUrl": null,
              "id": 42,
              "uploadProgress": 0,
              "uploadToken": null,
              "uploading": true,
            },
            "type": "widget/support/ATTACHMENT_UPLOAD_REQUESTED",
          },
        ]
      `)
    })

    it('with existing attachments handles additional attachments', () => {
      jest
        .spyOn(_, 'uniqueId')
        .mockReturnValueOnce('10')
        .mockReturnValueOnce('11')
        .mockReturnValueOnce('12')
        .mockReturnValueOnce('13')
        .mockReturnValueOnce('14')
      const store = mockStore({
        support: {
          config: { maxFileCount: 5 },
          attachments: [mockFileBlob2, mockFileBlob3],
        },
      })
      store.dispatch(
        actions.uploadAttachedFiles(fiveFiles, updateFinalForm, {
          ids: ['1', '2'],
          limitExceeded: false,
        })
      )
      const dispatchedActions = store.getActions()

      expect(dispatchedActions[0].type).toEqual(actionTypes.ATTACHMENT_UPLOAD_REQUESTED)
      expect(dispatchedActions[1].type).toEqual(actionTypes.ATTACHMENT_UPLOAD_REQUESTED)
      expect(dispatchedActions[2].type).toEqual(actionTypes.ATTACHMENT_UPLOAD_REQUESTED)
      expect(dispatchedActions.length).toEqual(3)

      expect(updateFinalForm).toHaveBeenCalledWith({
        ids: ['10', '11', '12', '1', '2'],
        limitExceeded: true,
      })
      expect(updateFinalForm).toHaveBeenCalledTimes(1)
    })
  })
})

describe('submitTicket', () => {
  beforeEach(() => {
    formatRequestData.mockReturnValue('params')
    queuesReset()
  })

  it('sends the expected request and action', () => {
    const state = {
      support: { attachments: [{ id: '123', uploadToken: 'uploadToken-123' }] },
    }
    const formState = { attachments: { ids: ['123'] } }
    const formTitle = 'contact-form'
    const fields = []
    const store = mockStore(state)

    store.dispatch(actions.submitTicket(formState, formTitle, fields))
    expect(http.send).toHaveBeenCalledWith({
      callbacks: { done: expect.any(Function), fail: expect.any(Function) },
      method: 'post',
      params: 'params',
      path: '/api/v2/requests',
    })
    expect(formatRequestData).toHaveBeenCalledWith(
      state,
      formState,
      ['uploadToken-123'],
      formTitle,
      fields
    )
    expect(store.getActions()[0]).toEqual({ type: actionTypes.TICKET_SUBMISSION_REQUEST_SENT })
  })

  it('dispatches expected actions on successful request', () => {
    const store = mockStore()

    store.dispatch(actions.submitTicket([1, 2, 3], 'contact-form'))

    const cb = http.send.mock.calls[0][0].callbacks.done

    cb({ text: JSON.stringify({ a: 123 }) })

    expect(store.getActions()[1]).toEqual({
      type: actionTypes.TICKET_SUBMISSION_REQUEST_SUCCESS,
      payload: { name: 'contact-form' },
    })
  })

  it('clears the form when the form submission was successful', () => {
    const store = mockStore()

    store.dispatch(actions.submitTicket([1, 2, 3], 'contact-form'))

    const cb = http.send.mock.calls[0][0].callbacks.done

    cb({ text: JSON.stringify({ a: 123 }) })

    expect(store.getActions()).toContainEqual(clearFormState('support-contact-form'))
  })

  it('replaces history with the success page onto history', () => {
    const store = mockStore()

    store.dispatch(actions.submitTicket([1, 2, 3], 'contact-form'))

    const cb = http.send.mock.calls[0][0].callbacks.done

    cb({ text: JSON.stringify({ a: 123 }) })

    expect(history.replace).toHaveBeenCalledWith(routes.success())
  })

  it('dispatches expected actions on failed timeout request', () => {
    const store = mockStore()

    store.dispatch(actions.submitTicket([1, 2, 3], 'contact-form'))

    const cb = http.send.mock.calls[0][0].callbacks.fail

    cb({ timeout: true })

    expect(store.getActions()[1]).toEqual({
      type: actionTypes.TICKET_SUBMISSION_REQUEST_FAILURE,
      payload: 'There was a problem. Please try again.',
    })
  })

  it('dispatches expected actions on failed error request', () => {
    const store = mockStore()

    store.dispatch(actions.submitTicket([1, 2, 3], 'contact-form'))

    const cb = http.send.mock.calls[0][0].callbacks.fail

    cb({ something: 'else' })

    expect(store.getActions()[1]).toEqual({
      type: actionTypes.TICKET_SUBMISSION_REQUEST_FAILURE,
      payload: 'There was an error processing your request. Please try again later.',
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
        prefillId: 456,
      },
    })
  })
})
