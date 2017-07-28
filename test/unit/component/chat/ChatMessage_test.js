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
          avatarDefault: 'avatarDefault'
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

    describe('messageBubbleStyle', () => {
      describe('when avatar should show', () => {
        beforeEach(() => {
          const component = domRender(<ChatMessage showAvatar={true} />);

          chatMessageNode = ReactDOM.findDOMNode(component);
        });

        it('uses messageBubbleAvatar style', () => {
          expect(chatMessageNode.querySelector('.messageBubbleAvatar'))
            .toBeTruthy();
        });
      });

      describe('when avatar should not show', () => {
        beforeEach(() => {
          const component = domRender(<ChatMessage showAvatar={false} />);

          chatMessageNode = ReactDOM.findDOMNode(component);
        });

        it('uses messageBubble style', () => {
          expect(chatMessageNode.querySelector('.messageBubble'))
            .toBeTruthy();
        });
      });
    });

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
    let component;

    describe('when it is an agent and name is not empty', () => {
      beforeEach(() => {
        component = domRender(<ChatMessage isAgent={true} name='Smith' />);
      });

      it('returns an Avatar component', () => {
        expect(component.renderName())
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
          component = domRender(<ChatMessage name={subject.name} isAgent={subject.isAgent} />);
        });

        it(`should return null for name: ${subject.name}, isAgent: ${subject.isAgent}`, () => {
          expect(component.renderName())
            .toBeNull();
        });
      });
    });
  });

  describe('renderAvatar', () => {
    let component;

    describe('when showAvatar is true', () => {
      beforeEach(() => {
        component = domRender(<ChatMessage showAvatar={true} />);
      });

      it('returns an Avatar component', () => {
        expect(component.renderAvatar())
          .not.toBeNull();
      });
    });

    describe('when showAvatar is false', () => {
      beforeEach(() => {
        component = domRender(<ChatMessage showAvatar={false} />);
      });

      it('returns null', () => {
        expect(component.renderAvatar())
          .toBeNull();
      });
    });

    describe('when avatarPath exists', () => {
      const imageUrl = 'https://www.fakesite.com/img/blah.jpg';

      beforeEach(() => {
        component = domRender(<ChatMessage showAvatar={true} avatarPath={imageUrl} />);
      });

      it('should render Avatar with avatar style', () => {
        const avatarComponent = component.renderAvatar();

        expect(avatarComponent.props.className)
          .toEqual('avatar');
      });
    });

    describe('when avatarPath does not exist', () => {
      beforeEach(() => {
        component = domRender(<ChatMessage showAvatar={true} />);
      });

      it('should render Avatar with avatarDefault style', () => {
        const avatarComponent = component.renderAvatar();

        expect(avatarComponent.props.className)
          .toEqual('avatarDefault');
      });
    });
  });
});

