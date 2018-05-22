describe('ChatOfflineForm component', () => {
  let ChatOfflineForm;
  const ChatOfflineFormPath = buildSrcPath('component/chat/ChatOfflineForm');

  const Form = noopReactComponent();
  const Field = noopReactComponent();
  const EmailField = noopReactComponent();
  const Button = noopReactComponent();
  const LoadingSpinner = noopReactComponent();
  const ChatOperatingHours = noopReactComponent();
  const ChatOfflineMessageForm = noopReactComponent();
  const UserProfile = noopReactComponent();

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
          scrollContainerContent: 'scrollContainerContentClass',
          operatingHoursContainer: 'operatingHoursContainerClass',
          operatingHoursLink: 'operatingHoursLinkClass',
          nameFieldWithSocialLogin: 'nameFieldWithSocialLoginClass'
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
          LOADING: 'loading',
          OPERATING_HOURS: 'operatingHours'
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
      },
      'component/chat/ChatOfflineMessageForm': {
        ChatOfflineMessageForm
      },
      'component/chat/UserProfile': { UserProfile }
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
      result,
      mockSocialLogin,
      mockVisitor;

    beforeEach(() => {
      const mockFormState = {
        name: 'Terence',
        message: 'I need coffee',
        email: 'terence@terence.com'
      };

      component = instanceRender(
        <ChatOfflineForm
          formState={mockFormState}
          offlineMessage={{ screen: 'main' }}
          socialLogin={mockSocialLogin}
          visitor={mockVisitor} />
      );

      spyOn(component, 'renderNameField');
      spyOn(component, 'renderEmailField');
      spyOn(component, 'renderPhoneNumberField');
      spyOn(component, 'renderMessageField');

      result = component.renderForm();
    });

    describe('when not socially logged in', () => {
      beforeAll(() => {
        mockSocialLogin = {
          authenticated: false
        };
      });

      it('has a props.formState value', () => {
        const expected = {
          name: 'Terence',
          message: 'I need coffee',
          email: 'terence@terence.com'
        };

        expect(result.props.formState)
          .toEqual(jasmine.objectContaining(expected));
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

      it('has a props.formState value and social email and name', () => {
        const expected = {
          name: 'yolo',
          message: 'I need coffee',
          email: 'email@email.com'
        };

        expect(result.props.formState)
          .toEqual(jasmine.objectContaining(expected));
      });
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
    let result,
      offlineMessageProp,
      onFormBackSpy;

    const mockFormValues = {
      name: 'Boromir',
      email: 'boromir@gondor.nw',
      phone: '12345678',
      message: 'One does not simply walk into Mordor'
    };

    describe('when the screen is the success screen', () => {
      beforeEach(() => {
        offlineMessageProp = { screen: 'success', details: mockFormValues };
        onFormBackSpy = jasmine.createSpy('onFormBack');

        const component = instanceRender(
          <ChatOfflineForm offlineMessage={offlineMessageProp} handleOfflineFormBack={onFormBackSpy}/>
        );

        result = component.renderSuccess();
      });

      it('renders ChatOfflineMessageForm', () => {
        expect(TestUtils.isElementOfType(result, ChatOfflineMessageForm))
          .toEqual(true);
      });

      it('passes the correct props to ChatOfflineMessageForm', () => {
        expect(result.props.offlineMessage)
          .toEqual(offlineMessageProp);

        expect(result.props.onFormBack)
          .toEqual(onFormBackSpy);
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

  describe('renderOperatingHours', () => {
    let result;

    describe('when the screen is not the operating hours screen', () => {
      beforeEach(() => {
        const component = instanceRender(<ChatOfflineForm offlineMessage={{ screen: 'main' }} />);

        result = component.renderOperatingHours();
      });

      it('renders nothing', () => {
        expect(result)
          .toBeUndefined();
      });
    });

    describe('when the screen is the operatingHours screen', () => {
      beforeEach(() => {
        const mockOperatingHours = {
          account_schedule: [[456]],
          enabled: true
        };

        const component = instanceRender(
          <ChatOfflineForm
            operatingHours={mockOperatingHours}
            offlineMessage={{ screen: 'operatingHours' }} />
        );

        result = component.renderOperatingHours();
      });

      it('returns a <ChatOperatingHours> element', () => {
        expect(TestUtils.isElementOfType(result, ChatOperatingHours))
          .toEqual(true);
      });

      it('has a props.operatingHours value', () => {
        const expected = {
          account_schedule: [[456]],
          enabled: true
        };

        expect(result.props.operatingHours)
          .toEqual(expected);
      });
    });
  });

  describe('renderOperatingHoursLink', () => {
    let result,
      link,
      mockOperatingHours,
      handleOperatingHoursClickFn;

    beforeEach(() => {
      handleOperatingHoursClickFn = () => {};

      const component = instanceRender(
        <ChatOfflineForm
          operatingHours={mockOperatingHours}
          handleOperatingHoursClick={handleOperatingHoursClickFn}
          offlineMessage={{ screen: 'main' }} />
      );

      result = component.renderOperatingHoursLink();
      link = _.get(result, 'props.children');
    });

    describe('when operating hours are active', () => {
      beforeAll(() => {
        mockOperatingHours = {
          account_schedule: [[456]],
          enabled: true
        };
      });

      it('returns a <p> element at the top', () => {
        expect(TestUtils.isElementOfType(result, 'p'))
          .toEqual(true);
      });

      it('returns the right classes for the <p> element', () => {
        expect(result.props.className)
          .toEqual('operatingHoursContainerClass');
      });

      it('returns a link (<a> element) inside the <p>', () => {
        expect(TestUtils.isElementOfType(link, 'a'))
          .toEqual(true);
      });

      it('returns the right classes for the <a> element', () => {
        expect(link.props.className)
          .toEqual('operatingHoursLinkClass');
      });

      it('returns a prop for onClick for the <a> element', () => {
        expect(link.props.onClick)
          .toEqual(handleOperatingHoursClickFn);
      });

      it('returns a the right label for the link', () => {
        expect(link.props.children)
          .toEqual('embeddable_framework.chat.operatingHours.label.anchor');
      });
    });

    describe('when operating hours are not active', () => {
      beforeAll(() => {
        mockOperatingHours = { enabled: false };
      });

      it('returns nothing', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('renderOfflineGreeting', () => {
    let result;

    beforeEach(() => {
      const component = instanceRender(<ChatOfflineForm offlineMessage={{ screen: 'main' }} />);

      result = component.renderOfflineGreeting();
    });

    it('renders a type of <p>', () => {
      expect(TestUtils.isElementOfType(result, 'p'))
        .toEqual(true);
    });

    it('has the right className', () => {
      expect(result.props.className)
        .toEqual('offlineGreetingClass');
    });
  });

  describe('renderUserProfile', () => {
    let component;

    beforeEach(() => {
      component = instanceRender(<ChatOfflineForm />);

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
      componentArgs;

    beforeEach(() => {
      const component = instanceRender(<ChatOfflineForm {...componentArgs} />);

      result = component.renderNameField();
    });

    describe('when called', () => {
      beforeAll(() => {
        componentArgs = {
          formFields: {
            name: { required: true }
          }
        };
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

    describe('when there is at least one social login available', () => {
      beforeAll(() => {
        componentArgs = {
          authUrls: [{ Goggle: 'https://www.zopim.com/auth/goggle/3DsjCpVY6RGFpfrfQk88xJ6DqnM82JMJ-mJhKBcIWnWUWJY' }]
        };
      });

      it('renders with expected style', () => {
        expect(result.props.fieldContainerClasses)
          .toContain('nameFieldWithSocialLoginClass');
      });
    });

    describe('when there are no social logins available', () => {
      beforeAll(() => {
        componentArgs = {
          authUrls: []
        };
      });

      it('renders with expected style', () => {
        expect(result.props.fieldContainerClasses)
          .not.toContain('nameFieldWithSocialLoginClass');
      });
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
