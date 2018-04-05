describe('ChatOffline component', () => {
  let ChatOffline;
  const ChatOfflinePath = buildSrcPath('component/chat/ChatOffline');

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      './ChatOffline.scss': {
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
      'component/container/ScrollContainer': {
        ScrollContainer: noopReactComponent()
      },
      'component/button/Button': {
        Button: noopReactComponent()
      },
      'component/chat/ChatOfflineForm': {
        ChatOfflineForm: noopReactComponent()
      },
      'src/redux/modules/chat': {
        ChatOfflineFormChanged: ''
      },
      'src/redux/modules/chat/chat-selectors': {
        getChatOfflineForm: '',
        getOfflineFormFields: ''
      }
    });

    mockery.registerAllowable(ChatOfflinePath);
    ChatOffline = requireUncached(ChatOfflinePath).default.WrappedComponent;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('render', () => {
    let component,
      result;

    beforeEach(() => {
      component = instanceRender(<ChatOffline />);

      result = component.render();
    });

    it('has a props.containerClasses value', () => {
      expect(result.props.containerClasses)
        .toEqual('scrollContainerContentClass');
    });

    it('has a props.classes value', () => {
      expect(result.props.classes)
        .toEqual('scrollContainerClass');
    });

    it('has a props.title value', () => {
      expect(result.props.title)
        .toEqual('embeddable_framework.chat.title');
    });

    describe('when the isMobile prop is true', () => {
      beforeEach(() => {
        component = instanceRender(<ChatOffline isMobile={true} />);

        result = component.render();
      });

      it('passes the mobile styles to the classes prop', () => {
        expect(result.props.classes)
          .toContain('mobileContainerClass');
      });
    });
  });

  describe('renderOfflineForm', () => {
    let component,
      result;

    describe('when offline form is enabled', () => {
      beforeEach(() => {
        component = instanceRender(
          <ChatOffline
          formSettings={{ enabled: true }}
          operatingHours={{ account_schedule: [[456]] }}
          />);

        result = component.renderOfflineForm();
      });

      it('renders a ChatOfflineForm component', () => {
        expect(result)
          .toBeDefined();
      });

      it('relays an operatingHours prop', () => {
        expect(result.props.operatingHours)
          .toEqual({ account_schedule: [[456]] });
      });
    });

    describe('when offline form is disabled', () => {
      beforeEach(() => {
        component = instanceRender(<ChatOffline formSettings={{ enabled: false }} />);

        result = component.renderOfflineForm();
      });

      it('does not render a component', () => {
        expect(result)
          .not.toBeDefined();
      });
    });
  });

  describe('renderChatOfflineScreen', () => {
    let component,
      result;

    describe('when offline form is enabled', () => {
      beforeEach(() => {
        component = instanceRender(<ChatOffline formSettings={{ enabled: true }} />);

        result = component.renderChatOfflineScreen();
      });

      it('does not render a component', () => {
        expect(result)
          .not.toBeDefined();
      });
    });

    describe('when offline form is disabled', () => {
      beforeEach(() => {
        component = instanceRender(<ChatOffline formSettings={{ enabled: false }} />);

        result = component.renderChatOfflineScreen();
      });

      it('renders a component', () => {
        expect(result)
          .toBeDefined();
      });
    });
  });
});
