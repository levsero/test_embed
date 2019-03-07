import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../talk-actions';
import * as types from '../talk-action-types';
import * as screenTypes from 'src/redux/modules/talk/talk-screen-types';
import * as baseTypes from 'src/redux/modules/base/base-action-types';
import { http, socketio } from 'service/transport';

jest.mock('service/transport');

const mockStore = configureMockStore([thunk]);

test('updateTalkAgentAvailability dispatches TALK_AGENT_AVAILABILITY_SOCKET_EVENT action', () => {
  const expected = {
    type: types.TALK_AGENT_AVAILABILITY_SOCKET_EVENT,
    payload: { agentAvailability: true }
  };

  expect(actions.updateTalkAgentAvailability({ agentAvailability: true }))
    .toEqual(expected);
});

test('updateTalkEmbeddableConfig dispatches TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT action', () => {
  const mockConfig = {
    agentAvailability: false,
    averageWaitTime: '2',
    capability: '0',
    enabled: false,
    nickname: '',
    phoneNumber: ''
  };
  const action = actions.updateTalkEmbeddableConfig(mockConfig);

  expect(action)
    .toEqual({
      type: types.TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT,
      payload: mockConfig
    });
});

test('updateTalkAverageWaitTime dispatches TALK_AVERAGE_WAIT_TIME_SOCKET_EVENT action', () => {
  const expected = {
    type: types.TALK_AVERAGE_WAIT_TIME_SOCKET_EVENT,
    payload: '5'
  };

  expect(actions.updateTalkAverageWaitTime('5'))
    .toEqual(expected);
});

test('talkDisconnect dispatches TALK_DISCONNECT_SOCKET_EVENT action', () => {
  const expected = {
    type: types.TALK_DISCONNECT_SOCKET_EVENT
  };

  expect(actions.talkDisconnect())
    .toEqual(expected);
});

test('updateTalkScreen dispatches UPDATE_TALK_SCREEN action', () => {
  const expected = {
    type: types.UPDATE_TALK_SCREEN,
    payload: screenTypes.SUCCESS_NOTIFICATION_SCREEN
  };

  expect(actions.updateTalkScreen(screenTypes.SUCCESS_NOTIFICATION_SCREEN))
    .toEqual(expected);
});

describe('resetTalkScreen', () => {
  test('show back button', () => {
    const state = {
      talk: {
        embeddableConfig: { capability: 'widget/talk/PHONE_ONLY' }
      },
      settings: {
        chat: {}
      },
      chat: {},
      zopimChat: {},
      base: {
        embeds: {
          helpCenterForm: {}
        }
      },
    };

    const store = mockStore(state);

    store.dispatch(actions.resetTalkScreen());

    expect(store.getActions())
      .toEqual([{
        type: types.UPDATE_TALK_SCREEN,
        payload: screenTypes.PHONE_ONLY_SCREEN
      }, {
        type: baseTypes.UPDATE_BACK_BUTTON_VISIBILITY,
        payload: true
      }]);
  });

  test('do not show back button', () => {
    const state = {
      talk: {
        embeddableConfig: { capability: 'widget/talk/CALLBACK_AND_PHONE' }
      },
      settings: {
        chat: {
        }
      },
      chat: {},
      zopimChat: {},
      base: {
        embeds: {}
      },
    };

    const store = mockStore(state);

    store.dispatch(actions.resetTalkScreen());

    expect(store.getActions())
      .toEqual([{
        type: types.UPDATE_TALK_SCREEN,
        payload: screenTypes.CALLBACK_AND_PHONE_SCREEN
      }, {
        type: baseTypes.UPDATE_BACK_BUTTON_VISIBILITY,
        payload: false
      }]);
  });
});

test('updateTalkCallMeForm dispatches expected actions', () => {
  const formState = {
    phone: '+61423423329',
    name: 'ally',
    email: 'Allly@ally.com',
    description: 'Pleaseee help me.'
  };
  const expected = {
    type: types.UPDATE_CALLBACK_FORM,
    payload: {
      phone: '+61423423329',
      name: 'ally',
      email: 'Allly@ally.com',
      description: 'Pleaseee help me.'
    }
  };

  expect(actions.updateTalkCallbackForm(formState))
    .toEqual(expected);
});

describe('submitTalkCallbackForm', () => {
  const dispatchAction = () => {
    const formState = {
        phone: '+61423456789',
        name: 'Johnny',
        email: 'Johnny@john.com',
        description: 'Please help me.'
      },
      serviceUrl = 'https://customer.blah.com',
      nickname = 'Support',
      store = mockStore({
        talk: { formState }
      });

    store.dispatch(
      actions.submitTalkCallbackForm(
        serviceUrl,
        nickname
      )
    );

    return store;
  };

  it('calls callMeRequest with expected payload', () => {
    const expectedPayload = {
      params: {
        phoneNumber: '+61423456789',
        additionalInfo: {
          name: 'Johnny',
          description: 'Please help me.'
        },
        subdomain: 'customer',
        keyword: 'Support'
      },
      callbacks: { done: expect.any(Function), fail: expect.any(Function) }
    };

    dispatchAction();
    expect(http.callMeRequest)
      .toHaveBeenCalledWith('https://customer.blah.com', expectedPayload);
  });

  it('dispatches an action with the form state', () => {
    const store = dispatchAction();

    expect(store.getActions())
      .toEqual([{
        type: types.TALK_CALLBACK_REQUEST,
        payload: {
          phone: '+61423456789',
          name: 'Johnny',
          email: 'Johnny@john.com',
          description: 'Please help me.'
        }
      }]);
  });

  it('dispatches expected actions on successful request', () => {
    const store = dispatchAction();

    const callback = http.callMeRequest.mock.calls[0][1].callbacks.done;

    callback({ body: { phone_number: '+61423456789' } }); // eslint-disable-line camelcase
    const actions = store.getActions();

    actions.shift();
    expect(actions)
      .toEqual([
        {
          type: types.TALK_CALLBACK_SUCCESS,
          payload: {
            description: 'Please help me.',
            email: 'Johnny@john.com',
            name: 'Johnny',
            phone: '+61423456789'
          }
        },
        {
          type: types.UPDATE_CALLBACK_FORM,
          payload: {}
        },
        {
          type: baseTypes.UPDATE_BACK_BUTTON_VISIBILITY,
          payload: false
        }
      ]);
  });

  it('dispatches expected actions on failed request', () => {
    const store = dispatchAction();
    const error = {
      response: {
        text: '{"error": "Invalid phone number"}'
      },
      status: 422
    };
    const expectedError = {
      message: 'Invalid phone number',
      status: 422
    };
    const callback = http.callMeRequest.mock.calls[0][1].callbacks.fail;

    callback(error);
    const actions = store.getActions();

    actions.shift();
    expect(actions)
      .toEqual([
        {
          type: types.TALK_CALLBACK_FAILURE,
          payload: expectedError
        }
      ]);
  });
});

describe('loadTalkVendors', () => {
  describe('with a valid nickname', () => {
    const loadTalkVendors = () => {
      const mockPromises = [
          Promise.resolve({ default: 'mockio' }),
          Promise.resolve('mockLibphonenumber')
        ],
        mockServiceUrl = 'https://kruger-industrial-smoothing.zendesk.com',
        mockNickname = 'koko_the_monkey',
        store = mockStore({});

      return {
        store,
        response: store.dispatch(actions.loadTalkVendors(mockPromises, mockServiceUrl, mockNickname))
      };
    };

    it('dispatches an action of type TALK_VENDOR_LOADED with the loaded vendors', async () => {
      const { store, response } = loadTalkVendors();

      await response;
      const action = store.getActions()[0];

      expect(action.type)
        .toBe(types.TALK_VENDOR_LOADED);

      expect(action.payload)
        .toEqual({ io: 'mockio', libphonenumber: 'mockLibphonenumber' });
    });

    it('calls socketio.connect with the io vendor, service url and nickname', async () => {
      const { response } = loadTalkVendors();

      await response;

      expect(socketio.connect)
        .toHaveBeenCalledWith(
          'mockio',
          'https://kruger-industrial-smoothing.zendesk.com',
          'koko_the_monkey'
        );
    });

    it('calls socketio.mapEventsToActions with the socket', async () => {
      socketio.connect.mockImplementation(() => 'mockSocket');

      const { response } = loadTalkVendors();

      await response;

      expect(socketio.mapEventsToActions)
        .toHaveBeenCalledWith('mockSocket', expect.any(Object));
    });
  });

  describe('with an empty nickname', () => {
    const loadTalkVendors = () => {
      const mockPromises = [
          Promise.resolve({ default: 'mockio' }),
          Promise.resolve('mockLibphonenumber')
        ],
        mockServiceUrl = 'https://kruger-industrial-smoothing.zendesk.com',
        mockNickname = '',
        store = mockStore({});

      return {
        store,
        response: store.dispatch(actions.loadTalkVendors(mockPromises, mockServiceUrl, mockNickname))
      };
    };

    it('does not call socketio.connect', async () => {
      const { response } = loadTalkVendors();

      await response;

      expect(socketio.connect)
        .not.toHaveBeenCalled();
    });
  });
});

test('handleTalkVendorLoaded dispatches expected action', () => {
  const expected = {
    type: types.TALK_VENDOR_LOADED,
    payload: 'blah'
  };

  expect(actions.handleTalkVendorLoaded('blah'))
    .toEqual(expected);
});
