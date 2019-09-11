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
  const ZendeskLogo = noopReactComponent()
  const ScrollContainer = noopReactComponent()
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
      'component/chat/ChatOperatingHours': {
        ChatOperatingHours
      },
      'component/chat/ChatOfflineMessageForm': {
        ChatOfflineMessageForm
      },
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
      'component/ZendeskLogo': { ZendeskLogo },
      'component/container/ScrollContainer': { ScrollContainer },
      'src/util/fields': {
        shouldRenderErrorMessage: () => mockShouldRenderErrorMessage,
        renderLabel: () => 'someLabel'
      },
      './ChatHistoryLink.scss': {
        locals: {}
      },
      'component/Icon': {
        Icon: noop
      }
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

  describe('renderZendeskLogo', () => {
    let result, mockHideZendeskLogo

    beforeEach(() => {
      const component = instanceRender(<ChatOfflineForm hideZendeskLogo={mockHideZendeskLogo} />)

      result = component.renderZendeskLogo()
    })

    describe('when hideZendeskLogo is true', () => {
      beforeAll(() => {
        mockHideZendeskLogo = true
      })

      it('returns null', () => {
        expect(result).toBeNull()
      })
    })

    describe('when hideZendeskLogo is false', () => {
      beforeAll(() => {
        mockHideZendeskLogo = false
      })

      it('renders the zendesk logo', () => {
        expect(TestUtils.isElementOfType(result, ZendeskLogo)).toEqual(true)
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

      spyOn(component, 'renderSubmitButton')
      spyOn(component, 'renderOfflineGreeting')
      spyOn(component, 'renderOperatingHoursLink')
      spyOn(component, 'renderMessagingChannels')
      spyOn(component, 'renderPhoneNumberField')
      spyOn(component, 'renderMessageField')
      spyOn(component, 'renderZendeskLogo')
      spyOn(component, 'renderUserProfile')
      spyOn(component, 'getScrollContainerClasses')

      result = component.renderForm()
    })

    describe("when offlineMessage's screen is in the main state", () => {
      beforeAll(() => {
        titleProp = mockTitle
        mockOfflineMessage = { screen: mainScreen }
      })

      it('returns a form', () => {
        expect(result.type).toEqual('form')
      })

      it('calls renderSubmitButton', () => {
        expect(component.renderSubmitButton).toHaveBeenCalled()
      })

      it('calls renderOfflineGreeting', () => {
        expect(component.renderOfflineGreeting).toHaveBeenCalled()
      })

      it('calls renderOperatingHoursLink', () => {
        expect(component.renderOperatingHoursLink).toHaveBeenCalled()
      })

      it('calls renderMessagingChannels', () => {
        expect(component.renderMessagingChannels).toHaveBeenCalled()
      })

      it('calls renderPhoneNumberField', () => {
        expect(component.renderPhoneNumberField).toHaveBeenCalled()
      })

      it('calls renderMessageField', () => {
        expect(component.renderMessageField).toHaveBeenCalled()
      })

      it('calls renderZendeskLogo', () => {
        expect(component.renderZendeskLogo).toHaveBeenCalled()
      })

      it('calls renderUserProfile', () => {
        expect(component.renderUserProfile).toHaveBeenCalled()
      })

      it('calls getScrollContainerClasses', () => {
        expect(component.getScrollContainerClasses).toHaveBeenCalled()
      })

      it('renders with the correct title', () => {
        const targetElem = result.props.children

        expect(targetElem.props.title).toEqual(mockTitle)
      })

      it('renders with the correct fullscreen value', () => {
        const targetElem = result.props.children

        expect(targetElem.props.fullscreen).toEqual(true)
      })

      it('renders with the correct isMobile value', () => {
        const targetElem = result.props.children

        expect(targetElem.props.isMobile).toEqual(true)
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

  describe('renderLoading', () => {
    let result

    describe('when the screen is the loading screen', () => {
      beforeEach(() => {
        const component = instanceRender(
          <ChatOfflineForm
            title={mockTitle}
            formState={initialFormState}
            offlineMessage={{ screen: 'loading' }}
            isMobile={true}
            fullscreen={true}
          />
        )

        result = component.renderLoading()
      })

      it('renders a type of LoadingSpinner', () => {
        const wrapperElem = result.props.children
        const targetElem = wrapperElem.props.children

        expect(TestUtils.isElementOfType(targetElem, LoadingSpinner)).toEqual(true)
      })

      it('renders with the correct title', () => {
        expect(result.props.title).toEqual(mockTitle)
      })

      it('renders with the correct fullscreen value', () => {
        expect(result.props.fullscreen).toEqual(true)
      })

      it('renders with the correct isMobile value', () => {
        expect(result.props.isMobile).toEqual(true)
      })
    })

    describe('when the screen is not the loading screen', () => {
      beforeEach(() => {
        const component = instanceRender(
          <ChatOfflineForm formState={initialFormState} offlineMessage={{ screen: 'main' }} />
        )

        result = component.renderLoading()
      })

      it('renders nothing', () => {
        expect(result).toBeUndefined()
      })
    })
  })

  describe('renderSuccess', () => {
    let result, offlineMessageProp, onFormBackSpy

    const mockFormValues = {
      name: 'Boromir',
      email: 'boromir@gondor.nw',
      phone: '12345678',
      message: 'One does not simply walk into Mordor'
    }

    describe('when the screen is the success screen', () => {
      beforeEach(() => {
        offlineMessageProp = { screen: 'success', details: mockFormValues }
        onFormBackSpy = jasmine.createSpy('onFormBack')

        const component = instanceRender(
          <ChatOfflineForm
            title={mockTitle}
            formState={initialFormState}
            offlineMessage={offlineMessageProp}
            handleOfflineFormBack={onFormBackSpy}
            isMobile={true}
            fullscreen={true}
          />
        )

        result = component.renderSuccess()
      })

      it('does not render ChatOfflineMessageForm', () => {
        expect(TestUtils.isElementOfType(result.props.children, ChatOfflineMessageForm)).toEqual(
          false
        )
      })

      it('renders SuccessNotification', () => {
        expect(TestUtils.isElementOfType(result.props.children[0], SuccessNotification)).toEqual(
          true
        )
      })

      it('renders with the correct title', () => {
        expect(result.props.title).toEqual(mockTitle)
      })
      it('renders with the correct fullscreen value', () => {
        expect(result.props.fullscreen).toEqual(true)
      })

      it('renders with the correct isMobile value', () => {
        expect(result.props.isMobile).toEqual(true)
      })
    })

    describe('when the screen is not the success screen', () => {
      beforeEach(() => {
        const component = instanceRender(
          <ChatOfflineForm formState={initialFormState} offlineMessage={{ screen: 'main' }} />
        )

        result = component.renderSuccess()
      })

      it('renders nothing', () => {
        expect(result).toBeUndefined()
      })
    })
  })

  describe('renderOperatingHours', () => {
    let result

    describe('when the screen is not the operating hours screen', () => {
      beforeEach(() => {
        const component = instanceRender(
          <ChatOfflineForm formState={initialFormState} offlineMessage={{ screen: 'main' }} />
        )

        result = component.renderOperatingHours()
      })

      it('returns null', () => {
        expect(result).toBeNull()
      })
    })

    describe('when the screen is the operatingHours screen', () => {
      beforeEach(() => {
        const mockOperatingHours = {
          account_schedule: [[456]],
          enabled: true
        }

        const component = instanceRender(
          <ChatOfflineForm
            title={mockTitle}
            operatingHours={mockOperatingHours}
            offlineMessage={{ screen: 'operatingHours' }}
            isMobile={true}
            fullscreen={true}
          />
        )

        result = component.renderOperatingHours()
      })

      it('returns a <ChatOperatingHours> element', () => {
        const targetElem = result.props.children

        expect(TestUtils.isElementOfType(targetElem, ChatOperatingHours)).toEqual(true)
      })

      it('has a props.operatingHours value', () => {
        const targetElem = result.props.children
        const expected = {
          account_schedule: [[456]],
          enabled: true
        }

        expect(targetElem.props.operatingHours).toEqual(expected)
      })

      it('renders with the correct title', () => {
        expect(result.props.title).toEqual(mockTitle)
      })

      it('renders with the correct fullscreen value', () => {
        expect(result.props.fullscreen).toEqual(true)
      })

      it('renders with the correct isMobile value', () => {
        expect(result.props.isMobile).toEqual(true)
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
