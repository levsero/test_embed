const prechatScreen = 'widget/chat/PRECHAT_SCREEN';
const chattingScreen = 'widget/chat/CHATTING_SCREEN';
const loadingScreen = 'widget/chat/LOADING_SCREEN';
const feedbackScreen = 'widget/chat/FEEDBACK_SCREEN';
const offlineMessageScreen = 'widget/chat/OFFLINE_MESSAGE_SCREEN';

describe('ChatOnline component', () => {
  let ChatOnline,
    prechatFormSettingsProp;

  const chatPath = buildSrcPath('component/chat/ChatOnline');
  const chatConstantsPath = buildSrcPath('constants/chat');

  const AGENT_LIST_SCREEN = 'widget/chat/AGENT_LIST_SCREEN';

  const updateChatScreenSpy = jasmine.createSpy('updateChatScreen');
  const resetCurrentMessageSpy = jasmine.createSpy('resetCurrentMessage');

  const AttachmentBox = noopReactComponent('AttachmentBox');
  const ChatMenu = noopReactComponent('ChatMenu');
  const ChatReconnectionBubble = noopReactComponent('ChatReconnectionBubble');
  const ChatOfflineMessageForm = noopReactComponent('ChatOfflineMessageForm');
  const ChatPrechatForm = noopReactComponent('ChatPrechatForm');
  const ButtonPill = noopReactComponent('ButtonPill');
  const LoadingSpinner = noopReactComponent('LoadingSpinner');
  const ZendeskLogo = noopReactComponent('ZendeskLogo');
  const AgentScreen = noopReactComponent('AgentScreen');

  const CONNECTION_STATUSES = requireUncached(chatConstantsPath).CONNECTION_STATUSES;
  const DEPARTMENT_STATUSES = requireUncached(chatConstantsPath).DEPARTMENT_STATUSES;

  beforeEach(() => {
    mockery.enable();

    prechatFormSettingsProp = { form: {}, required: false };

    initMockRegistry({
      './ChatOnline.scss': {
        locals: {
          scrollContainerMobile: 'scrollContainerMobileClasses',
          scrollContainerMessagesContent: 'scrollContainerMessagesContentClass',
          scrollContainerMessagesContentDesktop: 'scrollContainerMessagesContentDesktopClass',
          footer: 'footerClasses',
          footerMobile: 'footerMobileClasses',
          footerMobileWithLogo: 'footerMobileWithLogoClasses',
          scrollContainer: 'scrollContainerClasses',
          scrollContainerContent: 'scrollContainerContentClasses',
          agentListBackButton: 'agentListBackButtonClasses',
          mobileContainer: 'mobileContainerClasses',
          logoFooter: 'logoFooterClasses',
          zendeskLogo: 'zendeskLogoClasses',
          zendeskLogoChatMobile: 'zendeskLogoChatMobileClasses',
          agentListBackButtonWithLogo: 'agentListBackButtonWithLogoClasses'
        }
      },
      'component/loading/LoadingSpinner': {
        LoadingSpinner
      },
      'component/ZendeskLogo': {
        ZendeskLogo
      },
      'component/chat/chatting/ChattingScreen': noopReactComponent(),
      'component/chat/agents/AgentScreen': AgentScreen,
      'component/chat/rating/RatingScreen': noopReactComponent(),
      'component/button/ButtonPill': {
        ButtonPill
      },
      'component/chat/ChatPrechatForm': {
        ChatPrechatForm
      },
      'component/chat/ChatMenu': {
        ChatMenu: ChatMenu
      },
      'component/container/Container': {
        Container: noopReactComponent()
      },
      'component/chat/ChatPopup': {
        ChatPopup: noopReactComponent()
      },
      'component/chat/ChatContactDetailsPopup': {
        ChatContactDetailsPopup: noopReactComponent()
      },
      'component/chat/ChatEmailTranscriptPopup': {
        ChatEmailTranscriptPopup: noopReactComponent()
      },
      'component/chat/ChatRatingGroup': {
        ChatRatings: {}
      },
      'component/chat/ChatReconnectionBubble': {
        ChatReconnectionBubble: ChatReconnectionBubble
      },
      'component/loading/LoadingEllipses': {
        LoadingEllipses: noopReactComponent()
      },
      'component/container/ScrollContainer': {
        ScrollContainer: scrollContainerComponent()
      },
      'component/attachment/AttachmentBox': {
        AttachmentBox: AttachmentBox
      },
      'src/redux/modules/chat': {
        sendMsg: noop,
        handleChatBoxChange: noop,
        setVisitorInfo: noop,
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
        PRECHAT_SCREEN: prechatScreen,
        CHATTING_SCREEN: chattingScreen,
        FEEDBACK_SCREEN: feedbackScreen,
        LOADING_SCREEN: loadingScreen,
        OFFLINE_MESSAGE_SCREEN: offlineMessageScreen,
        AGENT_LIST_SCREEN
      },
      'service/i18n': {
        i18n: {
          t: _.identity,
          isRTL: () => {}
        }
      },
      'constants/chat': {
        AGENT_BOT: 'agent:trigger',
        CONNECTION_STATUSES,
        DEPARTMENT_STATUSES
      },
      'src/util/chat': {
        isDefaultNickname: noop
      },
      'component/chat/ChatOfflineMessageForm': {
        ChatOfflineMessageForm
      }
    });

    mockery.registerAllowable(chatPath);
    ChatOnline = requireUncached(chatPath).default.WrappedComponent;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();

    updateChatScreenSpy.calls.reset();
  });

  describe('onContainerClick', () => {
    let component,
      updateMenuVisibilitySpy,
      updateContactDetailsVisibilitySpy,
      updateEmailTranscriptVisibilitySpy;

    beforeEach(() => {
      updateContactDetailsVisibilitySpy = jasmine.createSpy('updateContactDetailsVisibility');
      updateEmailTranscriptVisibilitySpy = jasmine.createSpy('updateEmailTranscriptVisibility');
      updateMenuVisibilitySpy = jasmine.createSpy('updateMenuVisibility');

      component = instanceRender(
        <ChatOnline
          updateContactDetailsVisibility={updateContactDetailsVisibilitySpy}
          updateEmailTranscriptVisibility={updateEmailTranscriptVisibilitySpy}
          updateMenuVisibility={updateMenuVisibilitySpy}
        />
      );
      component.onContainerClick();
    });

    it('should set the correct state', () => {
      expect(component.state)
        .toEqual(jasmine.objectContaining({
          showEndChatMenu: false
        }));
    });

    it('calls updateEmailTranscriptVisibility with false', () => {
      expect(updateEmailTranscriptVisibilitySpy)
        .toHaveBeenCalledWith(false);
    });

    it('calls updateContactDetailsVisibility with false', () => {
      expect(updateContactDetailsVisibilitySpy)
        .toHaveBeenCalledWith(false);
    });

    it('calls updateMenuVisibility with false', () => {
      expect(updateMenuVisibilitySpy)
        .toHaveBeenCalledWith(false);
    });
  });

  describe('componentDidMount', () => {
    let updateChatBackButtonVisibilitySpy;

    beforeEach(() => {
      updateChatBackButtonVisibilitySpy = jasmine.createSpy('updateChatBackButtonVisibility');

      const component = instanceRender(<ChatOnline updateChatBackButtonVisibility={updateChatBackButtonVisibilitySpy} />);

      component.componentDidMount();
    });

    it('calls props.updateChatBackButtonVisibility', () => {
      expect(updateChatBackButtonVisibilitySpy)
        .toHaveBeenCalled();
    });
  });

  describe('componentWillReceiveProps', () => {
    let nextProps,
      component;

    describe('the updateChatBackButtonVisibility prop', () => {
      let updateChatBackButtonVisibilitySpy;

      beforeEach(() => {
        updateChatBackButtonVisibilitySpy = jasmine.createSpy('updateChatBackButtonVisibility');
        component = instanceRender(<ChatOnline updateChatBackButtonVisibility={updateChatBackButtonVisibilitySpy} screen='screen' chats={[]} events={[]} />);
        nextProps = {
          screen: 'screen',
          chats: [],
          events: [],
          agentsTyping: []
        };

        component.componentWillReceiveProps(nextProps);
      });

      it('is called', () => {
        expect(updateChatBackButtonVisibilitySpy)
          .toHaveBeenCalled();
      });
    });
  });

  describe('onPrechatFormComplete', () => {
    let component,
      setVisitorInfoSpy,
      sendMsgSpy,
      setDepartmentSpy,
      formInfo,
      sendOfflineMessageSpy,
      clearDepartmentSpy,
      mockDepartments;

    beforeEach(() => {
      setVisitorInfoSpy = jasmine.createSpy('setVisitorInfo');
      sendMsgSpy = jasmine.createSpy('sendMsg');
      setDepartmentSpy = jasmine.createSpy('setDepartment');
      sendOfflineMessageSpy = jasmine.createSpy('sendOfflineMessage');
      clearDepartmentSpy = jasmine.createSpy('clearDepartment');
      component = instanceRender(
        <ChatOnline
          postChatFormSettings={{ header: 'foo' }}
          setVisitorInfo={setVisitorInfoSpy}
          sendMsg={sendMsgSpy}
          setDepartment={setDepartmentSpy}
          updateChatScreen={updateChatScreenSpy}
          resetCurrentMessage={resetCurrentMessageSpy}
          departments={mockDepartments}
          sendOfflineMessage={sendOfflineMessageSpy}
          clearDepartment={clearDepartmentSpy} />
      );

      component.onPrechatFormComplete(formInfo);
    });

    afterEach(() => {
      setVisitorInfoSpy.calls.reset();
      sendMsgSpy.calls.reset();
      setDepartmentSpy.calls.reset();
      updateChatScreenSpy.calls.reset();
      sendOfflineMessageSpy.calls.reset();
    });

    describe('when display_name is not specified in the form data', () => {
      const nameValue = 'test name';

      beforeAll(() => {
        formInfo = {
          name: nameValue,
          email: 'mother@of.dragons',
          phone: '87654321',
          message: 'bend the knee',
          department: 12345
        };

        mockDepartments = {
          12345: {
            status: 'online'
          }
        };
      });

      it('uses the value of the name as the display_name', () => {
        expect(setVisitorInfoSpy.calls.mostRecent().args[0].display_name)
          .toEqual(nameValue);
      });
    });

    describe('when the form data has null or undefined values', () => {
      beforeAll(() => {
        formInfo = {
          display_name: 'name',
          email: undefined,
          phone: null
        };
      });

      it('omits those values from the setVisitorInfo call', () => {
        const visitorInfo = _.omit(formInfo, ['email', 'phone']);

        expect(setVisitorInfoSpy)
          .toHaveBeenCalledWith(visitorInfo);
      });
    });

    describe('when department is specified', () => {
      describe('when department is online', () => {
        beforeAll(() => {
          formInfo = {
            display_name: 'Daenerys Targaryen',
            email: 'mother@of.dragons',
            phone: '87654321',
            message: 'bend the knee',
            department: 12345
          };

          mockDepartments = {
            12345: {
              status: 'online'
            }
          };
        });

        it('calls setDepartment with correct arguments', () => {
          expect(setDepartmentSpy)
            .toHaveBeenCalledWith(formInfo.department, jasmine.any(Function), jasmine.any(Function));
        });

        it('calls setVisitorInfo with the correct arguments', () => {
          expect(setVisitorInfoSpy)
            .toHaveBeenCalledWith({
              display_name: 'Daenerys Targaryen',
              email: 'mother@of.dragons',
              phone: '87654321'
            });
        });

        it('calls updateChatScreen with the CHATTING_SCREEN', () => {
          expect(updateChatScreenSpy)
            .toHaveBeenCalledWith(chattingScreen);
        });

        describe('when there is a message to send', () => {
          beforeAll(() => {
            formInfo.message = 'Bend the knee m8.';
          });

          it('sends an online message', () => {
            setDepartmentSpy.calls.mostRecent().args[1]();
            expect(sendMsgSpy)
              .toHaveBeenCalledWith('Bend the knee m8.');
          });
        });

        describe('when there is no message to send', () => {
          beforeAll(() => {
            formInfo.message = null;
          });

          it('does not send online message', () => {
            setDepartmentSpy.calls.mostRecent().args[1]();
            expect(sendMsgSpy)
              .not
              .toHaveBeenCalled();
          });
        });
      });

      describe('when department is offline', () => {
        beforeAll(() => {
          formInfo = {
            display_name: 'Daenerys Targaryen',
            email: 'mother@of.dragons',
            phone: '87654321',
            message: 'bend the knee',
            department: 12345
          };

          mockDepartments = {
            12345: {
              status: 'offline'
            }
          };
        });

        it('calls updateChatScreen with LOADING_SCREEN', () => {
          expect(updateChatScreenSpy)
            .toHaveBeenCalledWith(loadingScreen);
        });

        it('calls sendOfflineMessage with formInfo', () => {
          expect(sendOfflineMessageSpy)
            .toHaveBeenCalledWith(formInfo, jasmine.any(Function), jasmine.any(Function));
        });

        it('calls updateChatScreen with offline screen when the callbackSuccess is invoked', () => {
          const callbackSuccess = sendOfflineMessageSpy.calls.mostRecent().args[1];

          callbackSuccess();

          expect(updateChatScreenSpy)
            .toHaveBeenCalledWith(offlineMessageScreen);
        });

        it('calls updateChatScreen with preChat screen when the callbackFailure is invoked', () => {
          const callbackFailure = sendOfflineMessageSpy.calls.mostRecent().args[2];

          callbackFailure();

          expect(updateChatScreenSpy)
            .toHaveBeenCalledWith(prechatScreen);
        });
      });
    });

    describe('when department is not specified', () => {
      beforeAll(() => {
        formInfo = {
          display_name: 'Daenerys Targaryen',
          email: 'mother@of.dragons',
          phone: '87654321'
        };

        mockDepartments = null;
      });

      it('calls clearDepartment with the correct arguments', () => {
        expect(clearDepartmentSpy)
          .toHaveBeenCalledWith(jasmine.any(Function));
      });

      it('should call setVisitorInfo with the correct arguments', () => {
        expect(setVisitorInfoSpy)
          .toHaveBeenCalledWith({
            display_name: 'Daenerys Targaryen',
            email: 'mother@of.dragons',
            phone: '87654321'
          });
      });

      it('calls updateChatScreen with the CHATTING_SCREEN', () => {
        expect(updateChatScreenSpy)
          .toHaveBeenCalledWith(chattingScreen);
      });

      describe('when there is a message to send', () => {
        beforeAll(() => {
          formInfo.message = 'Bend the knee m8.';
        });

        it('sends an online message', () => {
          clearDepartmentSpy.calls.mostRecent().args[0]();
          expect(sendMsgSpy)
            .toHaveBeenCalledWith('Bend the knee m8.');
        });
      });

      describe('when there is no message to send', () => {
        beforeAll(() => {
          formInfo.message = null;
        });

        it('does not send online message', () => {
          clearDepartmentSpy.calls.mostRecent().args[0]();
          expect(sendMsgSpy)
            .not
            .toHaveBeenCalled();
        });
      });
    });

    it('calls resetCurrentMessage', () => {
      expect(resetCurrentMessageSpy)
        .toHaveBeenCalled();
    });
  });

  describe('renderPrechatScreen', () => {
    let component,
      result;

    describe('when state.screen is `prechat`', () => {
      beforeEach(() => {
        component = instanceRender(
          <ChatOnline
            screen={prechatScreen}
            prechatFormSettings={prechatFormSettingsProp} />
        );
        result = component.renderPrechatScreen();
      });

      it('returns a component', () => {
        expect(result)
          .toBeTruthy();
      });

      describe('the scroll container wrapper', () => {
        it('has its classes prop to the scroll container style', () => {
          expect(result.props.classes)
            .toEqual('scrollContainerClasses');
        });

        it('has its containerClasses prop to the scrollContainerContent style', () => {
          expect(result.props.containerClasses)
            .toEqual('scrollContainerContentClasses');
        });

        it('renders the ChatPrechatForm component', () => {
          expect(TestUtils.isElementOfType(result.props.children, ChatPrechatForm))
            .toEqual(true);
        });
      });
    });

    describe('when state.screen is `offlinemessage`', () => {
      beforeEach(() => {
        component = instanceRender(
          <ChatOnline
            screen={offlineMessageScreen}
            prechatFormSettings={prechatFormSettingsProp} />
        );
        result = component.renderPrechatScreen();
      });

      it('returns a component', () => {
        expect(result)
          .toBeTruthy();
      });

      describe('the scroll container wrapper', () => {
        it('has its classes prop to the scroll container style', () => {
          expect(result.props.classes)
            .toEqual('scrollContainerClasses');
        });

        it('has its containerClasses prop to the scrollContainerContent style', () => {
          expect(result.props.containerClasses)
            .toEqual('scrollContainerContentClasses');
        });

        it('renders the ChatOfflineMessageForm component', () => {
          expect(TestUtils.isElementOfType(result.props.children, ChatOfflineMessageForm))
            .toEqual(true);
        });
      });
    });

    describe('when state.screen is `loading`', () => {
      beforeEach(() => {
        component = instanceRender(
          <ChatOnline
            screen={loadingScreen}
            prechatFormSettings={prechatFormSettingsProp} />
        );
        result = component.renderPrechatScreen();
      });

      it('returns a component', () => {
        expect(result)
          .toBeTruthy();
      });

      describe('the scroll container wrapper', () => {
        it('has its classes prop to the scroll container style', () => {
          expect(result.props.classes)
            .toEqual('scrollContainerClasses');
        });

        it('has its containerClasses prop to the scrollContainerContent style', () => {
          expect(result.props.containerClasses)
            .toEqual('scrollContainerContentClasses');
        });

        it('renders the LoadingSpinner component', () => {
          expect(TestUtils.isElementOfType(result.props.children, LoadingSpinner))
            .toEqual(true);
        });
      });
    });

    describe('when state.screen is not `prechat` and not `offlinemessage`', () => {
      beforeEach(() => {
        component = instanceRender(
          <ChatOnline
            screen={'yoloScreen'}
            prechatFormSettings={prechatFormSettingsProp} />
        );
        result = component.renderPrechatScreen();
      });

      it('should not render prechat form', () => {
        expect(result)
          .toBeUndefined();
      });
    });

    describe('scroll container classes', () => {
      describe('when user is on mobile', () => {
        beforeEach(() => {
          component = instanceRender(
            <ChatOnline
              screen={prechatScreen}
              prechatFormSettings={prechatFormSettingsProp}
              isMobile={true} />
          );
          result = component.renderPrechatScreen();
        });

        it('render mobileContainer class on scroll container', () => {
          expect(result.props.classes)
            .toContain('mobileContainerClasses');
        });
      });

      describe('when user is not on mobile', () => {
        beforeEach(() => {
          component = instanceRender(
            <ChatOnline
              screen={prechatScreen}
              prechatFormSettings={prechatFormSettingsProp}
              isMobile={false} />
          );
          result = component.renderPrechatScreen();
        });

        it('does not render mobileContainer class on scroll container', () => {
          expect(result.props.classes)
            .not
            .toContain('mobileContainerClasses');
        });
      });

      describe('when hideZendeskLogo is false', () => {
        beforeEach(() => {
          component = instanceRender(
            <ChatOnline
              screen={prechatScreen}
              prechatFormSettings={prechatFormSettingsProp}
              hideZendeskLogo={false} />
          );
          result = component.renderPrechatScreen();
        });

        it('renders logo in footer', () => {
          expect(TestUtils.isElementOfType(result.props.footerContent, ZendeskLogo))
            .toBeTruthy();
        });

        it('renders footer with correct class', () => {
          expect(result.props.footerClasses)
            .toContain('logoFooterClasses');
        });
      });

      describe('when hideZendeskLogo is true', () => {
        beforeEach(() => {
          component = instanceRender(
            <ChatOnline
              screen={prechatScreen}
              prechatFormSettings={prechatFormSettingsProp}
              hideZendeskLogo={true} />
          );
          result = component.renderPrechatScreen();
        });

        it('does not render logo in footer', () => {
          expect(result.props.footerContent)
            .toBeFalsy();
        });

        it('renders footer with correct class', () => {
          expect(result.props.footerClasses)
            .not.toContain('logoFooterClasses');
        });
      });
    });
  });

  describe('renderPostchatScreen', () => {
    let component;

    describe('when state.screen is not `feedback`', () => {
      beforeEach(() => {
        component = instanceRender(<ChatOnline screen={chattingScreen} />);
      });

      it('does not return anything', () => {
        expect(component.renderPostchatScreen())
          .toBeFalsy();
      });
    });

    describe('when state.screen is `feedback`', () => {
      beforeEach(() => {
        component = instanceRender(<ChatOnline screen={feedbackScreen} />);
      });

      it('returns a component', () => {
        expect(component.renderPostchatScreen())
          .toBeTruthy();
      });
    });
  });

  describe('renderChatScreen', () => {
    let component;

    describe('when state.screen is not `chatting`', () => {
      beforeEach(() => {
        component = instanceRender(
          <ChatOnline
            screen={prechatScreen}
            prechatFormSettings={prechatFormSettingsProp} />
        );
      });

      it('does not return anything', () => {
        expect(component.renderChatScreen())
          .toBeFalsy();
      });
    });

    describe('when state.screen is `chatting`', () => {
      beforeEach(() => {
        component = instanceRender(
          <ChatOnline
            screen={chattingScreen}
            prechatFormSettings={prechatFormSettingsProp} />
        );
      });

      it('returns a component', () => {
        expect(component.renderChatScreen())
          .toBeTruthy();
      });
    });
  });

  describe('renderChatMenu', () => {
    let component,
      mockEvent,
      mockUserSoundSettings,
      updateContactDetailsVisibilitySpy,
      updateEmailTranscriptVisibilitySpy,
      handleSoundIconClickSpy;

    describe('when method is called', () => {
      beforeEach(() => {
        component = instanceRender(<ChatOnline />);
      });

      it('returns a ChatMenu component', () => {
        expect(TestUtils.isElementOfType(component.renderChatMenu(), ChatMenu))
          .toEqual(true);
      });
    });

    describe('when prop.menuVisible is false', () => {
      beforeEach(() => {
        component = instanceRender(<ChatOnline menuVisible={false} />);
      });

      it('passes false to its popup components show prop', () => {
        expect(component.renderChatMenu().props.show)
          .toBe(false);
      });
    });

    describe('when prop.menuVisible is true', () => {
      beforeEach(() => {
        component = instanceRender(<ChatOnline menuVisible={true} />);
      });

      it('passes true to its popup components show prop', () => {
        expect(component.renderChatMenu().props.show)
          .toBe(true);
      });
    });

    describe('when prop.endChatOnClick is called', () => {
      let updateMenuVisibilitySpy;

      beforeEach(() => {
        updateMenuVisibilitySpy = jasmine.createSpy('updateMenuVisibility');
        component = instanceRender(<ChatOnline updateMenuVisibility={updateMenuVisibilitySpy} />);

        spyOn(component, 'setState');

        const chatMenu = component.renderChatMenu();

        mockEvent = { stopPropagation: jasmine.createSpy('stopPropagation') };
        chatMenu.props.endChatOnClick(mockEvent);
      });

      it('calls stopPropagation on event', () => {
        expect(mockEvent.stopPropagation)
          .toHaveBeenCalled();
      });

      it('calls updateMenuVisibility', () => {
        expect(updateMenuVisibilitySpy)
          .toHaveBeenCalledWith(false);
      });

      it('calls setState with expected arguments', () => {
        const expected = {
          showEndChatMenu: true
        };

        expect(component.setState)
          .toHaveBeenCalledWith(jasmine.objectContaining(expected));
      });
    });

    describe('when prop.contactDetailsOnClick is called', () => {
      beforeEach(() => {
        updateContactDetailsVisibilitySpy = jasmine.createSpy('updateContactDetailsVisibility');
        component = instanceRender(
          <ChatOnline updateContactDetailsVisibility={updateContactDetailsVisibilitySpy} />
        );

        const chatMenu = component.renderChatMenu();

        mockEvent = { stopPropagation: jasmine.createSpy('stopPropagation') };
        chatMenu.props.contactDetailsOnClick(mockEvent);
      });

      it('calls stopPropagation on event', () => {
        expect(mockEvent.stopPropagation)
          .toHaveBeenCalled();
      });

      it('calls updateContactDetailsVisibility with true', () => {
        expect(updateContactDetailsVisibilitySpy)
          .toHaveBeenCalledWith(true);
      });
    });

    describe('when prop.emailTranscriptOnClick is called', () => {
      beforeEach(() => {
        updateEmailTranscriptVisibilitySpy = jasmine.createSpy('updateEmailTranscriptVisibility');

        component = instanceRender(<ChatOnline updateEmailTranscriptVisibility={updateEmailTranscriptVisibilitySpy} />);

        spyOn(component, 'setState');

        const chatMenu = component.renderChatMenu();

        mockEvent = { stopPropagation: jasmine.createSpy('stopPropagation') };
        chatMenu.props.emailTranscriptOnClick(mockEvent);
      });

      it('calls stopPropagation on event', () => {
        expect(mockEvent.stopPropagation)
          .toHaveBeenCalled();
      });

      it('calls updateEmailTranscriptVisibility with true', () => {
        expect(updateEmailTranscriptVisibilitySpy)
          .toHaveBeenCalledWith(true);
      });
    });

    describe('when prop.onSoundClick is called', () => {
      beforeEach(() => {
        mockUserSoundSettings = false;
        handleSoundIconClickSpy = jasmine.createSpy('handleSoundIconClick');
        component = instanceRender(
          <ChatOnline
            userSoundSettings={mockUserSoundSettings}
            handleSoundIconClick={handleSoundIconClickSpy} />
        );

        const chatMenu = component.renderChatMenu();

        chatMenu.props.onSoundClick();
      });

      it('calls handleSoundIconClick with expected arguments', () => {
        const expected = { sound: !mockUserSoundSettings };

        expect(handleSoundIconClickSpy)
          .toHaveBeenCalledWith(jasmine.objectContaining(expected));
      });
    });
  });

  describe('renderChatEndPopup', () => {
    let component;

    describe('when the notification should be shown', () => {
      beforeEach(() => {
        component = instanceRender(
          <ChatOnline chat={{ rating: null }} />
        );
        component.setState({ showEndChatMenu: true });
      });

      it('passes true to its popup components show prop', () => {
        expect(component.renderChatEndPopup().props.show)
          .toBe(true);
      });
    });

    describe('when the notification should not be shown', () => {
      beforeEach(() => {
        component = instanceRender(<ChatOnline chat={{ rating: null }} />);
      });

      it('passes false to its popup components show prop', () => {
        expect(component.renderChatEndPopup().props.show)
          .toBe(false);
      });
    });
  });

  describe('renderChatContactDetailsPopup', () => {
    let chatContactDetailsPopup,
      mockVisitor,
      mockEditContactDetails,
      mockName,
      mockEmail,
      updateContactDetailsVisibilitySpy,
      setVisitorInfoSpy;

    beforeEach(() => {
      mockEditContactDetails = { show: true, status: 'error' };
      mockVisitor = { name: 'Terence', email: 'foo@bar.com' };

      const component = instanceRender(
        <ChatOnline
          editContactDetails={mockEditContactDetails}
          visitor={mockVisitor} />
      );

      chatContactDetailsPopup = component.renderChatContactDetailsPopup();
    });

    it('passes a status string to the popup component\'s screen prop', () => {
      expect(chatContactDetailsPopup.props.screen)
        .toBe(mockEditContactDetails.status);
    });

    it('passes the correct value to the popup component\'s show prop', () => {
      expect(chatContactDetailsPopup.props.show)
        .toBe(mockEditContactDetails.show);
    });

    it('passes an expected object to the popup component\'s visitor prop', () => {
      expect(chatContactDetailsPopup.props.visitor)
        .toEqual(jasmine.objectContaining(mockVisitor));
    });

    describe('when props.tryAgainFn is called', () => {
      beforeEach(() => {
        updateContactDetailsVisibilitySpy = jasmine.createSpy('updateEmailTranscriptVisibility');

        const component = instanceRender(
          <ChatOnline
            updateContactDetailsVisibility={updateContactDetailsVisibilitySpy}
            editContactDetails={{ show: true }} />
        );
        const popup = component.renderChatContactDetailsPopup();

        popup.props.tryAgainFn();
      });

      it('calls updateEmailTranscriptVisibility with true', () => {
        expect(updateContactDetailsVisibilitySpy)
          .toHaveBeenCalledWith(true);
      });
    });

    describe('when props.leftCtaFn is called', () => {
      beforeEach(() => {
        updateContactDetailsVisibilitySpy = jasmine.createSpy('updateContactDetailsVisibility');

        const component = instanceRender(
          <ChatOnline
            updateContactDetailsVisibility={updateContactDetailsVisibilitySpy}
            editContactDetails={mockEditContactDetails} />
        );
        const chatContactDetailsPopup = component.renderChatContactDetailsPopup();

        chatContactDetailsPopup.props.leftCtaFn();
      });

      it('calls updateContactDetailsVisibility with false', () => {
        expect(updateContactDetailsVisibilitySpy)
          .toHaveBeenCalledWith(false);
      });
    });

    describe('when props.rightCtaFn is called', () => {
      beforeEach(() => {
        setVisitorInfoSpy = jasmine.createSpy('setVisitorInfo');
        mockName = 'Terence';
        mockEmail = 'foo@bar.com';

        const component = instanceRender(
          <ChatOnline
            setVisitorInfo={setVisitorInfoSpy}
            editContactDetails={mockEditContactDetails} />
        );
        const chatContactDetailsPopup = component.renderChatContactDetailsPopup();

        chatContactDetailsPopup.props.rightCtaFn(mockName, mockEmail);
      });

      it('calls setVisitorInfo with an expected argument', () => {
        const expected = { display_name: mockName, email: mockEmail };

        expect(setVisitorInfoSpy)
          .toHaveBeenCalledWith(jasmine.objectContaining(expected));
      });
    });
  });

  describe('renderChatEmailTranscriptPopup', () => {
    let component,
      updateEmailTranscriptVisibilitySpy,
      sendEmailTranscriptSpy;

    describe('when the popup should be shown', () => {
      beforeEach(() => {
        component = instanceRender(
          <ChatOnline emailTranscript={{ show: true }} />
        );
      });

      it('passes true to its popup components show prop', () => {
        expect(component.renderChatEmailTranscriptPopup().props.show)
          .toBe(true);
      });
    });

    describe('when the popup should not be shown', () => {
      beforeEach(() => {
        component = instanceRender(<ChatOnline emailTranscript={{ show: false }} />);
      });

      it('does not render the component', () => {
        expect(component.renderChatEmailTranscriptPopup())
          .toBeUndefined();
      });
    });

    describe('when props.tryEmailTranscriptAgain is called', () => {
      beforeEach(() => {
        updateEmailTranscriptVisibilitySpy = jasmine.createSpy('updateEmailTranscriptVisibility');

        const component = instanceRender(
          <ChatOnline
            updateEmailTranscriptVisibility={updateEmailTranscriptVisibilitySpy}
            emailTranscript={{ show: true }} />
        );
        const popup = component.renderChatEmailTranscriptPopup();

        popup.props.tryEmailTranscriptAgain();
      });

      it('calls updateEmailTranscriptVisibility with true', () => {
        expect(updateEmailTranscriptVisibilitySpy)
          .toHaveBeenCalledWith(true);
      });
    });

    describe('when props.leftCtaFn is called', () => {
      beforeEach(() => {
        updateEmailTranscriptVisibilitySpy = jasmine.createSpy('updateEmailTranscriptVisibility');

        const component = instanceRender(
          <ChatOnline
            updateEmailTranscriptVisibility={updateEmailTranscriptVisibilitySpy}
            emailTranscript={{ show: true }} />
        );
        const popup = component.renderChatEmailTranscriptPopup();

        popup.props.leftCtaFn();
      });

      it('calls updateEmailTranscriptVisibility with false', () => {
        expect(updateEmailTranscriptVisibilitySpy)
          .toHaveBeenCalledWith(false);
      });
    });

    describe('when props.rightCtaFn is called', () => {
      let mockEmailTranscript;

      beforeEach(() => {
        sendEmailTranscriptSpy = jasmine.createSpy('sendEmailTranscript');
        mockEmailTranscript = { show: true, email: 'foo@bar.com' };

        const component = instanceRender(
          <ChatOnline
            sendEmailTranscript={sendEmailTranscriptSpy}
            emailTranscript={mockEmailTranscript} />
        );
        const popup = component.renderChatEmailTranscriptPopup();

        popup.props.rightCtaFn(mockEmailTranscript.email);
      });

      it('calls sendEmailTranscript with an expected argument', () => {
        const expected = mockEmailTranscript.email;

        expect(sendEmailTranscriptSpy)
          .toHaveBeenCalledWith(expected);
      });
    });
  });

  describe('renderAttachmentsBox', () => {
    let component;
    const renderChatComponent = (screen, attachmentsEnabled) => (
      instanceRender(
        <ChatOnline screen={screen} attachmentsEnabled={attachmentsEnabled} prechatFormSettings={prechatFormSettingsProp} />
      )
    );

    describe('when screen is not `chatting`', () => {
      beforeEach(() => {
        component = renderChatComponent(prechatScreen, true);
        component.handleDragEnter();
      });

      it('does not return anything', () => {
        expect(component.renderAttachmentsBox())
          .toBeFalsy();
      });
    });

    describe('when attachmentsEnabled is false', () => {
      beforeEach(() => {
        component = renderChatComponent(chattingScreen, false);
        component.handleDragEnter();
      });

      it('does not return anything', () => {
        expect(component.renderAttachmentsBox())
          .toBeFalsy();
      });
    });

    describe('when the component has not had handleDragEnter called on it', () => {
      beforeEach(() => {
        component = renderChatComponent(chattingScreen, true);
      });

      it('does not return anything', () => {
        expect(component.renderAttachmentsBox())
          .toBeFalsy();
      });
    });

    describe('when the screen is `chatting`, the attachments are enabled and handleDragEnter has been called', () => {
      beforeEach(() => {
        component = renderChatComponent(chattingScreen, true);
        component.handleDragEnter();
      });

      it('returns the AttachmentsBox component', () => {
        expect(TestUtils.isElementOfType(component.renderAttachmentsBox(), AttachmentBox))
          .toEqual(true);
      });
    });
  });

  describe('renderChatReconnectionBubble', () => {
    let connectionStatus,
      result;

    beforeEach(() => {
      const component = instanceRender(<ChatOnline connection={connectionStatus} />);

      result = component.renderChatReconnectionBubble();
    });

    describe('when the connection prop is set to connecting', () => {
      beforeAll(() => {
        connectionStatus = CONNECTION_STATUSES.CONNECTING;
      });

      it('returns the ChatReconnectingBubble component', () => {
        expect(TestUtils.isElementOfType(result, ChatReconnectionBubble))
          .toEqual(true);
      });
    });

    describe('when the connection prop is not set to connecting', () => {
      beforeAll(() => {
        connectionStatus = CONNECTION_STATUSES.CONNECTED;
      });

      it('returns undefined', () => {
        expect(result)
          .toBeUndefined();
      });
    });
  });

  describe('renderAgentListScreen', () => {
    let component,
      screen;

    beforeEach(() => {
      component = instanceRender(
        <ChatOnline
          screen={screen} />
      ).renderAgentListScreen();
    });

    describe('when the screen is not AGENT_LIST_SCREEN', () => {
      beforeAll(() => {
        screen = chattingScreen;
      });

      it('returns nothing', () => {
        expect(component)
          .toBeFalsy();
      });
    });

    describe('when the screen is AGENT_LIST_SCREEN', () => {
      beforeAll(() => {
        screen = AGENT_LIST_SCREEN;
      });

      it('returns a AgentScreen component', () => {
        expect(TestUtils.isElementOfType(component, AgentScreen))
          .toEqual(true);
      });
    });
  });

  describe('renderChatReconnectButton', () => {
    let connectionStatus,
      result;

    beforeEach(() => {
      const component = instanceRender(<ChatOnline connection={connectionStatus} />);

      result = component.renderChatReconnectButton();
    });

    describe('when the connection prop is set to closed', () => {
      beforeAll(() => {
        connectionStatus = CONNECTION_STATUSES.CLOSED;
      });

      it('returns a div with a ButtonPill component inside it', () => {
        expect(TestUtils.isElementOfType(result.props.children, ButtonPill))
          .toEqual(true);
      });
    });

    describe('when the connection prop is not set to closed', () => {
      beforeAll(() => {
        connectionStatus = CONNECTION_STATUSES.CONNECTED;
      });

      it('returns undefined', () => {
        expect(result)
          .toBeUndefined();
      });
    });
  });

  describe('showContactDetailsFn', () => {
    let updateContactDetailsVisibilitySpy,
      stopPropagationSpy;

    beforeEach(() => {
      updateContactDetailsVisibilitySpy = jasmine.createSpy('updateContactDetailsVisibility');
      stopPropagationSpy = jasmine.createSpy('stopPropagation');

      const component = instanceRender(
        <ChatOnline
          updateContactDetailsVisibility={updateContactDetailsVisibilitySpy}
        />
      );

      component.showContactDetailsFn({ stopPropagation: stopPropagationSpy });
    });

    it('stops the event propagating', () => {
      expect(stopPropagationSpy)
        .toHaveBeenCalled();
    });

    it('calls updateContactDetailsVisibility with true', () => {
      expect(updateContactDetailsVisibilitySpy)
        .toHaveBeenCalledWith(true);
    });
  });
});
