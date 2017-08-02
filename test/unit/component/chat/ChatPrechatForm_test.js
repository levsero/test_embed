describe('ChatPrechatForm component', () => {
  let ChatPrechatForm,
    mockForm,
    mockFormValidity;
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
        Field: noopReactComponent()
      },
      'service/i18n': {
        i18n: {
          t: noop
        }
      }
    });

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
    const visitor = { display_name: 'Arya Stark', email: 'no@name.x' };  // eslint-disable-line camelcase

    beforeEach(() => {
      component = instanceRender(<ChatPrechatForm />);
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
      component = instanceRender(<ChatPrechatForm />);
      mockFormValidity = true;
      component.form = mockForm;

      component.handleFormChange();
    });

    describe('state.formState', () => {
      it('equals the form elements name mapped to the value', () => {
        expect(component.state.formState)
          .toEqual({ display_name: 'John Snow', email: 'j@l.r' });  // eslint-disable-line camelcase
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
      component = instanceRender(<ChatPrechatForm onFormCompleted={onFormCompletedSpy} />);

      component.setState({ formState: 'mockFormState' });
      component.handleFormSubmit({ preventDefault: noop });
    });

    it('calls onFormCompleted spy with state.formState', () => {
      expect(onFormCompletedSpy)
        .toHaveBeenCalledWith('mockFormState');
    });
  });
});
