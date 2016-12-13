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

  fdescribe('#render', () => {
    let component,
        style;

    describe('Component props', () => {
      beforeEach(() => {
        component = domRender(<MessageBubble color="purple" backgroundColor="lavender" />);
        // style = ReactDOM.findDOMNode(component).style;
      });

      it('sets the color', () => {
        style = ReactDOM.findDOMNode(component).style;
        expect(style.color)
          .toEqual('purple');
      });

      it('sets the background color', () => {
        style = ReactDOM.findDOMNode(component).style;
        expect(style.backgroundColor)
          .toEqual('lavender');
      });
    });
  });
});
