describe('MessageBubble component', () => {
  let MessageBubble;
  const messageBubblePath = buildSrcPath('component/chat/MessageBubble');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'React': React,
      './MessageBubble.sass': {
        locals: ''
      }
    });

    mockery.registerAllowable(messageBubblePath);
    MessageBubble = requireUncached(messageBubblePath).MessageBubble;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#render', () => {
    let component,
      domNode;

    describe('Component props', () => {
      beforeEach(() => {
        component = domRender(
          <MessageBubble
            message="Test Message"
            backgroundColor="red"
            color="purple" />
        );
        domNode = ReactDOM.findDOMNode(component);
      });

      it('sets the color', () => {
        expect(domNode.style.color)
          .toEqual('purple');
      });

      it('sets the text content', () => {
        expect(domNode.textContent)
          .toEqual('Test Message');
      });

      it('sets the background color', () => {
        expect(domNode.style.backgroundColor)
          .toEqual('red');
      });
    });
  });
});
