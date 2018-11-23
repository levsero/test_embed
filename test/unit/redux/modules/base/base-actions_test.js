import jsonwebtoken from 'jsonwebtoken';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

let actions,
  actionTypes,
  chatNotificationDismissedSpy,
  chatOpenedSpy,
  mockNameValidValue,
  mockEmailValidValue,
  mockStore,
  mockAuthSettings,
  mockOAuth,
  mockBaseIsAuthenticated,
  mockIsTokenValid,
  mockExtractTokenId,
  mockPersistentStoreValue,
  mockHasContextuallySearched,
  mockActiveEmbed,
  mockIsTokenRenewable = jasmine.createSpy('isTokenRenewable'),
  persistentStoreRemoveSpy = jasmine.createSpy('remove'),
  persistentStoreSetSpy = jasmine.createSpy('set'),
  httpPostSpy = jasmine.createSpy('http'),
  broadcastSpy = jasmine.createSpy('broadcast'),
  contextualSearchSpy = jasmine.createSpy('contextualSearch').and.returnValue({ type: 'someActionType' });

const middlewares = [thunk];
const createMockStore = configureMockStore(middlewares);
const API_ON_CLOSE_NAME = 'API_ON_CLOSE_NAME';

describe('base redux actions', () => {
  beforeEach(() => {
    mockery.enable();

    mockNameValidValue = true;
    mockEmailValidValue = true;

    chatNotificationDismissedSpy = jasmine.createSpy('chatNotificationDismissed')
      .and.returnValue({ type: 'widget/chat/CHAT_NOTIFICATION_DISMISSED' });
    chatOpenedSpy = jasmine.createSpy('chatOpened')
      .and.returnValue({ type: 'widget/chat/CHAT_OPENED' });

    initMockRegistry({
      'constants/api': {
        API_ON_CLOSE_NAME
      },
      'src/redux/modules/chat': {
        chatNotificationDismissed: chatNotificationDismissedSpy,
        chatOpened: chatOpenedSpy
      },
      'src/redux/modules/base/helpers/auth': {
        isTokenValid: () => mockIsTokenValid,
        extractTokenId: () => mockExtractTokenId,
        isTokenRenewable: mockIsTokenRenewable
      },
      'src/util/utils': {
        nameValid: () => mockNameValidValue,
        emailValid: () => mockEmailValidValue
      },
      'service/settings': {
        settings: {
          getSupportAuthSettings: () => mockAuthSettings
        }
      },
      'src/redux/modules/base/base-selectors': {
        getOAuth: () => mockOAuth,
        getBaseIsAuthenticated: () => mockBaseIsAuthenticated,
        getActiveEmbed: () => mockActiveEmbed,
      },
      'src/redux/modules/helpCenter/helpCenter-selectors': {
        getHasContextuallySearched: () => mockHasContextuallySearched
      },
      'src/redux/modules/helpCenter': {
        contextualSearch: contextualSearchSpy
      },
      'src/constants/shared': {
        PHONE_PATTERN: /^[0-9]+$/
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

    mockery.registerAllowable(actionsPath);
    mockery.registerAllowable(actionTypesPath);

    actions = requireUncached(actionsPath);
    actionTypes = requireUncached(actionTypesPath);

    mockStore = createMockStore({ base: {} });
  });

  afterEach(() => {
    httpPostSpy.calls.reset();
    persistentStoreSetSpy.calls.reset();
    persistentStoreRemoveSpy.calls.reset();
    broadcastSpy.calls.reset();
    contextualSearchSpy.calls.reset();
    mockery.disable();
    mockery.deregisterAll();

    jasmine.clock().uninstall();
  });

  describe('handleChatBadgeMinimize', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.handleChatBadgeMinimize());
      action = mockStore.getActions()[0];
    });

    it('dispatches an action with CHAT_BADGE_MINIMIZED', () => {
      expect(action.type)
        .toEqual(actionTypes.CHAT_BADGE_MINIMIZED);
    });
  });

  describe('updateEmbeddableConfig', () => {
    let action,
      mockConfig;

    beforeEach(() => {
      mockConfig = {
        embeds: {
          helpCenterForm: {
            props: {
              signInRequired: true
            }
          }
        }
      };

      mockStore.dispatch(actions.updateEmbeddableConfig(mockConfig));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action with UPDATE_EMBEDDABLE_CONFIG', () => {
      expect(action.type)
        .toEqual(actionTypes.UPDATE_EMBEDDABLE_CONFIG);
    });

    it('dispatches the correct payload', () => {
      expect(action.payload)
        .toEqual(mockConfig);
    });
  });

  describe('removeFromQueue', () => {
    let mockMethodName,
      action;

    beforeEach(() => {
      mockMethodName = 'someMethodName';
      mockStore.dispatch(actions.removeFromQueue(mockMethodName));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action with REMOVE_FROM_QUEUE', () => {
      expect(action.type)
        .toEqual(actionTypes.REMOVE_FROM_QUEUE);
    });

    it('dispatches the correct payload', () => {
      expect(action.payload)
        .toEqual('someMethodName');
    });
  });

  describe('updateQueue', () => {
    let mockPayload,
      action;

    beforeEach(() => {
      mockPayload = {
        some: 'payload'
      };
      mockStore.dispatch(actions.updateQueue(mockPayload));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action with UPDATE_QUEUE', () => {
      expect(action.type)
        .toEqual(actionTypes.UPDATE_QUEUE);
    });

    it('dispatches the correct payload', () => {
      expect(action.payload)
        .toEqual({
          some: 'payload'
        });
    });
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

        it('dispatches an action of type UPDATE_ACTIVE_EMBED', () => {
          expect(actionList[0].type)
            .toEqual(actionTypes.UPDATE_ACTIVE_EMBED);
        });

        it('has the embed in the payload', () => {
          expect(actionList[0].payload)
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

  describe('apiResetWidget', () => {
    let actionList;

    beforeEach(() => {
      mockStore.dispatch(actions.apiResetWidget());
      actionList = mockStore.getActions();
    });

    it('dispatches an action of type API_CLEAR_FORM First', () => {
      expect(actionList[0].type).toEqual(actionTypes.API_CLEAR_FORM);
    });

    it('dispatches an action of type API_CLEAR_HC_SEARCHES Second', () => {
      expect(actionList[1].type).toEqual(actionTypes.API_CLEAR_HC_SEARCHES);
    });

    it('dispatches an action of type API_RESET_WIDGET Third', () => {
      expect(actionList[2].type).toEqual(actionTypes.API_RESET_WIDGET);
    });
  });

  describe('apiClearHcSearches', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.apiClearHcSearches());
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type API_CLEAR_HC_SEARCHES', () => {
      expect(action.type).toEqual( actionTypes.API_CLEAR_HC_SEARCHES );
    });
  });

  describe('apiResetWidget', () => {
    let actionList;

    beforeEach(() => {
      mockStore.dispatch(actions.apiResetWidget());
      actionList = mockStore.getActions();
    });

    it('dispatches an action of type API_CLEAR_FORM First', () => {
      expect(actionList[0].type).toEqual( actionTypes.API_CLEAR_FORM );
    });

    it('dispatches an action of type API_CLEAR_HC_SEARCHES Second', () => {
      expect(actionList[1].type).toEqual( actionTypes.API_CLEAR_HC_SEARCHES );
    });

    it('dispatches an action of type API_RESET_WIDGET Third', () => {
      expect(actionList[2].type).toEqual( actionTypes.API_RESET_WIDGET );
    });
  });
  describe('apiClearHcSearches', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.apiClearHcSearches());
      action = mockStore.getActions()[0];
    });
    it('dispatches an action of type API_CLEAR_HC_SEARCHES', () => {
      expect(action.type).toEqual( actionTypes.API_CLEAR_HC_SEARCHES );
    });
  });

  describe('updateWidgetShown', () => {
    let action,
      actionList;

    describe('when the widget is being shown for the first time', () => {
      beforeEach(() => {
        mockHasContextuallySearched = false;
        mockStore.dispatch(actions.updateWidgetShown(true));
      });

      it('calls contextualSearch', () => {
        expect(contextualSearchSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when the widget is hidden', () => {
      beforeEach(() => {
        mockStore.dispatch(actions.updateWidgetShown(false));
      });

      it('does not call contextualSearch', () => {
        expect(contextualSearchSpy)
          .not
          .toHaveBeenCalled();
      });
    });

    describe('when the widget is being shown for the second time', () => {
      beforeEach(() => {
        mockHasContextuallySearched = true;
        mockStore.dispatch(actions.updateWidgetShown(true));
      });

      it('does not call contextualSearch', () => {
        expect(contextualSearchSpy)
          .not
          .toHaveBeenCalled();
      });
    });

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
          mockActiveEmbed = 'chat';
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

  describe('handlePrefillReceived', () => {
    let action,
      payload;

    describe('when invoked normally', () => {
      beforeEach(() => {
        payload = {
          name: { value: 'Harry Potter', readOnly: true },
          email: { value: 'hpotter@hogwarts.edu.uk', readOnly: false },
          phone: { value: '12345678' }
        };

        mockStore.dispatch(actions.handlePrefillReceived(payload));
        action = mockStore.getActions()[0];
      });

      it('dispatches an action of type PREFILL_RECEIVED', () => {
        expect(action.type)
          .toEqual(actionTypes.PREFILL_RECEIVED);
      });

      it('passes the expected values payload', () => {
        const expected = {
          prefillValues: {
            name: 'Harry Potter',
            email: 'hpotter@hogwarts.edu.uk',
            phone: '12345678'
          },
          isReadOnly: {
            name: true,
            email: false
          }
        };

        expect(action.payload)
          .toEqual(expected);
      });
    });

    describe('when the email is not valid', () => {
      beforeEach(() => {
        payload = {
          email: { value: 'hpotter@hogwarts' },
          name: { value: 'Harry Potter' }
        };

        mockEmailValidValue = false;
        mockStore.dispatch(actions.handlePrefillReceived(payload));
        action = mockStore.getActions()[0];
      });

      it('does not pass through the email in payload', () => {
        expect(action.payload.prefillValues.email)
          .toBeFalsy();
      });

      it('still passes through the name in payload', () => {
        expect(action.payload.prefillValues.name)
          .toBe('Harry Potter');
      });
    });

    describe('when the phone is not valid', () => {
      beforeEach(() => {
        payload = {
          phone: { value: 'number' },
          name: { value: 'Harry Potter' }
        };

        mockStore.dispatch(actions.handlePrefillReceived(payload));
        action = mockStore.getActions()[0];
      });

      it('does not pass through the phone in payload', () => {
        expect(action.payload.prefillValues.phone)
          .toBeFalsy();
      });

      it('still passes through the name in payload', () => {
        expect(action.payload.prefillValues.name)
          .toBe('Harry Potter');
      });
    });

    describe('when the name is not valid', () => {
      beforeEach(() => {
        payload = {
          name: { value: 1 },
          phone: { value: '12345678' }
        };

        mockNameValidValue = false;
        mockStore.dispatch(actions.handlePrefillReceived(payload));
        action = mockStore.getActions()[0];
      });

      it('does not pass through the name in payload', () => {
        expect(action.payload.prefillValues.name)
          .toBeFalsy();
      });

      it('still passes through the phone in payload', () => {
        expect(action.payload.prefillValues.phone)
          .toEqual('12345678');
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

      it('requests a new oauth token', () => {
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
        mockIsTokenRenewable.and.returnValue(true);
        mockStore.dispatch(actions.renewToken());
      });

      it('requests a new oauth token', () => {
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
        mockIsTokenRenewable.and.returnValue(false);
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
        mockOAuth = {
          createdAt: 10
        };
        revokedAt = 8;
      });

      it('dispatches AUTHENTICATION_TOKEN_NOT_REVOKED', () => {
        expect(action.type)
          .toEqual(actionTypes.AUTHENTICATION_TOKEN_NOT_REVOKED);
      });
    });

    describe('when token is revoked and oauth is stored', () => {
      beforeAll(() => {
        mockOAuth = {
          createdAt: 7
        };
        revokedAt = 8;
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

  describe('handleOnApiCalled', () => {
    let action,
      mockActionType,
      selectorSpy,
      callbackSpy;

    beforeEach(() => {
      mockActionType = 'widget/chat/CHAT_CONNECTED';
      selectorSpy = jasmine.createSpy('arbitrarySelector');
      callbackSpy = jasmine.createSpy('arbitraryCallback');

      mockStore.dispatch(actions.handleOnApiCalled(mockActionType, selectorSpy, true, callbackSpy));

      action = mockStore.getActions()[0];
    });

    describe('when event is in the event list', () => {
      it('dispatches a API_ON_RECEIVED event', () => {
        expect(action.type)
          .toEqual(actionTypes.API_ON_RECEIVED);
      });

      it('has the actionType property in the payload', () => {
        expect(action.payload.actionType)
          .toEqual(mockActionType);
      });

      it('has the selectors property in the payload', () => {
        const selectors = action.payload.selectors;

        selectors();

        expect(selectorSpy)
          .toHaveBeenCalled();
      });

      it('has the useActionPayload param', () => {
        expect(action.payload.useActionPayload).toEqual(true);
      });

      it('has the callback property in the payload', () => {
        const callback = action.payload.callback;

        callback();

        expect(callbackSpy)
          .toHaveBeenCalled();
      });
    });
  });

  describe('handleCloseButtonClicked', () => {
    let dispatchedActions;

    beforeEach(() => {
      mockStore.dispatch(actions.handleCloseButtonClicked());
      dispatchedActions = mockStore.getActions();
    });

    it('dispatches a CLOSE_BUTTON_CLICKED event', () => {
      expect(dispatchedActions[0].type)
        .toEqual(actionTypes.CLOSE_BUTTON_CLICKED);
    });

    it('dispatches a EXECUTE_API_ON_CLOSE_CALLBACK event', () => {
      expect(dispatchedActions[1].type)
        .toEqual(actionTypes.EXECUTE_API_ON_CLOSE_CALLBACK);
    });
  });

  describe('launcherClicked', () => {
    let dispatchedActions;

    beforeEach(() => {
      mockStore.dispatch(actions.launcherClicked());
      dispatchedActions = mockStore.getActions();
    });

    describe('when the activeEmbed is not zopimChat', () => {
      beforeAll(() => {
        mockActiveEmbed = 'helpCenterForm';
      });

      it('dispatches a LAUNCHER_CLICKED event', () => {
        expect(dispatchedActions[0].type)
          .toEqual(actionTypes.LAUNCHER_CLICKED);
      });

      it('dispatches an EXECUTE_API_ON_OPEN_CALLBACK event', () => {
        expect(dispatchedActions[1].type).
          toEqual(actionTypes.EXECUTE_API_ON_OPEN_CALLBACK);
      });
    });

    describe('when the activeEmbed is zopimChat', () => {
      beforeAll(() => {
        mockActiveEmbed = 'zopimChat';
      });

      it('calls mediator zopimChat.show', () => {
        expect(broadcastSpy)
          .toHaveBeenCalledWith('zopimChat.show');
      });

      it('dispatches an EXECUTE_API_ON_OPEN_CALLBACK event', () => {
        expect(dispatchedActions[0].type).
          toEqual(actionTypes.EXECUTE_API_ON_OPEN_CALLBACK);
      });
    });
  });

  describe('apiClearForm', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.apiClearForm());
      action = mockStore.getActions()[0];
    });

    it('dispatches an action with API_CLEAR_FORM', () => {
      expect(action.type)
        .toEqual(actionTypes.API_CLEAR_FORM);
    });

    it('broadcasts .clear to mediator', () => {
      expect(broadcastSpy)
        .toHaveBeenCalledWith('.clear');
    });
  });

  describe('widgetInitialised', () => {
    let actionInit,
      actionBootUp;

    beforeEach(() => {
      jasmine.clock().install();
      mockStore.dispatch(actions.widgetInitialised());
      actionInit = mockStore.getActions()[0];
      actionBootUp = mockStore.getActions()[1];
    });

    it('dispatches an action with WIDGET_INITIALISED', () => {
      expect(actionInit.type)
        .toEqual(actionTypes.WIDGET_INITIALISED);
    });

    it('has not dispatched a second action', () => {
      expect(actionBootUp).toEqual(undefined);
    });

    describe('After 5 seconds', () => {
      beforeEach(() => {
        jasmine.clock().tick(5000);
        actionBootUp = mockStore.getActions()[1];
      });

      it('dispatches an action with BOOT_UP_TIMER_COMPLETE', () => {
        expect(actionBootUp.type)
          .toEqual(actionTypes.BOOT_UP_TIMER_COMPLETE);
      });
    });
  });

  describe('activateReceived', () => {
    let action,
      mockOptions;

    describe('with parameter', () => {
      beforeEach(() => {
        mockOptions = {
          value: true
        };
        mockStore.dispatch(actions.activateRecieved(mockOptions));
        action = mockStore.getActions()[0];
      });

      describe('when the activeEmbed is zopimChat', () => {
        beforeAll(() => {
          mockActiveEmbed = 'zopimChat';
        });

        it('calls mediator zopimChat.show', () => {
          expect(broadcastSpy)
            .toHaveBeenCalledWith('zopimChat.show');
        });

        it('does not dispatch an action', () => {
          expect(action)
            .toEqual(undefined);
        });
      });

      describe('when the activeEmbed is not zopimChat', () => {
        beforeAll(() => {
          mockActiveEmbed = 'helpCenterForm';
        });

        it('dispatches an action with ACTIVATE_RECEIVED', () => {
          expect(action.type)
            .toEqual(actionTypes.ACTIVATE_RECEIVED);
        });

        it('does not call mediator zopimChat.show', () => {
          expect(broadcastSpy)
            .not.toHaveBeenCalled();
        });

        it('dispatches the correct payload', () => {
          expect(action.payload)
            .toEqual(mockOptions);
        });
      });
    });

    describe('with no parameter', () => {
      beforeEach(() => {
        mockOptions = {};
        mockStore.dispatch(actions.activateRecieved());
        action = mockStore.getActions()[0];
      });

      it('dispatches the correct payload', () => {
        expect(action.payload)
          .toEqual(mockOptions);
      });
    });
  });

  describe('hideRecieved', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.hideRecieved());
      action = mockStore.getActions()[0];
    });

    describe('when the activeEmbed is zopimChat', () => {
      beforeAll(() => {
        mockActiveEmbed = 'zopimChat';
      });

      it('calls mediator zopimChat.hide', () => {
        expect(broadcastSpy)
          .toHaveBeenCalledWith('zopimChat.hide');
      });
    });

    describe('when the activeEmbed is not zopimChat', () => {
      beforeAll(() => {
        mockActiveEmbed = 'helpCenterForm';
      });

      it('dispatches an action with HIDE_RECEIVED', () => {
        expect(action.type)
          .toEqual(actionTypes.HIDE_RECEIVED);
      });

      it('calls mediator .hide', () => {
        expect(broadcastSpy)
          .toHaveBeenCalledWith('.hide');
      });
    });
  });

  describe('showRecieved', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.showRecieved());
      action = mockStore.getActions()[0];
    });

    it('dispatches an action with SHOW_RECEIVED', () => {
      expect(action.type)
        .toEqual(actionTypes.SHOW_RECEIVED);
    });
  });

  describe('legacyShowReceived', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.legacyShowReceived());
      action = mockStore.getActions()[0];
    });

    it('dispatches an action with LEGACY_SHOW_RECEIVED', () => {
      expect(action.type)
        .toEqual(actionTypes.LEGACY_SHOW_RECEIVED);
    });

    it('calls mediator .show', () => {
      expect(broadcastSpy)
        .toHaveBeenCalledWith('.show');
    });
  });

  describe('nextButtonClicked', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.nextButtonClicked());
      action = mockStore.getActions()[0];
    });

    it('dispatches an action with NEXT_BUTTON_CLICKED', () => {
      expect(action.type)
        .toEqual(actionTypes.NEXT_BUTTON_CLICKED);
    });
  });

  describe('cancelButtonClicked', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.cancelButtonClicked());
      action = mockStore.getActions()[0];
    });

    it('dispatches an action with CANCEL_BUTTON_CLICKED', () => {
      expect(action.type)
        .toEqual(actionTypes.CANCEL_BUTTON_CLICKED);
    });
  });

  describe('openReceived', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.openReceived());
      action = mockStore.getActions()[0];
    });

    it('dispatches an action with OPEN_RECEIVED', () => {
      expect(action.type)
        .toEqual(actionTypes.OPEN_RECEIVED);
    });
  });

  describe('closeReceived', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.closeReceived());
      action = mockStore.getActions()[0];
    });

    it('dispatches an action with CLOSE_RECEIVED', () => {
      expect(action.type)
        .toEqual(actionTypes.CLOSE_RECEIVED);
    });
  });

  describe('toggleReceived', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.toggleReceived());
      action = mockStore.getActions()[0];
    });

    it('dispatches an action with TOGGLE_RECEIVED', () => {
      expect(action.type)
        .toEqual(actionTypes.TOGGLE_RECEIVED);
    });
  });

  describe('executeApiOnOpenCallback', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.executeApiOnOpenCallback());
      action = mockStore.getActions()[0];
    });

    it('dispatches a EXECUTE_API_ON_OPEN_CALLBACK event', () => {
      expect(action.type).toEqual(actionTypes.EXECUTE_API_ON_OPEN_CALLBACK);
    });
  });

  describe('executeApiOnCloseCallback', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.executeApiOnCloseCallback());
      action = mockStore.getActions()[0];
    });

    it('dispatches a EXECUTE_API_ON_CLOSE_CALLBACK event', () => {
      expect(action.type)
        .toEqual(actionTypes.EXECUTE_API_ON_CLOSE_CALLBACK);
    });
  });
});
