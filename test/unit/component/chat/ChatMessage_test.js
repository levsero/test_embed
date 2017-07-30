describe('ChatMessage component', () => {
  let ChatMessage;
  const chatMessagePath = buildSrcPath('component/chat/ChatMessage');

  beforeEach(() => {
    resetDOM();
    mockery.enable();

    initMockRegistry({
      './ChatMessage.sass': {
        locals: {
          messageUser: 'messageUserClasses',
          messageAgent: 'messageAgentClasses',
          messageBubbleAvatar: 'messageBubbleAvatar',
          messageBubble: 'messageBubble',
          avatar: 'avatar',
          avatarDefault: 'avatarDefault',
          agentBackground: 'agentBackground',
          userBackground: 'userBackground'
        }
      },
      'component/chat/MessageBubble': {
        MessageBubble: class extends Component {
          render = () => <div className={this.props.className} />;
        }
      },
      'component/Avatar': {
        Avatar: class extends Component {
          render = () => <div />;
        }
      }
    });

    mockery.registerAllowable(chatMessagePath);
    ChatMessage = requireUncached(chatMessagePath).ChatMessage;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#render', () => {
    let chatMessageNode;

    describe('userClasses', () => {
      describe('when the message is from a agent', () => {
        beforeEach(() => {
          const component = domRender(<ChatMessage isAgent={true} />);

          chatMessageNode = ReactDOM.findDOMNode(component);
        });

        it('uses the correct styles', () => {
          expect(chatMessageNode.querySelector('.messageAgentClasses'))
            .toBeTruthy();

          expect(chatMessageNode.querySelector('.messageUserClasses'))
            .toBeFalsy();
        });
      });

      describe('when the message is not from a agent', () => {
        beforeEach(() => {
          const component = domRender(<ChatMessage isAgent={false} />);

          chatMessageNode = ReactDOM.findDOMNode(component);
        });

        it('uses the correct styles', () => {
          expect(chatMessageNode.querySelector('.messageUserClasses'))
            .toBeTruthy();

          expect(chatMessageNode.querySelector('.messageAgentClasses'))
            .toBeFalsy();
        });
      });
    });
  });

  describe('renderName', () => {
    let result;

    describe('when it is an agent and name is not empty', () => {
      beforeEach(() => {
        const component = domRender(<ChatMessage isAgent={true} name='Smith' />);

        result = component.renderName();
      });

      it('returns an Avatar component', () => {
        expect(result)
          .not.toBeNull();
      });
    });

    describe('for situations where it should not render name', () => {
      const subjects = [
        { name: '', isAgent: true },
        { name: 'bob', isAgent: false },
        { name: '', isAgent: false }
      ];

      _.each(subjects, (subject) => {
        beforeEach(() => {
          const component = domRender(<ChatMessage name={subject.name} isAgent={subject.isAgent} />);

          result = component.renderName();
        });

        it(`should return null for name: '${subject.name}', isAgent: ${subject.isAgent}`, () => {
          expect(result)
            .toBeNull();
        });
      });
    });
  });

  describe('renderAvatar', () => {
    let result;

    describe('when showAvatar is true', () => {
      beforeEach(() => {
        const component = instanceRender(<ChatMessage showAvatar={true} />);

        result = component.renderAvatar();
      });

      it('returns an Avatar component', () => {
        expect(result)
          .not.toBeNull();
      });
    });

    describe('when showAvatar is false', () => {
      beforeEach(() => {
        const component = instanceRender(<ChatMessage showAvatar={false} />);

        result = component.renderAvatar();
      });

      it('returns null', () => {
        expect(result)
          .toBeNull();
      });
    });

    describe('when avatarPath exists', () => {
      const imageUrl = 'https://www.fakesite.com/img/blah.jpg';

      beforeEach(() => {
        const component = instanceRender(<ChatMessage showAvatar={true} avatarPath={imageUrl} />);

        result = component.renderAvatar();
      });

      it('should render Avatar with avatar style', () => {
        expect(result.props.className)
          .toContain('avatar');
      });
    });

    describe('when avatarPath does not exist', () => {
      beforeEach(() => {
        const component = instanceRender(<ChatMessage showAvatar={true} />);

        result = component.renderAvatar();
      });

      it('should render Avatar with avatarDefault style', () => {
        expect(result.props.className)
          .toContain('avatarDefault');
      });
    });
  });

  describe('renderMessageBubble', () => {
    let result;

    describe('when the user is an agent', () => {
      beforeEach(() => {
        const component = instanceRender(<ChatMessage isAgent={true} />);

        result = component.renderMessageBubble();
      });

      it('should receive agent background styles', () => {
        expect(result.props.className)
          .toContain('agentBackground');
      });
    });

    describe('when the user is a visitor', () => {
      beforeEach(() => {
        const component = instanceRender(<ChatMessage isAgent={false} />);

        result = component.renderMessageBubble();
      });

      it('should receive user background styles', () => {
        expect(result.props.className)
          .toContain('userBackground');
      });
    });

    describe('when avatar should be shown', () => {
      beforeEach(() => {
        const component = instanceRender(<ChatMessage showAvatar={true} />);

        result = component.renderMessageBubble();
      });

      it('should receive avatar modified styles', () => {
        expect(result.props.className)
          .toContain('messageBubbleAvatar');
      });
    });

    describe('when avatar should not be shown', () => {
      beforeEach(() => {
        const component = instanceRender(<ChatMessage showAvatar={false} />);

        result = component.renderMessageBubble();
      });

      it('should receive default messageBubble styles', () => {
        expect(result.props.className)
          .toContain('messageBubble');
      });
    });
  });
});

