const prechatScreen = 'widget/chat/PRECHAT_SCREEN';
const chattingScreen = 'widget/chat/CHATTING_SCREEN';
const feedbackScreen = 'widget/chat/FEEDBACK_SCREEN';
const offlineMessageScreen = 'widget/chat/OFFLINE_MESSAGE_SCREEN';

describe('Chat component', () => {
  let Chat,
    isIE,
    isFirefox,
    prechatFormSettingsProp;

  const chatPath = buildSrcPath('component/chat/Chat');
  const chatConstantsPath = buildSrcPath('constants/chat');

  const EMAIL_TRANSCRIPT_SCREEN = 'widget/chat/EMAIL_TRANSCRIPT_SCREEN';
  const EMAIL_TRANSCRIPT_SUCCESS_SCREEN = 'widget/chat/EMAIL_TRANSCRIPT_SUCCESS_SCREEN';
  const EMAIL_TRANSCRIPT_FAILURE_SCREEN = 'widget/chat/EMAIL_TRANSCRIPT_FAILURE_SCREEN';
  const EMAIL_TRANSCRIPT_LOADING_SCREEN = 'widget/chat/EMAIL_TRANSCRIPT_LOADING_SCREEN';
  const AGENT_LIST_SCREEN = 'widget/chat/AGENT_LIST_SCREEN';

  const updateChatScreenSpy = jasmine.createSpy('updateChatScreen');
  const sendChatRatingSpy = jasmine.createSpy('sendChatRating');
  const sendChatCommentSpy = jasmine.createSpy('sendChatComment');
  const endChatSpy = jasmine.createSpy('endChat');
  const translationSpy = jasmine.createSpy('translation').and.callFake(_.identity);
  const resetCurrentMessageSpy = jasmine.createSpy('resetCurrentMessage');

  const AttachmentBox = noopReactComponent('AttachmentBox');
  const ChatMenu = noopReactComponent('ChatMenu');
  const ChatFeedbackForm = noopReactComponent('ChatFeedbackForm');
  const ChatReconnectionBubble = noopReactComponent('ChatReconnectionBubble');
  const ChatOfflineMessageForm = noopReactComponent('ChatOfflineMessageForm');
  const ChatPrechatForm = noopReactComponent('ChatPrechatForm');
  const Button = noopReactComponent('Button');
  const ButtonPill = noopReactComponent('ButtonPill');

  const CONNECTION_STATUSES = requireUncached(chatConstantsPath).CONNECTION_STATUSES;
  const DEPARTMENT_STATUSES = requireUncached(chatConstantsPath).DEPARTMENT_STATUSES;

  beforeEach(() => {
    mockery.enable();

    prechatFormSettingsProp = { form: {}, required: false };

    isIE = false;
    isFirefox = false;

    initMockRegistry({
      './Chat.scss': {
        locals: {
          scrollContainerMobile: 'scrollContainerMobileClasses',
          scrollContainerMessagesContent: 'scrollContainerMessagesContentClass',
          scrollContainerMessagesContentDesktop: 'scrollContainerMessagesContentDesktopClass',
          footer: 'footerClasses',
          footerMobile: 'footerMobileClasses',
          agentTyping: 'agentTypingClasses',
          scrollContainer: 'scrollContainerClasses',
          scrollContainerContent: 'scrollContainerContentClasses',
          scrollBarFix: 'scrollBarFix',
          agentListBackButton: 'agentListBackButtonClasses',
          mobileContainer: 'mobileContainerClasses'
        }
      },
      'component/button/Button': {
        Button
      },
      'component/chat/ChatAgentList': {
        ChatAgentList: noopReactComponent()
      },
      'component/button/ButtonPill': {
        ButtonPill
      },
      'component/chat/ChatBox': {
        ChatBox: noopReactComponent()
      },
      'component/chat/ChatHeader': {
        ChatHeader: noopReactComponent()
      },
      'component/chat/ChatPrechatForm': {
        ChatPrechatForm
      },
      'component/chat/ChatFooter': {
        ChatFooter: noopReactComponent()
      },
      'component/chat/ChatMenu': {
        ChatMenu: ChatMenu
      },
      'component/chat/ChatLog': {
        ChatLog: noopReactComponent()
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
      'component/chat/ChatFeedbackForm': {
        ChatFeedbackForm
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
        sendChatRating: sendChatRatingSpy,
        sendChatComment: sendChatCommentSpy,
        endChat: endChatSpy,
        resetCurrentMessage: resetCurrentMessageSpy
      },
      'src/redux/modules/chat/chat-selectors': {
        getPrechatFormFields: noop
      },
      'src/redux/modules/chat/chat-screen-types': {
        PRECHAT_SCREEN: prechatScreen,
        CHATTING_SCREEN: chattingScreen,
        FEEDBACK_SCREEN: feedbackScreen,
        OFFLINE_MESSAGE_SCREEN: offlineMessageScreen,
        EMAIL_TRANSCRIPT_SCREEN: EMAIL_TRANSCRIPT_SCREEN,
        EMAIL_TRANSCRIPT_SUCCESS_SCREEN: EMAIL_TRANSCRIPT_SUCCESS_SCREEN,
        EMAIL_TRANSCRIPT_FAILURE_SCREEN: EMAIL_TRANSCRIPT_FAILURE_SCREEN,
        AGENT_LIST_SCREEN
      },
      'service/i18n': {
        i18n: { t: translationSpy }
      },
      'utility/devices': {
        isIE: () => isIE,
        isFirefox: () => isFirefox
      },
      'constants/chat': {
        AGENT_BOT: 'agent:trigger',
        CONNECTION_STATUSES,
        DEPARTMENT_STATUSES
      },
      'src/util/utils': {
        chatNameDefault: noop
      },
      'component/chat/ChatOfflineMessageForm': {
        ChatOfflineMessageForm
      }
    });

    mockery.registerAllowable(chatPath);
    Chat = requireUncached(chatPath).default.WrappedComponent;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();

    updateChatScreenSpy.calls.reset();
    sendChatRatingSpy.calls.reset();
    sendChatCommentSpy.calls.reset();
    endChatSpy.calls.reset();
    translationSpy.calls.reset();
  });

  describe('onContainerClick', () => {
    let component,
      updateMenuVisibilitySpy,
      updateContactDetailsVisibilitySpy;

    beforeEach(() => {
      updateContactDetailsVisibilitySpy = jasmine.createSpy('updateContactDetailsVisibility');
      updateMenuVisibilitySpy = jasmine.createSpy('updateMenuVisibility');

      component = instanceRender(
        <Chat
          updateContactDetailsVisibility={updateContactDetailsVisibilitySpy}
          updateMenuVisibility={updateMenuVisibilitySpy}
        />
      );
      component.onContainerClick();
    });

    it('should set the correct state', () => {
      expect(component.state)
        .toEqual(jasmine.objectContaining({
          showEndChatMenu: false,
          showEmailTranscriptMenu: false
        }));
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
    let component,
      currentScreen,
      chats,
      events;

    beforeEach(() => {
      component = instanceRender(<Chat screen={currentScreen} chats={chats} events={events} />);
      spyOn(component, 'scrollToBottom');
      component.componentDidMount();
    });

    describe('when current screen is CHATTING_SCREEN', () => {
      describe('when there are chats', () => {
        beforeAll(() => {
          currentScreen = chattingScreen;
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
          currentScreen = chattingScreen;
          chats = [];
          events = [];
        });

        it('does not scroll to bottom', () => {
          expect(component.scrollToBottom)
            .not.toHaveBeenCalled();
        });
      });
    });

    describe('when current screen is not CHATTING_SCREEN', () => {
      beforeAll(() => {
        currentScreen = feedbackScreen;
        chats = [1,2];
        events = [3];
      });

      it('does not scroll to bottom', () => {
        expect(component.scrollToBottom)
          .not.toHaveBeenCalled();
      });
    });
  });

  describe('componentDidMount', () => {
    let updateChatBackButtonVisibilitySpy;

    beforeEach(() => {
      updateChatBackButtonVisibilitySpy = jasmine.createSpy('updateChatBackButtonVisibility');

      const component = instanceRender(<Chat updateChatBackButtonVisibility={updateChatBackButtonVisibilitySpy} />);

      component.componentDidMount();
    });

    it('calls props.updateChatBackButtonVisibility', () => {
      expect(updateChatBackButtonVisibilitySpy)
        .toHaveBeenCalled();
    });
  });

  describe('componentWillReceiveProps', () => {
    let emailTranscript,
      nextProps,
      component;

    describe('when next props emailTranscript screen is not EMAIL_TRANSCRIPT_SCREEN', () => {
      beforeEach(() => {
        emailTranscript = {
          screen: EMAIL_TRANSCRIPT_SUCCESS_SCREEN,
          email: 'yolo@yolo.com'
        };
        component = instanceRender(<Chat emailTranscript={emailTranscript} chats={[]} events={[]} />);
      });

      describe('when next props is different from previous props', () => {
        beforeEach(() => {
          nextProps = {
            emailTranscript: {
              screen: EMAIL_TRANSCRIPT_LOADING_SCREEN
            },
            chats: [],
            events: []
          };
          component.componentWillReceiveProps(nextProps);
        });

        it('should set the correct state', () => {
          expect(component.state)
            .toEqual(jasmine.objectContaining({
              showEmailTranscriptMenu: true
            }));
        });
      });

      describe('when next props is not different from previous props', () => {
        beforeEach(() => {
          nextProps = {
            emailTranscript: {
              screen: EMAIL_TRANSCRIPT_SUCCESS_SCREEN
            },
            chats: [],
            events: []
          };
          component.componentWillReceiveProps(nextProps);
        });

        it('should not update state', () => {
          expect(component.state)
            .toEqual(jasmine.objectContaining({
              showEmailTranscriptMenu: false
            }));
        });
      });
    });

    describe('when next props emailTranscript screen is EMAIL_TRANSCRIPT_SCREEN', () => {
      beforeEach(() => {
        emailTranscript = {
          screen: EMAIL_TRANSCRIPT_SCREEN,
          email: 'yolo@yolo.com'
        };
        component = instanceRender(<Chat emailTranscript={emailTranscript} chats={[]} events={[]} />);
      });

      describe('when next props is different from previous props', () => {
        beforeEach(() => {
          nextProps = {
            emailTranscript: {
              screen: EMAIL_TRANSCRIPT_SCREEN
            },
            chats: [],
            events: []
          };
          component.componentWillReceiveProps(nextProps);
        });

        it('should not update the state', () => {
          expect(component.state)
            .toEqual(jasmine.objectContaining({
              showEmailTranscriptMenu: false
            }));
        });
      });

      describe('when next props is not different from previous props', () => {
        beforeEach(() => {
          nextProps = {
            emailTranscript: {
              screen: EMAIL_TRANSCRIPT_SCREEN
            },
            chats: [],
            events: []
          };
          component.componentWillReceiveProps(nextProps);
        });

        it('should not update the state', () => {
          expect(component.state)
            .toEqual(jasmine.objectContaining({
              showEmailTranscriptMenu: false
            }));
        });
      });
    });

    describe('the updateChatBackButtonVisibility prop', () => {
      let updateChatBackButtonVisibilitySpy;

      beforeEach(() => {
        updateChatBackButtonVisibilitySpy = jasmine.createSpy('updateChatBackButtonVisibility');
        component = instanceRender(<Chat updateChatBackButtonVisibility={updateChatBackButtonVisibilitySpy} chats={[]} events={[]} />);
        nextProps = {
          emailTranscript: {},
          chats: [],
          events: []
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
        <Chat
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

        it('calls sendOfflineMessage with the correct arguments', () => {
          expect(sendOfflineMessageSpy)
            .toHaveBeenCalledWith({
              ...formInfo
            });
        });

        it('calls updateChatScreen with the OFFLINE_MESSAGE_SCREEN', () => {
          expect(updateChatScreenSpy)
            .toHaveBeenCalledWith(offlineMessageScreen);
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
          <Chat
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
          <Chat
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

    describe('when state.screen is not `prechat` and not `offlinemessage`', () => {
      beforeEach(() => {
        component = instanceRender(
          <Chat
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
            <Chat
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
            <Chat
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
    });
  });

  describe('renderPostchatScreen', () => {
    let component;

    describe('when state.screen is not `feedback`', () => {
      beforeEach(() => {
        component = instanceRender(
          <Chat
            screen={chattingScreen}
          />
        );
      });

      it('does not return anything', () => {
        expect(component.renderPostchatScreen())
          .toBeFalsy();
      });
    });

    describe('when state.screen is `feedback`', () => {
      const defaultRating = {
        value: 'default_rating',
        comment: null
      };

      beforeEach(() => {
        component = instanceRender(
          <Chat
            screen={feedbackScreen}
            rating={defaultRating}
            updateChatScreen={updateChatScreenSpy}
            endChat={endChatSpy}
            sendChatRating={sendChatRatingSpy}
            sendChatComment={sendChatCommentSpy}
          />
        );
      });

      it('returns a component', () => {
        expect(component.renderPostchatScreen())
          .toBeTruthy();
      });

      it('returns a component with the ChatFeedbackForm component as the first child', () => {
        const firstChild = component.renderPostchatScreen().props.children;

        expect(TestUtils.isElementOfType(firstChild, ChatFeedbackForm)).toEqual(true);
      });

      describe('the scroll container wrapper', () => {
        it('has its classes prop to the scroll container style', () => {
          expect(component.renderPostchatScreen().props.classes)
            .toEqual('scrollContainerClasses');
        });

        it('has its containerClasses prop to the scrollContainerContent style', () => {
          expect(component.renderPostchatScreen().props.containerClasses)
            .toEqual('scrollContainerContentClasses');
        });
      });

      describe('the sendClickFn passed as a prop to the ChatFeedbackForm', () => {
        let chatFeedbackFormComponent, sendClickFn;

        beforeEach(() => {
          chatFeedbackFormComponent = component.renderPostchatScreen().props.children;
          sendClickFn = chatFeedbackFormComponent.props.sendClickFn;
        });

        it('sends the chat rating if it has changed', () => {
          const newRating = { value: 'updated_rating'};

          sendClickFn(newRating);
          expect(sendChatRatingSpy).toHaveBeenCalledWith(newRating);
        });

        it('does not send the chat rating if it is the same', () => {
          sendClickFn(defaultRating.value);
          expect(sendChatRatingSpy).not.toHaveBeenCalled();
        });

        it('sends the comment if one is submitted', () => {
          const chatReviewComment = 'you are nice';

          sendClickFn(defaultRating.value, chatReviewComment);
          expect(sendChatCommentSpy).toHaveBeenCalledWith(chatReviewComment);
        });

        it('does not send the comment if it is not specified', () => {
          sendClickFn(defaultRating.value, null);
          expect(sendChatCommentSpy).not.toHaveBeenCalled();
        });

        it('redirects to the chatting screen', () => {
          sendClickFn(defaultRating.value);
          expect(updateChatScreenSpy).toHaveBeenCalledWith(chattingScreen);
        });

        describe('when the components state has endChatFromFeedbackForm set to true', () => {
          beforeEach(() => {
            component.setState({ endChatFromFeedbackForm: true });
            sendClickFn = sendClickFn.bind(component);
          });

          it('ends the chat', () => {
            sendClickFn(defaultRating.value);
            expect(endChatSpy).toHaveBeenCalled();
          });
        });

        describe('when the components state has endChatFromFeedbackForm set to false', () => {
          beforeEach(() => {
            component.setState({ endChatFromFeedbackForm: false });
            sendClickFn = sendClickFn.bind(component);
          });

          it('does not end the chat', () => {
            sendClickFn(defaultRating.value);
            expect(endChatSpy).not.toHaveBeenCalled();
          });
        });
      });

      describe('the skipClickFn passed as a prop to the ChatFeedbackForm', () => {
        let chatFeedbackFormComponent, skipClickFn;

        beforeEach(() => {
          chatFeedbackFormComponent = component.renderPostchatScreen().props.children;
          skipClickFn = chatFeedbackFormComponent.props.skipClickFn;
        });

        it('redirects to the chatting screen', () => {
          skipClickFn();
          expect(updateChatScreenSpy).toHaveBeenCalledWith(chattingScreen);
        });

        describe('when the components state has endChatFromFeedbackForm set to true', () => {
          beforeEach(() => {
            component.setState({ endChatFromFeedbackForm: true });
            skipClickFn = skipClickFn.bind(component);
          });

          it('ends the chat', () => {
            skipClickFn();
            expect(endChatSpy).toHaveBeenCalled();
          });
        });

        describe('when the components state has endChatFromFeedbackForm set to false', () => {
          beforeEach(() => {
            component.setState({ endChatFromFeedbackForm: false });
            skipClickFn = skipClickFn.bind(component);
          });

          it('does not end the chat', () => {
            skipClickFn();
            expect(endChatSpy).not.toHaveBeenCalled();
          });
        });
      });
    });
  });

  describe('renderChatScreen', () => {
    let component, result;
    const renderChatComponent = (ratingsEnabled, agents, isMobile) => (
      instanceRender(
        <Chat
          screen={chattingScreen}
          ratingSettings={{ enabled: ratingsEnabled }}
          agents={agents}
          isMobile={isMobile} />
      )
    );

    describe('render', () => {
      beforeEach(() => {
        component = renderChatComponent(true, {});
      });

      describe('footer classNames on non-mobile devices', () => {
        it('has desktop specific classes', () => {
          result = component.renderChatScreen();
          expect(result.props.footerClasses)
            .toContain('footerClasses');
          expect(result.props.footerClasses)
            .not.toContain('footerMobileClasses');
        });
      });

      describe('footer classNames on mobile devices', () => {
        beforeEach(() => {
          component = renderChatComponent(true, {}, true);
        });

        it('has mobile specific classes', () => {
          result = component.renderChatScreen();
          expect(result.props.footerClasses)
            .toContain('footerClasses');
          expect(result.props.footerClasses)
            .toContain('footerMobileClasses');
        });
      });

      describe('the renderChatHeader call', () => {
        beforeEach(() => {
          component = instanceRender(<Chat screen={chattingScreen} />);
          spyOn(component, 'renderChatHeader');
          component.renderChatScreen();
        });

        it('calls renderChatHeader', () => {
          expect(component.renderChatHeader)
            .toHaveBeenCalled();
        });
      });
    });

    describe('when state.screen is not `chatting`', () => {
      beforeEach(() => {
        component = instanceRender(
          <Chat
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
          <Chat
            screen={chattingScreen}
            prechatFormSettings={prechatFormSettingsProp} />
        );
      });

      it('returns a component', () => {
        expect(component.renderChatScreen())
          .toBeTruthy();
      });
    });

    describe('when state.lastAgentLeaveEvent contains an event', () => {
      const leaveEvent = {nick: 'agent:123', type: 'chat.memberleave'};

      beforeEach(() => {
        component = instanceRender(
          <Chat
            screen={chattingScreen}
            lastAgentLeaveEvent={leaveEvent} />
        );
      });

      it("passes the event to the chatLog component's `lastAgentLeaveEvent` prop", () => {
        const scrollContainer = component.renderChatScreen().props.children;
        const chatLog = scrollContainer.props.children[0];
        const lastAgentLeaveEvent = chatLog.props.lastAgentLeaveEvent;

        expect(lastAgentLeaveEvent)
          .toEqual(leaveEvent);
      });
    });

    describe('when state.lastAgentLeaveEvent does not contain an event', () => {
      const leaveEvent = null;

      beforeEach(() => {
        component = instanceRender(
          <Chat
            screen={chattingScreen}
            lastAgentLeaveEvent={leaveEvent} />
        );
      });

      it("passes null to the chatLog component's `lastAgentLeaveEvent` prop", () => {
        const scrollContainer = component.renderChatScreen().props.children;
        const chatLog = scrollContainer.props.children[0];
        const lastAgentLeaveEvent = chatLog.props.lastAgentLeaveEvent;

        expect(lastAgentLeaveEvent)
          .toEqual(null);
      });
    });

    describe('for non mobile devices', () => {
      beforeEach(() => {
        component = instanceRender(<Chat screen={chattingScreen} />);
      });

      it('adds the scrollContainerMessagesContentDesktop to it', () => {
        expect(component.renderChatScreen().props.containerClasses)
          .toContain('scrollContainerMessagesContentDesktopClass');
      });

      it('does not add the scrollContainerMobile class to it', () => {
        expect(component.renderChatScreen().props.containerClasses)
          .not
          .toContain('scrollContainerMobileClasses');
      });

      it('does not add scrollContainerMessagesContent class to it', () => {
        expect(component.renderChatScreen().props.containerClasses)
          .not
          .toContain('scrollContainerMessagesContentClass');
      });
    });

    describe('for mobile devices', () => {
      beforeEach(() => {
        component = instanceRender(<Chat isMobile={true} screen={chattingScreen} />);
      });

      it('does not add the scrollContainerMessagesContentDesktop to it', () => {
        expect(component.renderChatScreen().props.containerClasses)
          .not
          .toContain('scrollContainerMessagesContentDesktopClass');
      });

      it('adds mobile container classes to scrollContainer', () => {
        expect(component.renderChatScreen().props.containerClasses)
          .toContain('scrollContainerMobileClasses');
      });

      it('adds scrollContainerMessagesContent class to it', () => {
        expect(component.renderChatScreen().props.containerClasses)
          .toContain('scrollContainerMessagesContentClass');
      });
    });

    describe('when the browser is Firefox', () => {
      beforeEach(() => {
        isFirefox = true;
        component = instanceRender(<Chat screen={chattingScreen} />);
      });

      it('adds the scrollbar fix classes to scrollContainer', () => {
        expect(component.renderChatScreen().props.containerClasses)
          .toContain('scrollBarFix');
      });
    });

    describe('when the browser is Internet Explorer', () => {
      beforeEach(() => {
        isIE = true;
        component = instanceRender(<Chat screen={chattingScreen} />);
      });

      it('adds the scrollbar fix classes to scrollContainer', () => {
        expect(component.renderChatScreen().props.containerClasses)
          .toContain('scrollBarFix');
      });
    });

    describe('the scroll container wrapper', () => {
      beforeEach(() => {
        component = instanceRender(<Chat screen={chattingScreen} />);
      });

      it('has its classes prop to the scroll container style', () => {
        expect(component.renderChatScreen().props.classes)
          .toEqual('scrollContainerClasses');
      });
    });
  });

  describe('renderChatMenu', () => {
    let component,
      mockEvent,
      mockUserSoundSettings,
      updateContactDetailsVisibilitySpy,
      handleSoundIconClickSpy;

    describe('when method is called', () => {
      beforeEach(() => {
        component = instanceRender(<Chat />);
      });

      it('returns a ChatMenu component', () => {
        expect(TestUtils.isElementOfType(component.renderChatMenu(), ChatMenu))
          .toEqual(true);
      });
    });

    describe('when prop.menuVisible is false', () => {
      beforeEach(() => {
        component = instanceRender(<Chat menuVisible={false} />);
      });

      it('passes false to its popup components show prop', () => {
        expect(component.renderChatMenu().props.show)
          .toBe(false);
      });
    });

    describe('when prop.menuVisible is true', () => {
      beforeEach(() => {
        component = instanceRender(<Chat menuVisible={true} />);
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
        component = instanceRender(<Chat updateMenuVisibility={updateMenuVisibilitySpy} />);

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
      let updateMenuVisibilitySpy;

      beforeEach(() => {
        updateMenuVisibilitySpy = jasmine.createSpy('updateMenuVisibility');
        updateContactDetailsVisibilitySpy = jasmine.createSpy('updateContactDetailsVisibility');
        component = instanceRender(
          <Chat
            updateContactDetailsVisibility={updateContactDetailsVisibilitySpy}
            updateMenuVisibility={updateMenuVisibilitySpy}
          />
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

      it('calls updateMenuVisibility with false', () => {
        expect(updateMenuVisibilitySpy)
          .toHaveBeenCalledWith(false);
      });
    });

    describe('when prop.emailTranscriptOnClick is called', () => {
      let updateMenuVisibilitySpy;

      beforeEach(() => {
        updateMenuVisibilitySpy = jasmine.createSpy('updateMenuVisibility');

        component = instanceRender(<Chat updateMenuVisibility={updateMenuVisibilitySpy} />);

        spyOn(component, 'setState');

        const chatMenu = component.renderChatMenu();

        mockEvent = { stopPropagation: jasmine.createSpy('stopPropagation') };
        chatMenu.props.emailTranscriptOnClick(mockEvent);
      });

      it('calls stopPropagation on event', () => {
        expect(mockEvent.stopPropagation)
          .toHaveBeenCalled();
      });

      it('calls setState with expected arguments', () => {
        const expected = {
          showEmailTranscriptMenu: true
        };

        expect(component.setState)
          .toHaveBeenCalledWith(jasmine.objectContaining(expected));
      });

      it('calls updateMenuVisibility with false', () => {
        expect(updateMenuVisibilitySpy)
          .toHaveBeenCalledWith(false);
      });
    });

    describe('when prop.onSoundClick is called', () => {
      beforeEach(() => {
        mockUserSoundSettings = false;
        handleSoundIconClickSpy = jasmine.createSpy('handleSoundIconClick');
        component = instanceRender(
          <Chat
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
          <Chat chat={{ rating: null }} />
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
        component = instanceRender(<Chat chat={{ rating: null }} />);
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
        <Chat
          editContactDetails={mockEditContactDetails}
          visitor={mockVisitor} />
      );

      chatContactDetailsPopup = component.renderChatContactDetailsPopup();
    });

    it(`passes a status string to the popup component's screen prop`, () => {
      expect(chatContactDetailsPopup.props.screen)
        .toBe('error');
    });

    it(`passes true to the popup component's show prop`, () => {
      expect(chatContactDetailsPopup.props.show)
        .toBe(true);
    });

    it(`passes an expected object to the popup component's visitor prop`, () => {
      expect(chatContactDetailsPopup.props.visitor)
        .toEqual(jasmine.objectContaining(mockVisitor));
    });

    describe('when props.leftCtaFn is called', () => {
      beforeEach(() => {
        updateContactDetailsVisibilitySpy = jasmine.createSpy('updateContactDetailsVisibility');

        const component = instanceRender(<Chat updateContactDetailsVisibility={updateContactDetailsVisibilitySpy} />);
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

        const component = instanceRender(<Chat setVisitorInfo={setVisitorInfoSpy} />);
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
    let component;

    describe('when the popup should be shown', () => {
      beforeEach(() => {
        component = instanceRender(<Chat />);
        component.setState({ showEmailTranscriptMenu: true });
      });

      it('passes true to its popup components show prop', () => {
        expect(component.renderChatEmailTranscriptPopup().props.show)
          .toBe(true);
      });
    });

    describe('when the popup should not be shown', () => {
      beforeEach(() => {
        component = instanceRender(<Chat />);
      });

      it('passes false to its popup components show prop', () => {
        expect(component.renderChatEmailTranscriptPopup().props.show)
          .toBe(false);
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
          const component = instanceRender(<Chat agents={mockAgents} queuePosition={queuePosition} />);

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
          const component = instanceRender(<Chat agents={mockAgents} queuePosition={queuePosition} />);

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
        const component = instanceRender(<Chat agents={mockAgents} queuePosition={queuePosition} />);

        queuePositionComponent = component.renderQueuePosition();
      });

      it('returns null', () => {
        expect(queuePositionComponent)
          .toBeNull();
      });
    });
  });

  describe('renderAgentTyping', () => {
    let agentTypingComponent,
      mockAgents;

    describe('when no agents are typing a message', () => {
      beforeEach(() => {
        mockAgents = [
          { display_name: 'Wayne', typing: false }
        ];

        const component = instanceRender(<Chat chat={{ rating: null }} agents={mockAgents} />);

        agentTypingComponent = component.renderAgentTyping();
      });

      it('renders nothing', () => {
        expect(agentTypingComponent)
          .toBeNull();
      });
    });

    describe('when there is an agent typing a message', () => {
      beforeEach(() => {
        mockAgents = [
          { display_name: 'Wayne', typing: true }
        ];

        const component = instanceRender(<Chat chat={{ rating: null }} agents={mockAgents} />);

        agentTypingComponent = component.renderAgentTyping();
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

    describe('when a trigger agent bot is typing', () => {
      beforeEach(() => {
        mockAgents = {
          'agent:trigger': { display_name: 'agent', typing: true }
        };

        const component = instanceRender(<Chat chat={{ rating: null }} agents={mockAgents} />);

        agentTypingComponent = component.renderAgentTyping();
      });

      it('renders nothing', () => {
        expect(agentTypingComponent)
          .toBeNull();
      });
    });

    describe('when two agents are typing a message', () => {
      beforeEach(() => {
        mockAgents = [
          { display_name: 'Wayne', typing: true },
          { display_name: 'Terence', typing: true }
        ];

        const component = instanceRender(<Chat chat={{ rating: null }} agents={mockAgents} />);

        agentTypingComponent = component.renderAgentTyping();
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
        mockAgents = [
          { display_name: 'Wayne', typing: true },
          { display_name: 'Terence', typing: true },
          { display_name: 'Mandy', typing: true }
        ];

        const component = instanceRender(<Chat chat={{ rating: null }} agents={mockAgents} />);

        agentTypingComponent = component.renderAgentTyping();
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
      screen,
      updateChatScreenSpy,
      chatHeaderComponent;

    beforeEach(() => {
      updateChatScreenSpy = jasmine.createSpy('updateChatScreen');

      const component = instanceRender(
        <Chat
          ratingSettings={ratingSettings}
          agentJoined={agentJoined}
          agents={agents}
          screen={screen}
          updateChatScreen={updateChatScreenSpy} />
        );

      chatHeaderComponent = component.renderChatHeader();
    });

    describe('when there is an agent actively in the chat', () => {
      beforeAll(() => {
        agents = { 'agent:123456': { display_name: 'agent' } };
      });

      describe('when on the chatting screen', () => {
        beforeAll(() => {
          screen = chattingScreen;
        });

        beforeEach(() => {
          chatHeaderComponent.props.onAgentDetailsClick();
        });

        it('passes a function which calls updateChatScreen with agent list screen', () => {
          expect(updateChatScreenSpy)
            .toHaveBeenCalledWith(AGENT_LIST_SCREEN);
        });
      });

      describe('when not on the chatting screen', () => {
        beforeAll(() => {
          screen = feedbackScreen;
        });

        it('passes null to the onAgentDetailsClick prop', () => {
          expect(chatHeaderComponent.props.onAgentDetailsClick)
            .toBeNull();
        });
      });
    });

    describe('when there is no agent actively in the chat', () => {
      beforeAll(() => {
        screen = chattingScreen;
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

      describe('when on the chatting screen', () => {
        beforeAll(() => {
          screen = chattingScreen;
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

      describe('when not on the chatting screen', () => {
        beforeAll(() => {
          screen = feedbackScreen;
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
      });
    });

    describe('when agent has not joined', () => {
      beforeAll(() => {
        screen = chattingScreen;
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

  describe('renderAttachmentsBox', () => {
    let component;
    const renderChatComponent = (screen, attachmentsEnabled) => (
      instanceRender(
        <Chat screen={screen} attachmentsEnabled={attachmentsEnabled} prechatFormSettings={prechatFormSettingsProp} />
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
      const component = instanceRender(<Chat connection={connectionStatus} />);

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
      isMobile = false,
      updateChatScreenSpy;

    beforeEach(() => {
      updateChatScreenSpy = jasmine.createSpy('updateChatScreen');
      component = instanceRender(
        <Chat
          screen={AGENT_LIST_SCREEN}
          isMobile={isMobile}
          updateChatScreen={updateChatScreenSpy} />
      ).renderAgentListScreen();
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
            .toEqual('agentListBackButtonClasses');
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
              .toHaveBeenCalledWith(chattingScreen);
          });
        });
      });
    });
  });

  describe('renderChatReconnectButton', () => {
    let connectionStatus,
      result;

    beforeEach(() => {
      const component = instanceRender(<Chat connection={connectionStatus} />);

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
    let updateMenuVisibilitySpy,
      updateContactDetailsVisibilitySpy,
      stopPropagationSpy;

    beforeEach(() => {
      updateMenuVisibilitySpy = jasmine.createSpy('updateMenuVisibility');
      updateContactDetailsVisibilitySpy = jasmine.createSpy('updateContactDetailsVisibility');
      stopPropagationSpy = jasmine.createSpy('stopPropagation');

      const component = instanceRender(
        <Chat
          updateMenuVisibility={updateMenuVisibilitySpy}
          updateContactDetailsVisibility={updateContactDetailsVisibilitySpy}
        />
      );

      component.showContactDetailsFn({ stopPropagation: stopPropagationSpy });
    });

    it('stops the event propagating', () => {
      expect(stopPropagationSpy)
        .toHaveBeenCalled();
    });

    it('calls updateMenuVisibility with false', () => {
      expect(updateMenuVisibilitySpy)
        .toHaveBeenCalledWith(false);
    });

    it('calls updateContactDetailsVisibility with true', () => {
      expect(updateContactDetailsVisibilitySpy)
        .toHaveBeenCalledWith(true);
    });
  });
});
