describe('ChatOffline component', () => {
  let ChatOffline, TEST_IDS
  const ChatOfflinePath = buildSrcPath('component/chat/ChatOffline')
  const sharedConstantsPath = buildSrcPath('constants/shared')

  const Button = noopReactComponent()
  const ChatOfflineForm = noopReactComponent()

  const mockTitle = 'My custom title'

  beforeEach(() => {
    mockery.enable()

    TEST_IDS = requireUncached(sharedConstantsPath).TEST_IDS

    initMockRegistry({
      './ChatOffline.scss': {
        locals: {
          container: 'containerClass',
          offlineGreeting: 'offlineGreetingClass',
          submitButton: 'submitButtonClass',
          scrollContainerContent: 'scrollContainerContentClass',
          logoFooter: 'logoFooterClass',
          noZendeskLogoButton: 'noZendeskLogoButton',
          zendeskLogoButton: 'zendeskLogoButton'
        }
      },
      'service/i18n': {
        i18n: {
          t: _.identity,
          isRTL: () => {}
        }
      },
      '@zendeskgarden/react-buttons': { Button },
      'component/chat/ChatOfflineForm': { ChatOfflineForm },
      'src/redux/modules/chat': {
        ChatOfflineFormChanged: ''
      },
      'src/redux/modules/chat/chat-selectors': {
        getChatOfflineForm: ''
      },
      'src/redux/modules/selectors': {
        getOfflineFormFields: ''
      },
      'src/redux/modules/base/base-selectors': {
        getWidgetShown: ''
      },
      'constants/chat': {
        OFFLINE_FORM_SCREENS: {
          OPERATING_HOURS: 'OPERATING_HOURS',
          SUCCESS: 'SUCCESS'
        }
      },
      'src/redux/modules/chat/chat-history-selectors': {},
      './ChatHistoryLink.scss': {
        locals: {}
      },
      'component/Icon': {
        Icon: noop
      },
      'src/constants/shared': {
        TEST_IDS
      },
      'src/components/Widget': {
        Widget: noopReactComponent(),
        Header: noopReactComponent(),
        Main: noopReactComponent()
      }
    })

    mockery.registerAllowable(ChatOfflinePath)
    ChatOffline = requireUncached(ChatOfflinePath).default.WrappedComponent
  })

  afterEach(() => {
    mockery.deregisterAll()
    mockery.disable()
  })

  describe('render', () => {
    let component, mockFormSettings

    beforeEach(() => {
      component = instanceRender(<ChatOffline formSettings={mockFormSettings} />)

      spyOn(component, 'renderOfflineForm')
      spyOn(component, 'renderChatOfflineScreen')

      component.render()
    })

    describe('when formSettings is enabled', () => {
      beforeAll(() => {
        mockFormSettings = { enabled: true }
      })

      it('calls renderOfflineForm', () => {
        expect(component.renderOfflineForm).toHaveBeenCalled()
      })
    })

    describe('when formSettings is not enabled', () => {
      beforeAll(() => {
        mockFormSettings = { enabled: false }
      })

      it('calls renderChatOfflineScreen', () => {
        expect(component.renderChatOfflineScreen).toHaveBeenCalled()
      })
    })
  })

  describe('renderOfflineForm', () => {
    let result

    beforeEach(() => {
      const component = instanceRender(
        <ChatOffline title={mockTitle} fullscreen={true} isMobile={true} />
      )

      result = component.renderOfflineForm()
    })

    it('renders ChatOfflineForm', () => {
      expect(TestUtils.isElementOfType(result, ChatOfflineForm)).toEqual(true)
    })

    it('renders with the correct title', () => {
      expect(result.props.title).toEqual(mockTitle)
    })
    it('renders with the correct fullscreen status', () => {
      expect(result.props.fullscreen).toEqual(true)
    })

    it('renders with the correct isMobile status', () => {
      expect(result.props.isMobile).toEqual(true)
    })
  })
})
