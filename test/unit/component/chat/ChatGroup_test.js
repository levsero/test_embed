describe('ChatGroup component', () => {
  let ChatGroup;
  const chatGroupPath = buildSrcPath('component/chat/ChatGroup');
  const messageData = { msg: 'Hmm why did I forget the actual plan for implementing ChatGroup?', display_name: 'bob' }; // eslint-disable-line camelcase
  const messagesData = [messageData];

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      './ChatGroup.scss': {
        locals: {
          messageAgent: 'messageAgent',
          messageUser: 'messageUser',
          agentBackground: 'agentBackground',
          userBackground: 'userBackground',
          avatarWithSrc: 'avatarWithSrc',
          avatarDefault: 'avatarDefault',
          nameAvatar: 'nameAvatarClass',
          nameNoAvatar: 'nameNoAvatarClass',
          messageBubble: 'messageBubbleClass'
        }
      },
      'component/chat/MessageBubble': {
        MessageBubble: class extends Component {
          render = () => <div id='messageBubble' className={this.props.className}>{this.props.message}</div>;
        }
      },
      'component/Avatar': {
        Avatar: noopReactComponent()
      }
    });

    mockery.registerAllowable(chatGroupPath);
    ChatGroup = requireUncached(chatGroupPath).ChatGroup;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#renderName', () => {
    let nameElement;

    describe('when showAvatar is true', () => {
      beforeEach(() => {
        const component = instanceRender(
          <ChatGroup
            isAgent={true}
            showAvatar={true}
            messages={messagesData} />
        );

        nameElement = component.renderName();
      });

      it('renders with nameAvatarClass', () => {
        expect(nameElement.props.className)
          .toContain('nameAvatarClass');
      });
    });

    describe('when showAvatar is false', () => {
      beforeEach(() => {
        const component = instanceRender(
          <ChatGroup
            isAgent={true}
            showAvatar={false}
            messages={messagesData} />
        );

        nameElement = component.renderName();
      });

      it('renders with nameNoAvatarClass', () => {
        expect(nameElement.props.className)
          .toContain('nameNoAvatarClass');
      });
    });

    describe('when it is an agent and name is not empty', () => {
      beforeEach(() => {
        const component = instanceRender(<ChatGroup isAgent={true} messages={messagesData} />);

        nameElement = component.renderName();
      });

      it('returns a div element', () => {
        expect(nameElement)
          .not.toBeNull();
      });

      it('contains a name prop', () => {
        expect(nameElement.props.children)
          .toEqual('bob');
      });
    });

    describe('when the user is a visitor', () => {
      beforeEach(() => {
        const component = instanceRender(<ChatGroup isAgent={false} messages={messagesData} />);

        nameElement = component.renderName();
      });

      it('returns null', () => {
        expect(nameElement)
          .toBeNull();
      });
    });

    describe('when the name is empty', () => {
      beforeEach(() => {
        const messagesData = [{ display_name: '' }]; // eslint-disable-line camelcase
        const component = instanceRender(<ChatGroup isAgent={false} messages={messagesData} />);

        nameElement = component.renderName();
      });

      it('returns null', () => {
        expect(nameElement)
          .toBeNull();
      });
    });
  });

  describe('#renderAvatar', () => {
    let avatarElement;

    describe('when isAgent and showAvatar are false', () => {
      beforeEach(() => {
        const component = instanceRender(<ChatGroup showAvatar={false} isAgent={false} />);

        avatarElement = component.renderAvatar();
      });

      it('returns null', () => {
        expect(avatarElement)
          .toBeNull();
      });
    });

    describe('when isAgent and showAvatar are true', () => {
      beforeEach(() => {
        const component = instanceRender(<ChatGroup showAvatar={true} isAgent={true} />);

        avatarElement = component.renderAvatar();
      });

      it('returns an Avatar component', () => {
        expect(avatarElement)
          .not.toBeNull();
      });
    });

    describe('when isAgent is false and showAvatar is true', () => {
      beforeEach(() => {
        const component = instanceRender(<ChatGroup showAvatar={true} isAgent={false} />);

        avatarElement = component.renderAvatar();
      });

      it('returns null', () => {
        expect(avatarElement)
          .toBeNull();
      });
    });

    describe('when isAgent is true and showAvatar is false', () => {
      beforeEach(() => {
        const component = instanceRender(<ChatGroup showAvatar={false} isAgent={true} />);

        avatarElement = component.renderAvatar();
      });

      it('returns null', () => {
        expect(avatarElement)
          .toBeNull();
      });
    });

    describe('when avatarPath exists', () => {
      const imageUrl = 'https://www.fakesite.com/img/blah.jpg';

      beforeEach(() => {
        const component = instanceRender(<ChatGroup showAvatar={true} isAgent={true} avatarPath={imageUrl} />);

        avatarElement = component.renderAvatar();
      });

      it('should render Avatar with avatar style', () => {
        expect(avatarElement.props.className)
          .toContain('avatar');
      });
    });

    describe('when avatarPath does not exist', () => {
      beforeEach(() => {
        const component = instanceRender(<ChatGroup showAvatar={true} isAgent={true} />);

        avatarElement = component.renderAvatar();
      });

      it('should render Avatar with avatarDefault style', () => {
        expect(avatarElement.props.className)
          .toContain('avatarDefault');
      });
    });
  });

  describe('#renderChatMessage', () => {
    let chatGroupNode;

    beforeEach(() => {
      const component = domRender(<ChatGroup messages={messagesData} />);

      chatGroupNode = ReactDOM.findDOMNode(component);
    });

    it('renders messageBubble with a name', () => {
      expect(chatGroupNode.querySelector('#messageBubble').textContent)
        .toEqual(messageData.msg);
    });

    describe('when showAvatar is true', () => {
      beforeEach(() => {
        const component = domRender(<ChatGroup showAvatar={true} isAgent={true} messages={messagesData} />);

        chatGroupNode = ReactDOM.findDOMNode(component);
      });

      it('renders MessageBubble with messageBubble class', () => {
        const result = chatGroupNode.querySelector('.messageBubbleClass');

        expect(result)
          .not.toBeNull();
      });
    });

    describe('when showAvatar is false', () => {
      beforeEach(() => {
        const component = domRender(<ChatGroup showAvatar={false} isAgent={true} messages={messagesData} />);

        chatGroupNode = ReactDOM.findDOMNode(component);
      });

      it('does not render with messageBubble class', () => {
        const result = chatGroupNode.querySelector('.messageBubbleClass');

        expect(result)
          .toBeNull();
      });
    });

    describe('when user is agent', () => {
      beforeEach(() => {
        const component = domRender(<ChatGroup isAgent={true} messages={messagesData} />);

        chatGroupNode = ReactDOM.findDOMNode(component);
      });

      it('renders with agent styles', () => {
        expect(chatGroupNode.querySelector('.messageAgent'))
          .toBeTruthy();
      });

      it('renders with agent background styles', () => {
        expect(chatGroupNode.querySelector('.agentBackground'))
          .toBeTruthy();
      });
    });

    describe('when user is visitor', () => {
      beforeEach(() => {
        const component = domRender(<ChatGroup isAgent={false} messages={messagesData} />);

        chatGroupNode = ReactDOM.findDOMNode(component);
      });

      it('renders with visitor styles', () => {
        expect(chatGroupNode.querySelector('.messageUser'))
          .toBeTruthy();
      });

      it('renders with visitor background styles', () => {
        expect(chatGroupNode.querySelector('.userBackground'))
          .toBeTruthy();
      });
    });
  });
});
