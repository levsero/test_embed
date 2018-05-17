describe('ChatSocialLogin component', () => {
  let ChatSocialLogin;
  const chatSocialLoginPath = buildSrcPath('component/chat/ChatSocialLogin');
  const chatConstantsPath = buildSrcPath('constants/chat');
  const Icon = noopReactComponent();
  const LoadingSpinner = noopReactComponent();
  const Avatar = noopReactComponent();

  let chatConstants = requireUncached(chatConstantsPath);
  let CHAT_SOCIAL_LOGIN_SCREENS = chatConstants.CHAT_SOCIAL_LOGIN_SCREENS;

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      './ChatSocialLogin.scss': {
        locals: {
        }
      },
      'constants/chat': {
        CHAT_SOCIAL_LOGIN_SCREENS
      },
      'component/Icon': { Icon },
      'component/loading/LoadingSpinner': { LoadingSpinner },
      'component/Avatar': { Avatar },
      'service/i18n': {
        i18n: {
          t: _.identity
        }
      }
    });

    mockery.registerAllowable(chatSocialLoginPath);
    ChatSocialLogin = requireUncached(chatSocialLoginPath).ChatSocialLogin;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('render', () => {
    let component,
      componentArgs;

    beforeEach(() => {
      component = instanceRender(<ChatSocialLogin {...componentArgs} />);

      spyOn(component, 'renderAuthedProfileField');
      spyOn(component, 'renderDefaultProfileFields');

      component.render();
    });

    describe('when social login is authenticated', () => {
      beforeAll(() => {
        componentArgs = {
          socialLogin: {
            authenticated: true
          }
        };
      });

      it('calls renderAuthedProfileField', () => {
        expect(component.renderAuthedProfileField)
          .toHaveBeenCalled();

        expect(component.renderDefaultProfileFields)
          .not.toHaveBeenCalled();
      });
    });

    describe('when social login is not authenticated', () => {
      beforeAll(() => {
        componentArgs = {
          socialLogin: {
            authenticated: false
          }
        };
      });

      it('calls renderDefaultProfileFields', () => {
        expect(component.renderDefaultProfileFields)
          .toHaveBeenCalled();

        expect(component.renderAuthedProfileField)
          .not.toHaveBeenCalled();
      });
    });
  });

  describe('renderSocialLoginField', () => {
    let result,
      component,
      componentArgs;

    beforeEach(() => {
      component = instanceRender(<ChatSocialLogin {...componentArgs} />);

      spyOn(component, 'renderSocialLoginOptions');

      result = component.renderSocialLoginField();
    });

    describe('when there is at least one social login available', () => {
      beforeAll(() => {
        componentArgs = {
          socialLogin: { authenticated: true },
          authUrls: [{ Goggle: 'https://www.zopim.com/auth/goggle/3DsjCpVY6RGFpfrfQk88xJ6DqnM82JMJ-mJhKBcIWnWUWJY' }]
        };
      });

      it('renders a component', () => {
        expect(result)
          .not.toBeNull();
      });

      it('calls renderSocialLoginOptions with expected args', () => {
        expect(component.renderSocialLoginOptions)
          .toHaveBeenCalledWith(componentArgs.authUrls);
      });

      it('renders the social login label', () => {
        expect(result.props.children[0])
          .toEqual('embeddable_framework.chat.form.common.field.social_login.label');
      });
    });

    describe('when there are no social logins available', () => {
      beforeAll(() => {
        componentArgs = {
          authUrls: []
        };
      });

      it('returns null', () => {
        expect(result)
          .toBeNull();
      });

      it('does not call renderSocialLoginOptions', () => {
        expect(component.renderSocialLoginOptions)
          .not.toHaveBeenCalled();
      });
    });
  });

  describe('renderSocialLoginOptions', () => {
    let result;
    const authUrls = {
      google: 'https://www.zopim.com/auth/Google/3DsjCpVY6RGFpfrfQk88xJ6DqnM82JMJ-mJhKBcIWnWUWJY',
      facebook: 'https://www.zopim.com/auth/Facebook/3DsjCpVY6RGFpfrfQk88xJ6DqnM82JMJ-mJhKBcIWnWUWJY'
    };

    beforeEach(() => {
      const component = instanceRender(<ChatSocialLogin />);

      result = component.renderSocialLoginOptions(authUrls);
    });

    it('has at least one element in the array', () => {
      expect(_.size(authUrls))
        .toBeGreaterThan(0);
    });

    it('has an anchor element with expected attrs related to Google', () => {
      const element = result[0];
      const icon = element.props.children;

      expect(element.type)
        .toEqual('a');

      expect(element.props.href)
        .toEqual(authUrls.google);

      expect(icon.props.type)
        .toEqual('Icon--google');
    });

    it('has an anchor element with expected attrs related to Facebook', () => {
      const element = result[1];
      const icon = element.props.children;

      expect(element.type)
        .toEqual('a');

      expect(element.props.href)
        .toEqual(authUrls.facebook);

      expect(icon.props.type)
        .toEqual('Icon--facebook');
    });
  });

  describe('renderDefaultProfileFields', () => {
    let result,
      component,
      componentArgs;

    beforeEach(() => {
      componentArgs = {
        nameField: noopReactComponent(),
        emailField: noopReactComponent()
      };

      component = instanceRender(<ChatSocialLogin {...componentArgs} />);

      spyOn(component, 'renderSocialLoginField');

      result = component.renderDefaultProfileFields();
    });

    it('calls renderSocialLoginField', () => {
      expect(component.renderSocialLoginField)
        .toHaveBeenCalled();
    });

    it('renders props.nameField', () => {
      const element = result.props.children[0];

      expect(element)
        .toEqual(componentArgs.nameField);
    });

    it('renders props.emailField', () => {
      const element = result.props.children[2];

      expect(element)
        .toEqual(componentArgs.emailField);
    });
  });

  describe('renderAuthedProfileField', () => {
    let result,
      componentArgs;

    beforeEach(() => {
      const component = instanceRender(<ChatSocialLogin {...componentArgs} />);

      result = component.renderAuthedProfileField();
    });

    describe('when the screen is pending logout', () => {
      beforeAll(() => {
        componentArgs = {
          socialLogin: {
            screen: CHAT_SOCIAL_LOGIN_SCREENS.LOGOUT_PENDING
          }
        };
      });

      it('renders a LoadingSpinner', () => {
        const authContainer = result.props.children[1];
        const targetElement = authContainer.props.children[2];

        expect(TestUtils.isElementOfType(targetElement, LoadingSpinner))
          .toEqual(true);
      });
    });

    describe('when the screen is not pending logout', () => {
      beforeAll(() => {
        componentArgs = {
          socialLogin: {
            screen: CHAT_SOCIAL_LOGIN_SCREENS.LOGOUT_SUCCESS
          }
        };
      });

      it('renders an Icon', () => {
        const authContainer = result.props.children[1];
        const targetElement = authContainer.props.children[2];

        expect(TestUtils.isElementOfType(targetElement, Icon))
          .toEqual(true);
      });
    });
  });
});
