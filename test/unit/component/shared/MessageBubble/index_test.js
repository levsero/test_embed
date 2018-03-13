describe('MessageBubble component', () => {
  let MessageBubble;

  const messageBubblePath = buildSrcPath('component/shared/MessageBubble');
  const MessageOptions = noopReactComponent();

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      './MessageBubble.scss': {
        locals: {
          messageBubbleWithOptions: 'messageBubbleWithOptions',
          messageBubble: 'messageBubble'
        }
      },
      'component/shared/MessageOptions': {
        MessageOptions: MessageOptions
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
      response,
      options;

    describe('component props', () => {
      beforeEach(() => {
        component = instanceRender(<MessageBubble message='Test Message' className='bob' options={options}/>);
        spyOn(component, 'renderOptions');
        response = component.render();
      });

      it('calls renderOptions', () => {
        expect(component.renderOptions).toHaveBeenCalled();
      });

      it('sets the text content', () => {
        expect(response.props.children[0].props.children)
          .toEqual('Test Message');
      });

      it('sets the custom className', () => {
        expect(response.props.children[0].props.className)
          .toContain('bob');
      });

      describe('when there are no options', () => {
        beforeAll(() => {
          options = [];
        });

        it('sets the messageBubble style', () => {
          expect(response.props.children[0].props.className)
            .toContain('messageBubble');
        });
      });

      describe('when there are options', () => {
        beforeAll(() => {
          options = ['yes', 'no'];
        });

        it('sets the messageBubbleWithOptions style', () => {
          expect(response.props.children[0].props.className)
            .toContain('messageBubbleWithOptions');
        });
      });
    });
  });

  describe('#renderOptions', () => {
    let component,
      response,
      options;

    describe('when handleSendMsg is provided', () => {
      beforeEach(() => {
        component = instanceRender(<MessageBubble message='Test Message' options={options} handleSendMsg={() => {}}/>);
        response = component.renderOptions();
      });

      describe('when there are no options', () => {
        beforeAll(() => {
          options = [];
        });

        it('does not render options with message bubble', () => {
          expect(response)
            .toBeFalsy();
        });
      });

      describe('when there are options', () => {
        beforeAll(() => {
          options = ['yes', 'no'];
        });

        it('renders MessageOptions', () => {
          expect(TestUtils.isElementOfType(response, MessageOptions))
            .toEqual(true);
        });

        it('sets isMessageBubbleLinked prop to true', () => {
          expect(response.props.isMessageBubbleLinked)
            .toEqual(true);
        });

        it('sets the correct optionItems', () => {
          response.props.optionItems.forEach((optionItem, index) => {
            expect(TestUtils.isElementOfType(optionItem, 'a'))
              .toEqual(true);
            expect(optionItem.key)
              .toEqual(index.toString());
            expect(optionItem.props.children)
              .toEqual(options[index]);
            expect(optionItem.props.onClick)
              .toEqual(jasmine.any(Function));
          });
        });
      });
    });

    describe('when handleSendMsg is not provided', () => {
      beforeEach(() => {
        options = ['yes', 'no'];
        component = instanceRender(<MessageBubble message='Test Message' options={options} />);
        response = component.renderOptions();
      });

      it('does not set onClick handler', () => {
        response.props.optionItems.forEach((optionItem) => {
          expect(optionItem.props.onClick)
            .toBeFalsy();
        });
      });
    });
  });
});
