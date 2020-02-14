import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../fetchForms'
import * as types from '../action-types'
import { http } from 'service/transport'
import * as baseSelectors from 'src/redux/modules/base/base-selectors'

jest.mock('service/transport')
jest.mock('src/redux/modules/submitTicket/submitTicket-selectors')
jest.mock('src/redux/modules/base/base-selectors')
jest.mock('src/redux/modules/submitTicket/helpers/formatter.js')

const mockStore = configureMockStore([thunk])

describe('getTicketForms', () => {
  const dispatchAction = (customFields, locale) => {
    const store = mockStore({})

    store.dispatch(actions.getTicketForms(customFields, locale))
    return store
  }

  it('dispatches the expected action', () => {
    const store = dispatchAction()

    expect(store.getActions()).toEqual([
      {
        type: types.TICKET_FORMS_REQUEST_SENT
      }
    ])
  })

  it('sends the expected request payload', () => {
    dispatchAction('123', 'ru')

    expect(http.get).toHaveBeenCalledWith(
      {
        callbacks: { done: expect.any(Function), fail: expect.any(Function) },
        locale: 'ru',
        method: 'get',
        path: '/api/v2/ticket_forms/show_many.json?ids=123&include=ticket_fields&locale=ru',
        timeout: 20000
      },
      false
    )
  })

  const doCallback = (callbackType, args) => {
    const store = dispatchAction()
    const callback = http.get.mock.calls[0][0].callbacks[callbackType]

    callback(args)
    const actions = store.getActions()

    actions.shift()
    return actions
  }

  it('dispatches expected actions on failed request', () => {
    expect(doCallback('fail')).toEqual([
      {
        type: types.TICKET_FORMS_REQUEST_FAILURE
      }
    ])
  })

  it('dispatches expected actions on successful request with a single form payload', () => {
    const payload = {
      ticket_forms: ['a'] // eslint-disable-line camelcase
    }

    expect(doCallback('done', { text: JSON.stringify(payload) })).toEqual([
      {
        type: types.TICKET_FORMS_REQUEST_SUCCESS,
        payload
      },
      {
        type: types.TICKET_FORM_UPDATE,
        payload: 'a'
      }
    ])
  })

  it('dispatches expected actions on successful request with a no forms payload', () => {
    const payload = {
      ticket_forms: [] // eslint-disable-line camelcase
    }

    expect(doCallback('done', { text: JSON.stringify(payload) })).toEqual([
      {
        type: types.TICKET_FORMS_REQUEST_SUCCESS,
        payload
      }
    ])
  })

  it('dispatches expected actions on successful request with multiple forms payload', () => {
    const payload = {
      ticket_forms: ['a', 'b'] // eslint-disable-line camelcase
    }

    expect(doCallback('done', { text: JSON.stringify(payload) })).toEqual([
      {
        type: types.TICKET_FORMS_REQUEST_SUCCESS,
        payload
      }
    ])
  })
})

describe('getTicketFields', () => {
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
  const dispatchAction = locale => {
    const store = mockStore({})

    store.dispatch(actions.updateFormsForLocaleChange(locale))
    return store
  }

  describe('when ticket forms are enabled', () => {
    beforeEach(() => {
      jest.spyOn(baseSelectors, 'getTicketFormIds').mockReturnValue([10, 20])
    })

    it('calls getTicketForms with ticket form ids and locale', () => {
      const store = dispatchAction('en')

      expect(store.getActions()).toEqual([{ type: types.TICKET_FORMS_REQUEST_SENT }])
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
