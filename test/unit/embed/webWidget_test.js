describe('embed.webWidget', () => {
  let webWidget,
    mockIsOnHelpCenterPageValue,
    mockIsMobileBrowser,
    mockHelpCenterSuppressedValue,
    mockContactFormSuppressedValue,
    mockTalkSuppressedValue,
    mockTicketFormsValue,
    mockSupportJwtValue,
    mockSupportJwtFnValue,
    mockChatAuthValue,
    mockFiltersValue,
    mockFrame,
    mockNicknameValue,
    zChatInitSpy,
    authenticateSpy,
    mockActiveEmbed,
    mockStore,
    mockWebWidget,
    mockChatNotification,
    mockStandaloneMobileNotificationVisible,
    mockState,
    chatNotificationDismissedSpy,
    mockIsPopout,
    mockTalkRequired = true,
    mockCookiesDisabled

  const webWidgetPath = buildSrcPath('embed/webWidget/webWidget')
  const expireTokenSpy = jasmine.createSpy()
  const getTicketFormsSpy = jasmine.createSpy('ticketForms')
  const getTicketFieldsSpy = jasmine.createSpy('ticketFields')
  const AUTHENTICATION_STARTED = 'widget/chat/AUTHENTICATION_STARTED'
  const callMeScreen = 'widget/talk/CALLBACK_SCREEN'
  const createMockConfig = (overrides = {}) => {
    return {
      embeds: {
        talk: { props: { serviceUrl: 'talk.io' } },
        ...overrides
      }
    }
  }

  beforeEach(() => {
    mockIsOnHelpCenterPageValue = false
    mockHelpCenterSuppressedValue = false
    mockContactFormSuppressedValue = false
    mockTalkSuppressedValue = false
    ;(mockTicketFormsValue = []), (mockFiltersValue = []), (mockSupportJwtValue = null)
    mockSupportJwtFnValue = null
    mockChatAuthValue = null
    mockIsMobileBrowser = false
    mockIsPopout = false
    mockActiveEmbed = ''
    zChatInitSpy = jasmine.createSpy('zChatInit')
    authenticateSpy = jasmine.createSpy('authenticate')
    mockStore = {
      getState: () => mockState,
      dispatch: jasmine.createSpy('dispatch'),
      subscribe: () => undefined
    }
    mockChatNotification = { show: false, proactive: false }
    mockStandaloneMobileNotificationVisible = false
    chatNotificationDismissedSpy = jasmine.createSpy('chatNotificationDismissed')

    mockFrame = requireUncached(buildTestPath('unit/mocks/mockFrame')).MockFrame
    mockWebWidget = requireUncached(buildTestPath('unit/mocks/mockWebWidget'))

    getTicketFormsSpy.calls.reset()
    getTicketFieldsSpy.calls.reset()

    resetDOM()

    mockery.enable()

    jasmine.clock().install()

    initMockRegistry({
      React: React,
      'service/beacon': {
        beacon: jasmine.createSpyObj('beacon', ['trackUserAction', 'sendWidgetInitInterval'])
      },
      'service/i18n': {
        i18n: {
          getLocale: () => 'fr',
          t: _.identity
        }
      },
      'service/transport': {
        http: {
          get: jasmine.createSpy('http.get'),
          send: jasmine.createSpy('http.send'),
          sendFile: jasmine.createSpy('http.sendFile'),
          getImage: jasmine.createSpy('http.getImage'),
          getZendeskHost: () => {
            return 'zendesk.host'
          }
        }
      },
      'service/settings': {
        settings: {
          get: value => {
            return _.get(
              {
                contactOptions: { enabled: false },
                helpCenter: {
                  suppress: mockHelpCenterSuppressedValue,
                  filter: mockFiltersValue
                },
                contactForm: {
                  ticketForms: mockTicketFormsValue
                },
                talk: {
                  suppress: mockTalkSuppressedValue,
                  nickname: mockNicknameValue
                }
              },
              value,
              null
            )
          },
          getAuthSettingsJwt: () => mockSupportJwtValue,
          getAuthSettingsJwtFn: () => mockSupportJwtFnValue,
          getChatAuthSettings: () => mockChatAuthValue
        }
      },
      'component/webWidget/WebWidget': mockWebWidget,
      globalCSS: '',
      './webWidgetStyles': {
        webWidgetStyles: 'mockCss'
      },
      'component/frame/Frame': mockFrame,
      'src/redux/modules/chat/helpers/pollChatForOnlineStatus': {},
      'embeds/chat/actions/connectOnPageLoad': {},
      'src/redux/modules/chat': {
        setVisitorInfo: user => user,
        chatNotificationDismissed: chatNotificationDismissedSpy,
        setUpChat: () => undefined
      },
      'src/redux/modules/talk': {
        loadTalkVendors: noop
      },
      'src/redux/modules/base/base-selectors': {
        getActiveEmbed: () => mockActiveEmbed
      },
      'redux/modules/base/base-actions/index': {
        updateActiveEmbed: () => mockActiveEmbed
      },
      'embeds/support/actions/fetchForms': {
        fetchTicketForms: () => undefined,
        getTicketFields: getTicketFieldsSpy
      },
      'src/redux/modules/settings/settings-selectors': {
        getSettingsHelpCenterSuppress: () => mockHelpCenterSuppressedValue,
        getSettingsContactFormSuppress: () => mockContactFormSuppressedValue,
        getCookiesDisabled: () => mockCookiesDisabled
      },
      'src/redux/modules/chat/chat-selectors': {
        getStandaloneMobileNotificationVisible: () => mockStandaloneMobileNotificationVisible
      },
      'src/redux/modules/selectors': {
        getTalkEnabled: () => mockTalkRequired,
        getTalkNickname: () => mockNicknameValue,
        getChatNotification: () => mockChatNotification,
        getChatConnectionSuppressed: () => false,
        getDelayChatConnection: () => false
      },
      'src/redux/modules/talk/talk-screen-types': {
        CALLBACK_SCREEN: callMeScreen
      },
      'service/api/zopimApi': {
        zopimApi: {
          handleZopimQueue: jasmine.createSpy('handleZopimQ')
        }
      },
      'socket.io-client': {},
      'libphonenumber-js': {},
      'utility/devices': {
        isMobileBrowser() {
          return mockIsMobileBrowser
        },
        getZoomSizingRatio: noop
      },
      'utility/color/styles': {
        generateUserWidgetCSS: jasmine.createSpy().and.returnValue('')
      },
      'utility/pages': {
        isOnHelpCenterPage: () => mockIsOnHelpCenterPageValue
      },
      'utility/globals': {
        document: global.document,
        getDocumentHost: () => {
          return document.body
        },
        isPopout: () => mockIsPopout
      },
      'src/redux/modules/base': {
        authenticate: authenticateSpy,
        expireToken: expireTokenSpy
      },
      lodash: _,
      'constants/chat': {
        SDK_ACTION_TYPE_PREFIX: 'websdk'
      },
      'src/redux/modules/chat/chat-action-types': {
        AUTHENTICATION_STARTED
      },
      'utility/scrollHacks': {
        setScrollKiller: noop
      },
      'src/util/utils': {
        onNextTick: cb => setTimeout(cb, 0)
      },
      'src/util/chat': {}
    })

    mockery.registerAllowable(webWidgetPath)

    const factory = requireUncached(webWidgetPath).default

    webWidget = new factory()
  })

  afterEach(() => {
    jasmine.clock().uninstall()
    mockery.deregisterAll()
    mockery.disable()
  })

  describe('#create', () => {
    let faythe

    it('creates the embed component', () => {
      webWidget.create('', createMockConfig(), mockStore)

      faythe = webWidget.get()

      expect(faythe).toBeDefined()

      expect(faythe.component).toBeDefined()
    })

    describe('frame props', () => {
      let child, grandchild, frame

      const createRender = () => {
        const config = createMockConfig({
          ticketSubmissionForm: { props: { attachmentsEnabled: true } },
          helpCenterForm: { props: {} }
        })

        webWidget.create('', config, mockStore)
        webWidget.render()

        frame = webWidget.get().instance
        faythe = frame.getRootComponent()
        child = faythe.getActiveComponent()
        grandchild = child.getChild()
      }

      beforeEach(() => {
        createRender()
      })

      it('applies webWidget.scss to the frame factory', () => {
        webWidget.create('', createMockConfig(), mockStore)

        expect(webWidget.get().component.props.children.props.css).toContain('mockCss')
      })

      it('sets the iframe title', () => {
        expect(frame.props.title).toEqual('embeddable_framework.web_widget.frame.title')
      })

      describe('hideNavigationButtons', () => {
        beforeEach(() => {
          mockIsPopout = true
          mockIsMobileBrowser = true
        })

        describe('when is popout and mobile', () => {
          it('hides navigation buttons', () => {
            createRender()
            expect(frame.props.hideNavigationButtons).toEqual(true)
          })
        })

        describe('when not isPopout', () => {
          beforeEach(() => {
            mockIsPopout = false
            createRender()
          })

          it('return false', () => {
            expect(frame.props.hideNavigationButtons).toEqual(false)
          })
        })

        describe('when not isMobileBrowser', () => {
          beforeEach(() => {
            mockIsMobileBrowser = false
            createRender()
          })

          it('return false', () => {
            expect(frame.props.hideNavigationButtons).toEqual(false)
          })
        })

        describe('when not isPopout and not isMobileBrowser', () => {
          beforeEach(() => {
            mockIsMobileBrowser = false
            mockIsPopout = false
            createRender()
          })

          it('return false', () => {
            expect(frame.props.hideNavigationButtons).toEqual(false)
          })
        })
      })

      describe('onShow', () => {
        beforeEach(() => {
          mockIsMobileBrowser = true

          spyOn(grandchild, 'resetTicketFormVisibility')

          frame.props.onShow(frame)
        })
      })
    })

    describe('ipm', () => {
      describe('ipm mode is not on', () => {
        beforeEach(() => {
          const config = createMockConfig({
            ticketSubmissionForm: { props: { formTitleKey: 'foo' } }
          })

          webWidget.create('', config, mockStore)
          webWidget.render()

          faythe = webWidget.get().instance.props.children
        })

        it('passes in ipmHelpCenterAvailable as false', () => {
          expect(faythe.ipmHelpCenterAvailable).toBeFalsy()
        })
      })

      describe('no hc and ipm mode on', () => {
        beforeEach(() => {
          const config = createMockConfig({
            ticketSubmissionForm: { props: { formTitleKey: 'foo' } }
          })

          webWidget.create('', config, mockStore)
          webWidget.render()

          faythe = webWidget.get().instance.props.children
        })

        it('passes in ipmHelpCenterAvailable as true', () => {
          expect(faythe.props.ipmHelpCenterAvailable).toEqual(true)
        })
      })

      describe('has hc and ipm mode on', () => {
        beforeEach(() => {
          const config = createMockConfig({
            ticketSubmissionForm: { props: { formTitleKey: 'foo' } },
            helpCenterForm: { props: { formTitleKey: 'bar' } }
          })

          webWidget.create('', config, mockStore)
          webWidget.render()

          faythe = webWidget.get().instance.props.children
        })

        it('passes in ipmHelpCenterAvailable as false', () => {
          expect(faythe.props.ipmHelpCenterAvailable).toEqual(false)
        })
      })
    })

    describe('child props', () => {
      beforeEach(() => {
        const config = createMockConfig({
          ticketSubmissionForm: { props: { formTitleKey: 'foo' } }
        })

        webWidget.create('', config, mockStore)
        webWidget.render()

        faythe = webWidget.get().instance.props.children
      })

      it('should have default container styles', () => {
        expect(faythe.props.style).toEqual({ width: 342 })
      })

      describe('when on mobile', () => {
        beforeEach(() => {
          mockIsMobileBrowser = true
          webWidget.create('', createMockConfig(), mockStore)
          webWidget.render()

          faythe = webWidget.get().instance.props.children
        })

        it('switches container styles', () => {
          expect(faythe.props.style).toEqual({
            minHeight: '100%',
            width: '100%',
            maxHeight: '100%'
          })
        })
      })

      describe('when is popout', () => {
        let result,
          expectedResult = {
            minHeight: '100%',
            width: '100%',
            maxHeight: '100%'
          }

        beforeEach(() => {
          mockIsPopout = true
          webWidget.create('', createMockConfig(), mockStore)
          webWidget.render()

          result = webWidget.get().instance.props.children
        })

        afterEach(() => {
          mockIsPopout = false
        })

        it('contains popout styles', () => {
          expect(result.props.style).toEqual(expectedResult)
        })
      })
    })

    describe('when no embeds are part of config', () => {
      beforeEach(() => {
        zChatInitSpy.calls.reset()
        webWidget.create('', createMockConfig(), mockStore)
        webWidget.render()

        faythe = webWidget.get().instance.getRootComponent()
      })

      it('sets submitTicketAvailable to false', () => {
        expect(faythe.props.submitTicketAvailable).toBeFalsy()
      })

      it('sets helpCenterAvailable to false', () => {
        expect(faythe.props.helpCenterAvailable).toBeFalsy()
      })

      it('does not call zChat init', () => {
        expect(zChatInitSpy).not.toHaveBeenCalled()
      })
    })
  })

  describe('#render', () => {
    it('renders a webWidget form to the document', () => {
      webWidget.create('', createMockConfig(), mockStore)
      webWidget.render()

      expect(document.querySelectorAll('.mock-frame').length).toEqual(1)

      expect(TestUtils.isCompositeComponent(webWidget.get().instance)).toEqual(true)
    })

    it('should only be allowed to render an webWidget form once', () => {
      webWidget.create('', createMockConfig(), mockStore)

      expect(() => webWidget.render()).not.toThrow()

      expect(() => webWidget.render()).toThrow()
    })
  })
})
