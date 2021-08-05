import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as types from 'src/embeds/talk/action-types'
import createStore from 'src/redux/createStore'
import * as baseTypes from 'src/redux/modules/base/base-action-types'
import * as baseSelectors from 'src/redux/modules/selectors/selectors'
import { MAX_TALK_POLL_INTERVAL, BASE_TALK_POLL_INTERVAL } from 'src/redux/modules/talk/constants'
import { http, socketio } from 'src/service/transport'
import * as actions from '../talk-actions'

jest.useFakeTimers()

jest.mock('src/service/transport')

const mockStore = configureMockStore([thunk])

test('updateTalkAgentAvailability dispatches TALK_AGENT_AVAILABILITY_SOCKET_EVENT action', () => {
  const expected = {
    type: types.TALK_AGENT_AVAILABILITY_SOCKET_EVENT,
    payload: { agentAvailability: true },
  }

  expect(actions.updateTalkAgentAvailability({ agentAvailability: true })).toEqual(expected)
})

test('updateTalkEmbeddableConfig dispatches TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT action', () => {
  const mockConfig = {
    agentAvailability: false,
    averageWaitTime: '2',
    capability: '0',
    enabled: false,
    nickname: '',
    phoneNumber: '',
  }
  const action = actions.updateTalkEmbeddableConfig(mockConfig)

  expect(action).toEqual({
    type: types.TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT,
    payload: mockConfig,
  })
})

test('updateTalkAverageWaitTime dispatches TALK_AVERAGE_WAIT_TIME_SOCKET_EVENT action', () => {
  const expected = {
    type: types.TALK_AVERAGE_WAIT_TIME_SOCKET_EVENT,
    payload: '5',
  }

  expect(actions.updateTalkAverageWaitTime('5')).toEqual(expected)
})

test('talkDisconnect dispatches TALK_DISCONNECT_SOCKET_EVENT action', () => {
  const expected = {
    type: types.TALK_DISCONNECT_SOCKET_EVENT,
  }

  expect(actions.talkDisconnect()).toEqual(expected)
})

test('updateTalkCallMeForm dispatches expected actions', () => {
  const formState = {
    phone: '+61423423329',
    name: 'ally',
    email: 'Allly@ally.com',
    description: 'Pleaseee help me.',
  }
  const expected = {
    type: types.UPDATE_CALLBACK_FORM,
    payload: {
      phone: '+61423423329',
      name: 'ally',
      email: 'Allly@ally.com',
      description: 'Pleaseee help me.',
    },
  }

  expect(actions.updateTalkCallbackForm(formState)).toEqual(expected)
})

describe('submitTalkCallbackForm', () => {
  const dispatchAction = () => {
    const formState = {
        phone: '+61423456789',
        name: 'Johnny',
        email: 'Johnny@john.com',
        description: 'Please help me.',
      },
      serviceUrl = 'https://customer.blah.com',
      nickname = 'Support',
      store = mockStore({
        talk: { formState },
      })

    store.dispatch(actions.submitTalkCallbackForm(serviceUrl, nickname))

    return store
  }

  it('calls callMeRequest with expected payload', () => {
    const expectedPayload = {
      params: {
        phoneNumber: '+61423456789',
        additionalInfo: {
          name: 'Johnny',
          description: 'Please help me.',
        },
        subdomain: 'customer',
        keyword: 'Support',
      },
      callbacks: { done: expect.any(Function), fail: expect.any(Function) },
    }

    dispatchAction()
    expect(http.callMeRequest).toHaveBeenCalledWith('https://customer.blah.com', expectedPayload)
  })

  it('dispatches an action with the form state', () => {
    const store = dispatchAction()

    expect(store.getActions()).toEqual([
      {
        type: types.TALK_CALLBACK_REQUEST,
        payload: {
          phone: '+61423456789',
          name: 'Johnny',
          email: 'Johnny@john.com',
          description: 'Please help me.',
        },
      },
    ])
  })

  it('dispatches expected actions on successful request', () => {
    const store = dispatchAction()

    const callback = http.callMeRequest.mock.calls[0][1].callbacks.done

    callback({ body: { phone_number: '+61423456789' } }) // eslint-disable-line camelcase
    const actions = store.getActions()

    actions.shift()
    expect(actions).toEqual([
      {
        type: types.TALK_CALLBACK_SUCCESS,
        payload: {
          description: 'Please help me.',
          email: 'Johnny@john.com',
          name: 'Johnny',
          phone: '+61423456789',
        },
      },
      {
        type: types.UPDATE_CALLBACK_FORM,
        payload: {},
      },
      {
        type: baseTypes.UPDATE_BACK_BUTTON_VISIBILITY,
        payload: false,
      },
    ])
  })

  it('dispatches expected actions on failed request', () => {
    const store = dispatchAction()
    const error = {
      response: {
        text: '{"error": "Invalid phone number"}',
      },
      status: 422,
    }
    const expectedError = {
      message: 'Invalid phone number',
      status: 422,
    }
    const callback = http.callMeRequest.mock.calls[0][1].callbacks.fail

    callback(error)
    const actions = store.getActions()

    actions.shift()
    expect(actions).toEqual([
      {
        type: types.TALK_CALLBACK_FAILURE,
        payload: expectedError,
      },
    ])
  })
})

describe('loadTalkVendors', () => {
  describe('with a valid nickname', () => {
    const loadTalkVendors = () => {
      const mockServiceUrl = 'https://kruger-industrial-smoothing.zendesk.com',
        mockNickname = 'koko_the_monkey',
        store = mockStore({
          base: {
            embeds: { talk: true },
            embeddableConfig: {
              embeds: { talk: { props: { serviceUrl: mockServiceUrl, nickname: mockNickname } } },
            },
          },
          settings: {
            talk: { suppress: false },
          },
        })

      return {
        store,
        response: store.dispatch(actions.loadTalkVendors()),
      }
    }

    it('dispatches an action of type TALK_VENDOR_LOADED with the loaded vendors', async () => {
      const { store, response } = loadTalkVendors()

      await response
      const action = store.getActions()[0]

      expect(action.type).toBe(types.TALK_VENDOR_LOADED)

      expect(action.payload).toEqual({
        io: expect.any(Function),
      })
    })

    it('calls socketio.connect with the io vendor, service url and nickname', async () => {
      const { response } = loadTalkVendors()

      await response

      expect(socketio.connect).toHaveBeenCalledWith(
        expect.any(Function),
        'https://kruger-industrial-smoothing.zendesk.com',
        'koko_the_monkey'
      )
    })

    it('calls socketio.mapEventsToActions with the socket', async () => {
      socketio.connect.mockImplementation(() => 'mockSocket')

      const { response } = loadTalkVendors()

      await response

      expect(socketio.mapEventsToActions).toHaveBeenCalledWith('mockSocket', expect.any(Object))
    })
  })

  describe('with an empty nickname', () => {
    const loadTalkVendors = () => {
      const mockServiceUrl = 'https://kruger-industrial-smoothing.zendesk.com',
        store = mockStore({
          base: {
            embeds: { talk: true },
            embeddableConfig: {
              embeds: { talk: { props: { serviceUrl: mockServiceUrl, nickname: '' } } },
            },
          },
          settings: {
            talk: { suppress: false },
          },
        })

      return {
        store,
        response: store.dispatch(actions.loadTalkVendors()),
      }
    }

    it('does not call socketio.connect', async () => {
      const { response } = loadTalkVendors()

      await response

      expect(socketio.connect).not.toHaveBeenCalled()
    })
  })
})

const waitForApi = async () => {
  await new Promise((res) => {
    res()
  })
  await new Promise((res) => {
    res()
  })
}

const waitForTimer = async (time = MAX_TALK_POLL_INTERVAL) => {
  await new Promise((res) => {
    res()
  })
  jest.advanceTimersByTime(time)
  await new Promise((res) => {
    res()
  })
}

const iteration = async (time) => {
  await waitForApi()
  await waitForTimer(time)
}

describe('pollTalkStatus', () => {
  let store
  beforeEach(() => {
    baseSelectors.getDeferredTalkApiUrl = jest.fn(() => 'http://talk/url')
    http.get = jest.fn(() => {
      return new Promise((resolve) => {
        resolve({
          body: {
            subdomain: 'support',
            nickname: 'Support',
            availability: true,
            capability: 0,
          },
        })
      })
    })

    store = mockStore({
      talk: { isPolling: true },
    })
  })

  it('polls backing off exponentially', async () => {
    const expectedAction = {
      type: types.RECEIVED_DEFERRED_TALK_STATUS,
      payload: {
        availability: true,
        capability: 0,
        nickname: 'Support',
        subdomain: 'support',
      },
    }

    store.dispatch(actions.pollTalkStatus())

    // initial call is immediate
    await iteration(0)
    expect(store.getActions()).toEqual([expectedAction])
    store.clearActions()

    // subsequent 2 calls use base interval
    await iteration(BASE_TALK_POLL_INTERVAL)
    await iteration(BASE_TALK_POLL_INTERVAL)

    expect(store.getActions()).toEqual([expectedAction, expectedAction])
    store.clearActions()

    // then waits double base time
    await iteration(BASE_TALK_POLL_INTERVAL)
    expect(store.getActions()).toEqual([])
    await iteration(BASE_TALK_POLL_INTERVAL)
    expect(store.getActions()).toEqual([expectedAction])
    store.clearActions()

    // then waits four * base time
    await iteration(BASE_TALK_POLL_INTERVAL * 3)
    expect(store.getActions()).toEqual([])
    await iteration(BASE_TALK_POLL_INTERVAL)
    expect(store.getActions()).toEqual([expectedAction])
    store.clearActions()
  })

  it('polls the deferred talk api until stopped', async () => {
    store = createStore()
    const expectedAction = {
      type: types.RECEIVED_DEFERRED_TALK_STATUS,
      payload: {
        availability: true,
        capability: 0,
        nickname: 'Support',
        subdomain: 'support',
      },
    }

    const mockDispatch = jest.fn(store.dispatch)
    actions.pollTalkStatus()(mockDispatch, store.getState)

    await iteration()
    await iteration()
    await iteration()

    await waitForApi()

    expect(mockDispatch.mock.calls).toEqual([
      [expectedAction],
      [expectedAction],
      [expectedAction],
      [expectedAction],
    ])
    mockDispatch.mockClear()

    store.dispatch(actions.handleTalkVendorLoaded())

    await iteration()
    await iteration()

    expect(mockDispatch).not.toHaveBeenCalled()
  })
})

test('handleTalkVendorLoaded dispatches expected action', () => {
  const expected = {
    type: types.TALK_VENDOR_LOADED,
    payload: 'blah',
  }

  expect(actions.handleTalkVendorLoaded('blah')).toEqual(expected)
})
