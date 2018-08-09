describe('PrechatForm component', () => {
  let PrechatForm,
    mockShouldRenderErrorMessage,
    mockFormValidity;
  const PrechatFormPath = buildSrcPath('component/chat/prechat/PrechatForm');
  const UserProfile = noopReactComponent();
  const ScrollContainer = noopReactComponent();
  const ZendeskLogo = noopReactComponent();
  const TextField = noopReactComponent();
  const SelectField = noopReactComponent();
  const Item = noopReactComponent();
  const Message = noopReactComponent();

  const mockFormProp = {
    name: { name: 'name', required: true },
    email: { name: 'email', required: true },
    phone: { name: 'phone', label: 'Phone Number', required: false, hidden: false },
    message: { name: 'message', label: 'Message', required: false }
  };
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
  };

  beforeEach(() => {
    mockery.enable();

    mockFormValidity = false;

    initMockRegistry({
      './PrechatForm.scss': {
        locals: {
          nameFieldWithSocialLogin: 'nameFieldWithSocialLoginClass',
          mobileContainer: 'mobileContainerClass'
        }
      },
      'src/constants/shared': {
        EMAIL_PATTERN: /.+/,
        PHONE_PATTERN: /.+/,
        FONT_SIZE: 14
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
      '@zendeskgarden/react-textfields': {
        TextField,
        Label: noopReactComponent(),
        Input: noopReactComponent(),
        Textarea: noopReactComponent(),
        Message
      },
      '@zendeskgarden/react-select': {
        SelectField,
        Label: noopReactComponent(),
        Item,
        Select: noopReactComponent()
      },
      'component/container/ScrollContainer': { ScrollContainer },
      'component/ZendeskLogo': { ZendeskLogo },
      'src/util/fields': {
        shouldRenderErrorMessage: () => mockShouldRenderErrorMessage,
        renderLabelText: () => 'someLabel'
      }
    });

    mockery.registerAllowable(PrechatFormPath);
    PrechatForm = requireUncached(PrechatFormPath).PrechatForm;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('render', () => {
    let component,
      result,
      mockIsMobile;

    beforeEach(() => {
      component = instanceRender(<PrechatForm form={mockFormProp} isMobile={mockIsMobile} />);

      spyOn(component, 'renderGreetingMessage');
      spyOn(component, 'renderUserProfile');
      spyOn(component, 'renderDepartmentsField');
      spyOn(component, 'renderPhoneField');
      spyOn(component, 'renderMessageField');
      spyOn(component, 'renderZendeskLogo');
      spyOn(component, 'renderSubmitButton');

      result = component.render();
    });

    it('calls renderGreetingMessage', () => {
      expect(component.renderGreetingMessage)
        .toHaveBeenCalled();
    });

    it('calls renderUserProfile', () => {
      expect(component.renderUserProfile)
        .toHaveBeenCalled();
    });

    it('calls renderDepartmentsField', () => {
      expect(component.renderDepartmentsField)
        .toHaveBeenCalled();
    });

    it('calls renderPhoneField', () => {
      expect(component.renderPhoneField)
        .toHaveBeenCalled();
    });

    it('calls renderMessageField', () => {
      expect(component.renderMessageField)
        .toHaveBeenCalled();
    });

    it('calls renderZendeskLogo', () => {
      expect(component.renderZendeskLogo)
        .toHaveBeenCalled();
    });

    it('calls renderSubmitButton', () => {
      expect(component.renderSubmitButton)
        .toHaveBeenCalled();
    });

    it('returns a form component', () => {
      expect(result.type)
        .toEqual('form');
    });

    describe('scrollContainer.classes', () => {
      describe('when it is mobile mode', () => {
        beforeAll(() => {
          mockIsMobile = true;
        });

        it('contains mobile styles', () => {
          const targetElem = result.props.children;

          expect(targetElem.props.classes)
            .toContain('mobileContainerClass');
        });
      });

      describe('when it is desktop mode', () => {
        beforeAll(() => {
          mockIsMobile = false;
        });

        it('does not contain mobile styles', () => {
          const targetElem = result.props.children;

          expect(targetElem.props.classes)
            .not.toContain('mobileContainerClass');
        });
      });
    });
  });

  describe('renderZendeskLogo', () => {
    let result,
      mockHideZendeskLogo;

    beforeEach(() => {
      const component = instanceRender(<PrechatForm form={mockFormProp} hideZendeskLogo={mockHideZendeskLogo} />);

      result = component.renderZendeskLogo();
    });

    describe('when hideZendeskLogo is true', () => {
      beforeAll(() => {
        mockHideZendeskLogo = true;
      });

      it('returns null', () => {
        expect(result)
          .toBeNull();
      });
    });

    describe('when hideZendeskLogo is false', () => {
      beforeAll(() => {
        mockHideZendeskLogo = false;
      });

      it('renders the zendesk logo', () => {
        expect(TestUtils.isElementOfType(result, ZendeskLogo))
          .toEqual(true);
      });
    });
  });

  describe('renderGreetingMessage', () => {
    let result,
      greetingMessage;

    beforeEach(() => {
      const component = instanceRender(
        <PrechatForm form={mockFormProp} greetingMessage={greetingMessage} />
      );

      result = component.renderGreetingMessage();
    });

    describe('when props.greetingMessage is empty', () => {
      beforeAll(() => {
        greetingMessage = '';
      });

      it('does not render a greeting message', () => {
        expect(result)
          .toEqual(null);
      });
    });

    describe('when props.greetingMessage is not empty', () => {
      beforeAll(() => {
        greetingMessage = 'Hello how can we help you today?';
      });

      it('render a div with the greeting message', () => {
        expect(result.type)
          .toEqual('div');

        expect(result.props.children)
          .toEqual(greetingMessage);
      });
    });
  });

  describe('renderPhoneField', () => {
    let result,
      mockRenderErrorMessage,
      mockHidden;

    beforeEach(() => {
      const mockForm = {
        ...mockFormProp,
        phone: { hidden: mockHidden }
      };

      const component = instanceRender(
        <PrechatForm form={mockForm} />
      );

      spyOn(component, 'renderErrorMessage').and.callFake(() => mockRenderErrorMessage);
      result = component.renderPhoneField();
    });

    describe('when phone data attribute hidden is true', () => {
      beforeAll(() => {
        mockHidden = true;
      });

      it('does not render the phone field', () => {
        expect(result)
          .toEqual(null);
      });
    });

    describe('when phone data attribute hidden is false', () => {
      beforeAll(() => {
        mockHidden = false;
      });

      it('renders the phone field', () => {
        expect(TestUtils.isElementOfType(result, TextField))
          .toEqual(true);
      });
    });

    describe('when loginEnabled is false', () => {
      beforeEach(() => {
        const component = domRender(<PrechatForm form={mockFormProp} loginEnabled={false} />);

        result = component.renderPhoneField();
      });

      it('does not render the phone field', () => {
        expect(result)
          .toBe(null);
      });
    });

    describe('when invalid', () => {
      beforeAll(() => {
        mockRenderErrorMessage = Message;
      });

      it('renders field in an error state', () => {
        expect(result.props.children[1].props.validation)
          .toEqual('error');
      });
    });

    describe('when valid', () => {
      beforeAll(() => {
        mockRenderErrorMessage = null;
      });

      it('renders field not in an error state', () => {
        expect(result.props.children[1].props.validation)
          .toBeFalsy();
      });
    });
  });

  describe('renderUserProfile', () => {
    let component;

    beforeEach(() => {
      component = instanceRender(<PrechatForm form={mockFormProp} />);

      spyOn(component, 'renderNameField');
      spyOn(component, 'renderEmailField');

      component.renderUserProfile();
    });

    it('calls renderNameField', () => {
      expect(component.renderNameField)
        .toHaveBeenCalled();
    });

    it('calls renderEmailField', () => {
      expect(component.renderEmailField)
        .toHaveBeenCalled();
    });
  });

  describe('renderNameField', () => {
    let result,
      component,
      mockRenderErrorMessage,
      componentArgs;

    beforeEach(() => {
      component = instanceRender(<PrechatForm {...componentArgs} />);

      spyOn(component, 'isFieldRequired');
      spyOn(component, 'renderErrorMessage').and.callFake(() => mockRenderErrorMessage);

      result = component.renderNameField();
    });

    describe('when called', () => {
      beforeAll(() => {
        componentArgs = {
          form: {
            ...mockFormProp,
            name: { required: true }
          }
        };
      });

      it('renders a TextField component', () => {
        expect(TestUtils.isElementOfType(result, TextField))
          .toEqual(true);
      });

      it('calls isFieldRequired with expected arguments', () => {
        expect(component.isFieldRequired)
          .toHaveBeenCalledWith(true);
      });
    });

    describe('when loginEnabled is false', () => {
      beforeAll(() => {
        componentArgs = {
          form: mockFormProp,
          loginEnabled: false
        };
      });

      it('does not render the name field', () => {
        expect(result)
          .toBe(null);
      });
    });

    describe('when there is at least one social login available', () => {
      beforeAll(() => {
        componentArgs = {
          form: mockFormProp,
          authUrls: [{ Goggle: 'https://www.zopim.com/auth/goggle/3DsjCpVY6RGFpfrfQk88xJ6DqnM82JMJ-mJhKBcIWnWUWJY' }]
        };
      });

      it('renders with expected style', () => {
        expect(result.props.className)
          .toContain('nameFieldWithSocialLoginClass');
      });
    });

    describe('when there are no social logins available', () => {
      beforeAll(() => {
        componentArgs = {
          form: mockFormProp,
          authUrls: []
        };
      });

      it('renders with expected style', () => {
        expect(result.props.className)
          .not.toContain('nameFieldWithSocialLoginClass');
      });
    });

    describe('when invalid', () => {
      beforeAll(() => {
        mockRenderErrorMessage = Message;
      });

      it('renders field in an error state', () => {
        expect(result.props.children[1].props.validation)
          .toEqual('error');
      });
    });

    describe('when valid', () => {
      beforeAll(() => {
        mockRenderErrorMessage = null;
      });

      it('renders field not in an error state', () => {
        expect(result.props.children[1].props.validation)
          .toBeFalsy();
      });
    });
  });

  describe('renderEmailField', () => {
    let result,
      node,
      mockRenderErrorMessage,
      component;

    beforeEach(() => {
      const mockForm = {
        ...mockFormProp,
        email: { required: true }
      };

      component = instanceRender(<PrechatForm form={mockForm} />);

      spyOn(component, 'isFieldRequired');
      spyOn(component, 'renderErrorMessage').and.callFake(() => mockRenderErrorMessage);

      result = component.renderEmailField();
    });

    it('renders a TextField component', () => {
      expect(TestUtils.isElementOfType(result, TextField))
        .toEqual(true);
    });

    it('calls isFieldRequired with expected arguments', () => {
      expect(component.isFieldRequired)
        .toHaveBeenCalledWith(true);
    });

    describe('when loginEnabled is false', () => {
      beforeEach(() => {
        const component = domRender(<PrechatForm form={mockFormProp} loginEnabled={false} />);

        node = ReactDOM.findDOMNode(component);
      });

      it('does not render the email field', () => {
        expect(node.querySelector('input[name="email"]'))
          .toBe(null);
      });
    });

    describe('when invalid', () => {
      beforeAll(() => {
        mockRenderErrorMessage = Message;
      });

      it('renders field in an error state', () => {
        expect(result.props.children[1].props.validation)
          .toEqual('error');
      });
    });

    describe('when valid', () => {
      beforeAll(() => {
        mockRenderErrorMessage = null;
      });

      it('renders field not in an error state', () => {
        expect(result.props.children[1].props.validation)
          .toBeFalsy();
      });
    });
  });

  describe('renderMessageField', () => {
    let result,
      mockRenderErrorMessage,
      component;

    beforeEach(() => {
      const mockForm = {
        ...mockFormProp,
        message: { required: true }
      };

      component = instanceRender(<PrechatForm form={mockForm} />);

      spyOn(component, 'isFieldRequired');
      spyOn(component, 'renderErrorMessage').and.callFake(() => mockRenderErrorMessage);

      result = component.renderMessageField();
    });

    it('renders a TextField component', () => {
      expect(TestUtils.isElementOfType(result, TextField))
        .toEqual(true);
    });

    it('calls isFieldRequired with expected arguments', () => {
      expect(component.isFieldRequired)
        .toHaveBeenCalledWith(true);
    });

    describe('when invalid', () => {
      beforeAll(() => {
        mockRenderErrorMessage = Message;
      });

      it('renders field in an error state', () => {
        expect(result.props.children[1].props.validation)
          .toEqual('error');
      });
    });

    describe('when valid', () => {
      beforeAll(() => {
        mockRenderErrorMessage = null;
      });

      it('renders field not in an error state', () => {
        expect(result.props.children[1].props.validation)
          .toBeFalsy();
      });
    });
  });

  describe('renderDepartmentsField', () => {
    let renderDepartmentsFieldFn, formProp, result;
    const departments = [
        { name: 'Design', status: 'online', id: 12345, value: 12345 },
        { name: 'Engineering', status: 'online', id: 56789, value: 56789 }
      ],
      getRenderDepartmentsFieldFn = (formProp) => (
        instanceRender(<PrechatForm form={formProp} />)
          .renderDepartmentsField
      );

    describe('when there are departments in the form', () => {
      beforeEach(() => {
        formProp = {
          ...mockFormProp,
          departments,
          department: { label: 'department label' }
        };
        renderDepartmentsFieldFn = getRenderDepartmentsFieldFn(formProp);
        result = renderDepartmentsFieldFn();
      });

      it('returns a SelectField', () => {
        expect(TestUtils.isElementOfType(result, SelectField))
          .toEqual(true);
      });

      it('uses the label prop in the label element', () => {
        expect(result.props.children[0].props.children)
          .toEqual(formProp.department.label);
      });

      describe('dropdown options', () => {
        let options;

        beforeEach(() => {
          options = result.props.children[1].props.options;
        });

        it('has the right length', () => {
          expect(options.length)
            .toEqual(2);
        });

        it('have the type Item', () => {
          _.forEach(options, (option) => {
            expect(TestUtils.isElementOfType(option, Item))
              .toEqual(true);
          });
        });

        it('sets the name correctly for each item', () => {
          _.forEach(options, (option, index) => {
            expect(option.props.children)
              .toEqual(departments[index].name);
          });
        });
      });

      describe('when the required setting is true', () => {
        beforeEach(() => {
          formProp = {
            ...mockFormProp,
            departments,
            department: { required: true }
          };
          renderDepartmentsFieldFn = getRenderDepartmentsFieldFn(formProp);
          result = renderDepartmentsFieldFn();
        });

        it('sets the required attribute to true on the select element', () => {
          expect(result.props.children[1].props.required)
            .toEqual(true);
        });
      });

      describe('when the required setting is false', () => {
        beforeEach(() => {
          formProp = {
            ...mockFormProp,
            departments,
            department: { required: false }
          };
          renderDepartmentsFieldFn = getRenderDepartmentsFieldFn(formProp);
          result = renderDepartmentsFieldFn();
        });

        it('sets the required attribute to false on the else element', () => {
          expect(result.props.children[1].props.required)
            .toEqual(false);
        });
      });
    });

    describe('when there are no departments in the form', () => {
      beforeEach(() => {
        formProp = { ...mockFormProp, departments: undefined };
        renderDepartmentsFieldFn = getRenderDepartmentsFieldFn(formProp);
        result = renderDepartmentsFieldFn();
      });

      it('does not return anything', () => {
        expect(result)
          .toBeNull();
      });
    });
  });

  describe('handleFormChange', () => {
    let component, onPrechatFormChangeSpy;

    beforeEach(() => {
      onPrechatFormChangeSpy = jasmine.createSpy('onPrechatFormChange');
      component = instanceRender(<PrechatForm form={mockFormProp} onPrechatFormChange={onPrechatFormChangeSpy} />);
      mockFormValidity = true;
      component.form = mockForm;

      component.handleFormChange();
    });

    it('calls onPrechatFormChange', () => {
      expect(onPrechatFormChangeSpy)
        .toHaveBeenCalled();
    });

    it('calls onPrechatFormChange with the form element names mapped to their values', () => {
      expect(onPrechatFormChangeSpy)
        .toHaveBeenCalledWith(
          jasmine.objectContaining({
            display_name: 'John Snow',
            email: 'j@l.r'
          })
        );
    });

    it('calls onPrechatFormChange without the values from elements with type submit', () => {
      expect(onPrechatFormChangeSpy.calls.count())
        .toEqual(1);

      const formArgument = onPrechatFormChangeSpy.calls.first().args[0];

      expect(Object.keys(formArgument))
        .not
        .toContain('button');
    });
  });

  describe('handleFormSubmit', () => {
    let component,
      onFormCompletedSpy,
      mockSocialLogin,
      mockIsAuthenticated,
      mockState = { valid: true },
      mockVisitor;
    const formState = {
      name: 'someName',
      email: 'someEmail@someEmail.com',
      message: 'someMessage'
    };

    beforeEach(() => {
      onFormCompletedSpy = jasmine.createSpy('onFormCompleted');
      component = instanceRender(
        <PrechatForm
          form={mockFormProp}
          onFormCompleted={onFormCompletedSpy}
          formState={formState}
          visitor={mockVisitor}
          isAuthenticated={mockIsAuthenticated}
          socialLogin={mockSocialLogin}
        />
      );
      spyOn(component, 'setState');
      component.state = mockState;
      component.handleFormSubmit({ preventDefault: noop });
    });

    describe('when form is invalid', () => {
      beforeAll(() => {
        mockState = {
          valid: false
        };
      });

      it('shows error', () => {
        expect(component.setState)
          .toHaveBeenCalledWith({ showErrors: true });
      });
    });

    describe('when form is valid', () => {
      beforeAll(() => {
        mockState = {
          valid: true
        };
      });

      it('does not show error', () => {
        expect(component.setState)
          .toHaveBeenCalledWith({ showErrors: false });
      });
    });

    describe('when not socially logged in', () => {
      beforeAll(() => {
        mockSocialLogin = {
          authenticated: false
        };
      });

      it('calls onFormCompleted spy with the formState prop', () => {
        expect(onFormCompletedSpy)
          .toHaveBeenCalledWith(formState);
      });
    });

    describe('when socially logged in', () => {
      beforeAll(() => {
        mockSocialLogin = {
          authenticated: true
        };
        mockVisitor = {
          display_name: 'yolo',
          email: 'email@email.com'
        };
      });

      it('calls onFormCompleted spy with formState prop where name and email are from social details', () => {
        expect(onFormCompletedSpy)
          .toHaveBeenCalledWith({
            ...formState,
            name: 'yolo',
            email: 'email@email.com'
          });
      });
    });

    describe('when authenticated', () => {
      beforeAll(() => {
        mockIsAuthenticated = true;
        mockVisitor = {
          display_name: 'yolo',
          email: 'email@email.com'
        };
      });

      it('calls onFormCompleted spy with formState prop where name and email are from social details', () => {
        expect(onFormCompletedSpy)
          .toHaveBeenCalledWith({
            ...formState,
            name: 'yolo',
            email: 'email@email.com'
          });
      });
    });
  });

  describe('when the component is mounted', () => {
    let component;

    beforeEach(() => {
      component = instanceRender(<PrechatForm form={mockFormProp} />);
      spyOn(component, 'handleFormChange');
      component.componentDidMount();
    });

    it('calls handleFormChange', () => {
      expect(component.handleFormChange)
        .toHaveBeenCalled();
    });
  });

  describe('isDepartmentOffline', () => {
    let mockDepartments,
      mockDepartmentId,
      result;

    beforeEach(() => {
      const component = instanceRender(<PrechatForm form={mockFormProp} />);

      result = component.isDepartmentOffline(mockDepartments, mockDepartmentId);
    });

    describe('when no matching department was found', () => {
      beforeAll(() => {
        mockDepartments = [
          { id: '123', status: 'online' },
          { id: '420', status: 'offline' }
        ];
        mockDepartmentId = 'blah123';
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });

    describe('when the matching departments status is offline', () => {
      beforeAll(() => {
        mockDepartments = [
          { id: '4566', status: 'online' },
          { id: '1111', status: 'offline' }
        ];
        mockDepartmentId = '1111';
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('when the matching departments status is online', () => {
      beforeAll(() => {
        mockDepartments = [
          { id: '234', status: 'online' },
          { id: '77890', status: 'offline' }
        ];
        mockDepartmentId = '234';
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });
  });

  describe('isFieldRequired', () => {
    let mockFallback,
      mockDepartment,
      mockDepartments,
      component,
      result;

    beforeEach(() => {
      const form = {
        ...mockFormProp,
        departments: mockDepartments,
        department: { label: '' }
      };
      const formState = {
        ...mockForm,
        department: mockDepartment
      };

      component = instanceRender(
        <PrechatForm form={form} formState={formState} />
      );

      spyOn(component, 'isDepartmentOffline');

      result = component.isFieldRequired(mockFallback);
    });

    describe('when a department value exists', () => {
      beforeAll(() => {
        mockFallback = false;
        mockDepartment = '12345';
        mockDepartments = [{ id: 1 }, { id: 2 }];
      });

      it('calls isDepartmentOffline with expected arguments', () => {
        expect(component.isDepartmentOffline)
          .toHaveBeenCalledWith(mockDepartments, mockDepartment);
      });
    });

    describe('when a department value is an empty string', () => {
      beforeAll(() => {
        mockFallback = true;
        mockDepartment = '';
        mockDepartments = [{ id: 123 }, { id: 420 }];
      });

      it('does not call isDepartmentOffline', () => {
        expect(component.isDepartmentOffline)
          .not
          .toHaveBeenCalled();
      });

      it('returns the fallback value of true', () => {
        expect(result)
          .toEqual(mockFallback);
      });
    });
  });
});
