import jsonwebtoken from 'jsonwebtoken'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

let actions,
  actionTypes,
  chatNotificationDismissedSpy,
  chatOpenedSpy,
  mockNameValidValue,
  mockEmailValidValue,
  mockPhoneValidValue,
  mockStore,
  mockJwtFn,
  mockOAuth,
  mockBaseIsAuthenticated,
  mockIsTokenValid,
  mockExtractTokenId,
  mockPersistentStoreValue,
  mockHasContextuallySearched,
  mockGetArticleDisplayed,
  mockActiveEmbed,
  mockIsTokenExpired,
  mockAfterWidgetShowAnimationQueue,
  mockWebWidgetOpen,
  mockIsTokenRenewable = jasmine.createSpy('isTokenRenewable'),
  persistentStoreRemoveSpy = jasmine.createSpy('remove'),
  persistentStoreSetSpy = jasmine.createSpy('set'),
  httpPostSpy = jasmine.createSpy('http'),
  contextualSearchSpy = jasmine
    .createSpy('contextualSearch')
    .and.returnValue({ type: 'someActionType' }),
  fireEventsForSpy = jasmine.createSpy('fireFor'),
  focusLauncherSpy = jasmine.createSpy('focusLauncher')

const middlewares = [thunk]
const createMockStore = configureMockStore(middlewares)
const WIDGET_CLOSED_EVENT = 'WIDGET_CLOSED_EVENT'
const WIDGET_OPENED_EVENT = 'WIDGET_OPENED_EVENT'
const CHAT_POPOUT_EVENT = 'CHAT_POPOUT_EVENT'

describe('base redux actions', () => {
  beforeEach(() => {
    mockery.enable()

    mockNameValidValue = true
    mockEmailValidValue = true
    mockPhoneValidValue = true

    mockAfterWidgetShowAnimationQueue = []

    chatNotificationDismissedSpy = jasmine
      .createSpy('chatNotificationDismissed')
      .and.returnValue({ type: 'widget/chat/CHAT_NOTIFICATION_DISMISSED' })
    chatOpenedSpy = jasmine
      .createSpy('chatOpened')
      .and.returnValue({ type: 'widget/chat/CHAT_OPENED' })

    initMockRegistry({
      'constants/event': {
        WIDGET_CLOSED_EVENT,
        WIDGET_OPENED_EVENT,
        CHAT_POPOUT_EVENT
      },
      'service/api/callbacks': {
        fireFor: fireEventsForSpy
      },
      'src/redux/modules/chat': {
        chatNotificationDismissed: chatNotificationDismissedSpy,
        chatOpened: chatOpenedSpy
      },
      'src/redux/modules/base/helpers/auth': {
        isTokenValid: () => mockIsTokenValid,
        extractTokenId: () => mockExtractTokenId,
        isTokenRenewable: mockIsTokenRenewable,
        isTokenExpired: () => mockIsTokenExpired
      },
      'src/util/utils': {
        nameValid: () => mockNameValidValue,
        emailValid: () => mockEmailValidValue,
        phoneValid: () => mockPhoneValidValue
      },
      'service/settings': {
        settings: {
          getAuthSettingsJwtFn: () => mockJwtFn
        }
      },
      'src/redux/modules/base/base-selectors': {
        getOAuth: () => mockOAuth,
        getBaseIsAuthenticated: () => mockBaseIsAuthenticated,
        getActiveEmbed: () => mockActiveEmbed,
        getAfterWidgetShowAnimation: () => mockAfterWidgetShowAnimationQueue,
        getWebWidgetOpen: () => mockWebWidgetOpen
      },
      'embeds/helpCenter/selectors': {
        getHasContextuallySearched: () => mockHasContextuallySearched,
        getArticleDisplayed: () => mockGetArticleDisplayed
      },
      'src/redux/modules/chat/chat-selectors': {
        getPrechatFormRequired: () => false
      },
      'src/redux/modules/chat/chat-screen-types': {
        PRECHAT_SCREEN: 'PRECHAT_SCREEN'
      },
      'embeds/helpCenter/actions': {
        contextualSearch: contextualSearchSpy
      },
      'src/constants/shared': {
        PHONE_PATTERN: /^[0-9]+$/
      },
      'src/framework/services/persistence': {
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
      },
      'utility/globals': {
        focusLauncher: focusLauncherSpy
      },
      'src/embeds/support/actions': {
        clearAttachments: () => {}
      }
    })

    const actionsPath = buildSrcPath('redux/modules/base/base-actions/base-actions')
    const actionTypesPath = buildSrcPath('redux/modules/base/base-action-types')

    mockery.registerAllowable(actionsPath)
    mockery.registerAllowable(actionTypesPath)

    actions = requireUncached(actionsPath)
    actionTypes = requireUncached(actionTypesPath)

    mockStore = createMockStore({ base: {} })
  })

  afterEach(() => {
    httpPostSpy.calls.reset()
    persistentStoreSetSpy.calls.reset()
    persistentStoreRemoveSpy.calls.reset()
    contextualSearchSpy.calls.reset()
    mockery.disable()
    mockery.deregisterAll()

    jasmine.clock().uninstall()
  })

  describe('handleChatBadgeMinimize', () => {
    let action

    beforeEach(() => {
      mockStore.dispatch(actions.handleChatBadgeMinimize())
      action = mockStore.getActions()[0]
    })

    it('dispatches an action with CHAT_BADGE_MINIMIZED', () => {
      expect(action.type).toEqual(actionTypes.CHAT_BADGE_MINIMIZED)
    })
  })

  describe('badgeHideReceived', () => {
    let action

    beforeEach(() => {
      mockStore.dispatch(actions.badgeHideReceived())
      action = mockStore.getActions()[0]
    })

    it('dispatches an action with BADGE_HIDE_RECEIVED', () => {
      expect(action.type).toEqual(actionTypes.BADGE_HIDE_RECEIVED)
    })
  })

  describe('badgeShowReceived', () => {
    let action

    beforeEach(() => {
      mockStore.dispatch(actions.badgeShowReceived())
      action = mockStore.getActions()[0]
    })

    it('dispatches an action with BADGE_SHOW_RECEIVED', () => {
      expect(action.type).toEqual(actionTypes.BADGE_SHOW_RECEIVED)
    })
  })

  describe('updateEmbeddableConfig', () => {
    let action, mockConfig

    beforeEach(() => {
      mockConfig = {
        embeds: {
          helpCenterForm: {
            props: {
              signInRequired: true
            }
          }
        }
      }

      mockStore.dispatch(actions.updateEmbeddableConfig(mockConfig))
      action = mockStore.getActions()[0]
    })

    it('dispatches an action with UPDATE_EMBEDDABLE_CONFIG', () => {
      expect(action.type).toEqual(actionTypes.UPDATE_EMBEDDABLE_CONFIG)
    })

    it('dispatches the correct payload', () => {
      expect(action.payload).toEqual(mockConfig)
    })
  })

  describe('removeFromQueue', () => {
    let mockMethodName, action

    beforeEach(() => {
      mockMethodName = 'someMethodName'
      mockStore.dispatch(actions.removeFromQueue(mockMethodName))
      action = mockStore.getActions()[0]
    })

    it('dispatches an action with REMOVE_FROM_QUEUE', () => {
      expect(action.type).toEqual(actionTypes.REMOVE_FROM_QUEUE)
    })

    it('dispatches the correct payload', () => {
      expect(action.payload).toEqual('someMethodName')
    })
  })

  describe('updateQueue', () => {
    let mockPayload, action

    beforeEach(() => {
      mockPayload = {
        some: 'payload'
      }
      mockStore.dispatch(actions.updateQueue(mockPayload))
      action = mockStore.getActions()[0]
    })

    it('dispatches an action with UPDATE_QUEUE', () => {
      expect(action.type).toEqual(actionTypes.UPDATE_QUEUE)
    })

    it('dispatches the correct payload', () => {
      expect(action.payload).toEqual({
        some: 'payload'
      })
    })
  })

  describe('updateArturos', () => {
    let arturos, action

    beforeEach(() => {
      arturos = {
        newChat: true
      }

      mockStore.dispatch(actions.updateArturos(arturos))
      action = mockStore.getActions()[0]
    })

    it('dispatches an action with UPDATE_ARTUROS', () => {
      expect(action.type).toEqual(actionTypes.UPDATE_ARTUROS)
    })

    it('dispatches the correct payload', () => {
      expect(action.payload).toEqual(arturos)
    })
  })

  describe('updateEmbedAccessible', () => {
    let embed, accessible, action

    beforeEach(() => {
      embed = 'helpCenter'
      accessible = true
      mockStore.dispatch(actions.updateEmbedAccessible(embed, accessible))
      action = mockStore.getActions()[0]
    })

    it('dispatches an action of type UPDATE_EMBED', () => {
      expect(action.type).toEqual(actionTypes.UPDATE_EMBED)
    })

    it('has a name property in the payload', () => {
      expect(action.payload).toEqual(jasmine.objectContaining({ name: embed }))
    })

    it('has an accessible property in the payload', () => {
      expect(action.payload).toEqual(jasmine.objectContaining({ params: { accessible } }))
    })
  })

  describe('updateWidgetShown', () => {
    let action, actionList

    describe('when the widget is being shown for the first time', () => {
      beforeEach(() => {
        mockHasContextuallySearched = false
        mockStore.dispatch(actions.updateWidgetShown(true))
      })

      it('calls contextualSearch', () => {
        expect(contextualSearchSpy).toHaveBeenCalled()
      })
    })

    describe('when the widget is hidden', () => {
      beforeEach(() => {
        mockStore.dispatch(actions.updateWidgetShown(false))
      })

      it('does not call contextualSearch', () => {
        expect(contextualSearchSpy).not.toHaveBeenCalled()
      })
    })

    describe('when the widget is being shown for the second time', () => {
      beforeEach(() => {
        mockHasContextuallySearched = true
        mockStore.dispatch(actions.updateWidgetShown(true))
      })

      it('does not call contextualSearch', () => {
        expect(contextualSearchSpy).not.toHaveBeenCalled()
      })
    })

    describe('when activeEmbed is not chat', () => {
      beforeEach(() => {
        mockStore = createMockStore({ base: { activeEmbed: 'apoorv' } })
        mockStore.dispatch(actions.updateWidgetShown(true))
        action = mockStore.getActions()[0]
      })

      it('dispatches an action of type UPDATE_WIDGET_SHOWN', () => {
        expect(action.type).toEqual(actionTypes.UPDATE_WIDGET_SHOWN)
      })

      it('has the value of true in the payload', () => {
        expect(action.payload).toEqual(true)
      })
    })

    describe('when activeEmbed is chat', () => {
      beforeEach(() => {
        mockStore = createMockStore({ base: { activeEmbed: 'chat' } })
      })

      describe('when widget is shown', () => {
        beforeEach(() => {
          mockActiveEmbed = 'chat'
          mockStore.dispatch(actions.updateWidgetShown(true))
          actionList = mockStore.getActions()
        })

        it('dispatches an action of type UPDATE_WIDGET_SHOWN', () => {
          expect(actionList[0].type).toEqual(actionTypes.UPDATE_WIDGET_SHOWN)
        })

        it('has the value of true in the payload', () => {
          expect(actionList[0].payload).toEqual(true)
        })
      })

      describe('when widget is not shown', () => {
        beforeEach(() => {
          mockStore.dispatch(actions.updateWidgetShown(false))
          actionList = mockStore.getActions()
        })

        it('has the value of false in the payload', () => {
          expect(actionList[0].payload).toEqual(false)
        })

        it('does not dispatch an action of CHAT_OPENED', () => {
          expect(actionList.length).toEqual(1)
        })
      })
    })
  })

  describe('handlePrefillReceived', () => {
    let action, payload

    describe('when invoked normally', () => {
      const currentTime = 123

      beforeEach(() => {
        payload = {
          name: { value: 'Harry Potter', readOnly: true },
          email: { value: 'hpotter@hogwarts.edu.uk', readOnly: false },
          phone: { value: '12345678' }
        }

        spyOn(Date, 'now').and.returnValue(currentTime)

        mockStore.dispatch(actions.handlePrefillReceived(payload))
        action = mockStore.getActions()[0]
      })

      it('dispatches an action of type PREFILL_RECEIVED', () => {
        expect(action.type).toEqual(actionTypes.PREFILL_RECEIVED)
      })

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
          },
          timestamp: currentTime
        }

        expect(action.payload).toEqual(expected)
      })
    })

    describe('when the email is not valid', () => {
      beforeEach(() => {
        payload = {
          email: { value: 'hpotter@hogwarts' },
          name: { value: 'Harry Potter' }
        }

        mockEmailValidValue = false
        mockStore.dispatch(actions.handlePrefillReceived(payload))
        action = mockStore.getActions()[0]
      })

      it('does not pass through the email in payload', () => {
        expect(action.payload.prefillValues.email).toBeFalsy()
      })

      it('still passes through the name in payload', () => {
        expect(action.payload.prefillValues.name).toBe('Harry Potter')
      })
    })

    describe('when the phone is not valid', () => {
      beforeEach(() => {
        payload = {
          phone: { value: 'number' },
          name: { value: 'Harry Potter' }
        }
        mockPhoneValidValue = false
        mockStore.dispatch(actions.handlePrefillReceived(payload))
        action = mockStore.getActions()[0]
      })

      it('does not pass through the phone in payload', () => {
        expect(action.payload.prefillValues.phone).toBeFalsy()
      })

      it('still passes through the name in payload', () => {
        expect(action.payload.prefillValues.name).toBe('Harry Potter')
      })
    })

    describe('when the name is not valid', () => {
      beforeEach(() => {
        payload = {
          name: { value: 1 },
          phone: { value: '12345678' }
        }

        mockNameValidValue = false
        mockStore.dispatch(actions.handlePrefillReceived(payload))
        action = mockStore.getActions()[0]
      })

      it('does not pass through the name in payload', () => {
        expect(action.payload.prefillValues.name).toBeFalsy()
      })

      it('still passes through the phone in payload', () => {
        expect(action.payload.prefillValues.phone).toEqual('12345678')
      })
    })
  })

  describe('logout', function() {
    let action

    beforeEach(() => {
      mockStore.dispatch(actions.logout())
      action = mockStore.getActions()[0]
    })

    it('clears existing zE_oauth objects from localstorage', () => {
      expect(persistentStoreRemoveSpy).toHaveBeenCalledWith('zE_oauth')
    })

    it('dispatches AUTHENTICATION_TOKEN_REVOKED', () => {
      expect(action.type).toEqual(actionTypes.AUTHENTICATION_TOKEN_REVOKED)
    })
  })

  describe('authenticate', () => {
    let actionsList,
      newToken = 'yoloToken'

    beforeEach(() => {
      mockStore.dispatch(actions.authenticate(newToken))
      actionsList = mockStore.getActions()
    })

    it('dispatch AUTHENTICATION_PENDING action', () => {
      expect(actionsList[0].type).toEqual(actionTypes.AUTHENTICATION_PENDING)
    })

    describe('when authentication is required', () => {
      beforeAll(() => {
        newToken = 'someNewToken'
        mockExtractTokenId = 'notTheSameIdAszeoauth'
        mockBaseIsAuthenticated = false
      })

      it('requests a new oauth token', () => {
        const payload = httpPostSpy.calls.mostRecent().args[0]
        const params = payload.params

        expect(httpPostSpy).toHaveBeenCalled()

        expect(payload.method).toBe('POST')

        expect(payload.path).toBe('/embeddable/authenticate')

        expect(params).toEqual({
          body: newToken
        })
      })
    })

    describe('when authentication is not required', () => {
      beforeAll(() => {
        mockBaseIsAuthenticated = true
        mockOAuth = null
      })

      it('dispatchs AUTHENTICATION_SUCCESS action', () => {
        expect(actionsList[1].type).toEqual(actionTypes.AUTHENTICATION_SUCCESS)
      })
    })
  })

  describe('renewToken', () => {
    let zeoauth, renewPayload, jwt

    beforeEach(() => {
      const jwtPayload = {
        iat: 1458011438,
        jti: '1234567890',
        name: 'Jim Bob',
        email: 'jbob@zendesk.com'
      }

      jwt = jsonwebtoken.sign(jwtPayload, 'pencil')
      const body = { jwt }

      zeoauth = {
        id: '3498589cd03c34be6155b5a6498fe9786985da01', // sha1 hash of jbob@zendesk.com
        token: 'abcde',
        expiry: Math.floor(Date.now() / 1000) + 20 * 60,
        createdAt: Math.floor(Date.now() / 1000) - 1.6 * 60 * 60,
        webToken: jwt
      }
      renewPayload = {
        body: body.jwt,
        token: {
          oauth_token: zeoauth.token,
          oauth_expiry: zeoauth.expiry
        }
      }

      mockOAuth = zeoauth
    })

    describe('when the oauth token is renewable', () => {
      beforeEach(() => {
        mockIsTokenRenewable.and.returnValue(true)
        mockStore.dispatch(actions.renewToken())
      })

      it('requests a new oauth token', () => {
        const payload = httpPostSpy.calls.mostRecent().args[0]
        const params = payload.params

        expect(httpPostSpy).toHaveBeenCalled()

        expect(payload.method).toBe('POST')

        expect(payload.path).toBe('/embeddable/authenticate/renew')

        expect(params).toEqual(renewPayload)
      })

      describe('success callback', () => {
        let action

        beforeEach(() => {
          let doneCallback = httpPostSpy.calls.mostRecent().args[0].callbacks.done

          doneCallback({
            body: {
              oauth_token: 'abcde',
              oauth_expiry: 'someExpiry',
              oauth_created_at: 'createdAt'
            }
          })

          action = mockStore.getActions()[0]
        })

        it('stores the token', () => {
          expect(persistentStoreSetSpy).toHaveBeenCalledWith('zE_oauth', {
            id: zeoauth.id,
            token: 'abcde',
            expiry: 'someExpiry',
            createdAt: 'createdAt',
            webToken: jwt
          })
        })

        it('dispatchs AUTHENTICATION_SUCCESS action', () => {
          expect(action.type).toEqual(actionTypes.AUTHENTICATION_SUCCESS)
        })
      })

      describe('fail callback', () => {
        let action

        beforeEach(() => {
          let failCallback = httpPostSpy.calls.mostRecent().args[0].callbacks.fail

          failCallback()
          action = mockStore.getActions()[0]
        })

        it('does remove token', () => {
          expect(persistentStoreRemoveSpy).toHaveBeenCalledWith('zE_oauth')
        })

        it('does dispatch AUTHENTICATION_FAILURE action', () => {
          expect(action.type).toEqual(actionTypes.AUTHENTICATION_FAILURE)
        })
      })
    })

    describe('when the oauth token is not renewable', () => {
      beforeEach(() => {
        mockIsTokenRenewable.and.returnValue(false)
      })

      describe('and there is no jwtFn', () => {
        beforeEach(() => {
          mockStore.dispatch(actions.renewToken())
        })

        it('should return and not request a new oauth token', () => {
          expect(mockStore.getActions()).toEqual([])
        })

        describe('and the token is expired', () => {
          beforeEach(() => {
            mockIsTokenExpired = true
            mockStore.dispatch(actions.renewToken())
          })

          it('does not make any calls', () => {
            expect(mockStore.getActions()).toEqual([])
          })
        })
      })

      describe('and there is a jwtFn', () => {
        beforeEach(() => {
          mockJwtFn = jasmine.createSpy('mockJwtFn', callback => {
            callback()
          })
        })

        describe('and the token is expired', () => {
          beforeEach(() => {
            mockIsTokenExpired = true
            mockStore.dispatch(actions.renewToken())
          })

          it('calls the jwtFn', () => {
            expect(mockJwtFn).toHaveBeenCalledWith(jasmine.any(Function))
          })
        })

        describe('and there is no persisted oauth', () => {
          beforeEach(() => {
            mockOAuth = undefined
            mockStore.dispatch(actions.renewToken())
          })

          it('calls the jwtFn', () => {
            expect(mockJwtFn).toHaveBeenCalledWith(jasmine.any(Function))
          })
        })
      })
    })
  })

  describe('expireToken', () => {
    let action, revokedAt

    beforeEach(() => {
      mockStore.dispatch(actions.expireToken(revokedAt))
      action = mockStore.getActions()[0]
    })

    describe('when no oauth stored', () => {
      beforeAll(() => {
        mockOAuth = null
      })

      it('dispatches AUTHENTICATION_TOKEN_NOT_REVOKED', () => {
        expect(action.type).toEqual(actionTypes.AUTHENTICATION_TOKEN_NOT_REVOKED)
      })
    })

    describe('when token is not revoked', () => {
      beforeAll(() => {
        mockOAuth = {
          createdAt: 10
        }
        revokedAt = 8
      })

      it('dispatches AUTHENTICATION_TOKEN_NOT_REVOKED', () => {
        expect(action.type).toEqual(actionTypes.AUTHENTICATION_TOKEN_NOT_REVOKED)
      })
    })

    describe('when token is revoked and oauth is stored', () => {
      beforeAll(() => {
        mockOAuth = {
          createdAt: 7
        }
        revokedAt = 8
      })

      it('clears existing zE_oauth objects from localstorage', () => {
        expect(persistentStoreRemoveSpy).toHaveBeenCalledWith('zE_oauth')
      })

      it('dispatch AUTHENTICATION_TOKEN_REVOKED', () => {
        expect(action.type).toEqual(actionTypes.AUTHENTICATION_TOKEN_REVOKED)
      })
    })
  })

  describe('handleCloseButtonClicked', () => {
    let dispatchedActions

    beforeEach(() => {
      mockStore.dispatch(actions.handleCloseButtonClicked())
      dispatchedActions = mockStore.getActions()
    })

    afterEach(() => {
      fireEventsForSpy.calls.reset()
    })

    it('fires off widget close event', () => {
      expect(fireEventsForSpy).toHaveBeenCalledWith(WIDGET_CLOSED_EVENT)
    })

    it('calls focusLauncher', () => {
      expect(focusLauncherSpy).toHaveBeenCalled()
    })

    it('dispatches a CLOSE_BUTTON_CLICKED event', () => {
      expect(dispatchedActions[0].type).toEqual(actionTypes.CLOSE_BUTTON_CLICKED)
    })
  })

  describe('handlePopoutCreated', () => {
    let dispatchedActions

    beforeEach(() => {
      mockStore.dispatch(actions.handlePopoutCreated())
      dispatchedActions = mockStore.getActions()
    })

    it('dispatches a POPOUT_CREATED event', () => {
      expect(dispatchedActions[0].type).toEqual(actionTypes.POPOUT_CREATED)
    })

    it('fires off chat popout event', () => {
      expect(fireEventsForSpy).toHaveBeenCalledWith(CHAT_POPOUT_EVENT)
    })
  })

  describe('addToAfterShowAnimationQueue', () => {
    let dispatchedActions, callback

    beforeEach(() => {
      callback = () => 'hello'
      mockStore.dispatch(actions.addToAfterShowAnimationQueue(callback))
      dispatchedActions = mockStore.getActions()
    })

    it('dispatches a ADD_TO_AFTER_SHOW_ANIMATE event', () => {
      expect(dispatchedActions[0].type).toEqual(actionTypes.ADD_TO_AFTER_SHOW_ANIMATE)
    })

    it('dispatches the callback param as the payload', () => {
      expect(dispatchedActions[0].payload).toEqual(callback)
    })
  })

  describe('widgetShowAnimationComplete', () => {
    let dispatchedActions, callbackSpy

    beforeEach(() => {
      callbackSpy = () => ({ type: 'callbackType' })
      mockAfterWidgetShowAnimationQueue = [callbackSpy]
      mockStore.dispatch(actions.widgetShowAnimationComplete())
      dispatchedActions = mockStore.getActions()
    })

    it('dispatches functions in the afterWidgetShowAnimationQueue', () => {
      expect(dispatchedActions[0].type).toEqual('callbackType')
    })

    it('dispatches a WIDGET_SHOW_ANIMATION_COMPLETE event', () => {
      expect(dispatchedActions[1].type).toEqual(actionTypes.WIDGET_SHOW_ANIMATION_COMPLETE)
    })
  })

  describe('launcherClicked', () => {
    let dispatchedActions

    beforeEach(() => {
      mockStore.dispatch(actions.launcherClicked())
      dispatchedActions = mockStore.getActions()
    })

    afterEach(() => {
      fireEventsForSpy.calls.reset()
    })

    it('fires off widget open event', () => {
      expect(fireEventsForSpy).toHaveBeenCalledWith(WIDGET_OPENED_EVENT)
    })

    it('dispatches a LAUNCHER_CLICKED event', () => {
      expect(dispatchedActions[0].type).toEqual(actionTypes.LAUNCHER_CLICKED)
    })
  })

  describe('chatBadgeClicked', () => {
    let dispatchedActions

    beforeEach(() => {
      mockStore.dispatch(actions.chatBadgeClicked())
      dispatchedActions = mockStore.getActions()
    })

    afterEach(() => {
      fireEventsForSpy.calls.reset()
    })

    it('fires off widget open event', () => {
      expect(fireEventsForSpy).toHaveBeenCalledWith(WIDGET_OPENED_EVENT)
    })

    it('dispatches a CHAT_BADGE_CLICKED event', () => {
      expect(dispatchedActions[0].type).toEqual(actionTypes.CHAT_BADGE_CLICKED)
    })

    it('dispatches a ADD_TO_AFTER_SHOW_ANIMATE event', () => {
      expect(dispatchedActions[1].type).toEqual(actionTypes.ADD_TO_AFTER_SHOW_ANIMATE)
    })
  })

  describe('widgetInitialised', () => {
    let actionInit, actionBootUp

    beforeEach(() => {
      jasmine.clock().install()
      mockStore.dispatch(actions.widgetInitialised())
      actionInit = mockStore.getActions()[0]
      actionBootUp = mockStore.getActions()[1]
    })

    it('dispatches an action with WIDGET_INITIALISED', () => {
      expect(actionInit.type).toEqual(actionTypes.WIDGET_INITIALISED)
    })

    it('has not dispatched a second action', () => {
      expect(actionBootUp).toEqual(undefined)
    })

    describe('After 5 seconds', () => {
      beforeEach(() => {
        jasmine.clock().tick(5000)
        actionBootUp = mockStore.getActions()[1]
      })

      it('dispatches an action with BOOT_UP_TIMER_COMPLETE', () => {
        expect(actionBootUp.type).toEqual(actionTypes.BOOT_UP_TIMER_COMPLETE)
      })
    })
  })

  describe('activateReceived', () => {
    let action, mockOptions

    describe('with parameter', () => {
      beforeEach(() => {
        mockOptions = {
          value: true
        }
        mockStore.dispatch(actions.activateReceived(mockOptions))
        action = mockStore.getActions()[0]
      })

      it('dispatches an action with ACTIVATE_RECEIVED', () => {
        expect(action.type).toEqual(actionTypes.ACTIVATE_RECEIVED)
      })

      it('dispatches the correct payload', () => {
        expect(action.payload).toEqual(mockOptions)
      })
    })

    describe('with no parameter', () => {
      beforeEach(() => {
        mockOptions = {}
        mockStore.dispatch(actions.activateReceived())
        action = mockStore.getActions()[0]
      })

      it('dispatches the correct payload', () => {
        expect(action.payload).toEqual(mockOptions)
      })
    })
  })

  describe('hideReceived', () => {
    let action

    beforeEach(() => {
      mockStore.dispatch(actions.hideReceived())
      action = mockStore.getActions()[0]
    })

    it('dispatches an action with HIDE_RECEIVED', () => {
      expect(action.type).toEqual(actionTypes.HIDE_RECEIVED)
    })
  })

  describe('showReceived', () => {
    let action

    beforeEach(() => {
      mockStore.dispatch(actions.showReceived())
      action = mockStore.getActions()[0]
    })

    it('dispatches an action with SHOW_RECEIVED', () => {
      expect(action.type).toEqual(actionTypes.SHOW_RECEIVED)
    })
  })

  describe('legacyShowReceived', () => {
    let action

    beforeEach(() => {
      mockStore.dispatch(actions.legacyShowReceived())
      action = mockStore.getActions()[0]
    })

    it('dispatches an action with LEGACY_SHOW_RECEIVED', () => {
      expect(action.type).toEqual(actionTypes.LEGACY_SHOW_RECEIVED)
    })
  })

  describe('cancelButtonClicked', () => {
    let action

    beforeEach(() => {
      mockStore.dispatch(actions.cancelButtonClicked())
      action = mockStore.getActions()[0]
    })

    afterEach(() => {
      fireEventsForSpy.calls.reset()
    })

    it('dispatches an action with CANCEL_BUTTON_CLICKED', () => {
      expect(action.type).toEqual(actionTypes.CANCEL_BUTTON_CLICKED)
    })

    it('fires callbacks for WIDGET_CLOSED_EVENT', () => {
      expect(fireEventsForSpy).toHaveBeenCalledWith(WIDGET_CLOSED_EVENT)
    })
  })

  describe('openReceived', () => {
    describe('widget is open', () => {
      beforeAll(() => {
        mockWebWidgetOpen = true
      })

      it('does not dispatch any actions', () => {
        mockStore.dispatch(actions.openReceived())
        expect(mockStore.getActions()).toEqual([])
      })
    })

    describe('widget is closed', () => {
      let action

      beforeAll(() => {
        mockWebWidgetOpen = false
      })

      beforeEach(() => {
        mockStore.dispatch(actions.openReceived())
        action = mockStore.getActions()[0]
      })

      afterEach(() => {
        fireEventsForSpy.calls.reset()
      })

      it('dispatches an action with OPEN_RECEIVED', () => {
        expect(action.type).toEqual(actionTypes.OPEN_RECEIVED)
      })

      it('fires off widget open event', () => {
        expect(fireEventsForSpy).toHaveBeenCalledWith(WIDGET_OPENED_EVENT)
      })
    })
  })

  describe('closeReceived', () => {
    describe('widget is close', () => {
      beforeAll(() => {
        mockWebWidgetOpen = false
      })

      it('does not dispatch any actions', () => {
        mockStore.dispatch(actions.closeReceived())
        expect(mockStore.getActions()).toEqual([])
      })
    })

    describe('widget is open', () => {
      let action

      beforeAll(() => {
        mockWebWidgetOpen = true
      })

      beforeEach(() => {
        mockStore.dispatch(actions.closeReceived())
        action = mockStore.getActions()[0]
      })

      afterEach(() => {
        fireEventsForSpy.calls.reset()
      })

      it('dispatches an action with CLOSE_RECEIVED', () => {
        expect(action.type).toEqual(actionTypes.CLOSE_RECEIVED)
      })

      it('fires off widget close event', () => {
        expect(fireEventsForSpy).toHaveBeenCalledWith(WIDGET_CLOSED_EVENT)
      })
    })
  })

  describe('toggleReceived', () => {
    let action

    beforeEach(() => {
      mockStore.dispatch(actions.toggleReceived())
      action = mockStore.getActions()[0]
    })

    it('dispatches an action with TOGGLE_RECEIVED', () => {
      expect(action.type).toEqual(actionTypes.TOGGLE_RECEIVED)
    })
  })
})