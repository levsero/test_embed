describe('ChattingScreen component', () => {
  let ChattingScreen,
    isIE,
    isFirefox,
    mockIsAgent,
    HISTORY_REQUEST_STATUS,
    SCROLL_BOTTOM_THRESHOLD;

  const chatPath = buildSrcPath('component/chat/chatting/ChattingScreen');

  const updateChatScreenSpy = jasmine.createSpy('updateChatScreen');
  const translationSpy = jasmine.createSpy('translation').and.callFake(_.identity);
  const resetCurrentMessageSpy = jasmine.createSpy('resetCurrentMessage');
  const isDefaultNicknameSpy = jasmine.createSpy('isDefaultNicknameSpy').and.returnValue(false);

  const Button = noopReactComponent('Button');
  const ButtonPill = noopReactComponent('ButtonPill');
  const LoadingSpinner = noopReactComponent('LoadingSpinner');
  const ZendeskLogo = noopReactComponent('ZendeskLogo');

  beforeEach(() => {
    mockery.enable();

    HISTORY_REQUEST_STATUS = {
      PENDING: 'pending',
      DONE:    'done',
      FAIL:    'fail'
    };
    SCROLL_BOTTOM_THRESHOLD = 150;
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
          historyFetchingContainer: 'historyFetchingContainerClasses',
          noAgentTyping: 'noAgentTypingClass'
        }
      },
      'component/loading/LoadingSpinner': {
        LoadingSpinner
      },
      'component/button/Button': {
        Button
      },
      'component/button/ButtonPill': {
        ButtonPill
      },
      'component/ZendeskLogo': {
        ZendeskLogo
      },
      'component/chat/chatting/ChatBox': {
        ChatBox: noopReactComponent()
      },
      'component/chat/ChatHeader': {
        ChatHeader: noopReactComponent()
      },
      'component/chat/chatting/ChattingFooter': {
        ChattingFooter: noopReactComponent()
      },
      'component/chat/chatting/ChatLog': {
        ChatLog: noopReactComponent()
      },
      'component/chat/chatting/HistoryLog': {
        HistoryLog: noopReactComponent()
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
      'constants/chat': {
        SCROLL_BOTTOM_THRESHOLD,
        HISTORY_REQUEST_STATUS
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
        isDefaultNickname: isDefaultNicknameSpy,
        isAgent: () => mockIsAgent
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

  describe('componentWillUpdate', () => {
    let component,
      componentProps,
      previousProps,
      getScrollHeightSpy,
      mockScrollHeightValue;

    beforeEach(() => {
      mockScrollHeightValue = 123;
      getScrollHeightSpy = jasmine.createSpy('getScrollHeight').and.returnValue(mockScrollHeightValue);

      component = instanceRender(<ChattingScreen {...componentProps} />);
      component.scrollContainer = {
        getScrollHeight: getScrollHeightSpy
      };

      component.componentWillUpdate(previousProps);
    });

    describe('when previous historyStatus is pending', () => {
      beforeAll(() => {
        previousProps = { historyRequestStatus: 'pending' };
      });

      describe('when current historyStatus is done', () => {
        beforeAll(() => {
          componentProps = { historyRequestStatus: 'done' };
        });

        it('calls getScrollHeight', () => {
          expect(getScrollHeightSpy)
            .toHaveBeenCalled();
        });

        it('sets scrollHeightBeforeUpdate instance variable', () => {
          expect(component.scrollHeightBeforeUpdate)
            .toEqual(mockScrollHeightValue);
        });
      });

      describe('when current historyStatus is not done', () => {
        beforeAll(() => {
          componentProps = { historyRequestStatus: 'pending' };
        });

        it('does not call getScrollHeight', () => {
          expect(getScrollHeightSpy)
            .not.toHaveBeenCalled();
        });

        it('does not set scrollHeightBeforeUpdate instance variable', () => {
          expect(component.scrollHeightBeforeUpdate)
            .toEqual(null);
        });
      });
    });

    describe('when previous historyStatus is not pending', () => {
      beforeAll(() => {
        previousProps = { historyRequestStatus: 'done' };
      });

      describe('when current historyStatus is done', () => {
        beforeAll(() => {
          componentProps = { historyRequestStatus: 'done' };
        });

        it('does not call getScrollHeight', () => {
          expect(getScrollHeightSpy)
            .not.toHaveBeenCalled();
        });

        it('does not set scrollHeightBeforeUpdate instance variable', () => {
          expect(component.scrollHeightBeforeUpdate)
            .toEqual(null);
        });
      });

      describe('when current historyStatus is not done', () => {
        beforeAll(() => {
          componentProps = { historyRequestStatus: 'pending' };
        });

        it('does not call getScrollHeight', () => {
          expect(getScrollHeightSpy)
            .not.toHaveBeenCalled();
        });

        it('does not set scrollHeightBeforeUpdate instance variable', () => {
          expect(component.scrollHeightBeforeUpdate)
            .toEqual(null);
        });
      });
    });
  });

  describe('componentDidUpdate', () => {
    let component,
      mockPrevProps;

    describe('when scrollContainer exists', () => {
      beforeEach(() => {
        mockPrevProps = { foo: 'bar' };

        component = instanceRender(<ChattingScreen />);
        component.scrollContainer = {};

        spyOn(component, 'didUpdateFetchHistory');
        spyOn(component, 'didUpdateNewEntry');

        component.componentDidUpdate(mockPrevProps);
      });

      it('calls didUpdateFetchHistory', () => {
        expect(component.didUpdateFetchHistory)
          .toHaveBeenCalled();
      });

      it('calls didUpdateNewEntry with expected args', () => {
        expect(component.didUpdateNewEntry)
          .toHaveBeenCalledWith(mockPrevProps);
      });
    });

    describe('when scrollContainer does not exist', () => {
      beforeEach(() => {
        mockPrevProps = { foo: 'bar' };

        component = instanceRender(<ChattingScreen />);
        component.scrollContainer = null;

        spyOn(component, 'didUpdateFetchHistory');
        spyOn(component, 'didUpdateNewEntry');

        component.componentDidUpdate(mockPrevProps);
      });

      it('does not call didUpdateFetchHistory', () => {
        expect(component.didUpdateFetchHistory)
          .not.toHaveBeenCalled();
      });

      it('does not call didUpdateNewEntry', () => {
        expect(component.didUpdateNewEntry)
          .not.toHaveBeenCalled();
      });
    });
  });

  describe('didUpdateFetchHistory', () => {
    let component,
      mockScrollTop,
      mockScrollHeight,
      mockScrollContainer,
      mockScrollHeightBeforeUpdate,
      scrollToSpy;

    beforeEach(() => {
      component = instanceRender(<ChattingScreen />);
      component.scrollHeightBeforeUpdate = mockScrollHeightBeforeUpdate;
      component.scrollContainer = mockScrollContainer;

      component.didUpdateFetchHistory();
    });

    describe('when scrollHeightBeforeUpdate is truthy', () => {
      beforeAll(() => {
        mockScrollHeightBeforeUpdate = 30;
      });

      describe('when there is a change in content length', () => {
        beforeAll(() => {
          scrollToSpy = jasmine.createSpy('scrollTo');

          mockScrollTop = 20;
          mockScrollHeight = 10;

          mockScrollContainer = {
            getScrollTop: () => mockScrollTop,
            getScrollHeight: () => mockScrollHeight,
            scrollTo: scrollToSpy
          };
        });

        it('calls scrollTo on scrollContainer with an expected value', () => {
          const expected = mockScrollTop + (mockScrollHeight - mockScrollHeightBeforeUpdate);

          expect(scrollToSpy)
            .toHaveBeenCalledWith(expected);
        });

        it('sets scrollHeightBeforeUpdate to null', () => {
          expect(component.scrollHeightBeforeUpdate)
            .toBeNull();
        });
      });

      describe('when there is no change in content length', () => {
        beforeAll(() => {
          scrollToSpy = jasmine.createSpy('scrollTo');

          mockScrollTop = 20;
          mockScrollHeight = 30;

          mockScrollContainer = {
            getScrollTop: () => mockScrollTop,
            getScrollHeight: () => mockScrollHeight,
            scrollTo: scrollToSpy
          };
        });

        it('does not call scrollTop', () => {
          expect(scrollToSpy)
            .not.toHaveBeenCalled();
        });

        it('does not set scrollHeightBeforeUpdate to null', () => {
          expect(component.scrollHeightBeforeUpdate)
            .toEqual(mockScrollHeightBeforeUpdate);
        });
      });
    });

    describe('when scrollHeightBeforeUpdate is falsy', () => {
      beforeAll(() => {
        scrollToSpy = jasmine.createSpy('scrollTo');
      });

      it('does not call scrollTo', () => {
        expect(scrollToSpy)
          .not.toHaveBeenCalled();
      });
    });
  });

  describe('didUpdateNewEntry', () => {
    let component,
      componentProps,
      mockPrevProps,
      mockIsScrollCloseToBottom;

    beforeEach(() => {
      component = instanceRender(<ChattingScreen {...componentProps} />);
      component.isScrollCloseToBottom = mockIsScrollCloseToBottom;

      spyOn(component, 'scrollToBottom');
      spyOn(component, 'setState');

      component.didUpdateNewEntry(mockPrevProps);
    });

    describe('when it is a new log entry', () => {
      beforeAll(() => {
        componentProps = {
          chats: [
            { nick: 'visitor', type: 'chat.msg' },
            { nick: 'agent:123', type: 'chat.msg' }
          ],
          events: []
        };
        mockPrevProps = {
          chats: [{ nick: 'visitor', type: 'chat.msg' }],
          events: []
        };
      });

      describe('when scroll is at bottom and last message is not a visitor', () => {
        beforeAll(() => {
          mockIsAgent = true;
          mockIsScrollCloseToBottom = jasmine.createSpy('isScrollCloseToBottom').and.returnValue(true);
        });

        it('calls setState with expected args', () => {
          const expected = { notificationCount: 0 };

          expect(component.setState)
            .toHaveBeenCalledWith(expected);
        });
      });

      describe('when scroll is not at bottom and last message is not a visitor', () => {
        beforeAll(() => {
          mockIsAgent = true;
          mockIsScrollCloseToBottom = jasmine.createSpy('isScrollCloseToBottom').and.returnValue(false);
        });

        it('calls setState with expected args', () => {
          const expected = { notificationCount: 1 };

          expect(component.setState)
            .toHaveBeenCalledWith(expected);
        });
      });

      describe('when last message is a visitor', () => {
        beforeAll(() => {
          componentProps = {
            chats: [
              { nick: 'visitor', type: 'chat.msg' },
              { nick: 'visitor', type: 'chat.msg' }
            ],
            events: []
          };
          mockIsScrollCloseToBottom = jasmine.createSpy('isScrollCloseToBottom').and.returnValue(false);
        });

        it('calls scrollToBottom', () => {
          expect(component.scrollToBottom)
            .toHaveBeenCalled();
        });
      });

      describe('when scroll is close to bottom', () => {
        beforeAll(() => {
          mockIsScrollCloseToBottom = jasmine.createSpy('isScrollCloseToBottom').and.returnValue(true);
        });

        it('calls scrollToBottom', () => {
          expect(component.scrollToBottom)
            .toHaveBeenCalled();
        });
      });
    });

    describe('when the log entry is the same', () => {
      beforeAll(() => {
        componentProps = {
          chats: [{ nick: 'visitor', type: 'chat.msg' }],
          events: []
        };
        mockPrevProps = {
          chats: [{ nick: 'visitor', type: 'chat.msg' }],
          events: []
        };
        mockIsScrollCloseToBottom = jasmine.createSpy('isScrollCloseToBottom').and.returnValue(false);
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

      it('renders a div with expected styles', () => {
        expect(agentTypingComponent.type)
          .toEqual('div');

        expect(agentTypingComponent.props.className)
          .toEqual('noAgentTypingClass');
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

  describe('renderScrollPill', () => {
    let result,
      component,
      mockNotificationCount;

    beforeEach(() => {
      component = instanceRender(<ChattingScreen />);
      component.scrollContainer = { getScrollHeight: noop };
      component.setState({ notificationCount: mockNotificationCount });

      spyOn(component, 'scrollToBottom');

      result = component.renderScrollPill();
    });

    describe('when onClick is called', () => {
      beforeAll(() => {
        mockNotificationCount = 1;
      });

      it('sets and calls the relevant items', () => {
        result.props.onClick();

        expect(component.scrollToBottom)
          .toHaveBeenCalled();
      });
    });

    describe('when chatNotification count is greater than 1', () => {
      beforeAll(() => {
        mockNotificationCount = 2;
      });

      it('calls i18n with the expected key and args', () => {
        const translationKey = 'embeddable_framework.chat.button.manyMessages';

        expect(translationSpy)
          .toHaveBeenCalledWith(translationKey, { plural_number: 2 });
      });
    });

    describe('when chatNotification count is not greater than 1', () => {
      beforeAll(() => {
        mockNotificationCount = 1;
      });

      it('calls i18n with the expected key', () => {
        const translationKey = 'embeddable_framework.chat.button.oneMessage';

        expect(translationSpy)
          .toHaveBeenCalledWith(translationKey);
      });
    });
  });

  describe('handleChatScreenScrolled', () => {
    let component,
      mockProps,
      fetchConversationHistorySpy;

    describe('when scrollContainer does not exist', () => {
      beforeEach(() => {
        fetchConversationHistorySpy = jasmine.createSpy('fetchConversationHistory');

        component = instanceRender(<ChattingScreen fetchConversationHistory={fetchConversationHistorySpy} />);

        spyOn(component, 'setState');

        component.handleChatScreenScrolled();
      });

      it('does not call fetchConversationHistory', () => {
        expect(fetchConversationHistorySpy)
          .not.toHaveBeenCalled();
      });

      it('does not call setState', () => {
        expect(component.setState)
          .not.toHaveBeenCalled();
      });
    });

    describe('when scroll is at top and chat history has completed fetching data ', () => {
      beforeEach(() => {
        fetchConversationHistorySpy = jasmine.createSpy('fetchConversationHistory');

        mockProps = {
          hasMoreHistory: true,
          historyRequestStatus: 'done',
          fetchConversationHistory: fetchConversationHistorySpy
        };

        const component = instanceRender(<ChattingScreen {...mockProps} />);

        component.scrollContainer = { isAtTop: () => true, getScrollBottom: noop };

        component.handleChatScreenScrolled();
      });

      it('calls fetchConversationHistory', () => {
        expect(fetchConversationHistorySpy)
          .toHaveBeenCalled();
      });
    });

    describe('when scroll is close to the bottom', () => {
      beforeEach(() => {
        fetchConversationHistorySpy = jasmine.createSpy('fetchConversationHistory');

        mockProps = {
          hasMoreHistory: true,
          historyRequestStatus: 'done',
          fetchConversationHistory: fetchConversationHistorySpy
        };

        component = instanceRender(<ChattingScreen {...mockProps} />);
        component.scrollContainer = { isAtTop: noop };
        component.isScrollCloseToBottom = () => true;

        spyOn(component, 'setState');

        component.handleChatScreenScrolled();
      });

      it('calls setState with expected args', () => {
        expect(component.setState)
          .toHaveBeenCalledWith({ notificationCount: 0 });
      });
    });
  });

  describe('isScrollCloseToBottom', () => {
    let result,
      mockScrollContainer;

    beforeEach(() => {
      const component = instanceRender(<ChattingScreen />);

      component.scrollContainer = mockScrollContainer;

      result = component.isScrollCloseToBottom();
    });

    describe('when scrollContainer exists', () => {
      describe('when scrollBottom is greater or equal than threshold', () => {
        beforeAll(() => {
          mockScrollContainer = {
            getScrollBottom: () => SCROLL_BOTTOM_THRESHOLD + 1
          };
        });

        it('returns false', () => {
          expect(result)
            .toEqual(false);
        });
      });

      describe('when scrollBottom is less than threshold', () => {
        beforeAll(() => {
          mockScrollContainer = {
            getScrollBottom: () => SCROLL_BOTTOM_THRESHOLD - 1
          };
        });

        it('returns true', () => {
          expect(result)
            .toEqual(true);
        });
      });
    });

    describe('when scrollContainer does not exist', () => {
      beforeAll(() => {
        mockScrollContainer = null;
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });
  });
});
