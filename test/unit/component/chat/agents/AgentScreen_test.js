describe('AgentScreen component', () => {
  let AgentScreen;

  const chatPath = buildSrcPath('component/chat/agents/AgentScreen');

  const updateChatScreenSpy = jasmine.createSpy('updateChatScreen');

  const Button = noopReactComponent('Button');
  const ZendeskLogo = noopReactComponent('ZendeskLogo');

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      './AgentScreen.scss': {
        locals: {
          scrollContainerMobile: 'scrollContainerMobileClasses',
          scrollContainerMessagesContent: 'scrollContainerMessagesContentClass',
          scrollContainerMessagesContentDesktop: 'scrollContainerMessagesContentDesktopClass',
          scrollContainer: 'scrollContainerClasses',
          scrollContainerContent: 'scrollContainerContentClasses',
          agentListBackButton: 'agentListBackButtonClasses',
          mobileContainer: 'mobileContainerClasses',
          logoFooter: 'logoFooterClasses',
          zendeskLogo: 'zendeskLogoClasses',
          agentListBackButtonWithLogo: 'agentListBackButtonWithLogoClasses'
        }
      },
      'component/button/Button': {
        Button
      },
      'component/ZendeskLogo': {
        ZendeskLogo
      },
      'component/chat/agents/AgentList': {
        AgentList: noopReactComponent()
      },
      'component/container/ScrollContainer': {
        ScrollContainer: scrollContainerComponent()
      },
      'src/redux/modules/chat': {
        updateChatScreen: updateChatScreenSpy
      },
      'src/redux/modules/chat/chat-selectors': {
        getPrechatFormFields: noop
      },
      'src/redux/modules/chat/chat-history-selectors': {
        getHasMoreHistory: noop
      },
      'src/redux/modules/chat/chat-screen-types': {
        CHATTING_SCREEN: 'CHATTING_SCREEN'
      },
      'service/i18n': {
        i18n: {
          t: _.identity,
          isRTL: () => {}
        }
      }
    });

    mockery.registerAllowable(chatPath);
    AgentScreen = requireUncached(chatPath).default.WrappedComponent;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();

    updateChatScreenSpy.calls.reset();
  });

  describe('render', () => {
    let component,
      isMobile = false,
      hideZendeskLogo = false;

    beforeEach(() => {
      component = instanceRender(
        <AgentScreen
          isMobile={isMobile}
          hideZendeskLogo={hideZendeskLogo}
          updateChatScreen={updateChatScreenSpy} />
      ).render();
    });

    describe('for non mobile devices', () => {
      beforeAll(() => {
        isMobile = false;
      });

      it('does not add the scrollContainerMobile class to it', () => {
        expect(component.props.classes)
          .not
          .toContain('mobileContainerClasses');
      });
    });

    describe('for mobile devices', () => {
      beforeAll(() => {
        isMobile = true;
      });

      it('adds mobile classes to the scrollContainer', () => {
        expect(component.props.classes)
          .toContain('mobileContainerClasses');
      });
    });

    describe('the scroll container wrapper', () => {
      beforeAll(() => {
        isMobile = false;
      });

      it('has its classes prop to the scroll container style', () => {
        expect(component.props.classes)
          .toEqual('scrollContainerClasses');
      });

      it('has its containerClasses prop to the scrollContainerContent style', () => {
        expect(component.props.containerClasses)
          .toEqual('scrollContainerContentClasses');
      });

      describe('the footerContent', () => {
        let footerContent;

        beforeEach(() => {
          footerContent = component.props.footerContent;
        });

        it('is a button', () => {
          expect(TestUtils.isElementOfType(footerContent, Button))
            .toEqual(true);
        });

        it('has its className set to agentListBackButton', () => {
          expect(footerContent.props.className)
            .toContain('agentListBackButtonClasses');
        });

        it('has its label set correctly', () => {
          expect(footerContent.props.label)
            .toEqual('embeddable_framework.chat.agentList.button.backToChat');
        });

        describe('the onClick prop', () => {
          beforeEach(() => {
            footerContent.props.onClick();
          });

          it('calls updateChatScreen with chatting screen', () => {
            expect(updateChatScreenSpy)
              .toHaveBeenCalledWith('CHATTING_SCREEN');
          });
        });
      });
    });

    describe('hideZendeskLogo', () => {
      describe('when hideZendeskLogo is false', () => {
        it('renders footer with correct class', () => {
          expect(component.props.footerContent.props.className)
            .toContain('agentListBackButtonWithLogoClasses');
        });
      });

      describe('when hideZendeskLogo is true', () => {
        beforeAll(() => {
          hideZendeskLogo = true;
        });

        it('renders footer with correct class', () => {
          expect(component.props.footerContent.props.className)
            .not.toContain('agentListBackButtonWithLogoClasses');
        });
      });
    });
  });
});
