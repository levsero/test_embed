describe('Button Component', () => {
  let Button;

  const buttonPath = buildSrcPath('component/chat/chatting/structuredMessage/Button');
  const chatConstantsPath = buildSrcPath('constants/chat');

  const PureButton = noopReactComponent();

  const createActionSpy = jasmine.createSpy('createAction');

  const chatConstants = requireUncached(chatConstantsPath);
  let CHAT_STRUCTURED_MESSAGE_ACTION_TYPE = chatConstants.CHAT_STRUCTURED_MESSAGE_ACTION_TYPE;

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      'component/shared/StructuredMessage/pure/Button': {
        Button: PureButton
      },
      'constants/chat': {
        CHAT_STRUCTURED_MESSAGE_ACTION_TYPE
      },
    });

    mockery.registerAllowable(buttonPath);
    Button = requireUncached(buttonPath).Button;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();

    createActionSpy.calls.reset();
  });

  describe('#render', () => {
    const mockProps = {
      text: 'Hey!',
      action: {
        type: CHAT_STRUCTURED_MESSAGE_ACTION_TYPE.QUICK_REPLY_ACTION,
        value: 'replied'
      }
    };

    let component,
      result;

    beforeEach(() => {
      component = instanceRender(<Button {...mockProps} createAction={createActionSpy} />);
      result = component.render();
    });

    it('should return a PureButton component', () => {
      expect(TestUtils.isElementOfType(result, PureButton)).toEqual(true);
    });

    it('should pass the correct label props to the Pure button components', () => {
      expect(result.props.label).toEqual(mockProps.text);
    });

    it('should pass the correct onClick props to the Pure button components', () => {
      const mockActionSpy = jasmine.createSpy('mockActionSpy');

      createActionSpy.and.callFake(() => mockActionSpy);

      const result = component.render();

      expect(result.props.onClick).toEqual(mockActionSpy);
    });
  });
});
