describe('ChatPrechatForm component', () => {
  let ChatPrechatForm,
    mockForm,
    mockFormValidity,
    mockFormProp;
  const chatPrechatFormPath = buildSrcPath('component/chat/ChatPrechatForm');
  const Dropdown = noopReactComponent();

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
      'component/field/Field': {
        Field: class extends Component {
          render() {
            return this.props.input
                 ? React.cloneElement(this.props.input, _.extend({}, this.props))
                 : <input
                    name={this.props.name}
                    required={this.props.required}
                    pattern={this.props.pattern}
                    type={this.props.type} />;
          }
        }
      },
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

    it('sets valid state with the formValidity value', () => {
      expect(component.state.valid)
        .toEqual(true);
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

  describe('form field rendering', () => {
    let component, node, field;

    beforeEach(() => {
      component = domRender(<ChatPrechatForm form={mockFormProp} />);
      node = ReactDOM.findDOMNode(component);
    });

    describe('renders a name field with', () => {
      beforeEach(() => {
        field = node.querySelector('input[name="name"]');
      });

      it('the name attribute', () => {
        expect(field.name)
          .toBe('name');
      });

      it('the required attribute', () => {
        expect(field.hasAttribute('required'))
          .toBe(true);
      });
    });

    describe('renders an email field with', () => {
      beforeEach(() => {
        field = node.querySelector('input[name="email"]');
      });

      it('the name attribute', () => {
        expect(field.name)
          .toBe('email');
      });

      it('with the required attribute', () => {
        expect(field.hasAttribute('required'))
          .toBe(true);
      });

      it('with the pattern attribute', () => {
        expect(field.hasAttribute('pattern'))
          .toBe(true);
      });
    });

    describe('when the phone field is hidden', () => {
      beforeEach(() => {
        mockFormProp.phone.hidden = true;

        component = domRender(<ChatPrechatForm form={mockFormProp} />);
        node = ReactDOM.findDOMNode(component);
        field = node.querySelector('input[name="phone"]');
      });

      it('does not render a phone field', () => {
        expect(field)
          .toBe(null);
      });
    });

    describe('when the phone field is not hidden', () => {
      describe('renders a phone field with', () => {
        beforeEach(() => {
          field = node.querySelector('input[name="phone"]');
        });

        it('the name attribute', () => {
          expect(field.name)
            .toBe('phone');
        });

        it('the required attribute', () => {
          expect(field.hasAttribute('required'))
            .toBe(false);
        });

        it('the type attribute', () => {
          expect(field.type)
            .toBe('tel');
        });

        it('with the pattern attribute', () => {
          expect(field.hasAttribute('pattern'))
            .toBe(true);
        });
      });
    });

    describe('renders a message field with', () => {
      beforeEach(() => {
        field = node.querySelector('textarea[name="message"]');
      });

      it('the name attribute', () => {
        expect(field.name)
          .toBe('message');
      });

      it('the required attribute', () => {
        expect(field.hasAttribute('required'))
          .toBe(false);
      });

      it('the input attribute', () => {
        expect(field.rows)
          .toBe(3);
      });
    });

    describe('when loginEnabled is false', () => {
      beforeEach(() => {
        component = domRender(<ChatPrechatForm form={mockFormProp} loginEnabled={false} />);
        node = ReactDOM.findDOMNode(component);
      });

      it('does not render the name field', () => {
        expect(node.querySelector('input[name="name"]'))
          .toBe(null);
      });

      it('does not render the email field', () => {
        expect(node.querySelector('input[name="email"]'))
          .toBe(null);
      });

      it('does not render the phone field', () => {
        expect(node.querySelector('input[name="phone"]'))
          .toBe(null);
      });
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
          .toBeUndefined();
      });
    });
  });
});
