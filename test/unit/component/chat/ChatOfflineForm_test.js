describe('ChatOfflineForm component', () => {
  let ChatOfflineForm;
  const ChatOfflineFormPath = buildSrcPath('component/chat/ChatOfflineForm');

  const Form = noopReactComponent();
  const Field = noopReactComponent();
  const EmailField = noopReactComponent();
  const Button = noopReactComponent();
  const LoadingSpinner = noopReactComponent();
  const ChatOperatingHours = noopReactComponent();

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      './ChatOfflineForm.scss': {
        locals: {
          container: 'containerClass',
          offlineGreeting: 'offlineGreetingClass',
          submitButton: 'submitButtonClass',
          scrollContainer: 'scrollContainerClass',
          mobileContainer: 'mobileContainerClass',
          scrollContainerContent: 'scrollContainerContentClass'
        }
      },
      'service/i18n': {
        i18n: {
          t: _.identity
        }
      },
      'constants/chat': {
        OFFLINE_FORM_SCREENS: {
          MAIN: 'main',
          SUCCESS: 'success',
          LOADING: 'loading'
        }
      },
      'component/form/Form': {
        Form: Form
      },
      'component/field/Field': {
        Field: Field
      },
      'component/field/EmailField': {
        EmailField: EmailField
      },
      'component/button/Button': {
        Button: Button
      },
      'component/loading/LoadingSpinner': {
        LoadingSpinner: LoadingSpinner
      },
      'component/chat/ChatOperatingHours': {
        ChatOperatingHours
      }
    });

    mockery.registerAllowable(ChatOfflineFormPath);
    ChatOfflineForm = requireUncached(ChatOfflineFormPath).ChatOfflineForm;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('renderForm', () => {
    let component,
      result;

    beforeEach(() => {
      const mockFormState = {
        name: 'Terence',
        message: 'I need coffee'
      };

      component = instanceRender(<ChatOfflineForm formState={mockFormState} offlineMessage={{ screen: 'main' }} />);

      spyOn(component, 'renderNameField');
      spyOn(component, 'renderEmailField');
      spyOn(component, 'renderPhoneNumberField');
      spyOn(component, 'renderMessageField');

      result = component.renderForm();
    });

    it('has a props.formState value', () => {
      const expected = {
        name: 'Terence',
        message: 'I need coffee'
      };

      expect(result.props.formState)
        .toEqual(jasmine.objectContaining(expected));
    });

    it('has a props.submitbuttonClasses value', () => {
      expect(result.props.submitButtonClasses)
        .toEqual('submitButtonClass');
    });

    it('has a props.submitButtonlabel value', () => {
      expect(result.props.submitButtonLabel)
        .toEqual('embeddable_framework.chat.preChat.offline.button.sendMessage');
    });

    it('calls renderNameField', () => {
      expect(component.renderNameField)
        .toHaveBeenCalled();
    });

    it('calls renderEmailField', () => {
      expect(component.renderEmailField)
        .toHaveBeenCalled();
    });

    it('calls renderPhoneNumberField', () => {
      expect(component.renderPhoneNumberField)
        .toHaveBeenCalled();
    });

    it('calls renderMessageField', () => {
      expect(component.renderMessageField)
        .toHaveBeenCalled();
    });
  });

  describe('renderLoading', () => {
    let result;

    describe('when the screen is the loading screen', () => {
      beforeEach(() => {
        const component = instanceRender(<ChatOfflineForm offlineMessage={{ screen: 'loading' }} />);

        result = component.renderLoading();
      });

      it('renders a type of LoadingSpinner', () => {
        expect(TestUtils.isElementOfType(result.props.children, LoadingSpinner))
          .toEqual(true);
      });
    });

    describe('when the screen is not the loading screen', () => {
      beforeEach(() => {
        const component = instanceRender(<ChatOfflineForm offlineMessage={{ screen: 'main' }} />);

        result = component.renderLoading();
      });

      it('renders nothing', () => {
        expect(result)
          .toBeUndefined();
      });
    });
  });

  describe('renderSuccess', () => {
    let result, formResults;
    const mockFormValues = {
      name: 'Boromir',
      email: 'boromir@gondor.nw',
      phone: '12345678',
      message: 'One does not simply walk into Mordor'
    };

    describe('when the screen is the success screen', () => {
      beforeEach(() => {
        const component = instanceRender(
          <ChatOfflineForm offlineMessage={{ screen: 'success', details: mockFormValues }} />
        );

        result = component.renderSuccess();
        formResults = result.props.children[1].props.children;
      });

      it('renders the name value from the form to the screen', () => {
        expect(formResults[0].props.children)
          .toBe('Boromir');
      });

      it('renders the email value from the form to the screen', () => {
        expect(formResults[1].props.children)
          .toBe('boromir@gondor.nw');
      });

      it('renders the phone value from the form to the screen', () => {
        expect(formResults[2].props.children)
          .toBe('12345678');
      });

      it('renders the message value from the form to the screen', () => {
        expect(formResults[3].props.children)
          .toBe('One does not simply walk into Mordor');
      });
    });

    describe('when the screen is not the success screen', () => {
      beforeEach(() => {
        const component = instanceRender(<ChatOfflineForm offlineMessage={{ screen: 'main' }} />);

        result = component.renderSuccess();
      });

      it('renders nothing', () => {
        expect(result)
          .toBeUndefined();
      });
    });
  });

  describe('renderNameField', () => {
    let result;

    beforeEach(() => {
      const mockFormFields = { name: { required: true } };
      const component = instanceRender(<ChatOfflineForm formFields={mockFormFields} />);

      result = component.renderNameField();
    });

    it('renders a type of Field', () => {
      expect(TestUtils.isElementOfType(result, Field))
        .toEqual(true);
    });

    it('has props.name of name', () => {
      expect(result.props.name)
        .toEqual('name');
    });

    it('has props.required of true', () => {
      expect(result.props.required)
        .toEqual(true);
    });
  });

  describe('renderEmailField', () => {
    let result;

    beforeEach(() => {
      const mockFormFields = { email: { required: true } };
      const component = instanceRender(<ChatOfflineForm formFields={mockFormFields} />);

      result = component.renderEmailField();
    });

    it('renders a type of EmailField', () => {
      expect(TestUtils.isElementOfType(result, EmailField))
        .toEqual(true);
    });

    it('has props.required of true', () => {
      expect(result.props.required)
        .toEqual(true);
    });
  });

  describe('renderPhoneNumberField', () => {
    let result;

    beforeEach(() => {
      const mockFormFields = { phone: { required: true } };
      const component = instanceRender(<ChatOfflineForm formFields={mockFormFields} />);

      result = component.renderPhoneNumberField();
    });

    it('renders a type of Field', () => {
      expect(TestUtils.isElementOfType(result, Field))
        .toEqual(true);
    });

    it('has props.name of phone', () => {
      expect(result.props.name)
        .toEqual('phone');
    });

    it('has props.required of true', () => {
      expect(result.props.required)
        .toEqual(true);
    });
  });

  describe('renderMessageField', () => {
    let result;

    beforeEach(() => {
      const mockFormFields = { message: { required: true } };
      const component = instanceRender(<ChatOfflineForm formFields={mockFormFields} />);

      result = component.renderMessageField();
    });

    it('renders a type of Field', () => {
      expect(TestUtils.isElementOfType(result, Field))
        .toEqual(true);
    });

    it('has props.name of message', () => {
      expect(result.props.name)
        .toEqual('message');
    });

    it('has props.required of true', () => {
      expect(result.props.required)
        .toEqual(true);
    });
  });
});
