describe('MessageBubble component', () => {
  let MessageBubble;

  const messageBubblePath = buildSrcPath('component/shared/MessageBubble');
  const MessageOptions = noopReactComponent();
  const Linkify = noopReactComponent('Linkify');

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
      },
      'react-linkify' : Linkify,
      'service/i18n': {
        'i18n': {
          t: _.identity
        }
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

      it('wraps the text content in a linkify component', () => {
        expect(TestUtils.isElementOfType(response.props.children[0].props.children[0], Linkify))
          .toEqual(true);
      });

      it('sets the text content', () => {
        expect(response.props.children[0].props.children[0].props.children)
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

  describe('#renderTranslateLink', () => {
    let component,
      response,
      mockTranslatedMessage,
      mockShowOriginal;

    beforeEach(() => {
      component = instanceRender(
        <MessageBubble
          message='Test Message' translatedMessage={mockTranslatedMessage} />
      );
      component.state = {
        showOriginal: mockShowOriginal
      };

      spyOn(component, 'setState');
      response = component.renderTranslateLink();
    });

    describe('when there is no translated message', () => {
      beforeAll(() => {
        mockTranslatedMessage = '';
      });

      it('returns null', () => {
        expect(response)
          .toBeFalsy();
      });
    });

    describe('when there is a translated message', () => {
      beforeAll(() => {
        mockTranslatedMessage = 'yolo';
      });

      it('returns link', () => {
        expect(TestUtils.isElementOfType(response, 'a'))
          .toEqual(true);
      });

      describe('when showOriginal is true', () => {
        beforeAll(() => {
          mockShowOriginal = true;
        });

        it('returns show translated text', () => {
          expect(response.props.children)
            .toEqual('embeddable_framework.chat.show_translated');
        });
      });

      describe('when showOriginal is false', () => {
        beforeAll(() => {
          mockShowOriginal = false;
        });

        it('returns show original text', () => {
          expect(response.props.children)
            .toEqual('embeddable_framework.chat.show_original');
        });
      });
    });
  });

  describe('#renderMessage', () => {
    let component,
      response,
      mockShowOriginal;

    beforeEach(() => {
      component = instanceRender(
        <MessageBubble
          message='Test Message' translatedMessage='yo'/>
      );
      component.state = { showOriginal: mockShowOriginal };
      response = component.renderMessage();
    });

    describe('when showing original', () => {
      beforeAll(() => {
        mockShowOriginal = true;
      });

      it('returns original message', () => {
        expect(response)
          .toEqual('Test Message');
      });
    });

    describe('when not showing original', () => {
      beforeAll(() => {
        mockShowOriginal = false;
      });

      it('returns translated message', () => {
        expect(response)
          .toEqual('yo');
      });
    });
  });

  describe('#renderOptions', () => {
    let component,
      response,
      handleSendMsgSpy,
      options;

    beforeEach(() => {
      handleSendMsgSpy = jasmine.createSpy();

      component = instanceRender(
        <MessageBubble
          message='Test Message'
          handleSendMsg={handleSendMsgSpy}
          options={options} />
      );

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

      it('sets onOptionClick prop correctly', () => {
        expect(response.props.onOptionClick)
          .toBe(handleSendMsgSpy);
      });

      it('sets the correct optionItems', () => {
        expect(response.props.optionItems.length)
          .toEqual(2);
        expect(response.props.optionItems[0])
          .toEqual('yes');
        expect(response.props.optionItems[1])
          .toEqual('no');
      });
    });
  });
});
