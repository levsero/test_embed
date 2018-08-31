const prechatScreen = 'widget/chat/PRECHAT_SCREEN';
const chattingScreen = 'widget/chat/CHATTING_SCREEN';
const loadingScreen = 'widget/chat/LOADING_SCREEN';
const feedbackScreen = 'widget/chat/FEEDBACK_SCREEN';
const offlineMessageScreen = 'widget/chat/OFFLINE_MESSAGE_SCREEN';

describe('ChatOnline component', () => {
  let ChatOnline;

  const chatPath = buildSrcPath('component/chat/ChatOnline');
  const chatConstantsPath = buildSrcPath('constants/chat');

  const AGENT_LIST_SCREEN = 'widget/chat/AGENT_LIST_SCREEN';

  const updateChatScreenSpy = jasmine.createSpy('updateChatScreen');
  const resetCurrentMessageSpy = jasmine.createSpy('resetCurrentMessage');

  const AttachmentBox = noopReactComponent('AttachmentBox');
  const ChatMenu = noopReactComponent('ChatMenu');
  const ChatReconnectionBubble = noopReactComponent('ChatReconnectionBubble');
  const ButtonPill = noopReactComponent('ButtonPill');
  const LoadingSpinner = noopReactComponent('LoadingSpinner');
  const ZendeskLogo = noopReactComponent('ZendeskLogo');
  const AgentScreen = noopReactComponent('AgentScreen');

  const CONNECTION_STATUSES = requireUncached(chatConstantsPath).CONNECTION_STATUSES;
  const DEPARTMENT_STATUSES = requireUncached(chatConstantsPath).DEPARTMENT_STATUSES;

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      './ChatOnline.scss': {
        locals: {}
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
      'component/chat/prechat/PrechatScreen': noopReactComponent(),
      'component/button/ButtonPill': {
        ButtonPill
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

  describe('renderPrechatScreen', () => {
    let component,
      result;

    describe('when state.screen is `prechat`', () => {
      beforeEach(() => {
        component = instanceRender(
          <ChatOnline
            screen={prechatScreen} />
        );
        result = component.renderPrechatScreen();
      });

      it('returns a component', () => {
        expect(result)
          .toBeTruthy();
      });
    });

    describe('when state.screen is `offlinemessage`', () => {
      beforeEach(() => {
        component = instanceRender(
          <ChatOnline
            screen={offlineMessageScreen} />
        );
        result = component.renderPrechatScreen();
      });

      it('returns a component', () => {
        expect(result)
          .toBeTruthy();
      });
    });

    describe('when state.screen is `loading`', () => {
      beforeEach(() => {
        component = instanceRender(
          <ChatOnline
            screen={loadingScreen} />
        );
        result = component.renderPrechatScreen();
      });

      it('returns a component', () => {
        expect(result)
          .toBeTruthy();
      });
    });

    describe('when state.screen is not `prechat`, `loading` or `offlinemessage`', () => {
      beforeEach(() => {
        component = instanceRender(
          <ChatOnline
            screen={'yoloScreen'} />
        );
        result = component.renderPrechatScreen();
      });

      it('should not render prechat form', () => {
        expect(result)
          .toBeUndefined();
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
            screen={prechatScreen} />
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
            screen={chattingScreen} />
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
        <ChatOnline screen={screen} attachmentsEnabled={attachmentsEnabled} />
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
      isLoggingOut,
      result;

    beforeEach(() => {
      const component = instanceRender(<ChatOnline connection={connectionStatus} isLoggingOut={isLoggingOut} />);

      result = component.renderChatReconnectionBubble();
    });

    describe('when the connection prop is set to connecting', () => {
      beforeAll(() => {
        isLoggingOut = false;
        connectionStatus = CONNECTION_STATUSES.CONNECTING;
      });

      it('returns the ChatReconnectingBubble component', () => {
        expect(TestUtils.isElementOfType(result, ChatReconnectionBubble))
          .toEqual(true);
      });
    });

    describe('when the connection prop is not set to connecting', () => {
      beforeAll(() => {
        isLoggingOut = false;
        connectionStatus = CONNECTION_STATUSES.CONNECTED;
      });

      it('returns undefined', () => {
        expect(result)
          .toBeUndefined();
      });
    });

    describe('when user is logging out', () => {
      beforeAll(() => {
        connectionStatus = CONNECTION_STATUSES.CONNECTING;
        isLoggingOut = true;
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
      isLoggingOut,
      result;

    beforeEach(() => {
      const component = instanceRender(<ChatOnline connection={connectionStatus} isLoggingOut={isLoggingOut} />);

      result = component.renderChatReconnectButton();
    });

    describe('when the connection prop is set to closed', () => {
      beforeAll(() => {
        connectionStatus = CONNECTION_STATUSES.CLOSED;
        isLoggingOut = false;
      });

      it('returns a div with a ButtonPill component inside it', () => {
        expect(TestUtils.isElementOfType(result.props.children, ButtonPill))
          .toEqual(true);
      });
    });

    describe('when the connection prop is not set to closed', () => {
      beforeAll(() => {
        connectionStatus = CONNECTION_STATUSES.CONNECTED;
        isLoggingOut = false;
      });

      it('returns undefined', () => {
        expect(result)
          .toBeUndefined();
      });
    });

    describe('when user is logging out', () => {
      beforeAll(() => {
        connectionStatus = CONNECTION_STATUSES.CONNECTED;
        isLoggingOut = true;
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

  describe('toggleMenu', () => {
    let component, menuVisible, keypress, focusSpy;

    beforeEach(() => {
      component = domRender(<ChatOnline menuVisible={menuVisible} />);

      jasmine.clock().install();
      focusSpy = jasmine.createSpy('focus');
      component.menu = {
        focus: focusSpy
      };

      component.toggleMenu(keypress);
      jasmine.clock().tick();
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    describe('when menuVisibile is false', () => {
      beforeAll(() => {
        menuVisible = false;
      });

      describe('when keypress param is true', () => {
        beforeAll(() => {
          keypress = true;
        });

        it('calls focus on the menu', () => {
          expect(focusSpy)
            .toHaveBeenCalled();
        });
      });

      describe('when keypress param is false', () => {
        beforeAll(() => {
          keypress = false;
        });

        it('does not call focus on the menu', () => {
          expect(focusSpy)
            .not.toHaveBeenCalled();
        });
      });
    });

    describe('when menuVisibile is true', () => {
      beforeAll(() => {
        menuVisible = true;
      });

      describe('when keypress param is true', () => {
        beforeAll(() => {
          keypress = true;
        });

        it('does not call focus on the menu', () => {
          expect(focusSpy)
            .not.toHaveBeenCalled();
        });
      });

      describe('when keypress param is false', () => {
        beforeAll(() => {
          keypress = false;
        });

        it('does not call focus on the menu', () => {
          expect(focusSpy)
            .not.toHaveBeenCalled();
        });
      });
    });
  });
});
