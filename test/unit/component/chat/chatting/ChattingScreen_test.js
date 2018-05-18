describe('ChattingScreen component', () => {
  let ChattingScreen,
    isIE,
    isFirefox;

  const chatPath = buildSrcPath('component/chat/chatting/ChattingScreen');

  const updateChatScreenSpy = jasmine.createSpy('updateChatScreen');
  const translationSpy = jasmine.createSpy('translation').and.callFake(_.identity);
  const resetCurrentMessageSpy = jasmine.createSpy('resetCurrentMessage');
  const isDefaultNicknameSpy = jasmine.createSpy('isDefaultNicknameSpy').and.returnValue(false);

  const Button = noopReactComponent('Button');
  const LoadingSpinner = noopReactComponent('LoadingSpinner');
  const ZendeskLogo = noopReactComponent('ZendeskLogo');

  beforeEach(() => {
    mockery.enable();

    isIE = false;
    isFirefox = false;

    initMockRegistry({
      './ChattingScreen.scss': {
        locals: {
          scrollContainerMobile: 'scrollContainerMobileClasses',
          scrollContainerMessagesContent: 'scrollContainerMessagesContentClass',
          scrollContainerMessagesContentDesktop: 'scrollContainerMessagesContentDesktopClass',
          footer: 'footerClasses',
          footerMobile: 'footerMobileClasses',
          footerMobileWithLogo: 'footerMobileWithLogoClasses',
          agentTyping: 'agentTypingClasses',
          scrollContainer: 'scrollContainerClasses',
          scrollContainerContent: 'scrollContainerContentClasses',
          scrollBarFix: 'scrollBarFix',
          mobileContainer: 'mobileContainerClasses',
          logoFooter: 'logoFooterClasses',
          zendeskLogo: 'zendeskLogoClasses',
          zendeskLogoChatMobile: 'zendeskLogoChatMobileClasses',
          historyFetchingContainer: 'historyFetchingContainerClasses'
        }
      },
      'component/loading/LoadingSpinner': {
        LoadingSpinner
      },
      'component/button/Button': {
        Button
      },
      'component/ZendeskLogo': {
        ZendeskLogo
      },
      'component/chat/ChatBox': {
        ChatBox: noopReactComponent()
      },
      'component/chat/ChatHeader': {
        ChatHeader: noopReactComponent()
      },
      'component/chat/ChatFooter': {
        ChatFooter: noopReactComponent()
      },
      'component/chat/ChatLog': {
        ChatLog: noopReactComponent()
      },
      'component/chat/ChatHistoryLog': {
        ChatHistoryLog: noopReactComponent()
      },
      'component/loading/LoadingEllipses': {
        LoadingEllipses: noopReactComponent()
      },
      'component/container/ScrollContainer': {
        ScrollContainer: scrollContainerComponent()
      },
      'src/redux/modules/chat': {
        sendMsg: noop,
        handleChatBoxChange: noop,
        updateChatScreen: updateChatScreenSpy,
        resetCurrentMessage: resetCurrentMessageSpy
      },
      'src/redux/modules/chat/chat-selectors': {
        getPrechatFormFields: noop
      },
      'src/redux/modules/chat/chat-history-selectors': {
        getHasMoreHistory: noop
      },
      'src/redux/modules/chat/chat-screen-types': {
        FEEDBACK_SCREEN: 'FEEDBACK_SCREEN',
        AGENT_LIST_SCREEN: 'AGENT_LIST_SCREEN'
      },
      'service/i18n': {
        i18n: {
          t: translationSpy,
          isRTL: () => {}
        }
      },
      'utility/devices': {
        isIE: () => isIE,
        isFirefox: () => isFirefox
      },
      'src/util/chat': {
        isDefaultNickname: isDefaultNicknameSpy
      }
    });

    mockery.registerAllowable(chatPath);
    ChattingScreen = requireUncached(chatPath).default.WrappedComponent;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();

    updateChatScreenSpy.calls.reset();
    translationSpy.calls.reset();
  });

  describe('componentDidUpdate', () => {
    let component,
      componentProps,
      prevProps,
      scrollToSpy,
      mockGetScrollHeight,
      mockChatScrolledToBottom,
      mockScrollHeightAtFetch,
      mockChatScrollPos;

    beforeEach(() => {
      scrollToSpy = jasmine.createSpy('scrollTo');

      component = instanceRender(<ChattingScreen {...componentProps} />);
      component.scrollContainer = {
        scrollTo: scrollToSpy,
        getScrollHeight: mockGetScrollHeight
      };
      component.chatScrolledToBottom = mockChatScrolledToBottom;
      component.scrollHeightAtFetch = mockScrollHeightAtFetch;
      component.chatScrollPos = mockChatScrollPos;

      spyOn(component, 'scrollToBottom');

      component.componentDidUpdate(prevProps);
    });

    describe('when chatScrolledToBottom has a value', () => {
      beforeAll(() => {
        mockChatScrolledToBottom = 500;
      });

      it('calls scrollToBottom', () => {
        expect(component.scrollToBottom)
          .toHaveBeenCalled();
      });
    });

    describe('when chatScrolledToBottom does not have a value', () => {
      beforeAll(() => {
        mockChatScrolledToBottom = null;
        mockGetScrollHeight = noop;
        componentProps = { chats: [], events: [] };
        prevProps = { chats: [], events: [] };
      });

      it('does not call scrollToBottom', () => {
        expect(component.scrollToBottom)
          .not.toHaveBeenCalled();
      });
    });

    describe('when scrollContainer height has changed since fetching data', () => {
      beforeAll(() => {
        componentProps = { chats: [], events: [] };
        prevProps = { chats: [], events: [] };
        mockGetScrollHeight = () => 10;
        mockScrollHeightAtFetch = 5;
        mockChatScrollPos = 1;
      });

      it('calls scrollTo on scrollContainer with an expected value', () => {
        const difference = mockGetScrollHeight() - mockScrollHeightAtFetch;
        const expected = mockChatScrollPos + difference;

        expect(scrollToSpy)
          .toHaveBeenCalledWith(expected);
      });
    });

    describe('when scrollContainer height has not changed since fetching data', () => {
      beforeAll(() => {
        componentProps = { chats: [], events: [] };
        prevProps = { chats: [], events: [] };
        mockGetScrollHeight = () => 10;
        mockScrollHeightAtFetch = 10;
        mockChatScrollPos = 1;
      });

      it('does not call scrollTo on scrollContainer', () => {
        expect(scrollToSpy)
          .not.toHaveBeenCalled();
      });
    });

    describe('when the chat log count has changed', () => {
      beforeAll(() => {
        const previousLog = { chats: [], events: [] };
        const latestLog = {
          chats: [{ type: 'chat.msg', msg: 'Hello' }],
          events: []
        };

        componentProps = { ...latestLog };
        prevProps = { ...previousLog };
        mockGetScrollHeight = noop;
      });

      it('calls scrollToBottom', () => {
        expect(component.scrollToBottom)
          .toHaveBeenCalled();
      });
    });

    describe('when the chat log count has not changed', () => {
      beforeAll(() => {
        const previousLog = { chats: [], events: [] };
        const latestLog = { chats: [], events: [] };

        componentProps = { ...latestLog };
        prevProps = { ...previousLog };
        mockGetScrollHeight = noop;
      });

      it('does not call scrollToBottom', () => {
        expect(component.scrollToBottom)
          .not.toHaveBeenCalled();
      });
    });
  });

  describe('componentDidMount', () => {
    let component,
      chats,
      events;

    beforeEach(() => {
      component = instanceRender(<ChattingScreen chats={chats} events={events} />);
      spyOn(component, 'scrollToBottom');
      component.componentDidMount();
    });

    describe('when there are chats', () => {
      beforeAll(() => {
        chats = [1,2];
        events = [3];
      });

      it('scrolls to bottom', () => {
        expect(component.scrollToBottom)
          .toHaveBeenCalled();
      });
    });

    describe('when there are no chats', () => {
      beforeAll(() => {
        chats = [];
        events = [];
      });

      it('does not scroll to bottom', () => {
        expect(component.scrollToBottom)
          .not.toHaveBeenCalled();
      });
    });
  });

  describe('render', () => {
    let component, result;
    const renderChatComponent = ({
      ratingsEnabled = false,
      agents = {},
      isMobile = false,
      hideZendeskLogo = false
    }) => (
      instanceRender(
        <ChattingScreen
          ratingSettings={{ enabled: ratingsEnabled }}
          activeAgents={agents}
          isMobile={isMobile}
          hideZendeskLogo={hideZendeskLogo} />
      )
    );

    beforeEach(() => {
      component = renderChatComponent({
        ratingsEnabled: true
      });
    });

    describe('footer classnames', () => {
      describe('on non-mobile devices', () => {
        it('has desktop specific classes', () => {
          result = component.render();
          expect(result.props.footerClasses)
            .toContain('footerClasses');
          expect(result.props.footerClasses)
            .not.toContain('footerMobileClasses');
          expect(result.props.footerClasses)
            .not.toContain('footerMobileWithLogoClasses');
        });
      });

      describe('on mobile devices with logo', () => {
        beforeEach(() => {
          component = renderChatComponent({
            isMobile: true
          });
        });

        it('has mobile specific classes', () => {
          result = component.render();
          expect(result.props.footerClasses)
            .toContain('footerClasses');
          expect(result.props.footerClasses)
            .toContain('footerMobileClasses');
          expect(result.props.footerClasses)
            .toContain('footerMobileWithLogoClasses');
        });
      });

      describe('on mobile devices without logo', () => {
        beforeEach(() => {
          component = renderChatComponent({
            isMobile: true,
            hideZendeskLogo: true
          });
        });

        it('has mobile specific classes', () => {
          result = component.render();
          expect(result.props.footerClasses)
            .toContain('footerClasses');
          expect(result.props.footerClasses)
            .toContain('footerMobileClasses');
          expect(result.props.footerClasses)
            .not.toContain('footerMobileWithLogoClasses');
        });
      });
    });

    describe('zendeskLogo', () => {
      let logo;

      const findLogo = (parent) => {
        const firstLevelChildren = React.Children.map(
          parent.props.children, child => child
        );
        const secondLevelChildren = React.Children.map(
          firstLevelChildren[0].props.children, child => child
        );

        return _.find(secondLevelChildren, child => {
          return TestUtils.isElementOfType(child, ZendeskLogo);
        });
      };

      describe('on non-mobile devices with logo', () => {
        it('renders logo', () => {
          result = component.render();
          logo = findLogo(result);
          expect(logo)
            .toBeTruthy();
        });

        it('renders logo with desktop specific classes', () => {
          result = component.render();
          logo = findLogo(result);
          expect(logo.props.className)
            .toContain('zendeskLogoClasses');
          expect(logo.props.className)
            .not.toContain('zendeskLogoChatMobileClasses');
        });
      });

      describe('on non-mobile devices without logo', () => {
        beforeEach(() => {
          component = renderChatComponent({
            hideZendeskLogo: true
          });
        });

        it('does not render logo', () => {
          result = component.render();
          logo = findLogo(result);
          expect(logo)
            .toBeFalsy();
        });
      });

      describe('on mobile devices without logo', () => {
        beforeEach(() => {
          component = renderChatComponent({
            isMobile: true,
            hideZendeskLogo: true
          });
        });

        it('does not render logo', () => {
          result = component.render();
          logo = findLogo(result);
          expect(logo)
            .toBeFalsy();
        });
      });

      describe('on mobile devices with logo and no typing agent', () => {
        beforeEach(() => {
          component = renderChatComponent({
            isMobile: true
          });
        });

        it('renders logo', () => {
          result = component.render();
          logo = findLogo(result);
          expect(logo)
            .toBeTruthy();
        });

        it('renders logo with mobile specific classes', () => {
          result = component.render();
          logo = findLogo(result);
          expect(logo.props.className)
            .toContain('zendeskLogoClasses');
          expect(logo.props.className)
            .toContain('zendeskLogoChatMobileClasses');
        });
      });

      describe('on mobile devices with logo and typing agent', () => {
        beforeEach(() => {
          component = renderChatComponent({
            agentsTyping: [{ nick: 'agent:1', typing: true }],
            isMobile: true
          });
        });

        it('renders logo with mobile specific classes', () => {
          result = component.render();
          logo = findLogo(result);
          expect(logo)
            .toBeTruthy();
        });
      });
    });

    describe('the renderChatHeader call', () => {
      beforeEach(() => {
        component = instanceRender(<ChattingScreen />);
        spyOn(component, 'renderChatHeader');
        component.render();
      });

      it('calls renderChatHeader', () => {
        expect(component.renderChatHeader)
          .toHaveBeenCalled();
      });
    });

    describe('when state.lastAgentLeaveEvent contains an event', () => {
      const leaveEvent = {nick: 'agent:123', type: 'chat.memberleave'};

      beforeEach(() => {
        component = instanceRender(
          <ChattingScreen
            lastAgentLeaveEvent={leaveEvent} />
        );
      });

      it("passes the event to the chatLog component's `lastAgentLeaveEvent` prop", () => {
        const scrollContainer = component.render().props.children;
        const chatLog = scrollContainer.props.children[1];
        const lastAgentLeaveEvent = chatLog.props.lastAgentLeaveEvent;

        expect(lastAgentLeaveEvent)
          .toEqual(leaveEvent);
      });
    });

    describe('when state.lastAgentLeaveEvent does not contain an event', () => {
      const leaveEvent = null;

      beforeEach(() => {
        component = instanceRender(
          <ChattingScreen
            lastAgentLeaveEvent={leaveEvent} />
        );
      });

      it("passes null to the chatLog component's `lastAgentLeaveEvent` prop", () => {
        const scrollContainer = component.render().props.children;
        const chatLog = scrollContainer.props.children[1];
        const lastAgentLeaveEvent = chatLog.props.lastAgentLeaveEvent;

        expect(lastAgentLeaveEvent)
          .toEqual(null);
      });
    });

    describe('for non mobile devices', () => {
      beforeEach(() => {
        component = instanceRender(<ChattingScreen />);
      });

      it('adds the scrollContainerMessagesContentDesktop to it', () => {
        expect(component.render().props.containerClasses)
          .toContain('scrollContainerMessagesContentDesktopClass');
      });

      it('does not add the scrollContainerMobile class to it', () => {
        expect(component.render().props.containerClasses)
          .not
          .toContain('scrollContainerMobileClasses');
      });

      it('does not add scrollContainerMessagesContent class to it', () => {
        expect(component.render().props.containerClasses)
          .not
          .toContain('scrollContainerMessagesContentClass');
      });
    });

    describe('for mobile devices', () => {
      beforeEach(() => {
        component = instanceRender(<ChattingScreen isMobile={true} />);
      });

      it('does not add the scrollContainerMessagesContentDesktop to it', () => {
        expect(component.render().props.containerClasses)
          .not
          .toContain('scrollContainerMessagesContentDesktopClass');
      });

      it('adds mobile container classes to scrollContainer', () => {
        expect(component.render().props.containerClasses)
          .toContain('scrollContainerMobileClasses');
      });

      it('adds scrollContainerMessagesContent class to it', () => {
        expect(component.render().props.containerClasses)
          .toContain('scrollContainerMessagesContentClass');
      });
    });

    describe('when the browser is Firefox', () => {
      beforeEach(() => {
        isFirefox = true;
        component = instanceRender(<ChattingScreen />);
      });

      it('adds the scrollbar fix classes to scrollContainer', () => {
        expect(component.render().props.containerClasses)
          .toContain('scrollBarFix');
      });
    });

    describe('when the browser is Internet Explorer', () => {
      beforeEach(() => {
        isIE = true;
        component = instanceRender(<ChattingScreen />);
      });

      it('adds the scrollbar fix classes to scrollContainer', () => {
        expect(component.render().props.containerClasses)
          .toContain('scrollBarFix');
      });
    });

    describe('the scroll container wrapper', () => {
      beforeEach(() => {
        component = instanceRender(<ChattingScreen />);
      });

      it('has its classes prop to the scroll container style', () => {
        expect(component.render().props.classes)
          .toEqual('scrollContainerClasses');
      });
    });

    describe('showUpdateInfo', () => {
      let loginSettings,
        visitor,
        result,
        showUpdateInfoResult;

      beforeEach(() => {
        component = instanceRender(
          <ChattingScreen
            loginSettings={loginSettings}
            visitor={visitor}
          />);
        result = component.render();
        showUpdateInfoResult = result.props.children.props.children[1].props.showUpdateInfo;
      });

      describe('when login settings enabled is not true', () => {
        beforeAll(() => {
          loginSettings = {
            enabled: false
          };
        });

        it('should not show update info link', () => {
          expect(showUpdateInfoResult)
            .toEqual(false);
        });
      });

      describe('when login settings enabled is true', () => {
        beforeAll(() => {
          loginSettings = {
            enabled: true
          };
        });

        describe('when visitorNameSet is true', () => {
          describe('when emailSet is true', () => {
            beforeAll(() => {
              visitor = {
                display_name: 'yolo',
                email: 'yolo@yolo.com'
              };
            });

            it('should not show update info link', () => {
              expect(showUpdateInfoResult)
                .toEqual(false);
            });

            it('should call isDefaultNickname', () => {
              expect(isDefaultNicknameSpy)
                .toHaveBeenCalledWith('yolo');
            });
          });

          describe('when emailSet is not true', () => {
            beforeAll(() => {
              visitor = {
                display_name: 'yolo'
              };
            });

            it('should not show update info link', () => {
              expect(showUpdateInfoResult)
                .toEqual(false);
            });
          });
        });

        describe('when visitorNameSet is not true', () => {
          describe('when emailSet is true', () => {
            beforeAll(() => {
              visitor = {
                email: 'yolo@yolo.com'
              };
            });

            it('should not show update info link', () => {
              expect(showUpdateInfoResult)
                .toEqual(false);
            });
          });

          describe('when emailSet is not true', () => {
            beforeAll(() => {
              visitor = {};
            });

            it('should show update info link', () => {
              expect(showUpdateInfoResult)
                .toEqual(true);
            });
          });
        });
      });
    });
  });

  describe('renderQueuePosition', () => {
    let queuePositionComponent, queuePosition, mockAgents;

    describe('when there is no agent in the chat', () => {
      beforeEach(() => {
        mockAgents = {};
      });

      describe('when the queuePosition prop is greater than zero', () => {
        const translationKey = 'embeddable_framework.chat.chatLog.queuePosition';

        beforeEach(() => {
          queuePosition = 5;
          const component = instanceRender(<ChattingScreen activeAgents={mockAgents} queuePosition={queuePosition} />);

          queuePositionComponent = component.renderQueuePosition();
        });

        it('calls the i18n translate function with the correct key and value', () => {
          expect(translationSpy)
            .toHaveBeenCalledWith(translationKey, { value: queuePosition });
        });

        it('returns a component displaying the result of the i18n translate call', () => {
          const expectedContent = translationSpy(translationKey, { value: queuePosition });

          expect(queuePositionComponent.props.children)
            .toEqual(expectedContent);
        });
      });

      describe('when the queuePosition prop is zero', () => {
        beforeEach(() => {
          queuePosition = 0;
          const component = instanceRender(<ChattingScreen activeAgents={mockAgents} queuePosition={queuePosition} />);

          queuePositionComponent = component.renderQueuePosition();
        });

        it('returns null', () => {
          expect(queuePositionComponent)
            .toBeNull();
        });
      });
    });

    describe('when there is an agent in the chat', () => {
      beforeEach(() => {
        mockAgents = {'agent123456': { display_name: 'Wayne', typing: false }};
        queuePosition = 5;
        const component = instanceRender(<ChattingScreen activeAgents={mockAgents} queuePosition={queuePosition} />);

        queuePositionComponent = component.renderQueuePosition();
      });

      it('returns null', () => {
        expect(queuePositionComponent)
          .toBeNull();
      });
    });
  });

  describe('renderAgentTyping', () => {
    let agentTypingComponent;

    describe('when no agents are typing a message', () => {
      beforeEach(() => {
        const mockTypingAgents = [];
        const component = instanceRender(<ChattingScreen chat={{ rating: null }} />);

        agentTypingComponent = component.renderAgentTyping(mockTypingAgents);
      });

      it('renders nothing', () => {
        expect(agentTypingComponent)
          .toBeNull();
      });
    });

    describe('when there is an agent typing a message', () => {
      beforeEach(() => {
        const mockTypingAgents = [
          { nick: 'agent:1', typing: true }
        ];
        const component = instanceRender(<ChattingScreen chat={{ rating: null }} />);

        agentTypingComponent = component.renderAgentTyping(mockTypingAgents);
      });

      it('renders the notification style', () => {
        expect(agentTypingComponent.props.className)
          .toEqual('agentTypingClasses');
      });

      it('renders a notification that signifies a single agent typing', () => {
        expect(agentTypingComponent.props.children[1])
          .toEqual('embeddable_framework.chat.chatLog.isTyping');
      });
    });

    describe('when two agents are typing a message', () => {
      beforeEach(() => {
        const mockTypingAgents = [
          { nick: 'agent:1', typing: true },
          { nick: 'agent:2', typing: true }
        ];
        const component = instanceRender(<ChattingScreen chat={{ rating: null }} />);

        agentTypingComponent = component.renderAgentTyping(mockTypingAgents);
      });

      it('renders the notification style', () => {
        expect(agentTypingComponent.props.className)
          .toEqual('agentTypingClasses');
      });

      it('renders a notification that signifies two agents typing', () => {
        expect(agentTypingComponent.props.children[1])
          .toEqual('embeddable_framework.chat.chatLog.isTyping_two');
      });
    });

    describe('when more than two agents are typing a message', () => {
      beforeEach(() => {
        const mockTypingAgents = [
          { nick: 'agent:1',  typing: true },
          { nick: 'agent:2',  typing: true },
          { nick: 'agent:3',  typing: true }
        ];

        const component = instanceRender(<ChattingScreen chat={{ rating: null }} />);

        agentTypingComponent = component.renderAgentTyping(mockTypingAgents);
      });

      it('renders the notification style', () => {
        expect(agentTypingComponent.props.className)
          .toEqual('agentTypingClasses');
      });

      it('renders a notification that signifies multiple agents typing', () => {
        expect(agentTypingComponent.props.children[1])
          .toEqual('embeddable_framework.chat.chatLog.isTyping_multiple');
      });
    });
  });

  describe('renderChatHeader', () => {
    let agentJoined,
      ratingSettings,
      agents,
      updateChatScreenSpy,
      chatHeaderComponent;

    beforeEach(() => {
      updateChatScreenSpy = jasmine.createSpy('updateChatScreen');

      const component = instanceRender(
        <ChattingScreen
          ratingSettings={ratingSettings}
          agentJoined={agentJoined}
          activeAgents={agents}
          updateChatScreen={updateChatScreenSpy} />
      );

      chatHeaderComponent = component.renderChatHeader();
    });

    describe('when there is an agent actively in the chat', () => {
      beforeAll(() => {
        agents = { 'agent:123456': { display_name: 'agent' } };
      });

      it('passes a function which calls updateChatScreen with agent list screen', () => {
        chatHeaderComponent.props.onAgentDetailsClick();

        expect(updateChatScreenSpy)
          .toHaveBeenCalledWith('AGENT_LIST_SCREEN');
      });
    });

    describe('when there is no agent actively in the chat', () => {
      beforeAll(() => {
        agents = {};
      });

      it('passes null to the onAgentDetailsClick prop', () => {
        expect(chatHeaderComponent.props.onAgentDetailsClick)
          .toBeNull();
      });
    });

    describe('when agent has joined', () => {
      beforeAll(() => {
        agentJoined = true;
      });

      describe('when rating settings enabled', () => {
        beforeAll(() => {
          ratingSettings = { enabled: true };
        });

        it('shows rating', () => {
          expect(chatHeaderComponent.props.showRating)
            .toEqual(true);
        });
      });

      describe('when rating settings not enabled', () => {
        beforeAll(() => {
          ratingSettings = { enabled: false };
        });

        it('does not show rating', () => {
          expect(chatHeaderComponent.props.showRating)
            .toEqual(false);
        });
      });
    });

    describe('when agent has not joined', () => {
      beforeAll(() => {
        agentJoined = false;
      });

      describe('when rating settings enabled', () => {
        beforeAll(() => {
          ratingSettings = { enabled: true };
        });

        it('does not show rating', () => {
          expect(chatHeaderComponent.props.showRating)
            .toEqual(false);
        });
      });

      describe('when rating settings not enabled', () => {
        beforeAll(() => {
          ratingSettings = { enabled: false };
        });

        it('does not show rating', () => {
          expect(chatHeaderComponent.props.showRating)
            .toEqual(false);
        });
      });
    });
  });

  describe('renderHistoryFetching', () => {
    let requestStatus,
      result;

    beforeEach(() => {
      const component = instanceRender(<ChattingScreen historyRequestStatus={requestStatus} />);

      result = component.renderHistoryFetching();
    });

    describe('when the request status is set to pending', () => {
      beforeAll(() => {
        requestStatus = 'pending';
      });

      it('returns a div with the expected class', () => {
        expect(result.props.className)
          .toEqual('historyFetchingContainerClasses');
      });
    });

    describe('when the request status is null', () => {
      beforeAll(() => {
        requestStatus = null;
      });

      it('returns null', () => {
        expect(result)
          .toBeNull();
      });
    });
  });

  describe('handleChatScreenScrolled', () => {
    let component,
      fetchConversationHistorySpy,
      getScrollHeightSpy;

    beforeEach(() => {
      fetchConversationHistorySpy = jasmine.createSpy('fetchConversationHistory');
      getScrollHeightSpy = jasmine.createSpy('getScrollHeight');

      component = instanceRender(<ChattingScreen hasMoreHistory={true} historyRequestStatus='not_pending' fetchConversationHistory={fetchConversationHistorySpy} />);
      component.scrollContainer = {
        isAtTop: () => true,
        getScrollHeight: getScrollHeightSpy
      };

      component.handleChatScreenScrolled();
    });

    it('calls props.fetchConversationHistory', () => {
      expect(fetchConversationHistorySpy)
        .toHaveBeenCalled();
    });

    it('calls getScrollHeight on scrollContainer', () => {
      expect(getScrollHeightSpy)
        .toHaveBeenCalled();
    });
  });
});
