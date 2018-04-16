describe('ChatPrechatForm component', () => {
  let ChatPrechatForm,
    mockForm,
    mockFormValidity,
    mockFormProp;
  const chatPrechatFormPath = buildSrcPath('component/chat/ChatPrechatForm');
  const Dropdown = noopReactComponent();

  const Field = class extends Component {
    render() {
      return this.props.input
           ? React.cloneElement(this.props.input, _.extend({}, this.props))
           : <input
              name={this.props.name}
              required={this.props.required}
              pattern={this.props.pattern}
              type={this.props.type} />;
    }
  };

  beforeEach(() => {
    mockery.enable();

    mockFormValidity = false;

    initMockRegistry({
      './ChatPrechatForm.scss': {
        locals: {}
      },
      'component/button/Button': {
        Button: noopReactComponent()
      },
      'component/field/Field': { Field },
      'component/field/Dropdown': {
        Dropdown
      },
      'service/i18n': {
        i18n: {
          t: noop
        }
      }
    });

    mockFormProp = {
      name: { name: 'name', required: true },
      email: { name: 'email', required: true },
      phone: { name: 'phone', label: 'Phone Number', required: false, hidden: false },
      message: { name: 'message', label: 'Message', required: false }
    };

    mockForm = {
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

    mockery.registerAllowable(chatPrechatFormPath);
    ChatPrechatForm = requireUncached(chatPrechatFormPath).ChatPrechatForm;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('render', () => {
    let component,
      result;

    beforeEach(() => {
      component = instanceRender(<ChatPrechatForm form={mockFormProp} />);

      spyOn(component, 'renderGreetingMessage');
      spyOn(component, 'renderNameField');
      spyOn(component, 'renderEmailField');
      spyOn(component, 'renderPhoneField');
      spyOn(component, 'renderDepartmentsField');
      spyOn(component, 'renderMessageField');

      result = component.render();
    });

    it('calls renderGreetingMessage', () => {
      expect(component.renderGreetingMessage)
        .toHaveBeenCalled();
    });

    it('calls renderNameField', () => {
      expect(component.renderNameField)
        .toHaveBeenCalled();
    });

    it('calls renderEmailField', () => {
      expect(component.renderEmailField)
        .toHaveBeenCalled();
    });

    it('calls renderPhoneField', () => {
      expect(component.renderPhoneField)
        .toHaveBeenCalled();
    });

    it('calls renderDepartmentsField', () => {
      expect(component.renderDepartmentsField)
        .toHaveBeenCalled();
    });

    it('calls renderMessageField', () => {
      expect(component.renderMessageField)
        .toHaveBeenCalled();
    });

    it('returns a form component', () => {
      expect(result.type)
        .toEqual('form');
    });
  });

  describe('renderGreetingMessage', () => {
    let result,
      greetingMessage;

    beforeEach(() => {
      const component = instanceRender(
        <ChatPrechatForm form={mockFormProp} greetingMessage={greetingMessage} />
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
      node,
      mockHidden;

    beforeEach(() => {
      const mockForm = {
        ...mockFormProp,
        phone: { hidden: mockHidden }
      };

      const component = instanceRender(
        <ChatPrechatForm form={mockForm} />
      );

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
        expect(TestUtils.isElementOfType(result, Field))
          .toEqual(true);
      });
    });

    describe('when loginEnabled is false', () => {
      beforeEach(() => {
        const chatPrechatForm = domRender(<ChatPrechatForm form={mockFormProp} loginEnabled={false} />);

        node = ReactDOM.findDOMNode(chatPrechatForm);
      });

      it('does not render the phone field', () => {
        expect(node.querySelector('input[name="phone"]'))
          .toBe(null);
      });
    });
  });

  describe('renderNameField', () => {
    let result,
      node,
      component;

    beforeEach(() => {
      const mockForm = {
        ...mockFormProp,
        name: { required: true }
      };

      component = instanceRender(<ChatPrechatForm form={mockForm} />);

      spyOn(component, 'isFieldRequired');

      result = component.renderNameField();
    });

    it('renders a Field component', () => {
      expect(TestUtils.isElementOfType(result, Field))
        .toEqual(true);
    });

    it('calls isFieldRequired with expected arguments', () => {
      expect(component.isFieldRequired)
        .toHaveBeenCalledWith(true);
    });

    describe('when loginEnabled is false', () => {
      beforeEach(() => {
        const chatPrechatForm = domRender(<ChatPrechatForm form={mockFormProp} loginEnabled={false} />);

        node = ReactDOM.findDOMNode(chatPrechatForm);
      });

      it('does not render the name field', () => {
        expect(node.querySelector('input[name="name"]'))
          .toBe(null);
      });
    });
  });

  describe('renderEmailField', () => {
    let result,
      node,
      component;

    beforeEach(() => {
      const mockForm = {
        ...mockFormProp,
        email: { required: true }
      };

      component = instanceRender(<ChatPrechatForm form={mockForm} />);

      spyOn(component, 'isFieldRequired');

      result = component.renderEmailField();
    });

    it('renders a Field component', () => {
      expect(TestUtils.isElementOfType(result, Field))
        .toEqual(true);
    });

    it('calls isFieldRequired with expected arguments', () => {
      expect(component.isFieldRequired)
        .toHaveBeenCalledWith(true);
    });

    describe('when loginEnabled is false', () => {
      beforeEach(() => {
        const chatPrechatForm = domRender(<ChatPrechatForm form={mockFormProp} loginEnabled={false} />);

        node = ReactDOM.findDOMNode(chatPrechatForm);
      });

      it('does not render the email field', () => {
        expect(node.querySelector('input[name="email"]'))
          .toBe(null);
      });
    });
  });

  describe('renderMessageField', () => {
    let result,
      component;

    beforeEach(() => {
      const mockForm = {
        ...mockFormProp,
        message: { required: true }
      };

      component = instanceRender(<ChatPrechatForm form={mockForm} />);

      spyOn(component, 'isFieldRequired');

      result = component.renderMessageField();
    });

    it('renders a Field component', () => {
      expect(TestUtils.isElementOfType(result, Field))
        .toEqual(true);
    });

    it('calls isFieldRequired with expected arguments', () => {
      expect(component.isFieldRequired)
        .toHaveBeenCalledWith(true);
    });
  });

  describe('renderDepartmentsField', () => {
    let renderDepartmentsFieldFn, formProp, result;
    const departments = [
        { name: 'Design', status: 'online', id: 12345, value: 12345 },
        { name: 'Engineering', status: 'online', id: 56789, value: 56789 }
      ],
      getRenderDepartmentsFieldFn = (formProp) => (
      instanceRender(<ChatPrechatForm form={formProp} />)
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

      it('returns a dropdown', () => {
        expect(TestUtils.isElementOfType(result, Dropdown))
          .toEqual(true);
      });

      it('sets the label prop from the department settings', () => {
        expect(result.props.label)
          .toEqual(formProp.department.label);
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

        it('sets the required attribute to true', () => {
          expect(result.props.required)
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

        it('sets the required attribute to false', () => {
          expect(result.props.required)
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
    let component, setFormStateSpy;

    beforeEach(() => {
      setFormStateSpy = jasmine.createSpy('setFormState');
      component = instanceRender(<ChatPrechatForm form={mockFormProp} setFormState={setFormStateSpy} />);
      mockFormValidity = true;
      component.form = mockForm;

      component.handleFormChange();
    });

    it('calls setFormState', () => {
      expect(setFormStateSpy)
        .toHaveBeenCalled();
    });

    it('calls setFormState with the form element names mapped to their values', () => {
      expect(setFormStateSpy)
        .toHaveBeenCalledWith(
          jasmine.objectContaining({
            display_name: 'John Snow',
            email: 'j@l.r'
          })
        );
    });

    it('calls setFormState without the values from elements with type submit', () => {
      expect(setFormStateSpy.calls.count())
        .toEqual(1);

      const formArgument = setFormStateSpy.calls.first().args[0];

      expect(Object.keys(formArgument))
        .not
        .toContain('button');
    });
  });

  describe('handleFormSubmit', () => {
    let component, onFormCompletedSpy;
    const formState = 'mockFormState';

    beforeEach(() => {
      onFormCompletedSpy = jasmine.createSpy('onFormCompleted');
      component = instanceRender(
        <ChatPrechatForm
          form={mockFormProp}
          onFormCompleted={onFormCompletedSpy}
          formState={formState}
        />
      );
      component.handleFormSubmit({ preventDefault: noop });
    });

    it('calls onFormCompleted spy with the formState prop', () => {
      expect(onFormCompletedSpy)
        .toHaveBeenCalledWith(formState);
    });
  });

  describe('when the component is mounted', () => {
    let component;

    beforeEach(() => {
      component = instanceRender(<ChatPrechatForm form={mockFormProp} />);
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
      const chatPrechatForm = instanceRender(<ChatPrechatForm form={mockFormProp} />);

      result = chatPrechatForm.isDepartmentOffline(mockDepartments, mockDepartmentId);
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
      chatPrechatForm,
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

      chatPrechatForm = instanceRender(
        <ChatPrechatForm form={form} formState={formState} />
      );

      spyOn(chatPrechatForm, 'isDepartmentOffline');

      result = chatPrechatForm.isFieldRequired(mockFallback);
    });

    describe('when a department value exists', () => {
      beforeAll(() => {
        mockFallback = false;
        mockDepartment = '12345';
        mockDepartments = [{ id: 1 }, { id: 2 }];
      });

      it('calls isDepartmentOffline with expected arguments', () => {
        expect(chatPrechatForm.isDepartmentOffline)
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
        expect(chatPrechatForm.isDepartmentOffline)
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
