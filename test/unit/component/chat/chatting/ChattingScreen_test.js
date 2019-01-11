describe('ChattingScreen component', () => {
  let ChattingScreen,
    isIE,
    isFirefox,
    mockIsAgent,
    CHAT_CUSTOM_MESSAGE_EVENTS,
    HISTORY_REQUEST_STATUS,
    SCROLL_BOTTOM_THRESHOLD;

  const chatPath = buildSrcPath('component/chat/chatting/ChattingScreen');

  const updateChatScreenSpy = jasmine.createSpy('updateChatScreen');
  const translationSpy = jasmine.createSpy('translation').and.callFake(_.identity);
  const resetCurrentMessageSpy = jasmine.createSpy('resetCurrentMessage');
  const isDefaultNicknameSpy = jasmine.createSpy('isDefaultNicknameSpy').and.returnValue(false);
  const markAsReadSpy = jasmine.createSpy('markAsRead');

  const Button = noopReactComponent('Button');
  const ButtonPill = noopReactComponent('ButtonPill');
  const LoadingSpinner = noopReactComponent('LoadingSpinner');
  const ZendeskLogo = noopReactComponent('ZendeskLogo');
  const QuickReplies = noopReactComponent('QuickReplies');
  const QuickReply = noopReactComponent('QuickReply');

  const mockTitle = 'My custom title';

  beforeEach(() => {
    mockery.enable();

    CHAT_CUSTOM_MESSAGE_EVENTS = {
      CHAT_QUICK_REPLIES: 'chat.quick_replies'
    };
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
          agentTypingMobile: 'agentTypingMobileClasses',
          scrollContainerContent: 'scrollContainerContentClasses',
          scrollBarFix: 'scrollBarFix',
          logoFooter: 'logoFooterClasses',
          zendeskLogo: 'zendeskLogoClasses',
          zendeskLogoChatMobile: 'zendeskLogoChatMobileClasses',
          historyFetchingContainer: 'historyFetchingContainerClasses',
          noAgentTyping: 'noAgentTypingClass',
          noAgentTypingMobile: 'noAgentTypingMobileClass',
          scrollBottomPill: 'scrollBottomPillClass',
          scrollBottomPillMobile: 'scrollBottomPillMobileClass',
          headerMargin: 'headerMargin'
        }
      },
      'component/loading/LoadingSpinner': {
        LoadingSpinner
      },
      '@zendeskgarden/react-buttons': {
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
      'component/shared/QuickReplies': {
        QuickReply,
        QuickReplies
      },
      'src/redux/modules/chat': {
        sendMsg: noop,
        handleChatBoxChange: noop,
        updateChatScreen: updateChatScreenSpy,
        resetCurrentMessage: resetCurrentMessageSpy,
        markAsRead: markAsReadSpy
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
        HISTORY_REQUEST_STATUS,
        CHAT_CUSTOM_MESSAGE_EVENTS
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
      'utility/chat': {
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
    markAsReadSpy.calls.reset();
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

    describe('when chatting screen is previously hidden and now visible', () => {
      beforeAll(() => {
        mockPrevProps = {
          chats: [],
          events: [],
          chatsLength: 0,
          lastMessageAuthor: '',
          visible: false
        };
        componentProps = {
          chats: [],
          events: [],
          chatsLength: 0,
          lastMessageAuthor: '',
          visible: true,
          markAsRead: markAsReadSpy
        };
        mockIsScrollCloseToBottom =  jasmine.createSpy('isScrollCloseToBottom').and.returnValue(true);
      });

      describe('when scroll is at bottom', () => {
        it('calls markAsRead', () => {
          expect(markAsReadSpy)
            .toHaveBeenCalled();
        });
      });

      describe('when scroll is not at bottom', () => {
        beforeAll(() => {
          mockIsScrollCloseToBottom = jasmine.createSpy('isScrollCloseToBottom').and.returnValue(false);
        });

        it('does not call markAsRead', () => {
          expect(markAsReadSpy)
            .not.toHaveBeenCalled();
        });
      });
    });

    describe('when it is a new log entry', () => {
      beforeAll(() => {
        mockPrevProps = {
          chats: [{ nick: 'visitor', type: 'chat.msg' }],
          events: [],
          chatsLength: 1,
          lastMessageAuthor: 'visitor',
          visible: true
        };
        componentProps = {
          chats: [
            { nick: 'visitor', type: 'chat.msg' },
            { nick: 'agent:123', type: 'chat.msg' }
          ],
          events: [],
          chatsLength: 2,
          lastMessageAuthor: 'agent:123',
          visible: true,
          markAsRead: markAsReadSpy
        };
      });

      describe('when last message is not a visitor', () => {
        describe('when scroll is at bottom', () => {
          beforeAll(() => {
            mockIsAgent = true;
            mockIsScrollCloseToBottom = jasmine.createSpy('isScrollCloseToBottom').and.returnValue(true);
          });

          it('calls markAsRead', () => {
            expect(markAsReadSpy)
              .toHaveBeenCalled();
          });
        });

        describe('when scroll is not at bottom', () => {
          beforeAll(() => {
            mockIsAgent = true;
            mockIsScrollCloseToBottom = jasmine.createSpy('isScrollCloseToBottom').and.returnValue(false);
          });

          it('does not call markAsRead', () => {
            expect(markAsReadSpy)
              .not.toHaveBeenCalled();
          });
        });
      });

      describe('when last message is a visitor', () => {
        beforeAll(() => {
          componentProps = {
            chats: [
              { nick: 'visitor', type: 'chat.msg' },
              { nick: 'visitor', type: 'chat.msg' }
            ],
            events: [],
            chatsLength: 2,
            lastMessageAuthor: 'visitor'
          };
          mockIsScrollCloseToBottom = jasmine.createSpy('isScrollCloseToBottom').and.returnValue(false);
        });

        it('calls scrollToBottom', () => {
          expect(component.scrollToBottom)
            .toHaveBeenCalled();
        });
      });
    });

    describe('when the log entry is the same', () => {
      beforeAll(() => {
        mockPrevProps = {
          chats: [{ nick: 'visitor', type: 'chat.msg' }],
          events: [],
          chatsLength: 2,
          lastMessageAuthor: 'visitor'
        };
        componentProps = {
          chats: [{ nick: 'visitor', type: 'chat.msg' }],
          events: [],
          chatsLength: 2,
          lastMessageAuthor: 'visitor'
        };
        mockIsScrollCloseToBottom = jasmine.createSpy('isScrollCloseToBottom').and.returnValue(false);
      });

      it('does not call scrollToBottom', () => {
        expect(component.scrollToBottom)
          .not.toHaveBeenCalled();
      });
    });

    describe('when it is a new event entry', () => {
      beforeAll(() => {
        mockPrevProps = {
          chats: [],
          events: [
            { timestamp: 73870, nick: 'visitor', type: 'chat.memberjoin', display_name: 'zenguy' },
            { timestamp: 80869, nick: 'agent:450578159', type: 'chat.memberjoin', display_name: 'Terence Liew' }
          ],
          chatsLength: 2,
          lastMessageAuthor: ''
        };
        componentProps = {
          chats: [],
          events: [
            { timestamp: 73870, nick: 'visitor', type: 'chat.memberjoin', display_name: 'zenguy' },
            { timestamp: 80869, nick: 'agent:450578159', type: 'chat.memberjoin', display_name: 'Terence Liew' },
            { timestamp: 85011, nick: 'visitor', type: 'chat.rating', display_name: 'zenguy', new_rating: 'good', rating: undefined }
          ],
          chatsLength: 3,
          lastMessageAuthor: ''
        };
      });

      describe('when scroll is at the bottom', () => {
        beforeAll(() => {
          mockIsScrollCloseToBottom = jasmine.createSpy('isScrollCloseToBottom').and.returnValue(true);
        });

        it('calls scrollToBottom', () => {
          expect(component.scrollToBottom)
            .toHaveBeenCalled();
        });
      });

      describe('when scroll is not at the bottom', () => {
        beforeAll(() => {
          mockIsScrollCloseToBottom = jasmine.createSpy('isScrollCloseToBottom').and.returnValue(false);
        });

        it('does not call scrollToBottom', () => {
          expect(component.scrollToBottom)
            .not.toHaveBeenCalled();
        });
      });
    });

    describe('when the event entry is the same', () => {
      beforeAll(() => {
        componentProps = {
          chats: [],
          events: [
            { timestamp: 73870, nick: 'visitor', type: 'chat.memberjoin', display_name: 'zenguy' },
          ],
          chatsLength: 1
        };
        mockPrevProps = {
          chats: [],
          events: [
            { timestamp: 73870, nick: 'visitor', type: 'chat.memberjoin', display_name: 'zenguy' },
          ],
          chatsLength: 1
        };
      });

      beforeAll(() => {
        mockIsScrollCloseToBottom = jasmine.createSpy('isScrollCloseToBottom').and.returnValue(true);
      });

      it('does not call scrollToBottom', () => {
        expect(component.scrollToBottom)
          .not.toHaveBeenCalled();
      });
    });
  });

  describe('componentDidMount', () => {
    let component;

    describe('when there are chats', () => {
      beforeEach(() => {
        component = instanceRender(<ChattingScreen chatsLength={3} />);
        spyOn(component, 'scrollToBottom');
        component.componentDidMount();
      });

      it('scrolls to bottom', () => {
        expect(component.scrollToBottom)
          .toHaveBeenCalled();
      });
    });

    describe('when there are no chats', () => {
      beforeEach(() => {
        component = instanceRender(<ChattingScreen chatsLength={0} />);
        spyOn(component, 'scrollToBottom');
        component.componentDidMount();
      });

      it('does not scroll to bottom', () => {
        expect(component.scrollToBottom)
          .not.toHaveBeenCalled();
      });
    });
  });

  describe('#render', () => {
    let component, result, mockFullscreen, mockIsMobile;
    const renderChatComponent = ({
      agents = {},
      isMobile = mockIsMobile,
      hideZendeskLogo = false,
      profileConfig = {},
      socialLogin = { avatarPath: 'heynow' },
      agentJoined = false,
      fullscreen = mockFullscreen
    }) => (
      instanceRender(
        <ChattingScreen
          title={mockTitle}
          profileConfig={profileConfig}
          activeAgents={agents}
          isMobile={isMobile}
          hideZendeskLogo={hideZendeskLogo}
          socialLogin={socialLogin}
          agentJoined={agentJoined}
          fullscreen={fullscreen} />
      )
    );

    beforeEach(() => {
      component = renderChatComponent({
        ratingsEnabled: true
      });
    });

    describe('props', () => {
      beforeAll(() => {
        mockFullscreen = true;
        mockIsMobile = true;
      });

      afterAll(() => {
        mockFullscreen = false;
        mockIsMobile = false;
      });

      it('has a props.socialLogin value', () => {
        expect(component.props.socialLogin)
          .toEqual({ avatarPath: 'heynow' });
      });

      it('has a props.title value', () => {
        expect(component.props.title)
          .toEqual(mockTitle);
      });

      it('has a props.fullscreen value', () => {
        expect(component.props.fullscreen)
          .toEqual(true);
      });

      it('has a props.isMobile value', () => {
        expect(component.props.isMobile)
          .toEqual(true);
      });
    });

    describe('container classnames', () => {
      describe('headerMargin', () => {
        describe('when profile config avatar is true', () => {
          beforeEach(() => {
            component = renderChatComponent({
              profileConfig: {
                avatar: true
              }
            });

            result = component.render();
          });

          it('renders headerMargin', () => {
            expect(result.props.children[0].props.containerClasses)
              .toContain('headerMargin');
          });
        });

        describe('when profile config has no properties', () => {
          beforeEach(() => {
            component = renderChatComponent({
              profileConfig: {}
            });

            result = component.render();
          });

          it('does not render headerMargin', () => {
            expect(result.props.children[0].props.containerClasses)
              .not
              .toContain('headerMargin');
          });
        });

        describe('when profile config has only false properties', () => {
          beforeEach(() => {
            component = renderChatComponent({
              profileConfig: {
                title: false,
                rating: false
              }
            });

            result = component.render();
          });

          it('does not render headerMargin', () => {
            expect(result.props.children[0].props.containerClasses)
              .not
              .toContain('headerMargin');
          });
        });

        describe('when profile config has rating set to true but there is no agent', () => {
          beforeEach(() => {
            component = renderChatComponent({
              profileConfig: {
                rating: true
              },
              agentJoined: false
            });

            result = component.render();
          });

          it('does not render headerMargin', () => {
            expect(result.props.children[0].props.containerClasses)
              .not
              .toContain('headerMargin');
          });
        });

        describe('when profile config has rating set to true and there is an agent', () => {
          beforeEach(() => {
            component = renderChatComponent({
              profileConfig: {
                rating: true
              },
              agentJoined: true
            });

            result = component.render();
          });

          it('renders headerMargin', () => {
            expect(result.props.children[0].props.containerClasses)
              .toContain('headerMargin');
          });
        });
      });
    });

    describe('footer classnames', () => {
      describe('on non-mobile devices', () => {
        it('has desktop specific classes', () => {
          result = component.render();
          expect(result.props.children[0].props.footerClasses)
            .toContain('footerClasses');
          expect(result.props.children[0].props.footerClasses)
            .not.toContain('footerMobileClasses');
          expect(result.props.children[0].props.footerClasses)
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
          expect(result.props.children[0].props.footerClasses)
            .toContain('footerClasses');
          expect(result.props.children[0].props.footerClasses)
            .toContain('footerMobileClasses');
          expect(result.props.children[0].props.footerClasses)
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
          expect(result.props.children[0].props.footerClasses)
            .toContain('footerClasses');
          expect(result.props.children[0].props.footerClasses)
            .toContain('footerMobileClasses');
          expect(result.props.children[0].props.footerClasses)
            .not.toContain('footerMobileWithLogoClasses');
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

    describe('for non mobile devices', () => {
      beforeEach(() => {
        component = instanceRender(<ChattingScreen />);
      });

      it('adds the scrollContainerMessagesContentDesktop to it', () => {
        expect(component.render().props.children[0].props.containerClasses)
          .toContain('scrollContainerMessagesContentDesktopClass');
      });

      it('does not add the scrollContainerMobile class to it', () => {
        expect(component.render().props.children[0].props.containerClasses)
          .not
          .toContain('scrollContainerMobileClasses');
      });

      it('does not add scrollContainerMessagesContent class to it', () => {
        expect(component.render().props.children[0].props.containerClasses)
          .not
          .toContain('scrollContainerMessagesContentClass');
      });
    });

    describe('for mobile devices', () => {
      beforeEach(() => {
        component = instanceRender(<ChattingScreen isMobile={true} />);
      });

      it('does not add the scrollContainerMessagesContentDesktop to it', () => {
        expect(component.render().props.children[0].props.containerClasses)
          .not
          .toContain('scrollContainerMessagesContentDesktopClass');
      });

      it('adds mobile container classes to scrollContainer', () => {
        expect(component.render().props.children[0].props.containerClasses)
          .toContain('scrollContainerMobileClasses');
      });

      it('adds scrollContainerMessagesContent class to it', () => {
        expect(component.render().props.children[0].props.containerClasses)
          .toContain('scrollContainerMessagesContentClass');
      });
    });

    describe('when the browser is Firefox', () => {
      beforeEach(() => {
        isFirefox = true;
        component = instanceRender(<ChattingScreen />);
      });

      it('adds the scrollbar fix classes to scrollContainer', () => {
        expect(component.render().props.children[0].props.containerClasses)
          .toContain('scrollBarFix');
      });
    });

    describe('when the browser is Internet Explorer', () => {
      beforeEach(() => {
        isIE = true;
        component = instanceRender(<ChattingScreen />);
      });

      it('adds the scrollbar fix classes to scrollContainer', () => {
        expect(component.render().props.children[0].props.containerClasses)
          .toContain('scrollBarFix');
      });
    });

    xdescribe('showUpdateInfo', () => {
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
        const scrollContainer = result.props.children[0];
        const chatLog = scrollContainer.props.children[0].props.children[1];

        showUpdateInfoResult = chatLog.props.showUpdateInfo;
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
        mockAgents = { 'agent123456': { display_name: 'Wayne', typing: false } };
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

    describe('when called', () => {
      describe('when it is mobile mode', () => {
        beforeEach(() => {
          const component = instanceRender(<ChattingScreen isMobile={true} chat={{ rating: null }} />);

          agentTypingComponent = component.renderAgentTyping();
        });

        it('renders with agentTypingMobile class', () => {
          expect(agentTypingComponent.props.className)
            .toEqual('noAgentTypingMobileClass');
        });
      });

      describe('when it is not mobile mode', () => {
        beforeEach(() => {
          const component = instanceRender(<ChattingScreen isMobile={false} chat={{ rating: null }} />);

          agentTypingComponent = component.renderAgentTyping();
        });

        it('renders with agentTyping class', () => {
          expect(agentTypingComponent.props.className)
            .toEqual('noAgentTypingClass');
        });
      });
    });

    describe('when no agents are typing a message', () => {
      describe('when it is mobile mode', () => {
        beforeEach(() => {
          const mockTypingAgents = [];
          const component = instanceRender(<ChattingScreen isMobile={true} chat={{ rating: null }} />);

          agentTypingComponent = component.renderAgentTyping(mockTypingAgents);
        });

        it('renders a div with expected styles', () => {
          expect(agentTypingComponent.type)
            .toEqual('div');

          expect(agentTypingComponent.props.className)
            .toEqual('noAgentTypingMobileClass');
        });
      });

      describe('when it is not mobile mode', () => {
        beforeEach(() => {
          const mockTypingAgents = [];
          const component = instanceRender(<ChattingScreen isMobile={false} chat={{ rating: null }} />);

          agentTypingComponent = component.renderAgentTyping(mockTypingAgents);
        });

        it('renders a div with expected styles', () => {
          expect(agentTypingComponent.type)
            .toEqual('div');

          expect(agentTypingComponent.props.className)
            .toEqual('noAgentTypingClass');
        });
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
      profileConfig,
      agents,
      updateChatScreenSpy,
      chatHeaderComponent;

    beforeEach(() => {
      updateChatScreenSpy = jasmine.createSpy('updateChatScreen');

      const component = instanceRender(
        <ChattingScreen
          profileConfig={profileConfig}
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
          profileConfig = { rating: true };
        });

        it('shows rating', () => {
          expect(chatHeaderComponent.props.showRating)
            .toEqual(true);
        });
      });

      describe('when rating settings not enabled', () => {
        beforeAll(() => {
          profileConfig = { rating: false };
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
          profileConfig = { rating: true };
        });

        it('does not show rating', () => {
          expect(chatHeaderComponent.props.showRating)
            .toEqual(false);
        });
      });

      describe('when rating settings not enabled', () => {
        beforeAll(() => {
          profileConfig = { rating: false };
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
      componentProps,
      mockIsScrollCloseToBottom,
      mockNotificationCount;

    beforeEach(() => {
      component = instanceRender(
        <ChattingScreen
          notificationCount={mockNotificationCount}
          {...componentProps} />
      );
      component.scrollContainer = { getScrollHeight: noop };
      component.isScrollCloseToBottom = () => mockIsScrollCloseToBottom;

      spyOn(component, 'scrollToBottom');

      result = component.renderScrollPill();
    });

    describe('when notification count is 0', () => {
      beforeAll(() => {
        mockNotificationCount = 0;
        mockIsScrollCloseToBottom = false;
      });

      it('does not render', () => {
        expect(result)
          .toBeNull();
      });
    });

    describe('when scroll is near bottom', () => {
      beforeAll(() => {
        mockNotificationCount = 1;
        mockIsScrollCloseToBottom = true;
      });

      it('does not render', () => {
        expect(result)
          .toBeNull();
      });
    });

    describe('when onClick is called', () => {
      beforeAll(() => {
        mockIsScrollCloseToBottom = false;
        mockNotificationCount = 1;
        componentProps = {
          markAsRead: markAsReadSpy,
          visible: true
        };
      });

      it('sets and calls the relevant items', () => {
        result.props.onClick();

        expect(component.scrollToBottom)
          .toHaveBeenCalled();
      });

      it('calls markAsRead', () => {
        result.props.onClick();

        expect(markAsReadSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when chatNotification count is greater than 1', () => {
      beforeAll(() => {
        mockNotificationCount = 2;
      });

      it('calls i18n with the expected key and args', () => {
        const translationKey = 'embeddable_framework.common.notification.manyMessages';

        expect(translationSpy)
          .toHaveBeenCalledWith(translationKey, { plural_number: 2 });
      });
    });

    describe('when chatNotification count is not greater than 1', () => {
      beforeAll(() => {
        mockNotificationCount = 1;
      });

      it('calls i18n with the expected key', () => {
        const translationKey = 'embeddable_framework.common.notification.oneMessage';

        expect(translationSpy)
          .toHaveBeenCalledWith(translationKey);
      });
    });

    describe('when it is mobile mode', () => {
      beforeAll(() => {
        mockNotificationCount = 1;
        componentProps = {
          isMobile: true
        };
      });

      it('has scrollBottomPillMobile class', () => {
        expect(result.props.containerClass)
          .toContain('scrollBottomPillMobileClass');
      });
    });

    describe('when it is not mobile mode', () => {
      beforeAll(() => {
        mockNotificationCount = 1;
        componentProps = {
          isMobile: false
        };
      });

      it('has scrollBottomPill class', () => {
        expect(result.props.containerClass)
          .toContain('scrollBottomPillClass');
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
      let mockVisible;

      beforeEach(() => {
        fetchConversationHistorySpy = jasmine.createSpy('fetchConversationHistory');

        mockProps = {
          hasMoreHistory: true,
          historyRequestStatus: 'done',
          fetchConversationHistory: fetchConversationHistorySpy,
          markAsRead: markAsReadSpy,
          visible: mockVisible
        };

        component = instanceRender(<ChattingScreen {...mockProps} />);
        component.scrollContainer = { isAtTop: noop };
        component.isScrollCloseToBottom = () => true;

        component.handleChatScreenScrolled();
      });

      describe('when chatting screen is visible', () => {
        beforeAll(() => {
          mockVisible = true;
        });

        it('calls markAsRead', () => {
          expect(markAsReadSpy)
            .toHaveBeenCalled();
        });
      });

      describe('when chatting screen is hidden', () => {
        beforeAll(() => {
          mockVisible = false;
        });

        it('does not call markAsRead', () => {
          expect(markAsReadSpy)
            .not.toHaveBeenCalled();
        });
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

  describe('showContactDetails', () => {
    const spyFn = jasmine.createSpy('showContactDetails');
    let chatLog;

    beforeEach(() => {
      const component = instanceRender(<ChattingScreen showContactDetails={spyFn} />);
      const result = component.render();
      const scrollContainer = result.props.children[0];

      chatLog = scrollContainer.props.children[0].props.children[1];
    });

    it('passes showContactDetails prop to ChatLog', () => {
      expect(chatLog.props.updateInfoOnClick)
        .toEqual(spyFn);
    });
  });

  describe('renderQuickReply', () => {
    describe('when quickReply is in last chat log', () => {
      let quickReplyChatLog;

      beforeEach(() => {
        quickReplyChatLog = {
          timestamp: 2,
          type: CHAT_CUSTOM_MESSAGE_EVENTS.CHAT_QUICK_REPLIES,
          items: [
            {
              action: {
                type: 'QuickReplyAction',
                value: 'answer 1'
              },
              text: 'ANS1'
            },
            {
              action: {
                type: 'QuickReplyAction',
                value: 'answer 2'
              },
              text: 'ANS2'
            },
            {
              action: {
                type: 'QuickReplyAction',
                value: 'answer 3'
              },
              text: 'ANS3'
            }
          ]
        };
      });

      describe('when it is not hidden', () => {
        let QRComponent;
        let sendMsgStub = jasmine.createSpy('sendMsg');

        beforeEach(() => {
          const chatLogWithQRShown = JSON.parse(JSON.stringify(quickReplyChatLog));

          const component = instanceRender(<ChattingScreen getQuickRepliesFromChatLog={chatLogWithQRShown} sendMsg={sendMsgStub}/>);

          QRComponent = component.renderQuickReply();
        });

        afterEach(() => {
          sendMsgStub.calls.reset();
        });

        it('should render QuickReplies Component', () => {
          expect(TestUtils.isElementOfType(QRComponent, QuickReplies)).toEqual(true);
        });

        it('should render the right number of QuickReply component', () => {
          expect(QRComponent.props.children.length).toEqual(quickReplyChatLog.items.length);

          QRComponent.props.children.forEach((child) => {
            expect(TestUtils.isElementOfType(child, QuickReply)).toEqual(true);
          });
        });

        it('should pass the right props to each QuickReply component', () => {
          QRComponent.props.children.forEach((child, idx) => {
            expect(child.props).toEqual(jasmine.objectContaining({
              label: quickReplyChatLog.items[idx].text,
              onClick: jasmine.any(Function)
            }));
          });
        });

        it('should pass the right value to the onClick prop', () => {
          QRComponent.props.children.forEach((child, idx) => {
            child.props.onClick();
            expect(sendMsgStub).toHaveBeenCalledWith(quickReplyChatLog.items[idx].action.value);
          });
        });
      });
    });

    describe('when quickReply is not in last chat log', () => {
      it('return null', () => {
        const component = instanceRender(<ChattingScreen getQuickRepliesFromChatLog={null}/>);
        const QRComponent = component.renderQuickReply();

        expect(QRComponent).toBeNull();
      });
    });
  });
});
