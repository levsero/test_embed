describe('ChatOfflineForm component', () => {
  let ChatOfflineForm,
    SuccessNotification = noopReactComponent(),
    mockShouldRenderErrorMessage,
    TEST_IDS
  const ChatOfflineFormPath = buildSrcPath('component/chat/ChatOfflineForm')
  const sharedConstantsPath = basePath('src/constants/shared')

  const Form = noopReactComponent()
  const Field = noopReactComponent()
  const Button = noopReactComponent()
  const LoadingSpinner = noopReactComponent()
  const ChatOperatingHours = noopReactComponent()
  const ChatOfflineMessageForm = noopReactComponent()
  const ChatMessagingChannels = noopReactComponent()
  const UserProfile = noopReactComponent()
  const GardenField = noopReactComponent()
  const Message = noopReactComponent()
  const Linkify = noopReactComponent('Linkify')
  const mainScreen = 'main'
  const successScreen = 'success'
  const loadingScreen = 'loading'
  const operatingHoursScreen = 'operatingHours'
  const initialFormState = {
    name: '',
    email: '',
    phone: '',
    message: ''
  }

  const mockTitle = 'My custom title'

  beforeEach(() => {
    mockery.enable()

    TEST_IDS = requireUncached(sharedConstantsPath).TEST_IDS

    initMockRegistry({
      './ChatOfflineForm.scss': {
        locals: {
          container: 'containerClass',
          offlineGreeting: 'offlineGreetingClass',
          submitButton: 'submitButtonClass',
          scrollContainer: 'scrollContainerClass',
          mobileContainer: 'mobileContainerClass',
          scrollContainerContent: 'scrollContainerContentClass',
          operatingHoursContainer: 'operatingHoursContainerClass',
          operatingHoursLink: 'operatingHoursLinkClass',
          nameFieldWithSocialLogin: 'nameFieldWithSocialLoginClass'
        }
      },
      'service/i18n': {
        i18n: {
          t: _.identity,
          isRTL: () => {}
        }
      },
      '@zendeskgarden/react-forms': {
        Field: GardenField,
        Label: noopReactComponent(),
        Input: noopReactComponent(),
        Textarea: noopReactComponent(),
        Message
      },
      'react-linkify': Linkify,
      'constants/chat': {
        OFFLINE_FORM_SCREENS: {
          MAIN: mainScreen,
          SUCCESS: successScreen,
          LOADING: loadingScreen,
          OPERATING_HOURS: operatingHoursScreen
        }
      },
      'component/form/Form': {
        Form: Form
      },
      'component/field/Field': {
        Field: Field
      },
      '@zendeskgarden/react-buttons': {
        Button: Button
      },
      'component/loading/LoadingSpinner': {
        LoadingSpinner: LoadingSpinner
      },
      'src/embeds/chat/pages/OperatingHoursPage': ChatOperatingHours,
      'component/chat/ChatOfflineDepartmentMessageSuccess': ChatOfflineMessageForm,
      'component/chat/ChatMessagingChannels': {
        ChatMessagingChannels
      },
      'component/chat/UserProfile': { UserProfile },
      'component/shared/SuccessNotification': {
        SuccessNotification
      },
      'src/constants/shared': {
        ICONS: {
          SUCCESS_CONTACT_FORM: 'icon'
        },
        NAME_PATTERN: /.+/,
        PHONE_PATTERN: /.+/,
        TEST_IDS
      },
      'src/util/fields': {
        shouldRenderErrorMessage: () => mockShouldRenderErrorMessage,
        renderLabel: () => 'someLabel'
      },
      'embeds/chat/components/ViewHistoryButton': noopReactComponent(),
      'component/Icon': {
        Icon: noop
      },
      'src/embeds/chat/components/Footer/index': {},
      'src/components/Widget': {
        Widget: 'form',
        Header: noopReactComponent(),
        Main: noopReactComponent()
      },
      'src/components/SuccessNotification': {},
      'src/hooks/useTranslate': {},
      'icons/widget-icon_success_contactForm.svg': {}
    })

    mockery.registerAllowable(ChatOfflineFormPath)
    ChatOfflineForm = requireUncached(ChatOfflineFormPath).ChatOfflineForm
  })

  afterEach(() => {
    mockery.deregisterAll()
    mockery.disable()
  })

  describe('componentDidMount', () => {
    let component, mockOfflineMessage

    beforeEach(() => {
      component = instanceRender(
        <ChatOfflineForm formState={{}} offlineMessage={mockOfflineMessage} />
      )

      spyOn(component, 'validate')

      component.componentDidMount()
    })

    describe('when on main offline form screen', () => {
      beforeAll(() => {
        mockOfflineMessage = {
          screen: mainScreen
        }
      })

      it('calls validate', () => {
        expect(component.validate).toHaveBeenCalled()
      })
    })

    describe('when not on main offline form screen', () => {
      beforeAll(() => {
        mockOfflineMessage = {
          screen: 'someNonMainScreen'
        }
      })

      it('does not call validate', () => {
        expect(component.validate).not.toHaveBeenCalled()
      })
    })
  })

  describe('componentDidUpdate', () => {
    let component, mockWidgetShown, mockPrevProps

    beforeEach(() => {
      component = instanceRender(<ChatOfflineForm widgetShown={mockWidgetShown} />)

      spyOn(component, 'validate')

      component.componentDidUpdate(mockPrevProps)
    })

    describe('when the widget is previously shown', () => {
      beforeAll(() => {
        mockPrevProps = { widgetShown: true }
      })

      it('does not call validate', () => {
        expect(component.validate).not.toHaveBeenCalled()
      })
    })

    describe('when the widget is previously hidden', () => {
      beforeAll(() => {
        mockPrevProps = { widgetShown: false }
      })

      describe('when the widget is currently shown', () => {
        beforeAll(() => {
          mockWidgetShown = true
        })

        it('calls validate', () => {
          expect(component.validate).toHaveBeenCalled()
        })
      })

      describe('when the widget is currently hidden', () => {
        beforeAll(() => {
          mockWidgetShown = false
        })

        it('does not call validate', () => {
          expect(component.validate).not.toHaveBeenCalled()
        })
      })
    })
  })

  describe('renderErrorMessage', () => {
    let result, mockErrorString

    beforeEach(() => {
      let component = instanceRender(<ChatOfflineForm />)

      result = component.renderErrorMessage('val', true, mockErrorString, 'aaa')
    })

    describe('when we should render error message', () => {
      beforeAll(() => {
        mockErrorString = 'yolo'
        mockShouldRenderErrorMessage = true
      })

      it('returns a Message component', () => {
        expect(TestUtils.isElementOfType(result, Message)).toEqual(true)
      })

      it('renders error string', () => {
        expect(result.props.children).toEqual('yolo')
      })
    })

    describe('when we should not render error message', () => {
      beforeAll(() => {
        mockShouldRenderErrorMessage = false
      })

      it('returns no Message component', () => {
        expect(result).toBeFalsy()
      })
    })
  })

  describe('validate', () => {
    let component, mockCheckValidity, mockFormState

    beforeEach(() => {
      component = instanceRender(<ChatOfflineForm formState={mockFormState} />)
      component.offlineForm = {
        checkValidity: () => mockCheckValidity
      }

      spyOn(component, 'setState')

      component.validate()
    })

    describe('when form is valid', () => {
      beforeAll(() => {
        mockCheckValidity = true
      })

      describe('when formState is empty', () => {
        beforeAll(() => {
          mockFormState = {}
        })

        it('calls setState with an object containing "valid: false"', () => {
          const expected = { valid: false }

          expect(component.setState).toHaveBeenCalledWith(expected)
        })
      })

      describe('when formState is not empty', () => {
        beforeAll(() => {
          mockFormState = { name: 'terence' }
        })

        it('calls setState with true', () => {
          const expected = { valid: true }

          expect(component.setState).toHaveBeenCalledWith(expected)
        })
      })
    })

    describe('when form is not valid', () => {
      beforeAll(() => {
        mockCheckValidity = false
      })

      it('calls setState with an object containing "valid: false"', () => {
        const expected = { valid: false }

        expect(component.setState).toHaveBeenCalledWith(expected)
      })
    })
  })

  describe('handleFormChanged', () => {
    let component, mockEvent, mockOfflineForm, chatOfflineFormChangedSpy

    beforeEach(() => {
      chatOfflineFormChangedSpy = jasmine.createSpy('chatOfflineFormChanged')

      component = instanceRender(
        <ChatOfflineForm chatOfflineFormChanged={chatOfflineFormChangedSpy} />
      )

      spyOn(component, 'validate')

      component.offlineForm = mockOfflineForm
      mockEvent = { target: { name: 'email', value: 'bobba@bob.com' } }

      component.handleFormChanged(mockEvent)
    })

    describe('when offlineForm is exists', () => {
      beforeAll(() => {
        mockOfflineForm = { foo: 'bar' }
      })

      it('calls validate', () => {
        expect(component.validate).toHaveBeenCalled()
      })

      it('calls chatOfflineFormChanged with expected args', () => {
        const expected = { email: 'bobba@bob.com' }

        expect(chatOfflineFormChangedSpy).toHaveBeenCalledWith(expected)
      })
    })

    describe('when offlineForm does not exist', () => {
      beforeAll(() => {
        mockOfflineForm = undefined
      })

      it('does not call validate', () => {
        expect(component.validate).not.toHaveBeenCalled()
      })

      it('does not call chatOfflineFormChanged', () => {
        expect(chatOfflineFormChangedSpy).not.toHaveBeenCalled()
      })
    })
  })

  describe('handleFormSubmit', () => {
    let mockVisitor,
      mockSocialLogin,
      mockFormState,
      mockIsAuthenticated,
      sendOfflineMessageSpy,
      component,
      mockState = { valid: true }

    beforeEach(() => {
      mockFormState = { phone: '04028889342', message: 'halp!' }
      mockVisitor = { display_name: 'T-bone steak', email: 'dog@gone.com' }
      sendOfflineMessageSpy = jasmine.createSpy('sendOfflineMessage')

      component = instanceRender(
        <ChatOfflineForm
          formState={mockFormState}
          visitor={mockVisitor}
          socialLogin={mockSocialLogin}
          isAuthenticated={mockIsAuthenticated}
          sendOfflineMessage={sendOfflineMessageSpy}
        />
      )
      spyOn(component, 'setState')

      component.state = mockState
      component.handleFormSubmit({ preventDefault: () => {} })
    })

    afterEach(() => {
      sendOfflineMessageSpy.calls.reset()
    })

    describe('when form is invalid', () => {
      beforeAll(() => {
        mockState = {
          valid: false
        }
      })

      it('shows error', () => {
        expect(component.setState).toHaveBeenCalledWith({ showErrors: true })
      })
    })

    describe('when form is valid', () => {
      beforeAll(() => {
        mockState = {
          valid: true
        }
      })

      it('does not show error', () => {
        expect(component.setState).toHaveBeenCalledWith({ showErrors: false })
      })
    })

    describe('when socially authenticated', () => {
      beforeAll(() => {
        mockSocialLogin = { authenticated: true }
        mockState = { valid: true }
      })

      it('calls sendOfflineMessage with the expected args', () => {
        const expected = {
          ...mockFormState,
          name: 'T-bone steak',
          email: 'dog@gone.com'
        }

        expect(sendOfflineMessageSpy).toHaveBeenCalledWith(expected)
      })
    })

    describe('when authenticated', () => {
      beforeAll(() => {
        mockIsAuthenticated = true
        mockState = { valid: true }
      })

      it('calls sendOfflineMessage with the expected args', () => {
        const expected = {
          ...mockFormState,
          name: 'T-bone steak',
          email: 'dog@gone.com'
        }

        expect(sendOfflineMessageSpy).toHaveBeenCalledWith(expected)
      })
    })

    describe('when it is not authenticated', () => {
      beforeAll(() => {
        mockSocialLogin = { authenticated: false }
        mockIsAuthenticated = false
        mockState = { valid: true }
      })

      it('calls sendOfflineMessage with the expected args', () => {
        expect(sendOfflineMessageSpy).toHaveBeenCalledWith(mockFormState)
      })
    })
  })

  describe('renderForm', () => {
    let component, result, titleProp, mockOfflineMessage

    beforeEach(() => {
      component = instanceRender(
        <ChatOfflineForm
          title={titleProp}
          formState={initialFormState}
          offlineMessage={mockOfflineMessage}
          isMobile={true}
          fullscreen={true}
        />
      )

      spyOn(component, 'renderOfflineGreeting')
      spyOn(component, 'renderOperatingHoursLink')
      spyOn(component, 'renderMessagingChannels')
      spyOn(component, 'renderPhoneNumberField')
      spyOn(component, 'renderMessageField')
      spyOn(component, 'renderUserProfile')
      spyOn(component, 'getScrollContainerClasses')

      result = component.renderForm()
    })

    describe("when offlineMessage's screen is in the main state", () => {
      beforeAll(() => {
        titleProp = mockTitle
        mockOfflineMessage = { screen: mainScreen }
      })
    })

    describe("when offlineMessage's screen is not in the main state", () => {
      beforeAll(() => {
        mockOfflineMessage = { screen: operatingHoursScreen }
      })

      it('returns null', () => {
        expect(result).toBeNull()
      })
    })
  })

  describe('renderOperatingHoursLink', () => {
    let result, link, mockOperatingHours, handleOperatingHoursClickFn

    beforeEach(() => {
      handleOperatingHoursClickFn = () => {}

      const component = instanceRender(
        <ChatOfflineForm
          formState={initialFormState}
          operatingHours={mockOperatingHours}
          handleOperatingHoursClick={handleOperatingHoursClickFn}
          offlineMessage={{ screen: 'main' }}
        />
      )

      result = component.renderOperatingHoursLink()
      link = _.get(result, 'props.children')
    })

    describe('when operating hours are active', () => {
      beforeAll(() => {
        mockOperatingHours = {
          account_schedule: [[456]],
          enabled: true
        }
      })

      it('returns a <p> element at the top', () => {
        expect(TestUtils.isElementOfType(result, 'p')).toEqual(true)
      })

      it('returns the right classes for the <p> element', () => {
        expect(result.props.className).toEqual('operatingHoursContainerClass')
      })

      it('returns a link (<button> element) inside the <p>', () => {
        expect(TestUtils.isElementOfType(link, 'button')).toEqual(true)
      })

      it('returns the right classes for the <button> element', () => {
        expect(link.props.className).toEqual('operatingHoursLinkClass')
      })

      it('returns a prop for onClick for the <button> element', () => {
        expect(link.props.onClick).toEqual(handleOperatingHoursClickFn)
      })

      it('returns a the right label for the link', () => {
        expect(link.props.children).toEqual('embeddable_framework.chat.operatingHours.label.anchor')
      })
    })

    describe('when operating hours are not active', () => {
      beforeAll(() => {
        mockOperatingHours = { enabled: false }
      })

      it('returns nothing', () => {
        expect(result).toBeUndefined()
      })
    })
  })

  describe('renderOfflineGreeting', () => {
    let result,
      greeting = ''

    beforeEach(() => {
      const component = instanceRender(
        <ChatOfflineForm
          formState={initialFormState}
          greeting={greeting}
          offlineMessage={{ screen: 'main' }}
        />
      )

      result = component.renderOfflineGreeting()
    })

    it('renders a type of <Linkify>', () => {
      expect(TestUtils.isElementOfType(result, Linkify)).toEqual(true)
    })

    it('has the right className', () => {
      expect(result.props.className).toEqual('offlineGreetingClass')
    })

    describe('when a greeting is passed in', () => {
      beforeAll(() => {
        greeting = 'Show me what you got!'
      })

      it('uses the greeting passed in', () => {
        expect(result.props.children.props.children).toEqual('Show me what you got!')
      })
    })
  })

  describe('renderMessagingChannels', () => {
    let result,
      channels = {}

    beforeEach(() => {
      const component = instanceRender(
        <ChatOfflineForm
          formState={initialFormState}
          channels={channels}
          offlineMessage={{ screen: 'main' }}
        />
      )

      result = component.renderMessagingChannels()
    })

    describe('when channels are passed in', () => {
      beforeAll(() => {
        channels = {
          facebook: { allowed: true, page_id: '123' },
          twitter: { allowed: false, page_id: '456' }
        }
      })

      it('uses the channels passed in', () => {
        expect(result.props.channels).toEqual(channels)
      })
    })
  })

  describe('renderUserProfile', () => {
    let component

    beforeEach(() => {
      component = instanceRender(<ChatOfflineForm />)

      spyOn(component, 'renderNameField')
      spyOn(component, 'renderEmailField')

      component.renderUserProfile()
    })

    it('calls renderNameField', () => {
      expect(component.renderNameField).toHaveBeenCalled()
    })

    it('calls renderEmailField', () => {
      expect(component.renderEmailField).toHaveBeenCalled()
    })
  })

  describe('renderNameField', () => {
    let result, componentArgs, mockRenderErrorMessage

    beforeEach(() => {
      const component = instanceRender(
        <ChatOfflineForm formState={initialFormState} {...componentArgs} />
      )

      spyOn(component, 'renderErrorMessage').and.callFake(() => mockRenderErrorMessage)
      result = component.renderNameField()
    })

    describe('when called', () => {
      beforeAll(() => {
        componentArgs = {
          formFields: {
            name: { required: true }
          }
        }
      })

      it('renders a type of TextField', () => {
        expect(TestUtils.isElementOfType(result, GardenField)).toEqual(true)
      })

      it('has props.name of name', () => {
        expect(result.props.children[1].props.name).toEqual('name')
      })

      it('has props.required of true', () => {
        expect(result.props.children[1].props.required).toEqual(true)
      })
    })

    describe('when there is at least one social login available', () => {
      beforeAll(() => {
        componentArgs = {
          authUrls: [
            {
              Goggle:
                'https://www.zopim.com/auth/goggle/3DsjCpVY6RGFpfrfQk88xJ6DqnM82JMJ-mJhKBcIWnWUWJY'
            }
          ]
        }
      })

      it('renders with expected style', () => {
        expect(result.props.children[1].props.className).toContain('nameFieldWithSocialLoginClass')
      })
    })

    describe('when there are no social logins available', () => {
      beforeAll(() => {
        componentArgs = {
          authUrls: []
        }
      })

      it('renders with expected style', () => {
        expect(result.props.fieldContainerClasses).not.toContain('nameFieldWithSocialLoginClass')
      })
    })

    describe('when invalid', () => {
      beforeAll(() => {
        mockRenderErrorMessage = Message
      })

      it('renders field in an error state', () => {
        expect(result.props.children[1].props.validation).toEqual('error')
      })
    })

    describe('when valid', () => {
      beforeAll(() => {
        mockRenderErrorMessage = null
      })

      it('renders field not in an error state', () => {
        expect(result.props.children[1].props.validation).toEqual(undefined)
      })
    })
  })

  describe('renderEmailField', () => {
    let result, mockRenderErrorMessage

    beforeEach(() => {
      const mockFormFields = { email: { required: true } }
      const component = instanceRender(
        <ChatOfflineForm formState={initialFormState} formFields={mockFormFields} />
      )

      spyOn(component, 'renderErrorMessage').and.callFake(() => mockRenderErrorMessage)
      result = component.renderEmailField()
    })

    it('renders a type of TextField', () => {
      expect(TestUtils.isElementOfType(result, GardenField)).toEqual(true)
    })

    it('has props.required of true', () => {
      expect(result.props.children[1].props.required).toEqual(true)
    })

    describe('when invalid', () => {
      beforeAll(() => {
        mockRenderErrorMessage = Message
      })

      it('renders field in an error state', () => {
        expect(result.props.children[1].props.validation).toEqual('error')
      })
    })

    describe('when valid', () => {
      beforeAll(() => {
        mockRenderErrorMessage = null
      })

      it('renders field not in an error state', () => {
        expect(result.props.children[1].props.validation).toEqual(undefined)
      })
    })
  })

  describe('renderPhoneNumberField', () => {
    let result,
      mockRenderErrorMessage,
      mockPhoneEnabled = true

    beforeEach(() => {
      const mockFormFields = { phone: { required: true } }
      const component = instanceRender(
        <ChatOfflineForm
          phoneEnabled={mockPhoneEnabled}
          formState={initialFormState}
          formFields={mockFormFields}
        />
      )

      spyOn(component, 'renderErrorMessage').and.callFake(() => mockRenderErrorMessage)
      result = component.renderPhoneNumberField()
    })

    it('renders a type of TextField', () => {
      expect(TestUtils.isElementOfType(result, GardenField)).toEqual(true)
    })

    it('has props.name of phone', () => {
      expect(result.props.children[1].props.name).toEqual('phone')
    })

    it('has props.required of true', () => {
      expect(result.props.children[1].props.required).toEqual(true)
    })

    describe('when invalid', () => {
      beforeAll(() => {
        mockRenderErrorMessage = Message
      })

      it('renders field in an error state', () => {
        expect(result.props.children[1].props.validation).toEqual('error')
      })
    })

    describe('when valid', () => {
      beforeAll(() => {
        mockRenderErrorMessage = null
      })

      it('renders field not in an error state', () => {
        expect(result.props.children[1].props.validation).toEqual(undefined)
      })
    })

    describe('when phone is not enabled', () => {
      beforeAll(() => {
        mockPhoneEnabled = false
      })

      it('returns null', () => {
        expect(result).toBeNull()
      })
    })
  })

  describe('renderMessageField', () => {
    let result, mockRenderErrorMessage

    beforeEach(() => {
      const mockFormFields = { message: { required: true } }
      const component = instanceRender(
        <ChatOfflineForm formState={initialFormState} formFields={mockFormFields} />
      )

      spyOn(component, 'renderErrorMessage').and.callFake(() => mockRenderErrorMessage)
      result = component.renderMessageField()
    })

    it('renders a type of TextField', () => {
      expect(TestUtils.isElementOfType(result, GardenField)).toEqual(true)
    })

    it('has props.name of message', () => {
      expect(result.props.children[1].props.name).toEqual('message')
    })

    it('has props.required of true', () => {
      expect(result.props.children[1].props.required).toEqual(true)
    })

    describe('when invalid', () => {
      beforeAll(() => {
        mockRenderErrorMessage = Message
      })

      it('renders field in an error state', () => {
        expect(result.props.children[1].props.validation).toEqual('error')
      })
    })

    describe('when valid', () => {
      beforeAll(() => {
        mockRenderErrorMessage = null
      })

      it('renders field not in an error state', () => {
        expect(result.props.children[1].props.validation).toEqual(undefined)
      })
    })
  })
})
