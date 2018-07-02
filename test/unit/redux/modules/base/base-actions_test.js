import jsonwebtoken from 'jsonwebtoken';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

let actions,
  actionTypes,
  chatActionTypes,
  chatNotificationDismissedSpy,
  chatOpenedSpy,
  mockEmailValidValue,
  mockStore,
  mockAuthSettings,
  mockOAuth,
  mockBaseIsAuthenticated,
  mockIsTokenValid,
  mockExtractTokenId,
  mockIsTokenRenewable,
  mockIsTokenRevoked,
  mockPersistentStoreValue,
  persistentStoreRemoveSpy = jasmine.createSpy('remove'),
  persistentStoreSetSpy = jasmine.createSpy('set'),
  httpPostSpy = jasmine.createSpy('http'),
  broadcastSpy = jasmine.createSpy('broadcast');

const middlewares = [thunk];
const createMockStore = configureMockStore(middlewares);

describe('base redux actions', () => {
  beforeEach(() => {
    mockery.enable();

    mockEmailValidValue = true;

    chatNotificationDismissedSpy = jasmine.createSpy('chatNotificationDismissed')
      .and.returnValue({ type: 'widget/chat/CHAT_NOTIFICATION_DISMISSED' });
    chatOpenedSpy = jasmine.createSpy('chatOpened')
      .and.returnValue({ type: 'widget/chat/CHAT_OPENED' });

    initMockRegistry({
      'src/redux/modules/chat': {
        chatNotificationDismissed: chatNotificationDismissedSpy,
        chatOpened: chatOpenedSpy
      },
      'utility/utils': {
        emailValid: () => mockEmailValidValue,
        isTokenValid: () => mockIsTokenValid,
        extractTokenId: () => mockExtractTokenId,
        isTokenRenewable: () => mockIsTokenRenewable,
        isTokenRevoked: () => mockIsTokenRevoked
      },
      'service/settings': {
        settings: {
          getSupportAuthSettings: () => mockAuthSettings
        }
      },
      'src/redux/modules/base/base-selectors': {
        getOAuth: () => mockOAuth,
        getBaseIsAuthenticated: () => mockBaseIsAuthenticated
      },
      'service/mediator': {
        mediator: {
          channel: {
            broadcast: broadcastSpy
          }
        }
      },
      'service/persistence': {
        store: {
          get: () => mockPersistentStoreValue,
          remove: persistentStoreRemoveSpy,
          set: persistentStoreSetSpy
        }
      },
      'service/transport': {
        http: {
          send: httpPostSpy
        }
      }
    });

    const actionsPath = buildSrcPath('redux/modules/base');
    const actionTypesPath = buildSrcPath('redux/modules/base/base-action-types');
    const chatActionTypesPath = buildSrcPath('redux/modules/chat/chat-action-types');

    mockery.registerAllowable(actionsPath);
    mockery.registerAllowable(actionTypesPath);

    actions = requireUncached(actionsPath);
    actionTypes = requireUncached(actionTypesPath);
    chatActionTypes = requireUncached(chatActionTypesPath);

    mockStore = createMockStore({ base: {} });
  });

  afterEach(() => {
    httpPostSpy.calls.reset();
    persistentStoreSetSpy.calls.reset();
    persistentStoreRemoveSpy.calls.reset();
    broadcastSpy.calls.reset();
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('updateArturos', () => {
    let arturos,
      action;

    beforeEach(() => {
      arturos = {
        newChat: true
      };

      mockStore.dispatch(actions.updateArturos(arturos));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action with UPDATE_ARTUROS', () => {
      expect(action.type)
        .toEqual(actionTypes.UPDATE_ARTUROS);
    });

    it('dispatches the correct payload', () => {
      expect(action.payload)
        .toEqual(arturos);
    });
  });

  describe('updateActiveEmbed', () => {
    let embed,
      action,
      actionList;

    describe('when the new active embed is chat', () => {
      describe('widget is shown', () => {
        beforeEach(() => {
          embed = 'chat';
          mockStore = createMockStore({ base: { widgetShown: true } });
          mockStore.dispatch(actions.updateActiveEmbed(embed));
          actionList = mockStore.getActions();
        });

        it('dispatches an action of type CHAT_OPENED', () => {
          expect(actionList[0].type)
            .toEqual(chatActionTypes.CHAT_OPENED);
        });

        it('dispatches an action of type UPDATE_ACTIVE_EMBED', () => {
          expect(actionList[1].type)
            .toEqual(actionTypes.UPDATE_ACTIVE_EMBED);
        });

        it('has the embed in the payload', () => {
          expect(actionList[1].payload)
            .toEqual(embed);
        });
      });

      describe('widget is not shown', () => {
        beforeEach(() => {
          embed = 'chat';
          mockStore = createMockStore({ base: { widgetShown: false } });
          mockStore.dispatch(actions.updateActiveEmbed(embed));
          actionList = mockStore.getActions();
        });

        it('dispatches an action of type UPDATE_ACTIVE_EMBED', () => {
          expect(actionList[0].type)
            .toEqual(actionTypes.UPDATE_ACTIVE_EMBED);
        });
      });
    });

    describe('when the new active embed is not chat', () => {
      beforeEach(() => {
        embed = 'helpCenter';
        mockStore.dispatch(actions.updateActiveEmbed(embed));
        action = mockStore.getActions()[0];
      });

      it('dispatches an action of type UPDATE_ACTIVE_EMBED', () => {
        expect(action.type)
          .toEqual(actionTypes.UPDATE_ACTIVE_EMBED);
      });

      it('has the embed in the payload', () => {
        expect(action.payload)
          .toEqual(embed);
      });
    });
  });

  describe('updateEmbedAccessible', () => {
    let embed,
      accessible,
      action;

    beforeEach(() => {
      embed = 'helpCenter';
      accessible = true;
      mockStore.dispatch(actions.updateEmbedAccessible(embed, accessible));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type UPDATE_EMBED', () => {
      expect(action.type)
        .toEqual(actionTypes.UPDATE_EMBED);
    });

    it('has a name property in the payload', () => {
      expect(action.payload)
        .toEqual(jasmine.objectContaining({ name: embed }));
    });

    it('has an accessible property in the payload', () => {
      expect(action.payload)
        .toEqual(jasmine.objectContaining({ params: { accessible } }));
    });
  });

  describe('updateBackButtonVisibility', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.updateBackButtonVisibility(true));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type UPDATE_BACK_BUTTON_VISIBILITY', () => {
      expect(action.type)
        .toEqual(actionTypes.UPDATE_BACK_BUTTON_VISIBILITY);
    });

    it('has the value of true in the payload', () => {
      expect(action.payload)
        .toEqual(true);
    });
  });

  describe('updateWidgetShown', () => {
    let action,
      actionList;

    describe('when activeEmbed is not chat', () => {
      beforeEach(() => {
        mockStore = createMockStore({ base: { activeEmbed: 'apoorv' } });
        mockStore.dispatch(actions.updateWidgetShown(true));
        action = mockStore.getActions()[0];
      });

      it('dispatches an action of type UPDATE_WIDGET_SHOWN', () => {
        expect(action.type)
          .toEqual(actionTypes.UPDATE_WIDGET_SHOWN);
      });

      it('has the value of true in the payload', () => {
        expect(action.payload)
          .toEqual(true);
      });
    });

    describe('when activeEmbed is chat', () => {
      beforeEach(() => {
        mockStore = createMockStore({ base: { activeEmbed: 'chat' } });
      });

      describe('when widget is shown', () => {
        beforeEach(() => {
          mockStore.dispatch(actions.updateWidgetShown(true));
          actionList = mockStore.getActions();
        });

        it('dispatches an action of type UPDATE_WIDGET_SHOWN', () => {
          expect(actionList[0].type)
            .toEqual(actionTypes.UPDATE_WIDGET_SHOWN);
        });

        it('has the value of true in the payload', () => {
          expect(actionList[0].payload)
            .toEqual(true);
        });

        it('dispatches an action of CHAT_OPENED', () => {
          expect(actionList[1].type)
            .toEqual(chatActionTypes.CHAT_OPENED);
        });
      });

      describe('when widget is not shown', () => {
        beforeEach(() => {
          mockStore.dispatch(actions.updateWidgetShown(false));
          actionList = mockStore.getActions();
        });

        it('has the value of false in the payload', () => {
          expect(actionList[0].payload)
            .toEqual(false);
        });

        it('does not dispatch an action of CHAT_OPENED', () => {
          expect(actionList.length)
            .toEqual(1);
        });
      });
    });
  });

  describe('handleIdentifyRecieved', () => {
    let action;
    const mockUser = {
      name: 'Harry Potter',
      email: 'hpotter@hogwarts.edu.uk'
    };

    beforeEach(() => {
      mockStore.dispatch(actions.handleIdentifyRecieved(mockUser));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type IDENTIFY_RECIEVED', () => {
      expect(action.type)
        .toEqual(actionTypes.IDENTIFY_RECIEVED);
    });

    it('passes the value to the payload', () => {
      expect(action.payload)
        .toEqual(mockUser);
    });

    describe('when the email is not valid', () => {
      beforeEach(() => {
        mockUser.email = 'hpotter@hogwarts';
        mockEmailValidValue = false;
        mockStore.dispatch(actions.handleIdentifyRecieved(mockUser));
        action = mockStore.getActions()[1];
      });

      it('does not pass through the email in payload', () => {
        expect(action.payload.email)
          .toBeFalsy();
      });

      it('still passes through the name in payload', () => {
        expect(action.payload.name)
          .toBe(mockUser.name);
      });
    });
  });

  describe('widgetHideAnimationComplete', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.widgetHideAnimationComplete());
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type WIDGET_HIDE_ANIMATION_COMPLETE', () => {
      expect(action.type)
        .toEqual(actionTypes.WIDGET_HIDE_ANIMATION_COMPLETE);
    });
  });

  describe('logout', function() {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.logout());
      action = mockStore.getActions()[0];
    });

    it('clears existing zE_oauth objects from localstorage', () => {
      expect(persistentStoreRemoveSpy)
        .toHaveBeenCalledWith('zE_oauth');
    });

    it('dispatch AUTHENTICATION_LOGGED_OUT', () => {
      expect(action.type)
        .toEqual(actionTypes.AUTHENTICATION_LOGGED_OUT);
    });
  });

  describe('authenticate', () => {
    let actionsList,
      newToken = 'yoloToken';

    beforeEach(() => {
      mockStore.dispatch(actions.authenticate(newToken));
      actionsList = mockStore.getActions();
    });

    it('dispatch AUTHENTICATION_PENDING action', () => {
      expect(actionsList[0].type)
        .toEqual(actionTypes.AUTHENTICATION_PENDING);
    });

    describe('when authentication is required', () => {
      beforeAll(() => {
        newToken = 'someNewToken';
        mockExtractTokenId = 'notTheSameIdAszeoauth';
        mockBaseIsAuthenticated = false;
      });

      it('should request a new oauth token', () => {
        const payload = httpPostSpy.calls.mostRecent().args[0];
        const params = payload.params;

        expect(httpPostSpy)
          .toHaveBeenCalled();

        expect(payload.method)
          .toBe('POST');

        expect(payload.path)
          .toBe('/embeddable/authenticate');

        expect(params)
          .toEqual({
            body: newToken
          });
      });
    });

    describe('when authentication is not required', () => {
      beforeAll(() => {
        mockBaseIsAuthenticated = true;
        mockOAuth = null;
      });

      it('broadcasts authentication.onSuccess', () => {
        expect(broadcastSpy)
          .toHaveBeenCalledWith('authentication.onSuccess');
      });

      it('dispatchs AUTHENTICATION_SUCCESS action', () => {
        expect(actionsList[1].type)
          .toEqual(actionTypes.AUTHENTICATION_SUCCESS);
      });
    });
  });

  describe('renewToken', () => {
    let zeoauth,
      renewPayload;

    beforeEach(() => {
      const jwtPayload = {
        'iat': 1458011438,
        'jti': '1234567890',
        'name': 'Jim Bob',
        'email': 'jbob@zendesk.com'
      };
      const body = { jwt: jsonwebtoken.sign(jwtPayload, 'pencil') };

      zeoauth = {
        id: '3498589cd03c34be6155b5a6498fe9786985da01', // sha1 hash of jbob@zendesk.com
        token: 'abcde',
        expiry: Math.floor(Date.now() / 1000) + (20 * 60),
        createdAt: Math.floor(Date.now() / 1000) - (1.6 * 60 * 60)
      };
      renewPayload = {
        body: body.jwt,
        token: {
          'oauth_token': zeoauth.token,
          'oauth_expiry': zeoauth.expiry
        }
      };
      mockOAuth = zeoauth;
      mockAuthSettings = body;
    });

    describe('when the oauth token is renewable', () => {
      beforeEach(() => {
        mockIsTokenRenewable = true;
        mockStore.dispatch(actions.renewToken());
      });

      it('should request a new oauth token', () => {
        const payload = httpPostSpy.calls.mostRecent().args[0];
        const params = payload.params;

        expect(httpPostSpy)
          .toHaveBeenCalled();

        expect(payload.method)
          .toBe('POST');

        expect(payload.path)
          .toBe('/embeddable/authenticate/renew');

        expect(params)
          .toEqual(renewPayload);
      });

      describe('success callback', () => {
        let action;

        beforeEach(() => {
          let doneCallback = httpPostSpy.calls.mostRecent().args[0].callbacks.done;

          /* eslint-disable camelcase */
          doneCallback({
            body: {
              oauth_token: 'abcde',
              oauth_expiry: 'someExpiry',
              oauth_created_at: 'createdAt'
            }
          });
          /* eslint-enable camelcase */

          action = mockStore.getActions()[0];
        });

        it('stores the token', () => {
          expect(persistentStoreSetSpy)
            .toHaveBeenCalledWith('zE_oauth', {
              'id': zeoauth.id,
              'token': 'abcde',
              'expiry': 'someExpiry',
              'createdAt': 'createdAt'
            });
        });

        it('broadcasts authentication.onSuccess', () => {
          expect(broadcastSpy)
            .toHaveBeenCalledWith('authentication.onSuccess');
        });

        it('dispatchs AUTHENTICATION_SUCCESS action', () => {
          expect(action.type)
            .toEqual(actionTypes.AUTHENTICATION_SUCCESS);
        });
      });

      describe('fail callback', () => {
        let action;

        beforeEach(() => {
          let failCallback = httpPostSpy.calls.mostRecent().args[0].callbacks.fail;

          failCallback();
          action = mockStore.getActions()[0];
        });

        it('does remove token', () => {
          expect(persistentStoreRemoveSpy)
            .toHaveBeenCalledWith('zE_oauth');
        });

        it('does dispatch AUTHENTICATION_FAILURE action', () => {
          expect(action.type)
            .toEqual(actionTypes.AUTHENTICATION_FAILURE);
        });
      });
    });

    describe('when the oauth token is not renewable', () => {
      beforeEach(() => {
        mockIsTokenRenewable = false;
        mockStore.dispatch(actions.renewToken());
      });

      it('should return and not request a new oauth token', () => {
        expect(httpPostSpy)
          .not.toHaveBeenCalled();
      });
    });
  });

  describe('revokeToken', () => {
    let action,
      revokedAt;

    beforeEach(() => {
      mockStore.dispatch(actions.revokeToken(revokedAt));
      action = mockStore.getActions()[0];
    });

    describe('when no oauth stored', () => {
      beforeAll(() => {
        mockOAuth = null;
      });

      it('dispatches AUTHENTICATION_TOKEN_NOT_REVOKED', () => {
        expect(action.type)
          .toEqual(actionTypes.AUTHENTICATION_TOKEN_NOT_REVOKED);
      });
    });

    describe('when token is not revoked', () => {
      beforeAll(() => {
        mockIsTokenRevoked = false;
      });

      it('dispatches AUTHENTICATION_TOKEN_NOT_REVOKED', () => {
        expect(action.type)
          .toEqual(actionTypes.AUTHENTICATION_TOKEN_NOT_REVOKED);
      });
    });

    describe('when token is revoked and oauth is stored', () => {
      beforeAll(() => {
        mockOAuth = 'someauth';
        mockIsTokenRevoked = true;
      });

      it('clears existing zE_oauth objects from localstorage', () => {
        expect(persistentStoreRemoveSpy)
          .toHaveBeenCalledWith('zE_oauth');
      });

      it('dispatch AUTHENTICATION_TOKEN_REVOKED', () => {
        expect(action.type)
          .toEqual(actionTypes.AUTHENTICATION_TOKEN_REVOKED);
      });
    });
  });
});
