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
          agentMessageOverflow: 'agentMessageOverflowClasses'
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

  describe('chatNotification', () => {
    let chatNotification,
      mockNotification;

    describe('when chat notification.show is true', () => {
      beforeEach(() => {
        mockNotification = { show: true, proactive: true };
        chatNotification = shallowRender(
          <ChatNotificationPopup
            notification={mockNotification}
            chatNotificationDismissed={noop} />
        );
      });

      it('passes the prop show as true to ChatPopup', () => {
        expect(chatNotification.props.show)
          .toBe(true);
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

      it('returns a div containing the name', () => {
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
      agentMessage = chatNotification.renderAgentMessage('These violent delights have violent ends');
    });

    it('renders the message inside a div', () => {
      expect(agentMessage.props.children)
        .toEqual('These violent delights have violent ends');
    });

    describe("when agentMessage's scrollHeight is greater then it's clientHeight", () => {
      beforeEach(() => {
        chatNotification.agentMessage = { scrollHeight: 5, clientHeight: 3 };
        agentMessage = chatNotification.renderAgentMessage('');
      });

      it('has agentMessageOverflow classes', () => {
        expect(agentMessage.props.className)
          .toContain('agentMessageOverflowClasses');
      });
    });

    describe("when agentMessage's scrollHeight is less then it's clientHeight", () => {
      beforeEach(() => {
        chatNotification.agentMessage = { scrollHeight: 1, clientHeight: 3 };
        agentMessage = chatNotification.renderAgentMessage('');
      });

      it('does not have agentMessageOverflow classes', () => {
        expect(agentMessage.props.className)
          .not.toContain('agentMessageOverflowClasses');
      });
    });
  });
});
