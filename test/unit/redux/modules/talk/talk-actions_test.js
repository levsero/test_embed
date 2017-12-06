import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

let actions,
  actionTypes,
  screenTypes,
  mockStore;

const middlewares = [thunk];
const createMockStore = configureMockStore(middlewares);
let httpSpy = jasmine.createSpyObj('http', ['callMeRequest']);

describe('talk redux actions', () => {
  let action,
    formState;

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      'service/transport': { http: httpSpy }
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

  describe('updateTalkScreen', () => {
    beforeEach(() => {
      mockStore.dispatch(actions.updateTalkScreen(screenTypes.SUCCESS_NOTIFICATION_SCREEN));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type UPDATE_SCREEN', () => {
      expect(action.type)
        .toEqual(actionTypes.UPDATE_SCREEN);
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

    it('dispatches an action of type UPDATE_SCREEN', () => {
      expect(action.type)
        .toEqual(actionTypes.UPDATE_SCREEN);
    });

    it('dispatches an action with the capable screen', () => {
      expect(action.payload)
        .toEqual(screenTypes.PHONE_ONLY_SCREEN);
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
    let subdomain,
      serviceUrl,
      keyword;

    beforeEach(() => {
      formState = {
        phone: '+61423456789',
        name: 'Johnny',
        email: 'Johnny@john.com',
        description: 'Please help me.'
      };
      serviceUrl = 'https://talk_service.com';
      keyword = 'Support';
      subdomain = 'z3npparker';
      mockStore = createMockStore({
        talk: { formState }
      });
      mockStore.dispatch(actions.submitTalkCallbackForm(formState, subdomain, serviceUrl, keyword));
      action = mockStore.getActions()[0];
    });

    it('calls http.callMeRequest', () => {
      const expectedPayload = {
        params: {
          phoneNumber: '+61423456789',
          additionalInfo: {
            name: 'Johnny',
            email: 'Johnny@john.com',
            description: 'Please help me.'
          },
          subdomain: 'z3npparker',
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

    describe('when the request is successful', () => {
      let doneCallback;

      beforeEach(() => {
        doneCallback = httpSpy.callMeRequest.calls.mostRecent().args[1].callbacks.done;
        doneCallback({ body: { phone_number: '+61423456789' } }); // eslint-disable-line camelcase
        action = mockStore.getActions()[1];
      });

      it('dispatches an action of type TALK_CALLBACK_SUCCESS', () => {
        expect(action.type)
          .toEqual(actionTypes.TALK_CALLBACK_SUCCESS);
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
});
