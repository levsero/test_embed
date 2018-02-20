describe('MessageBubble component', () => {
  let MessageBubble;
  const messageBubblePath = buildSrcPath('component/chat/MessageBubble');

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      './MessageBubble.scss': {
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
    let domNode;

    describe('component props', () => {
      beforeEach(() => {
        const component = domRender(<MessageBubble message='Test Message' className='bob'/>);

        domNode = ReactDOM.findDOMNode(component);
      });

      it('sets the text content', () => {
        expect(domNode.textContent)
          .toEqual('Test Message');
      });

      it('sets the className', () => {
        expect(domNode.className)
          .toContain('bob');
      });
    });
  });
});
