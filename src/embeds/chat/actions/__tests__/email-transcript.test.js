import * as actionTypes from '../action-types'
import * as actions from '../email-transcript'
import { zChatWithTimeout } from 'src/redux/modules/chat/helpers/zChatWithTimeout'
import { createMockStore } from 'utility/testHelpers'

jest.mock('src/redux/modules/chat/helpers/zChatWithTimeout')

describe('sendEmailTranscript', () => {
  const mockEmail = 'It was the best of times, it was the worst of times.'

  it('dispatches a EMAIL_TRANSCRIPT_REQUEST_SENT action', () => {
    zChatWithTimeout.mockReturnValue((email, callback) => {
      callback()
    })

    const store = createMockStore()

    store.dispatch(actions.sendEmailTranscript(mockEmail))

    const dispatchedActions = store.getActions()

    expect(dispatchedActions).toContainEqual({
      type: actionTypes.EMAIL_TRANSCRIPT_REQUEST_SENT,
      payload: mockEmail
    })
  })

  it('dispatches EMAIL_TRANSCRIPT_SUCCESS when email transcript was successful', () => {
    zChatWithTimeout.mockReturnValue((email, callback) => {
      callback()
    })

    const store = createMockStore()

    store.dispatch(actions.sendEmailTranscript(mockEmail))

    const dispatchedActions = store.getActions()

    expect(dispatchedActions).toContainEqual({
      type: actionTypes.EMAIL_TRANSCRIPT_SUCCESS,
      payload: mockEmail
    })
  })

  it('dispatches EMAIL_TRANSCRIPT_FAILURE when email transcript was not successful', () => {
    zChatWithTimeout.mockReturnValue((email, callback) => {
      callback(new Error('some error'))
    })

    const store = createMockStore()

    store.dispatch(actions.sendEmailTranscript(mockEmail))

    const dispatchedActions = store.getActions()

    expect(dispatchedActions).toContainEqual({
      type: actionTypes.EMAIL_TRANSCRIPT_FAILURE,
      payload: mockEmail
    })
  })

  it('resolves the promise when the request was not successful', () => {
    zChatWithTimeout.mockReturnValue((email, callback) => {
      callback()
    })

    const store = createMockStore()

    const result = store.dispatch(actions.sendEmailTranscript(mockEmail))

    expect(result).resolves.toEqual(undefined)
  })

  it('rejects the promise when the request was not successful', () => {
    zChatWithTimeout.mockReturnValue((email, callback) => {
      callback(new Error('some error'))
    })

    const store = createMockStore()

    const result = store.dispatch(actions.sendEmailTranscript(mockEmail))

    expect(result).rejects.toEqual(undefined)
  })
})
