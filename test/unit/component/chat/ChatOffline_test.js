describe('ChatOffline component', () => {
  let ChatOffline;
  const ChatOfflinePath = buildSrcPath('component/chat/ChatOffline');
  const ZendeskLogo = noopReactComponent('ZendeskLogo');

  const Button = noopReactComponent();

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
      'component/ZendeskLogo': {
        ZendeskLogo
      },
      'component/button/Button': { Button },
      'component/chat/ChatOfflineForm': {
        ChatOfflineForm: noopReactComponent()
      },
      'src/redux/modules/chat': {
        ChatOfflineFormChanged: ''
      },
      'src/redux/modules/chat/chat-selectors': {
        getChatOfflineForm: '',
        getOfflineFormFields: ''
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

  describe('renderZendeskLogo', () => {
    let chatOffline,
      result,
      mockHideZendeskLogo,
      mockIsMobile;

    beforeEach(() => {
      chatOffline = domRender(<ChatOffline hideZendeskLogo={mockHideZendeskLogo} isMobile={mockIsMobile} />);
      result = chatOffline.renderZendeskLogo();
    });

    describe('when hideZendeskLogo is true', () => {
      beforeAll(() => {
        mockHideZendeskLogo = true;
      });

      describe('when isMobile is true', () => {
        beforeAll(() => {
          mockIsMobile = true;
        });

        it('does not render zendesk logo', () => {
          expect(result)
            .toBeFalsy();
        });
      });

      describe('when isMobile is false', () => {
        beforeAll(() => {
          mockIsMobile = false;
        });

        it('does not render zendesk logo', () => {
          expect(result)
            .toBeFalsy();
        });
      });
    });

    describe('when hideZendeskLogo is false', () => {
      beforeAll(() => {
        mockHideZendeskLogo = false;
      });

      describe('when isMobile is true', () => {
        beforeAll(() => {
          mockIsMobile = true;
        });

        it('does not render zendesk logo', () => {
          expect(result)
            .toBeFalsy();
        });
      });

      describe('when isMobile is false', () => {
        beforeAll(() => {
          mockIsMobile = false;
        });

        it('renders zendesk logo', () => {
          expect(TestUtils.isElementOfType(result, ZendeskLogo))
            .toEqual(true);
        });
      });
    });
  });

  describe('renderFooterContent', () => {
    let chatOffline,
      result,
      mockOfflineMessage,
      mockNewHeight,
      mockHideZendeskLogo,
      mockIsMobile;

    beforeEach(() => {
      chatOffline = instanceRender(<ChatOffline
        newHeight={mockNewHeight}
        offlineMessage={mockOfflineMessage}
        isMobile={mockIsMobile}
        hideZendeskLogo={mockHideZendeskLogo} />);
      result = chatOffline.renderFooterContent();
    });

    describe('when screen is not OFFLINE_FORM_SCREENS.SUCCESS', () => {
      beforeAll(() => {
        mockOfflineMessage = {
          screen: 'yoloScreen'
        };
      });

      it('does not render footer content', () => {
        expect(result)
          .toBeFalsy();
      });
    });

    describe('when newHeight is false', () => {
      beforeAll(() => {
        mockNewHeight = false;
      });

      it('does not render footer content', () => {
        expect(result)
          .toBeFalsy();
      });
    });

    describe('when footer content required', () => {
      beforeAll(() => {
        mockNewHeight = true;
        mockOfflineMessage = {
          screen: 'SUCCESS'
        };
      });

      describe('when on mobile', () => {
        beforeAll(() => {
          mockIsMobile = true;
        });

        it('renders noZendeskLogoButton class', () => {
          expect(result.props.className)
            .toContain('noZendeskLogoButton');
        });

        it('does not render zendeskLogoButton class', () => {
          expect(result.props.className)
            .not
            .toContain('zendeskLogoButton');
        });
      });

      describe('when hideZendeskLogo is true', () => {
        beforeAll(() => {
          mockHideZendeskLogo = true;
        });

        it('renders noZendeskLogoButton', () => {
          expect(result.props.className)
            .toContain('noZendeskLogoButton');
        });

        it('does not renders zendeskLogoButton', () => {
          expect(result.props.className)
            .not
            .toContain('zendeskLogoButton');
        });
      });

      describe('when zendesk logo required', () => {
        beforeAll(() => {
          mockHideZendeskLogo = false;
          mockIsMobile = false;
        });

        it('renders zendeskLogoButton', () => {
          expect(result.props.className)
            .toContain('zendeskLogoButton');
        });

        it('does not render noZendeskLogoButton', () => {
          expect(result.props.className)
            .not
            .toContain('noZendeskLogoButton');
        });
      });
    });
  });

  describe('render', () => {
    let component,
      result;

    beforeEach(() => {
      component = instanceRender(<ChatOffline />);
      spyOn(component, 'renderFooterContent');
      spyOn(component, 'renderZendeskLogo');
      result = component.render();
    });

    it('calls renderZendeskLogo', () => {
      expect(component.renderZendeskLogo)
        .toHaveBeenCalled();
    });

    it('calls renderFooterContent', () => {
      expect(component.renderFooterContent)
        .toHaveBeenCalled();
    });

    it('has a props.containerClasses value', () => {
      expect(result.props.children[0].props.containerClasses)
        .toEqual('scrollContainerContentClass');
    });

    it('has a props.classes value', () => {
      expect(result.props.children[0].props.classes)
        .toEqual('scrollContainerClass');
    });

    it('has a props.title value', () => {
      expect(result.props.children[0].props.title)
        .toEqual('embeddable_framework.chat.title');
    });

    describe('when the isMobile prop is true', () => {
      beforeEach(() => {
        component = instanceRender(<ChatOffline isMobile={true} />);

        result = component.render();
      });

      it('passes the mobile styles to the classes prop', () => {
        expect(result.props.children[0].props.classes)
          .toContain('mobileContainerClass');
      });
    });

    describe('when the newHeight prop is false', () => {
      beforeEach(() => {
        component = instanceRender(<ChatOffline newHeight={false} />);

        result = component.render();
      });

      it('passes the scrollContainer styles to the classes prop', () => {
        expect(result.props.children[0].props.classes)
          .toContain('scrollContainerClass');
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
