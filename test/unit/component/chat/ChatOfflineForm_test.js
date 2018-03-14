describe('ChatOfflineForm component', () => {
  let ChatOfflineForm;
  const ChatOfflineFormPath = buildSrcPath('component/chat/ChatOfflineForm');

  const Form = noopReactComponent();
  const Field = noopReactComponent();
  const EmailField = noopReactComponent();

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      './ChatOfflineForm.scss': {
        locals: {
          container: 'containerClass',
          offlineGreeting: 'offlineGreetingClass',
          submitButton: 'submitButtonClass',
          form: 'formClass'
        }
      },
      'service/i18n': {
        i18n: {
          t: _.identity
        }
      },
      'component/container/ScrollContainer': {
        ScrollContainer: noopReactComponent()
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
      'src/redux/modules/chat': {
        chatOfflineFormChanged: ''
      },
      'src/redux/modules/chat/chat-selectors': {
        getChatOfflineForm: '',
        getOfflineFormFields: ''
      }
    });

    mockery.registerAllowable(ChatOfflineFormPath);
    ChatOfflineForm = requireUncached(ChatOfflineFormPath).default.WrappedComponent;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('render', () => {
    let component,
      result;

    beforeEach(() => {
      component = instanceRender(<ChatOfflineForm formState={{}} />);

      spyOn(component, 'renderBody');

      result = component.render();
    });

    it('has a props.containerClasses value', () => {
      expect(result.props.containerClasses)
        .toEqual('containerClass');
    });

    it('has a props.title value', () => {
      expect(result.props.title)
        .toEqual('embeddable_framework.chat.title');
    });

    it('calls renderBody', () => {
      expect(component.renderBody)
        .toHaveBeenCalled();
    });
  });

  describe('renderBody', () => {
    let component,
      result;

    beforeEach(() => {
      const mockFormState = {
        name: 'Terence',
        message: 'I need coffee'
      };

      component = instanceRender(<ChatOfflineForm formState={mockFormState} />);

      spyOn(component, 'renderNameField');
      spyOn(component, 'renderEmailField');
      spyOn(component, 'renderPhoneNumberField');
      spyOn(component, 'renderMessageField');

      result = component.renderBody();
    });

    it('has a props.formState value', () => {
      const expected = {
        name: 'Terence',
        message: 'I need coffee'
      };

      expect(result.props.formState)
        .toEqual(jasmine.objectContaining(expected));
    });

    it('has a props.className', () => {
      expect(result.props.className)
        .toEqual('formClass');
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
