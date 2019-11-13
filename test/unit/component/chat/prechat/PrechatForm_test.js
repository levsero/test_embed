describe('PrechatForm component', () => {
  let PrechatForm,
    mockShouldRenderErrorMessage,
    mockFormValidity,
    renderLabelSpy = jasmine.createSpy('renderLabel').and.callFake(_.identity),
    TEST_IDS
  const PrechatFormPath = buildSrcPath('component/chat/prechat/PrechatForm')
  const UserProfile = noopReactComponent()
  const Field = noopReactComponent()
  const Input = noopReactComponent()
  const Item = noopReactComponent()
  const Message = noopReactComponent()
  const Label = noopReactComponent()
  const Linkify = noopReactComponent('Linkify')
  const Dropdown = noopReactComponent()
  const sharedConstantsPath = basePath('src/constants/shared')

  const mockFormProp = {
    name: { name: 'name', required: true },
    email: { name: 'email', required: true },
    phone: { name: 'phone', label: 'Phone Number', required: false },
    message: { name: 'message', label: 'Message', required: false }
  }
  const mockForm = {
    checkValidity: () => mockFormValidity,
    elements: [
      {
        name: 'display_name',
        value: 'John Snow'
      },
      {
        name: 'email',
        value: 'j@l.r'
      },
      {
        name: 'button',
        type: 'submit'
      }
    ]
  }

  beforeEach(() => {
    mockery.enable()

    TEST_IDS = requireUncached(sharedConstantsPath).TEST_IDS
    mockFormValidity = false

    initMockRegistry({
      './PrechatForm.scss': {
        locals: {
          nameFieldWithSocialLogin: 'nameFieldWithSocialLoginClass'
        }
      },
      'src/constants/shared': {
        NAME_PATTERN: /.+/,
        EMAIL_PATTERN: /.+/,
        PHONE_PATTERN: /.+/,
        FONT_SIZE: 14,
        TEST_IDS
      },
      '@zendeskgarden/react-buttons': {
        Button: noopReactComponent()
      },
      'component/chat/UserProfile': { UserProfile },
      'service/i18n': {
        i18n: {
          t: noop,
          isRTL: () => {}
        }
      },
      '@zendeskgarden/react-forms': {
        Field,
        Label,
        Input,
        Textarea: noopReactComponent(),
        Message
      },
      'react-linkify': Linkify,
      '@zendeskgarden/react-dropdowns': {
        Dropdown,
        Label: noopReactComponent(),
        Menu: noopReactComponent(),
        Field: noopReactComponent(),
        Message: noopReactComponent(),
        Item,
        Select: noopReactComponent()
      },
      'src/util/fields': {
        shouldRenderErrorMessage: () => mockShouldRenderErrorMessage,
        renderLabel: renderLabelSpy
      },
      './ChatHistoryLink.scss': {
        locals: {}
      },
      'component/Icon': {
        Icon: noop
      },
      'src/util/utils': {
        onNextTick: cb => setTimeout(cb, 0)
      },
      'src/components/Widget': {
        Widget: noopReactComponent(),
        Header: noopReactComponent(),
        Main: noopReactComponent(),
        Footer: noopReactComponent()
      },
      'src/embeds/chat/components/Footer': {},
      'components/Frame': {}
    })

    mockery.registerAllowable(PrechatFormPath)
    PrechatForm = requireUncached(PrechatFormPath).PrechatForm
  })

  afterEach(() => {
    mockery.deregisterAll()
    mockery.disable()
    renderLabelSpy.calls.reset()
  })

  describe('renderGreetingMessage', () => {
    let result, greetingMessage

    beforeEach(() => {
      const component = instanceRender(
        <PrechatForm form={mockFormProp} greetingMessage={greetingMessage} />
      )

      result = component.renderGreetingMessage()
    })

    describe('when props.greetingMessage is empty', () => {
      beforeAll(() => {
        greetingMessage = ''
      })

      it('does not render a greeting message', () => {
        expect(result).toEqual(null)
      })
    })

    describe('when props.greetingMessage is not empty', () => {
      beforeAll(() => {
        greetingMessage = 'Hello how can we help you today?'
      })

      it('render a div with the greeting message', () => {
        expect(TestUtils.isElementOfType(result, Linkify)).toEqual(true)

        expect(result.props.children.props.children).toEqual(greetingMessage)
      })
    })
  })

  describe('renderPhoneField', () => {
    let result, mockRenderErrorMessage, mockPhoneEnabled

    beforeEach(() => {
      const component = instanceRender(
        <PrechatForm form={mockFormProp} phoneEnabled={mockPhoneEnabled} />
      )

      spyOn(component, 'renderErrorMessage').and.callFake(() => mockRenderErrorMessage)
      result = component.renderPhoneField()

      if (result) {
        result = result.props.children
      }
    })

    describe('when phone enabled attribute is false', () => {
      beforeAll(() => {
        mockPhoneEnabled = false
      })

      it('does not render the phone field', () => {
        expect(result).toEqual(null)
      })
    })

    describe('when phone enabled attribute is true', () => {
      beforeAll(() => {
        mockPhoneEnabled = true
      })

      it('renders the phone field', () => {
        expect(TestUtils.isElementOfType(result, Field)).toEqual(true)
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

  describe('renderUserProfile', () => {
    let component

    beforeEach(() => {
      component = instanceRender(<PrechatForm form={mockFormProp} />)

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

  describe('renderEmailField', () => {
    let result, mockRenderErrorMessage, component

    beforeEach(() => {
      const mockForm = {
        ...mockFormProp,
        email: { required: true }
      }

      component = instanceRender(<PrechatForm form={mockForm} />)

      spyOn(component, 'isFieldRequired')
      spyOn(component, 'renderErrorMessage').and.callFake(() => mockRenderErrorMessage)

      result = component.renderEmailField()
    })

    it('renders a TextField component', () => {
      expect(TestUtils.isElementOfType(result, Field)).toEqual(true)
    })

    it('calls isFieldRequired with expected arguments', () => {
      expect(component.isFieldRequired).toHaveBeenCalledWith(true)
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

  describe('renderMessageField', () => {
    let container, result, mockRenderErrorMessage, component

    beforeEach(() => {
      const mockForm = {
        ...mockFormProp,
        message: { required: true }
      }

      component = instanceRender(<PrechatForm form={mockForm} />)

      spyOn(component, 'isFieldRequired')
      spyOn(component, 'renderErrorMessage').and.callFake(() => mockRenderErrorMessage)

      container = component.renderMessageField()
      if (container) {
        result = container.props.children
      }
    })

    it('renders a TextField component', () => {
      expect(TestUtils.isElementOfType(result, Field)).toEqual(true)
    })

    it('calls isFieldRequired with expected arguments', () => {
      expect(component.isFieldRequired).toHaveBeenCalledWith(true)
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

  describe('handleFormChange', () => {
    let component, onPrechatFormChangeSpy

    beforeEach(() => {
      onPrechatFormChangeSpy = jasmine.createSpy('onPrechatFormChange')
      component = instanceRender(
        <PrechatForm form={mockFormProp} onPrechatFormChange={onPrechatFormChangeSpy} />
      )
      mockFormValidity = true
      component.form = mockForm

      component.handleFormChange()
    })

    it('calls onPrechatFormChange', () => {
      expect(onPrechatFormChangeSpy).toHaveBeenCalled()
    })

    it('calls onPrechatFormChange with the form element names mapped to their values', () => {
      expect(onPrechatFormChangeSpy).toHaveBeenCalledWith(
        jasmine.objectContaining({
          display_name: 'John Snow',
          email: 'j@l.r'
        })
      )
    })

    it('calls onPrechatFormChange without the values from elements with type submit', () => {
      expect(onPrechatFormChangeSpy.calls.count()).toEqual(1)

      const formArgument = onPrechatFormChangeSpy.calls.first().args[0]

      expect(Object.keys(formArgument)).not.toContain('button')
    })
  })

  describe('handleFormSubmit', () => {
    let component,
      onFormCompletedSpy,
      mockSocialLogin,
      mockIsAuthenticated,
      mockState = { valid: true },
      mockVisitor
    const formState = {
      name: 'someName',
      email: 'someEmail@someEmail.com',
      message: 'someMessage'
    }

    beforeEach(() => {
      onFormCompletedSpy = jasmine.createSpy('onFormCompleted')
      component = instanceRender(
        <PrechatForm
          form={mockFormProp}
          onFormCompleted={onFormCompletedSpy}
          formState={formState}
          visitor={mockVisitor}
          isAuthenticated={mockIsAuthenticated}
          socialLogin={mockSocialLogin}
        />
      )
      spyOn(component, 'setState')
      component.state = mockState
      component.handleFormSubmit({ preventDefault: noop })
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

    describe('when not socially logged in', () => {
      beforeAll(() => {
        mockSocialLogin = {
          authenticated: false
        }
      })

      it('calls onFormCompleted spy with the formState prop', () => {
        expect(onFormCompletedSpy).toHaveBeenCalledWith(formState)
      })
    })

    describe('when socially logged in', () => {
      beforeAll(() => {
        mockSocialLogin = {
          authenticated: true
        }
        mockVisitor = {
          display_name: 'yolo',
          email: 'email@email.com'
        }
      })

      it('calls onFormCompleted spy with formState prop where name and email are from social details', () => {
        expect(onFormCompletedSpy).toHaveBeenCalledWith({
          ...formState,
          name: 'yolo',
          email: 'email@email.com'
        })
      })
    })

    describe('when authenticated', () => {
      beforeAll(() => {
        mockIsAuthenticated = true
        mockVisitor = {
          display_name: 'yolo',
          email: 'email@email.com'
        }
      })

      it('calls onFormCompleted spy with formState prop where name and email are from social details', () => {
        expect(onFormCompletedSpy).toHaveBeenCalledWith({
          ...formState,
          name: 'yolo',
          email: 'email@email.com'
        })
      })
    })
  })

  describe('when the component is mounted', () => {
    let component

    beforeEach(() => {
      component = instanceRender(<PrechatForm form={mockFormProp} />)
      spyOn(component, 'handleFormChange')
      component.componentDidMount()
    })

    it('calls handleFormChange', () => {
      expect(component.handleFormChange).toHaveBeenCalled()
    })
  })

  describe('isDepartmentFieldValid', () => {
    let component, mockForm, mockFormState

    beforeEach(() => {
      component = instanceRender(<PrechatForm formState={mockFormState} form={mockForm} />)
    })

    describe('form prop has no departments', () => {
      beforeAll(() => {
        mockForm = mockFormProp
      })

      it('returns true', () => {
        expect(component.isDepartmentFieldValid()).toEqual(true)
      })
    })

    describe('department is required', () => {
      describe('there are no departments', () => {
        beforeAll(() => {
          mockForm = {
            ...mockFormProp,
            department: { required: true },
            departments: []
          }
        })

        it('returns true', () => {
          expect(component.isDepartmentFieldValid()).toEqual(true)
        })
      })

      describe('there are departments', () => {
        beforeAll(() => {
          mockForm = {
            ...mockFormProp,
            department: { required: true },
            departments: ['here']
          }
        })

        describe('there is no value for departments in form state', () => {
          it('returns falsy value', () => {
            expect(component.isDepartmentFieldValid()).toBeFalsy()
          })
        })

        describe('there is a value for departments in form state', () => {
          beforeAll(() => {
            mockFormState = {
              department: 'here'
            }
          })

          it('returns truthy', () => {
            expect(component.isDepartmentFieldValid()).toBeTruthy()
          })
        })
      })
    })
  })

  describe('isDepartmentOffline', () => {
    let mockDepartments, mockDepartmentId, result

    beforeEach(() => {
      const component = instanceRender(<PrechatForm form={mockFormProp} />)

      result = component.isDepartmentOffline(mockDepartments, mockDepartmentId)
    })

    describe('when no matching department was found', () => {
      beforeAll(() => {
        mockDepartments = [{ id: '123', status: 'online' }, { id: '420', status: 'offline' }]
        mockDepartmentId = 'blah123'
      })

      it('returns false', () => {
        expect(result).toEqual(false)
      })
    })

    describe('when the matching departments status is offline', () => {
      beforeAll(() => {
        mockDepartments = [{ id: '4566', status: 'online' }, { id: '1111', status: 'offline' }]
        mockDepartmentId = '1111'
      })

      it('returns true', () => {
        expect(result).toEqual(true)
      })
    })

    describe('when the matching departments status is online', () => {
      beforeAll(() => {
        mockDepartments = [{ id: '234', status: 'online' }, { id: '77890', status: 'offline' }]
        mockDepartmentId = '234'
      })

      it('returns false', () => {
        expect(result).toEqual(false)
      })
    })
  })

  describe('isFieldRequired', () => {
    let mockRequired, mockDepartment, mockDepartments, component, result

    beforeEach(() => {
      const form = {
        ...mockFormProp,
        departments: mockDepartments,
        department: { label: '' }
      }
      const formState = {
        ...mockForm,
        department: mockDepartment
      }

      component = instanceRender(<PrechatForm form={form} formState={formState} />)

      result = component.isFieldRequired(mockRequired)
    })

    describe('when a department value exists', () => {
      beforeAll(() => {
        mockRequired = false
        mockDepartments = [{ id: 1, status: 'online' }, { id: 2, status: 'offline' }]
      })

      describe('when department is online', () => {
        beforeAll(() => {
          mockDepartment = '1'
        })

        it('returns the required value', () => {
          expect(result).toEqual(mockRequired)
        })
      })

      describe('when department is offline', () => {
        beforeAll(() => {
          mockDepartment = '2'
        })

        it('returns true', () => {
          expect(result).toEqual(true)
        })
      })
    })

    describe('when a department value is an empty string', () => {
      beforeAll(() => {
        mockRequired = true
        mockDepartment = ''
        mockDepartments = [{ id: 123 }, { id: 420 }]
      })

      it('returns the required value of true', () => {
        expect(result).toEqual(mockRequired)
      })
    })
  })
})
