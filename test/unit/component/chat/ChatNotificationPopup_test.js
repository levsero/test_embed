describe('ChatNotificationPopup component', () => {
  let ChatNotificationPopup;
  const chatMenuPath = buildSrcPath('component/chat/ChatNotificationPopup');

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      './ChatNotificationPopup.scss': {
        locals: {
          ongoingNotificationCta: 'ongoingNotificationCtaClasses',
          ongoingNotification: 'ongoingNotificationClasses',
          agentMessageOverflow: 'agentMessageOverflowClasses',
          proactiveAvatar: 'proactiveAvatarClasses',
          avatar: 'avatarClasses'
        }
      },
      'component/Avatar': {
        Avatar: noopReactComponent()
      },
      'component/chat/ChatPopup': {
        ChatPopup: class extends Component {
          render() {
            return <div className={`${this.props.className} ChatPopup`} />;
          }
        }
      },
      'service/i18n': {
        i18n: {
          t: noop
        }
      }
    });

    mockery.registerAllowable(chatMenuPath);
    ChatNotificationPopup = requireUncached(chatMenuPath).ChatNotificationPopup;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('render', () => {
    let chatNotification,
      mockNotification;

    beforeEach(() => {
      mockNotification = { show: true, proactive: true };
      chatNotification = shallowRender(
        <ChatNotificationPopup
          notification={mockNotification}
          chatNotificationDismissed={noop} />
      );
    });

    describe('when notification.proactive is true', () => {
      it('applies the ongoingNotificationCta class', () => {
        expect(chatNotification.props.className)
          .toContain('ongoingNotificationCtaClasses');
      });
    });

    describe('when notification.proactive is false', () => {
      beforeEach(() => {
        mockNotification = { show: true, proactive: false };
        chatNotification = shallowRender(
          <ChatNotificationPopup
            notification={mockNotification}
            chatNotificationDismissed={noop} />
        );
      });

      it('applies the ongoingNotificationCta class', () => {
        expect(chatNotification.props.className)
          .toContain('ongoingNotificationClasses');
      });
    });

    describe('when chat notification.show is true', () => {
      it('passes the prop show as true to ChatPopup', () => {
        expect(chatNotification.props.show)
          .toBe(true);
      });
    });

    describe('when chat notification.show is false', () => {
      beforeEach(() => {
        mockNotification = { show: false };

        chatNotification = shallowRender(
          <ChatNotificationPopup
            notification={mockNotification} />
        );
      });

      it('passes the prop show as false to ChatPopup', () => {
        expect(chatNotification.props.show)
          .toBe(false);
      });
    });
  });

  describe('renderProactiveContent', () => {
    let chatNotification,
      mockNotification,
      proactiveContent;

    describe('when the chat is proactive', () => {
      beforeEach(() => {
        mockNotification = {
          show: true,
          proactive: true,
          display_name: 'Dolores',
          msg: 'These violent delights have violent ends'
        };
        chatNotification = domRender(
          <ChatNotificationPopup
            notification={mockNotification}
            chatNotificationDismissed={noop} />
        );
        spyOn(chatNotification, 'renderAgentName');
        spyOn(chatNotification, 'renderAgentMessage');
        proactiveContent = chatNotification.renderProactiveContent();
      });

      it('applies proactiveAvatar classes to the avatar', () => {
        expect(proactiveContent.props.children[0].props.className)
          .toContain('proactiveAvatarClasses');
      });

      it('calls renderAgentName with the display_name from the notification prop', () => {
        expect(chatNotification.renderAgentName)
          .toHaveBeenCalledWith('Dolores');
      });

      it('calls renderAgentMessage with the msg from the notification prop', () => {
        expect(chatNotification.renderAgentMessage)
          .toHaveBeenCalledWith('These violent delights have violent ends');
      });
    });

    describe('when the chat is not proactive', () => {
      beforeEach(() => {
        mockNotification = { show: true, proactive: false };
        chatNotification = domRender(
          <ChatNotificationPopup
            notification={mockNotification}
            chatNotificationDismissed={noop} />
        );
        spyOn(chatNotification, 'renderAgentName');
        spyOn(chatNotification, 'renderAgentMessage');
        proactiveContent = chatNotification.renderProactiveContent();
      });

      it('applies avatar classes to the avatar', () => {
        expect(proactiveContent.props.children[0].props.className)
          .toContain('avatarClasses');
      });

      it('calls renderAgentName with an empty string', () => {
        expect(chatNotification.renderAgentName)
          .toHaveBeenCalledWith('');
      });

      it('calls renderAgentMessage with undefined', () => {
        expect(chatNotification.renderAgentMessage)
          .toHaveBeenCalledWith(undefined);
      });
    });
  });

  describe('renderAgentName', () => {
    let chatNotification,
      mockNotification,
      agentName;

    beforeEach(() => {
      mockNotification = { show: true, proactive: false };
      chatNotification = domRender(
        <ChatNotificationPopup
          notification={mockNotification}
          chatNotificationDismissed={noop} />
      );
    });

    describe('when agentName is an empty string', () => {
      beforeEach(() => {
        agentName = chatNotification.renderAgentName('');
      });

      it('returns null', () => {
        expect(agentName)
          .toBe(null);
      });
    });

    describe('when agentName is defined', () => {
      beforeEach(() => {
        agentName = chatNotification.renderAgentName('Agent Smith');
      });

      it('renders a div', () => {
        expect(TestUtils.isElementOfType(agentName, 'div'))
          .toEqual(true);
      });

      it('contains the name', () => {
        expect(agentName.props.children)
          .toEqual('Agent Smith');
      });
    });
  });

  describe('renderAgentMessage', () => {
    let chatNotification,
      mockNotification,
      agentMessage;

    beforeEach(() => {
      mockNotification = { show: true, proactive: false };
      chatNotification = domRender(
        <ChatNotificationPopup
          notification={mockNotification}
          chatNotificationDismissed={noop} />
      );
    });

    describe("when agentMessage's scrollHeight is greater then its clientHeight", () => {
      beforeEach(() => {
        chatNotification.agentMessage = { scrollHeight: 5, clientHeight: 3 };
        agentMessage = chatNotification.renderAgentMessage('These violent delights have violent ends');
      });

      it('renders a div', () => {
        expect(TestUtils.isElementOfType(agentMessage, 'div'))
          .toEqual(true);
      });

      it('renders the message inside it', () => {
        expect(agentMessage.props.children)
          .toEqual('These violent delights have violent ends');
      });

      it('has agentMessageOverflow classes', () => {
        expect(agentMessage.props.className)
          .toContain('agentMessageOverflowClasses');
      });
    });

    describe("when agentMessage's scrollHeight is less then its clientHeight", () => {
      beforeEach(() => {
        chatNotification.agentMessage = { scrollHeight: 1, clientHeight: 3 };
        agentMessage = chatNotification.renderAgentMessage('These violent delights have violent ends');
      });

      it('renders a div', () => {
        expect(TestUtils.isElementOfType(agentMessage, 'div'))
          .toEqual(true);
      });

      it('renders the message inside it', () => {
        expect(agentMessage.props.children)
          .toEqual('These violent delights have violent ends');
      });

      it('does not have agentMessageOverflow classes', () => {
        expect(agentMessage.props.className)
          .not.toContain('agentMessageOverflowClasses');
      });
    });
  });
});
