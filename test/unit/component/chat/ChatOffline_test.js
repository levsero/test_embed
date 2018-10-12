describe('ChatOffline component', () => {
  let ChatOffline;
  const ChatOfflinePath = buildSrcPath('component/chat/ChatOffline');

  const Button = noopReactComponent();
  const ChatOfflineForm = noopReactComponent();

  const mockTitle = 'My custom title';

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      './ChatOffline.scss': {
        locals: {
          container: 'containerClass',
          offlineGreeting: 'offlineGreetingClass',
          submitButton: 'submitButtonClass',
          scrollContainerContent: 'scrollContainerContentClass',
          logoFooter: 'logoFooterClass',
          noZendeskLogoButton: 'noZendeskLogoButton',
          zendeskLogoButton: 'zendeskLogoButton'
        }
      },
      'service/i18n': {
        i18n: {
          t: _.identity,
          isRTL: () => {}
        }
      },
      'component/container/ScrollContainer': {
        ScrollContainer: noopReactComponent()
      },
      '@zendeskgarden/react-buttons': { Button },
      'component/chat/ChatOfflineForm': { ChatOfflineForm },
      'src/redux/modules/chat': {
        ChatOfflineFormChanged: ''
      },
      'src/redux/modules/chat/chat-selectors': {
        getChatOfflineForm: '',
        getOfflineFormFields: ''
      },
      'src/redux/modules/base/base-selectors': {
        getWidgetShown: ''
      },
      'constants/chat': {
        OFFLINE_FORM_SCREENS: {
          OPERATING_HOURS: 'OPERATING_HOURS',
          SUCCESS: 'SUCCESS'
        }
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
      mockFormSettings;

    beforeEach(() => {
      component = instanceRender(<ChatOffline formSettings={mockFormSettings}/>);

      spyOn(component, 'renderOfflineForm');
      spyOn(component, 'renderChatOfflineScreen');

      component.render();
    });

    describe('when formSettings is enabled', () => {
      beforeAll(() => {
        mockFormSettings = { enabled: true };
      });

      it('calls renderOfflineForm', () => {
        expect(component.renderOfflineForm)
          .toHaveBeenCalled();
      });
    });

    describe('when formSettings is not enabled', () => {
      beforeAll(() => {
        mockFormSettings = { enabled: false };
      });

      it('calls renderChatOfflineScreen', () => {
        expect(component.renderChatOfflineScreen)
          .toHaveBeenCalled();
      });
    });
  });

  describe('renderOfflineForm', () => {
    let result,
      titleProp;

    beforeEach(() => {
      const component = instanceRender(<ChatOffline title={titleProp} />);

      result = component.renderOfflineForm();
    });

    it('renders ChatOfflineForm', () => {
      expect(TestUtils.isElementOfType(result, ChatOfflineForm))
        .toEqual(true);
    });

    describe('when title is provided', () => {
      beforeAll(() => {
        titleProp = mockTitle;
      });

      it('passes the correct title down', () => {
        expect(result.props.title)
          .toEqual(mockTitle);
      });
    });

    describe('when title is not provided', () => {
      beforeAll(() => {
        titleProp = '';
      });

      it('passes the default title down', () => {
        expect(result.props.title)
          .toBeTruthy();
      });
    });
  });

  describe('renderChatOfflineScreen', () => {
    let result,
      titleProp;

    beforeEach(() => {
      const component = instanceRender(<ChatOffline title={titleProp} />);

      result = component.renderChatOfflineScreen();
    });

    describe('when title is provided', () => {
      beforeAll(() => {
        titleProp = mockTitle;
      });

      it('passes the correct title down', () => {
        expect(result.props.title)
          .toEqual(mockTitle);
      });
    });

    describe('when title is not provided', () => {
      beforeAll(() => {
        titleProp = '';
      });

      it('passes the default title down', () => {
        expect(result.props.title)
          .toBeTruthy();
      });
    });
  });
});
