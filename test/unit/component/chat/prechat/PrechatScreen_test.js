const prechatScreen = 'widget/chat/PRECHAT_SCREEN'
const chattingScreen = 'widget/chat/CHATTING_SCREEN'
const loadingScreen = 'widget/chat/LOADING_SCREEN'
const offlineMessageScreen = 'widget/chat/OFFLINE_MESSAGE_SUCCESS_SCREEN'

describe('PrechatScreen component', () => {
  let PrechatScreen, prechatFormSettingsProp

  const chatPath = buildSrcPath('component/chat/prechat/PrechatScreen')
  const chatConstantsPath = buildSrcPath('constants/chat')

  const updateChatScreenSpy = jasmine.createSpy('updateChatScreen')
  const handlePrechatFormSubmitSpy = jasmine.createSpy('handlePrechatFormSubmit')
  const resetCurrentMessageSpy = jasmine.createSpy('resetCurrentMessage')

  const PrechatForm = noopReactComponent('PrechatForm')
  const PrechatFormOfflineMessageSuccessPage = noopReactComponent(
    'PrechatFormOfflineMessageSuccessPage'
  )
  const LoadingSpinner = noopReactComponent('LoadingSpinner')

  const DEPARTMENT_STATUSES = requireUncached(chatConstantsPath).DEPARTMENT_STATUSES

  const mockTitle = 'My custom title'

  beforeEach(() => {
    mockery.enable()

    prechatFormSettingsProp = { form: {}, required: false }

    initMockRegistry({
      './PrechatScreen.scss': {
        locals: {
          scrollContainerMobile: 'scrollContainerMobileClasses',
          mobileContainer: 'mobileContainerClasses',
          logoFooter: 'logoFooterClasses',
          scrollContainer: 'scrollContainerClasses',
          scrollContainerContent: 'scrollContainerContentClasses',
          zendeskLogo: 'zendeskLogoClasses'
        }
      },
      'src/embeds/chat/components/SocialLogin': noopReactComponent(),
      'component/loading/LoadingSpinner': {
        LoadingSpinner
      },
      'embeds/chat/components/PrechatForm': PrechatForm,
      'embeds/chat/actions/prechat-form': { submitPrechatForm: noop() },
      'component/container/Container': {
        Container: noopReactComponent()
      },
      'embeds/webWidget/selectors/feature-flags': {
        isFeatureEnabled: () => false
      },
      'components/Widget/SuspensePage': noopReactComponent(),
      'src/redux/modules/chat': {
        sendMsg: noop,
        handleChatBoxChange: noop,
        setVisitorInfo: noop,
        updateChatScreen: updateChatScreenSpy,
        handlePrechatFormSubmit: handlePrechatFormSubmitSpy,
        resetCurrentMessage: resetCurrentMessageSpy
      },
      'src/redux/modules/selectors': {
        getPrechatFormFields: noop
      },
      'src/redux/modules/settings/settings-selectors': {
        getSettingsChatDepartmentsEmpty: noop
      },
      'src/redux/modules/chat/chat-screen-types': {
        PRECHAT_SCREEN: prechatScreen,
        CHATTING_SCREEN: chattingScreen,
        LOADING_SCREEN: loadingScreen,
        OFFLINE_MESSAGE_SUCCESS_SCREEN: offlineMessageScreen
      },
      'service/i18n': {
        i18n: {
          t: _.identity,
          isRTL: () => {}
        }
      },
      'constants/chat': {
        AGENT_BOT: 'agent:trigger',
        DEPARTMENT_STATUSES
      },
      'src/embeds/chat/pages/PrechatFormOfflineMessageSuccessPage': PrechatFormOfflineMessageSuccessPage,
      'src/redux/modules/chat/chat-selectors': {},
      'src/redux/modules/chat/chat-history-selectors': {},
      'src/components/Widget': {
        Widget: noopReactComponent(),
        Header: noopReactComponent(),
        Main: noopReactComponent(),
        Footer: noopReactComponent()
      },
      'src/components/WidgetHeader': {}
    })

    mockery.registerAllowable(chatPath)
    PrechatScreen = requireUncached(chatPath).default.WrappedComponent
  })

  afterEach(() => {
    mockery.deregisterAll()
    mockery.disable()

    updateChatScreenSpy.calls.reset()
  })

  describe('onPrechatFormComplete', () => {
    let component,
      setVisitorInfoSpy,
      sendMsgSpy,
      setDepartmentSpy,
      formInfo,
      sendOfflineMessageSpy,
      clearDepartmentSpy,
      mockDepartments,
      submitPrechatFormSpy,
      deptHidden = false

    beforeEach(() => {
      setVisitorInfoSpy = jasmine.createSpy('setVisitorInfo')
      sendMsgSpy = jasmine.createSpy('sendMsg')
      setDepartmentSpy = jasmine.createSpy('setDepartment')
      sendOfflineMessageSpy = jasmine.createSpy('sendOfflineMessage')
      clearDepartmentSpy = jasmine.createSpy('clearDepartment')
      submitPrechatFormSpy = jasmine.createSpy('submitPrechatForm')
      component = instanceRender(
        <PrechatScreen
          prechatFormSettings={prechatFormSettingsProp}
          setVisitorInfo={setVisitorInfoSpy}
          sendMsg={sendMsgSpy}
          setDepartment={setDepartmentSpy}
          updateChatScreen={updateChatScreenSpy}
          handlePrechatFormSubmit={handlePrechatFormSubmitSpy}
          resetCurrentMessage={resetCurrentMessageSpy}
          departments={mockDepartments}
          departmentFieldHidden={deptHidden}
          sendOfflineMessage={sendOfflineMessageSpy}
          clearDepartment={clearDepartmentSpy}
          submitPrechatForm={submitPrechatFormSpy}
        />
      )

      component.onPrechatFormComplete(formInfo)
    })

    afterEach(() => {
      deptHidden = false
      setVisitorInfoSpy.calls.reset()
      sendMsgSpy.calls.reset()
      setDepartmentSpy.calls.reset()
      updateChatScreenSpy.calls.reset()
      handlePrechatFormSubmitSpy.calls.reset()
      sendOfflineMessageSpy.calls.reset()
    })

    it('calls submitPrechatForm', () => {
      expect(submitPrechatFormSpy).toHaveBeenCalledWith({
        values: formInfo,
        isDepartmentFieldVisible: !deptHidden
      })
    })

    it('calls resetCurrentMessage', () => {
      expect(resetCurrentMessageSpy).toHaveBeenCalled()
    })
  })

  describe('render', () => {
    let component, mockScreen

    beforeEach(() => {
      const prechatFormSettings = { form: {}, message: '' }

      component = instanceRender(
        <PrechatScreen screen={mockScreen} prechatFormSettings={prechatFormSettings} />
      )

      spyOn(component, 'renderLoadingSpinner')

      component.render()
    })

    describe('when the screen is loading screen', () => {
      beforeAll(() => {
        mockScreen = loadingScreen
      })

      it('calls renderLoadingSpinner', () => {
        expect(component.renderLoadingSpinner).toHaveBeenCalled()
      })
    })

    describe('when the screen is unrecognised', () => {
      beforeAll(() => {
        mockScreen = 'bob screen'
      })

      it('does not call renderLoadingSpinner', () => {
        expect(component.renderLoadingSpinner).not.toHaveBeenCalled()
      })
    })
  })

  describe('renderLoadingSpinner', () => {
    let component

    beforeEach(() => {
      component = domRender(
        <PrechatScreen screen={loadingScreen} title={mockTitle} isMobile={true} fullscreen={true} />
      )
    })

    it('renders a LoadingSpinner', () => {
      expect(() => TestUtils.findRenderedComponentWithType(component, LoadingSpinner)).not.toThrow()
    })
  })
})
