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
          messageAgent: 'messageAgentClasses'
        }
      },
      'component/chat/MessageBubble': {
        MessageBubble: noopReactComponent()
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
    let component;

    describe('when the nick shows the message is from a agent', () => {
      beforeEach(() => {
        component = domRender(<ChatMessage nick='agent:xxx' />);
      });

      it('uses the correct styles', () => {
        expect(ReactDOM.findDOMNode(component).querySelector('.messageAgentClasses'))
          .toBeTruthy();

        expect(ReactDOM.findDOMNode(component).querySelector('.messageUserClasses'))
          .toBeFalsy();
      });
    });

    describe('when the nick shows the message is not from a agent', () => {
      beforeEach(() => {
        component = domRender(<ChatMessage nick='user:xxx' />);
      });

      it('uses the correct styles', () => {
        expect(ReactDOM.findDOMNode(component).querySelector('.messageUserClasses'))
          .toBeTruthy();

        expect(ReactDOM.findDOMNode(component).querySelector('.messageAgentClasses'))
          .toBeFalsy();
      });
    });
  });
});

