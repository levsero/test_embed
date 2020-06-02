import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../fetchForms'
import * as types from '../action-types'
import { http } from 'service/transport'
import { fetchTicketForms } from '../fetchForms'
import {
  TICKET_FORMS_REQUEST_SENT,
  TICKET_FORMS_REQUEST_SUCCESS,
  TICKET_FORMS_REQUEST_FAILURE,
  TICKET_FORM_UPDATE
} from '../action-types'
jest.mock('service/i18n')

describe('fetchTicketForms', () => {
  const createStore = configureMockStore([thunk])

  beforeEach(() => {
    createStore().clearActions()
    http.get = jest.fn(() => {
      return new Promise(resolve => {
        resolve()
      })
    })
  })

  it('does not make a request if one for the same forms and locale has already been done', async () => {
    const store = createStore({
      support: {
        forms: {},
        filteredFormsToDisplay: [],
        ticketFormsRequest: {
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
        filteredFormsToDisplay: [],
        ticketFormsRequest: {
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
            locale: 'en-US',
            active: true
          },
          456: {
            id: 456,
            locale: 'fr',
            active: true
          }
        },
        filteredFormsToDisplay: [123, 456],
        ticketFormsRequest: {
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
            fetchKey: 'en-US/456',
            formIds: [456]
          }
        }
      ])
    )

    expect(http.get).toHaveBeenCalledWith(
      {
        locale: 'en-US',
        path: '/api/v2/ticket_forms/show_many.json?ids=456&include=ticket_fields&locale=en-US'
      },
      false
    )
  })

  it('dispatches a request success action when successful', async () => {
    const response = { body: { ticket_forms: [{ id: 123 }] } }
    http.get = jest.fn(() => {
      return new Promise(resolve => {
        resolve(response)
      })
    })

    const store = createStore({
      support: {
        forms: {},
        filteredFormsToDisplay: [],
        ticketFormsRequest: {
          isLoading: false,
          fetchKey: null
        }
      }
    })
    jest.spyOn(store, 'dispatch')

    await store.dispatch(fetchTicketForms([123], 'en-US'))

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
            fetchKey: 'en-US/123',
            formIds: [123]
          }
        }
      ])
    )
  })

  it('dispatches a ticket form update action when successful and only one form retrieved from api', async () => {
    const response = { body: { ticket_forms: [{ id: 123 }] } }
    http.get = jest.fn(() => {
      return new Promise(resolve => {
        resolve(response)
      })
    })

    const store = createStore({
      support: {
        forms: {},
        filteredFormsToDisplay: [],
        ticketFormsRequest: {
          isLoading: false,
          fetchKey: null
        }
      }
    })
    jest.spyOn(store, 'dispatch')

    await store.dispatch(fetchTicketForms([123], 'en-US'))

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

  it('dispatches a failure action when request failed', async () => {
    http.get = jest.fn(() => {
      return new Promise((resolve, reject) => {
        reject({ message: 'error' })
      })
    })

    const store = createStore({
      support: {
        forms: {},
        filteredFormsToDisplay: [],
        ticketFormsRequest: {
          isLoading: false,
          fetchKey: null
        }
      }
    })
    jest.spyOn(store, 'dispatch')

    await store.dispatch(fetchTicketForms([123], 'en-US'))

    expect(store.getActions()).toEqual(
      expect.arrayContaining([
        {
          type: TICKET_FORMS_REQUEST_FAILURE,
          payload: {
            fetchKey: 'en-US/123',
            formIds: [123]
          }
        }
      ])
    )
  })
})

describe('getTicketFields', () => {
  const mockStore = configureMockStore([thunk])

  const dispatchAction = (customFields = {}, locale) => {
    const store = mockStore({
      base: {
        embeddableConfig: {
          embeds: { ticketSubmissionForm: { props: { customFields: customFields } } }
        }
      }
    })

    store.dispatch(actions.getTicketFields(locale))
    return store
  }

  it('dispatches the request sent action', () => {
    const store = dispatchAction({ ids: ['123'] }, 'ru')

    expect(store.getActions()).toEqual([
      {
        type: types.TICKET_FIELDS_REQUEST_SENT
      }
    ])
  })

  it('sends the expected request payload for ids', () => {
    dispatchAction({ ids: ['123'] }, 'ru')

    expect(http.get).toHaveBeenCalledWith(
      {
        locale: 'ru',
        path: '/embeddable/ticket_fields?field_ids=123&locale=ru'
      },
      false
    )
  })

  it('sends the expected request payload for all', () => {
    dispatchAction({ all: true }, 'th')

    expect(http.get).toHaveBeenCalledWith(
      {
        locale: 'th',
        path: '/embeddable/ticket_fields?locale=th'
      },
      false
    )
  })

  it('dispatches expected actions on failed request', async () => {
    http.get = jest.fn(() => {
      return new Promise((resolve, reject) => {
        reject({ message: 'error' })
      })
    })

    const store = mockStore({
      base: {
        embeddableConfig: {
          embeds: { ticketSubmissionForm: { props: { customFields: { all: true } } } }
        }
      }
    })
    await store.dispatch(actions.getTicketFields('th'))

    expect(store.getActions()).toEqual(
      expect.arrayContaining([
        {
          type: types.TICKET_FIELDS_REQUEST_FAILURE
        }
      ])
    )
  })

  it('dispatches expected actions on successful request', async () => {
    http.get = jest.fn(() => {
      return new Promise(resolve => {
        resolve({ body: { abc: true } })
      })
    })
    const store = mockStore({
      base: {
        embeddableConfig: {
          embeds: { ticketSubmissionForm: { props: { customFields: { all: true } } } }
        }
      }
    })
    await store.dispatch(actions.getTicketFields('th'))

    expect(store.getActions()).toEqual(
      expect.arrayContaining([
        {
          type: types.TICKET_FIELDS_REQUEST_SUCCESS,
          payload: { abc: true }
        }
      ])
    )
  })
})
