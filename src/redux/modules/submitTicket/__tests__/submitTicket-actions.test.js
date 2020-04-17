import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../submitTicket-actions'
import * as types from '../submitTicket-action-types'
import { http } from 'service/transport'
import * as selectors from 'src/redux/modules/submitTicket/submitTicket-selectors'
import * as formatters from '../helpers/formatter'
import { queuesReset } from 'utility/rateLimiting/helpers'

jest.mock('service/transport')
jest.mock('src/redux/modules/submitTicket/submitTicket-selectors')
jest.mock('src/redux/modules/base/base-selectors')
jest.mock('../helpers/formatter')

const mockStore = configureMockStore([thunk])

test('handleFormChange dispatches expected action', () => {
  const expected = {
    type: types.FORM_ON_CHANGE,
    payload: { a: true }
  }

  expect(actions.handleFormChange({ a: true })).toEqual(expected)
})

test('handleTicketFormClick dispatches expected action', () => {
  const expected = {
    type: types.TICKET_FORM_UPDATE,
    payload: { a: true }
  }

  expect(actions.handleTicketFormClick({ a: true })).toEqual(expected)
})

describe('handleTicketSubmission', () => {
  beforeEach(() => {
    selectors.getFormState = jest.fn(() => 'formState')
    selectors.getTicketFormsAvailable = jest.fn(() => 'ticketFormsAvailable')
    selectors.getTicketFields = jest.fn(() => 'ticketFields')
    selectors.getActiveTicketForm = jest.fn(() => 'activeTicketForm')
    formatters.formatRequestData.mockReturnValue('params')
    queuesReset()
  })

  it('sends the expected request and action', () => {
    const store = mockStore({}),
      done = jest.fn(),
      fail = jest.fn()

    store.dispatch(actions.handleTicketSubmission([1, 2, 3], done, fail))
    expect(formatters.formatRequestData).toHaveBeenCalledWith(
      {},
      'formState',
      'ticketFormsAvailable',
      'ticketFields',
      'activeTicketForm',
      [1, 2, 3]
    )
    expect(http.send).toHaveBeenCalledWith({
      callbacks: { done: expect.any(Function), fail: expect.any(Function) },
      method: 'post',
      params: 'params',
      path: '/api/v2/requests'
    })
    expect(store.getActions()).toEqual([{ type: types.TICKET_SUBMISSION_REQUEST_SENT }])
  })

  it('dispatches expected actions on successful request', () => {
    const store = mockStore({}),
      done = jest.fn(),
      fail = jest.fn()

    store.dispatch(actions.handleTicketSubmission([1, 2, 3], done, fail))

    const cb = http.send.mock.calls[0][0].callbacks.done

    cb({ text: JSON.stringify({ a: 123 }) })
    const dispatchedActions = store.getActions()

    dispatchedActions.shift()
    expect(dispatchedActions).toEqual([
      {
        type: types.TICKET_SUBMISSION_REQUEST_SUCCESS,
        payload: { a: 123 }
      }
    ])
    expect(done).toHaveBeenCalledWith({ text: JSON.stringify({ a: 123 }) })
  })

  it('dispatches expected actions on failed timeout request', () => {
    const store = mockStore({}),
      done = jest.fn(),
      fail = jest.fn()

    store.dispatch(actions.handleTicketSubmission([1, 2, 3], done, fail))

    const cb = http.send.mock.calls[0][0].callbacks.fail

    cb({ timeout: true })
    const dispatchedActions = store.getActions()

    dispatchedActions.shift()
    expect(dispatchedActions).toEqual([
      {
        type: types.TICKET_SUBMISSION_REQUEST_FAILURE,
        payload: 'There was a problem. Please try again.'
      }
    ])
    expect(fail).toHaveBeenCalledWith({ timeout: true })
  })

  it('dispatches expected actions on failed error request', () => {
    const store = mockStore({}),
      done = jest.fn(),
      fail = jest.fn()

    store.dispatch(actions.handleTicketSubmission([1, 2, 3], done, fail))

    const cb = http.send.mock.calls[0][0].callbacks.fail

    cb({ something: 'else' })
    const dispatchedActions = store.getActions()

    dispatchedActions.shift()
    expect(dispatchedActions).toEqual([
      {
        type: types.TICKET_SUBMISSION_REQUEST_FAILURE,
        payload: 'There was an error processing your request. Please try again later.'
      }
    ])
    expect(fail).toHaveBeenCalledWith({ something: 'else' })
  })
})
