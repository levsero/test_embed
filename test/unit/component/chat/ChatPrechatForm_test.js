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
          t: () => {}
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
      component = domRender(<ChatPrechatForm />);

      component.setState({ formState: { phone: '1234' } });

      component.componentWillReceiveProps({ visitor });
    });

    it('sets the name and email when it gets a valid email', () => {
      expect(component.state.formState)
        .toEqual(jasmine.objectContaining(visitor));
    });

    it('does not override the other form fields', () => {
      expect(component.state.formState.phone)
        .toEqual('1234');
    });
  });

  describe('handleFormChange', () => {
    let component;

    beforeEach(() => {
      component = domRender(<ChatPrechatForm />);
      mockFormValidity = true;
      component.form = mockForm;

      component.handleFormChange();
    });

    describe('state.formState', () => {
      it('should be set with the form elements name mapped to the value', () => {
        expect(component.state.formState)
          .toEqual({ display_name: 'John Snow', email: 'j@l.r' });  // eslint-disable-line camelcase
      });

      it('should not contain elements with type submit', () => {
        expect(component.state.formState.button)
          .toBeUndefined();
      });
    });

    it('should set valid state with the formValidity value', () => {
      expect(component.state.valid)
        .toEqual(true);
    });
  });

  describe('handleFormSubmit', () => {
    let component, onFormCompletedSpy;

    beforeEach(() => {
      onFormCompletedSpy = jasmine.createSpy('onFormCompleted');
      component = domRender(<ChatPrechatForm onFormCompleted={onFormCompletedSpy} />);

      component.setState({ formState: 'mockFormState' });
      component.handleFormSubmit({ preventDefault: noop });
    });

    it('should call onFormCompleted spy with state.formState', () => {
      expect(onFormCompletedSpy)
        .toHaveBeenCalledWith('mockFormState');
    });
  });
});
