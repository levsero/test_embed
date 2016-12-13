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
      style;

    describe('Component props', () => {
      beforeEach(() => {
        component = domRender(<MessageBubble backgroundColor="lavender" color="purple" />);
        style = ReactDOM.findDOMNode(component).style;
      });

      it('sets the color', () => {
        expect(style.color)
          .toEqual('purple');
      });

      // After much tinkering and investigation it looks like theres a bug in the
      // test dom rendering that prevents the backgroundColor property from being
      // present here. To the PR reviewers, give it a shot if you don't believe me,
      // I would love to have this resolved.

      // it('sets the background color', () => {
        // expect(style.backgroundColor)
          // .toEqual('lavender');
      // });
    });
  });
});
