import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../fetchForms'
import * as types from '../action-types'
import { http } from 'service/transport'
import * as baseSelectors from 'src/redux/modules/base/base-selectors'
import { fetchTicketForms } from '../fetchForms'
import {
  TICKET_FORMS_REQUEST_SENT,
  TICKET_FORMS_REQUEST_SUCCESS,
  TICKET_FORMS_REQUEST_FAILURE,
  TICKET_FORM_UPDATE
} from '../action-types'

jest.mock('service/transport')
jest.mock('src/redux/modules/submitTicket/submitTicket-selectors')
jest.mock('src/redux/modules/base/base-selectors')
jest.mock('src/redux/modules/submitTicket/helpers/formatter.js')
jest.mock('service/i18n')

describe('fetchTicketForms', () => {
  const createStore = configureMockStore([thunk])

  beforeEach(() => {
    createStore().clearActions()
  })

  it('does not make a request if one for the same forms and locale has already been done', async () => {
    const store = createStore({
      support: {
        forms: {},
        ticketFormsLoading: {
          isLoading: true,
          fetchKey: `en-US/123,456`
        }
      }
    })
    jest.spyOn(store, 'dispatch')

    store.dispatch(fetchTicketForms([123, 456], 'en-US'))

    expect(store.getActions()).not.toEqual(
      expect.arrayContaining([
        {
          type: TICKET_FORMS_REQUEST_SENT,
          payload: {
            fetchKey: 'en-US/123,456'
          }
        }
      ])
    )
  })

  it('does not make a request if there are no forms to request', () => {
    const store = createStore({
      support: {
        forms: {
          123: {
            id: 123,
            locale: 'en-US'
          }
        },
        ticketFormsLoading: {
          isLoading: false,
          fetchKey: null
        }
      }
    })
    jest.spyOn(store, 'dispatch')

    store.dispatch(fetchTicketForms([123], 'en-US'))

    expect(store.getActions()).not.toEqual(
      expect.arrayContaining([
        {
          type: TICKET_FORMS_REQUEST_SENT,
          payload: {
            fetchKey: 'en-US/123,456'
          }
        }
      ])
    )
  })

  it('only requests forms that it has not already downloaded', () => {
    const store = createStore({
      support: {
        forms: {
          123: {
            id: 123,
            locale: 'en-US'
          },
          456: {
            id: 456,
            locale: 'fr'
          }
        },
        ticketFormsLoading: {
          isLoading: false,
          fetchKey: null
        }
      }
    })
    jest.spyOn(store, 'dispatch')

    store.dispatch(fetchTicketForms([123, 456], 'en-US'))

    expect(store.getActions()).toEqual(
      expect.arrayContaining([
        {
          type: TICKET_FORMS_REQUEST_SENT,
          payload: {
            fetchKey: 'en-US/456'
          }
        }
      ])
    )

    expect(http.get.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        path: '/api/v2/ticket_forms/show_many.json?ids=456&include=ticket_fields&locale=en-US'
      })
    )
  })

  it('dispatches a request success action when successful', () => {
    const store = createStore({
      support: {
        forms: {},
        ticketFormsLoading: {
          isLoading: false,
          fetchKey: null
        }
      }
    })
    jest.spyOn(store, 'dispatch')

    store.dispatch(fetchTicketForms([123], 'en-US'))

    const httpCall = http.get.mock.calls[0][0]

    httpCall.callbacks.done({
      text: JSON.stringify({
        ticket_forms: [{ id: 123 }]
      })
    })

    expect(store.getActions()).toEqual(
      expect.arrayContaining([
        {
          type: TICKET_FORMS_REQUEST_SUCCESS,
          payload: {
            ticket_forms: [
              {
                id: 123,
                locale: 'en-US'
              }
            ],
            fetchKey: 'en-US/123'
          }
        }
      ])
    )
  })

  it('dispatches a ticket form update action when successful and only one form retrieved from api', () => {
    const store = createStore({
      support: {
        forms: {},
        ticketFormsLoading: {
          isLoading: false,
          fetchKey: null
        }
      }
    })
    jest.spyOn(store, 'dispatch')

    store.dispatch(fetchTicketForms([123], 'en-US'))

    const httpCall = http.get.mock.calls[0][0]

    httpCall.callbacks.done({
      text: JSON.stringify({
        ticket_forms: [{ id: 123 }]
      })
    })

    expect(store.getActions()).toEqual(
      expect.arrayContaining([
        {
          type: TICKET_FORM_UPDATE,
          payload: {
            id: 123,
            locale: 'en-US'
          }
        }
      ])
    )
  })

  it('dispatches a failure action when request failed', () => {
    const store = createStore({
      support: {
        forms: {},
        ticketFormsLoading: {
          isLoading: false,
          fetchKey: null
        }
      }
    })
    jest.spyOn(store, 'dispatch')

    store.dispatch(fetchTicketForms([123], 'en-US'))

    const httpCall = http.get.mock.calls[0][0]

    httpCall.callbacks.fail()

    expect(store.getActions()).toEqual(
      expect.arrayContaining([
        {
          type: TICKET_FORMS_REQUEST_FAILURE,
          payload: {
            fetchKey: 'en-US/123'
          }
        }
      ])
    )
  })
})

describe('getTicketFields', () => {
  const mockStore = configureMockStore([thunk])

  const dispatchAction = (customFields, locale) => {
    const store = mockStore({})

    store.dispatch(actions.getTicketFields(customFields, locale))
    return store
  }

  it('dispatches the expected action', () => {
    const store = dispatchAction({ ids: '123' }, 'ru')

    expect(store.getActions()).toEqual([
      {
        type: types.TICKET_FIELDS_REQUEST_SENT
      }
    ])
  })

  it('sends the expected request payload for ids', () => {
    dispatchAction({ ids: '123' }, 'ru')

    expect(http.get).toHaveBeenCalledWith(
      {
        callbacks: { done: expect.any(Function), fail: expect.any(Function) },
        locale: 'ru',
        method: 'get',
        path: '/embeddable/ticket_fields?field_ids=123&locale=ru',
        timeout: 20000
      },
      false
    )
  })

  it('sends the expected request payload for all', () => {
    dispatchAction({ all: true, ids: '123' }, 'th')

    expect(http.get).toHaveBeenCalledWith(
      {
        callbacks: { done: expect.any(Function), fail: expect.any(Function) },
        locale: 'th',
        method: 'get',
        path: '/embeddable/ticket_fields?locale=th',
        timeout: 20000
      },
      false
    )
  })

  const doCallback = (callbackType, args) => {
    const store = dispatchAction({})
    const callback = http.get.mock.calls[0][0].callbacks[callbackType]

    callback(args)
    const actions = store.getActions()

    actions.shift()
    return actions
  }

  it('dispatches expected actions on failed request', () => {
    expect(doCallback('fail')).toEqual([
      {
        type: types.TICKET_FIELDS_REQUEST_FAILURE
      }
    ])
  })

  it('dispatches expected actions on successful request', () => {
    expect(doCallback('done', { text: JSON.stringify({ abc: true }) })).toEqual([
      {
        type: types.TICKET_FIELDS_REQUEST_SUCCESS,
        payload: { abc: true }
      }
    ])
  })
})

describe('updateFormsForLocaleChange', () => {
  const mockStore = configureMockStore([thunk])

  const dispatchAction = locale => {
    const store = mockStore({ support: { forms: {}, ticketFormsLoading: {} } })

    store.dispatch(actions.updateFormsForLocaleChange(locale))
    return store
  }

  describe('when ticket forms are enabled', () => {
    beforeEach(() => {
      jest.spyOn(baseSelectors, 'getTicketFormIds').mockReturnValue([10, 20])
    })

    it('calls getTicketForms with ticket form ids and locale', () => {
      const store = dispatchAction('en')

      expect(store.getActions()).toEqual([
        { type: types.TICKET_FORMS_REQUEST_SENT, payload: { fetchKey: 'en/10,20' } }
      ])
    })
  })

  describe('when custom ticket fields are enabled', () => {
    beforeEach(() => {
      jest.spyOn(baseSelectors, 'getTicketFormIds').mockReturnValue(false)
      jest.spyOn(baseSelectors, 'getCustomFieldsAvailable').mockReturnValue(true)
      jest.spyOn(baseSelectors, 'getCustomFieldIds').mockReturnValue({
        ids: [10, 20]
      })
    })

    it('calls getTicketFields with custom fields and locale', () => {
      const store = dispatchAction('en')

      expect(store.getActions()).toEqual([{ type: types.TICKET_FIELDS_REQUEST_SENT }])
    })
  })
})
