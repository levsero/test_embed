describe('ChatPrechatForm component', () => {
  let ChatPrechatForm,
    mockForm,
    mockFormValidity,
    mockFormProp;
  const ChatPrechatFormPath = buildSrcPath('component/chat/ChatPrechatForm');

  beforeEach(() => {
    resetDOM();
    mockery.enable();

    mockFormValidity = false;

    initMockRegistry({
      './ChatPrechatForm.sass': {
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

    mockery.registerAllowable(ChatPrechatFormPath);
    ChatPrechatForm = requireUncached(ChatPrechatFormPath).ChatPrechatForm;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('componentWillReceiveProps', () => {
    let component;
    const visitor = { display_name: 'Arya Stark', email: 'no@name.x' };

    beforeEach(() => {
      component = instanceRender(<ChatPrechatForm form={mockFormProp} />);
      component.setState({ formState: { phone: '1234' } });
    });

    describe('when it gets a truthy email', () => {
      beforeEach(() => {
        component.componentWillReceiveProps({ visitor });
      });

      it('sets the name and email', () => {
        expect(component.state.formState)
          .toEqual(jasmine.objectContaining(visitor));
      });

      it('does not override the other form fields', () => {
        expect(component.state.formState.phone)
          .toEqual('1234');
      });
    });

    describe('when it gets a falsy email', () => {
      beforeEach(() => {
        component.componentWillReceiveProps({ visitor: {} });
      });

      it('does not set the name and email', () => {
        expect(component.state.formState)
          .not.toEqual(jasmine.objectContaining(visitor));
      });
    });
  });

  describe('handleFormChange', () => {
    let component;

    beforeEach(() => {
      component = instanceRender(<ChatPrechatForm form={mockFormProp} />);
      mockFormValidity = true;
      component.form = mockForm;

      component.handleFormChange();
    });

    describe('state.formState', () => {
      it('equals the form elements name mapped to the value', () => {
        expect(component.state.formState)
          .toEqual({ display_name: 'John Snow', email: 'j@l.r' });
      });

      it('does not contain elements with type submit', () => {
        expect(component.state.formState.button)
          .toBeUndefined();
      });
    });

    it('sets valid state with the formValidity value', () => {
      expect(component.state.valid)
        .toEqual(true);
    });
  });

  describe('handleFormSubmit', () => {
    let component, onFormCompletedSpy;

    beforeEach(() => {
      onFormCompletedSpy = jasmine.createSpy('onFormCompleted');
      component = instanceRender(<ChatPrechatForm form={mockFormProp} onFormCompleted={onFormCompletedSpy} />);

      component.setState({ formState: 'mockFormState' });
      component.handleFormSubmit({ preventDefault: noop });
    });

    it('calls onFormCompleted spy with state.formState', () => {
      expect(onFormCompletedSpy)
        .toHaveBeenCalledWith('mockFormState');
    });
  });

  describe('renders a form', () => {
    let component, node, field;

    beforeEach(() => {
      component = domRender(<ChatPrechatForm form={mockFormProp} />);
      node = ReactDOM.findDOMNode(component);
    });

    describe('with a name field', () => {
      beforeEach(() => {
        field = node.querySelector('input[name="name"]');
      });

      it('sets the name attribute', () => {
        expect(field.name)
          .toBe('name');
      });

      it('sets the required attribute', () => {
        expect(field.hasAttribute('required'))
          .toBe(true);
      });
    });

    describe('with an email field', () => {
      beforeEach(() => {
        field = node.querySelector('input[name="email"]');
      });

      it('sets the name attribute', () => {
        expect(field.name)
          .toBe('email');
      });

      it('sets the required attribute', () => {
        expect(field.hasAttribute('required'))
          .toBe(true);
      });

      it('sets the pattern attribute', () => {
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

      it('does not render the phone field', () => {
        expect(field)
          .toBe(null);
      });
    });

    describe('when the phone field is not hidden', () => {
      describe('with a phone field', () => {
        beforeEach(() => {
          field = node.querySelector('input[name="phone"]');
        });

        it('sets the name attribute', () => {
          expect(field.name)
            .toBe('phone');
        });

        it('sets the required attribute', () => {
          expect(field.hasAttribute('required'))
            .toBe(false);
        });

        it('sets the type attribute', () => {
          expect(field.type)
            .toBe('number');
        });
      });
    });

    describe('with a message field', () => {
      beforeEach(() => {
        field = node.querySelector('textarea[name="message"]');
      });

      it('sets the name attribute', () => {
        expect(field.name)
          .toBe('message');
      });

      it('sets the required attribute', () => {
        expect(field.hasAttribute('required'))
          .toBe(false);
      });

      it('sets the input attribute', () => {
        expect(field.rows)
          .toBe(3);
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
});
