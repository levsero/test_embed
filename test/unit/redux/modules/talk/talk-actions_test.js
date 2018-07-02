import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

let actions,
  actionTypes,
  screenTypes,
  mockStore,
  talkBackButtonEmbedsValue,
  mockSettings;

const middlewares = [thunk];
const createMockStore = configureMockStore(middlewares);
const updateBackButtonVisibilityType = 'MOCK_UPDATE_BACK_BUTTON';
let httpSpy = jasmine.createSpyObj('http', ['callMeRequest']),
  socketioSpy;

describe('talk redux actions', () => {
  let action,
    formState;

  beforeEach(() => {
    mockery.enable();

    talkBackButtonEmbedsValue = false;
    socketioSpy = {
      connect: jasmine.createSpy('connect'),
      mapEventsToActions: jasmine.createSpy('mapEventsToActions').and.returnValue('mockSocket')
    };

    initMockRegistry({
      'service/logging': { error: () => {} },
      'service/transport': { http: httpSpy, socketio: socketioSpy },
      'service/settings': {
        settings: {
          get: () => mockSettings
        }
      },
      'src/redux/modules/base/base-selectors': {},
      'src/redux/modules/selectors': {
        getShowTalkBackButton: () => talkBackButtonEmbedsValue
      },
      'src/redux/modules/base': {
        updateBackButtonVisibility: () => { return { type: updateBackButtonVisibilityType }; }
      },
      'utility/utils': {
        parseUrl: () => {
          return { hostname: 'customer.zendesk.com' };
        }
      }
    });

    const actionsPath = buildSrcPath('redux/modules/talk');
    const actionTypesPath = buildSrcPath('redux/modules/talk/talk-action-types');
    const screenTypesPath = buildSrcPath('redux/modules/talk/talk-screen-types');

    mockery.registerAllowable(actionsPath);
    mockery.registerAllowable(actionTypesPath);
    mockery.registerAllowable(screenTypesPath);

    actions = requireUncached(actionsPath);
    actionTypes = requireUncached(actionTypesPath);
    screenTypes = requireUncached(screenTypesPath);
    mockStore = createMockStore({ talk: {} });
  });

  afterEach(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('updateTalkEmbeddableConfig', () => {
    let action,
      mockConfig;

    beforeEach(() => {
      mockConfig = {
        agentAvailability: false,
        averageWaitTime: '2',
        capability: '0',
        enabled: false,
        nickname: '',
        phoneNumber: ''
      };

      mockStore.dispatch(actions.updateTalkEmbeddableConfig(mockConfig));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type UPDATE_TALK_EMBEDDABLE_CONFIG', () => {
      expect(action.type)
        .toEqual(actionTypes.UPDATE_TALK_EMBEDDABLE_CONFIG);
    });

    it('dispatches an action with the config', () => {
      expect(action.payload)
        .toEqual({
          capability: '0',
          enabled: false,
          nickname: '',
          phoneNumber: ''
        });
    });
  });

  describe('updateTalkAgentAvailability', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.updateTalkAgentAvailability(true));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type UPDATE_TALK_AGENT_AVAILABILITY', () => {
      expect(action.type)
        .toEqual(actionTypes.UPDATE_TALK_AGENT_AVAILABILITY);
    });

    it('dispatches an action with the agent availability', () => {
      expect(action.payload)
        .toBe(true);
    });
  });

  describe('updateTalkAverageWaitTime', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.updateTalkAverageWaitTime('5'));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type UPDATE_TALK_AVERAGE_WAIT_TIME', () => {
      expect(action.type)
        .toEqual(actionTypes.UPDATE_TALK_AVERAGE_WAIT_TIME);
    });

    it('dispatches an action with the wait time', () => {
      expect(action.payload)
        .toBe('5');
    });
  });

  describe('updateTalkAverageWaitTimeEnabled', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.updateTalkAverageWaitTimeEnabled(true));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type UPDATE_TALK_AVERAGE_WAIT_TIME_ENABLED', () => {
      expect(action.type)
        .toEqual(actionTypes.UPDATE_TALK_AVERAGE_WAIT_TIME_ENABLED);
    });

    it('dispatches an action with the average wait time enabled', () => {
      expect(action.payload)
        .toBe(true);
    });
  });

  describe('updateTalkScreen', () => {
    beforeEach(() => {
      mockStore.dispatch(actions.updateTalkScreen(screenTypes.SUCCESS_NOTIFICATION_SCREEN));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type UPDATE_TALK_SCREEN', () => {
      expect(action.type)
        .toEqual(actionTypes.UPDATE_TALK_SCREEN);
    });

    it('dispatches an action with the screen', () => {
      expect(action.payload)
        .toEqual(screenTypes.SUCCESS_NOTIFICATION_SCREEN);
    });
  });

  describe('resetTalkScreen', () => {
    let action;

    beforeEach(() => {
      mockStore = createMockStore({
        talk: {
          embeddableConfig: { capability: 'widget/talk/PHONE_ONLY' }
        }
      });
      mockStore.dispatch(actions.resetTalkScreen());
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type UPDATE_TALK_SCREEN', () => {
      expect(action.type)
        .toEqual(actionTypes.UPDATE_TALK_SCREEN);
    });

    it('dispatches an action with the capable screen', () => {
      expect(action.payload)
        .toEqual(screenTypes.PHONE_ONLY_SCREEN);
    });

    describe('when getShowTalkBackButton is false', () => {
      beforeEach(() => {
        talkBackButtonEmbedsValue = false;
        mockStore.dispatch(actions.resetTalkScreen());
        action = mockStore.getActions()[3];
      });

      it('calls updateBackButtonVisibility with false', () => {
        expect(action.type)
          .toBe(updateBackButtonVisibilityType);
      });
    });

    describe('when getShowTalkBackButton is true', () => {
      beforeEach(() => {
        talkBackButtonEmbedsValue = true;
        mockStore.dispatch(actions.resetTalkScreen());
        action = mockStore.getActions()[3];
      });

      it('calls updateBackButtonVisibility with true', () => {
        expect(action.type)
          .toBe(updateBackButtonVisibilityType);
      });
    });
  });

  describe('updateTalkCallMeForm', () => {
    let action,
      formState;

    beforeEach(() => {
      formState = {
        phone: '+61423423329',
        name: 'ally',
        email: 'Allly@ally.com',
        description: 'Pleaseee help me.'
      };
      mockStore.dispatch(actions.updateTalkCallbackForm(formState));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type UPDATE_CALLBACK_FORM', () => {
      expect(action.type)
        .toEqual(actionTypes.UPDATE_CALLBACK_FORM);
    });

    it('dispatches an action with the formState', () => {
      expect(action.payload)
        .toEqual({
          phone: '+61423423329',
          name: 'ally',
          email: 'Allly@ally.com',
          description: 'Pleaseee help me.'
        });
    });
  });

  describe('submitTalkCallbackForm', () => {
    let serviceUrl,
      nickname;

    beforeEach(() => {
      formState = {
        phone: '+61423456789',
        name: 'Johnny',
        email: 'Johnny@john.com',
        description: 'Please help me.'
      };
      serviceUrl = 'https://talk_service.com';
      nickname = 'Support';
      mockStore = createMockStore({
        talk: { formState }
      });
      mockStore.dispatch(actions.submitTalkCallbackForm(formState, serviceUrl, nickname));
      action = mockStore.getActions()[0];
    });

    it('calls http.callMeRequest', () => {
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
        callbacks: { done: jasmine.any(Function), fail: jasmine.any(Function) }
      };

      expect(httpSpy.callMeRequest)
        .toHaveBeenCalledWith('https://talk_service.com', expectedPayload);
    });

    it('dispatches an action of TALK_CALLBACK_REQUEST', () => {
      expect(action.type)
        .toEqual(actionTypes.TALK_CALLBACK_REQUEST);
    });

    it('dispatches an action with the form state', () => {
      expect(action.payload)
        .toEqual({
          phone: '+61423456789',
          name: 'Johnny',
          email: 'Johnny@john.com',
          description: 'Please help me.'
        });
    });

    describe('when a nickname exists in settings', () => {
      beforeEach(() => {
        mockSettings = 'Sales';

        mockStore.dispatch(actions.submitTalkCallbackForm(formState, serviceUrl, nickname));
      });

      it('overrides the nickname with the one from settings and passes it as `keyword`', () => {
        expect(httpSpy.callMeRequest.calls.mostRecent().args[1].params.keyword)
          .toEqual('Sales');
      });
    });

    describe('when the request is successful', () => {
      let doneCallback,
        actions;

      beforeEach(() => {
        doneCallback = httpSpy.callMeRequest.calls.mostRecent().args[1].callbacks.done;
        doneCallback({ body: { phone_number: '+61423456789' } }); // eslint-disable-line camelcase
        actions = mockStore.getActions();
      });

      it('dispatches an action of type TALK_CALLBACK_SUCCESS', () => {
        expect(actions[1].type)
          .toEqual(actionTypes.TALK_CALLBACK_SUCCESS);
      });

      it('dispatches an action with the form state', () => {
        expect(actions[1].payload)
          .toEqual({
            phone: '+61423456789',
            name: 'Johnny',
            email: 'Johnny@john.com',
            description: 'Please help me.'
          });
      });

      it('dispatches the action updateBackButtonVisibility', () => {
        expect(actions[3].type)
          .toEqual(updateBackButtonVisibilityType);
      });

      it('clears the form state', () => {
        expect(actions[2])
          .toEqual({ type: actionTypes.UPDATE_CALLBACK_FORM, payload: {} });
      });
    });

    describe('when the request has failed', () => {
      let failCallback;

      beforeEach(() => {
        const error = {
          response: {
            text: '{"error": "Invalid phone number"}'
          },
          status: 422
        };

        failCallback = httpSpy.callMeRequest.calls.mostRecent().args[1].callbacks.fail;
        failCallback(error);
        action = mockStore.getActions()[1];
      });

      it('dispatches an action of type TALK_CALLBACK_FAILURE', () => {
        expect(action.type)
          .toEqual(actionTypes.TALK_CALLBACK_FAILURE);
      });

      it('dispatches an action with a list of errors.', () => {
        const expectedError = {
          message: 'Invalid phone number',
          status: 422
        };

        expect(action.payload)
          .toEqual(expectedError);
      });
    });
  });

  describe('loadTalkVendors', () => {
    let action;

    describe('when all vendors are loaded', () => {
      let mockPromises,
        mockServiceUrl,
        mockNickname,
        response;

      beforeEach(() => {
        mockPromises = [
          Promise.resolve({ default: 'mockio' }),
          Promise.resolve('mockLibphonenumber')
        ];
        mockServiceUrl = 'https://kruger-industrial-smoothing.zendesk.com';
        mockNickname = 'koko_the_monkey';

        response = mockStore.dispatch(actions.loadTalkVendors(mockPromises, mockServiceUrl, mockNickname));
      });

      it('dispatches an action of type TALK_VENDOR_LOADED with the loaded vendors', () => {
        response.then(() => {
          action = mockStore.getActions()[0];
          expect(action.type)
            .toBe(actionTypes.TALK_VENDOR_LOADED);

          expect(action.payload)
            .toEqual({ io: 'mockio', libphonenumber: 'mockLibphonenumber' });
        });
      });

      it('calls socketio.connect with the io vendor, service url and nickname', () => {
        response.then(() => {
          expect(socketioSpy.connect.calls.mostRecent().args)
            .toEqual(['mockio', mockServiceUrl, mockNickname]);
        });
      });

      it('calls socketio.mapEventsToActions with the socket', () => {
        response.then(() => {
          expect(socketioSpy.mapEventsToActions.calls.mostRecent().args[0])
            .toBe('mockSocket');
        });
      });
    });
  });

  describe('handleTalkVendorLoaded', () => {
    let action,
      mockPayload;

    beforeEach(() => {
      mockPayload = {
        io: 'socket.io-client'
      };

      mockStore.dispatch(actions.handleTalkVendorLoaded(mockPayload));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type TALK_VENDOR_LOADED', () => {
      expect(action.type)
        .toEqual(actionTypes.TALK_VENDOR_LOADED);
    });

    it('dispatches an action with the loaded vendor', () => {
      expect(action.payload)
        .toEqual(mockPayload);
    });
  });
});
