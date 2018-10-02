describe('ButtonCard component', () => {
  let ButtonCard;

  const buttonCardPath = buildSrcPath('component/chat/chatting/structuredMessage/ButtonCard');
  const chatConstantsPath = buildSrcPath('constants/chat');

  const PureButtonCard = noopReactComponent();
  const Button = noopReactComponent();

  const createActionSpy = jasmine.createSpy('createAction');

  const chatConstants = requireUncached(chatConstantsPath);
  let CHAT_STRUCTURED_MESSAGE_ACTION_TYPE = chatConstants.CHAT_STRUCTURED_MESSAGE_ACTION_TYPE;

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      'component/shared/StructuredMessage/ButtonCard': {
        ButtonCard: PureButtonCard,
        Button
      },
      'constants/chat': {
        CHAT_STRUCTURED_MESSAGE_ACTION_TYPE
      },
    });

    mockery.registerAllowable(buttonCardPath);
    ButtonCard = requireUncached(buttonCardPath).ButtonCard;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();

    createActionSpy.calls.reset();
  });

  describe('#render', () => {
    const componentProps = {
      msg: 'Hello!',
      buttons: [
        {
          text: 'Hey!',
          action: {
            type: CHAT_STRUCTURED_MESSAGE_ACTION_TYPE.QUICK_REPLY_ACTION,
            value: 'replied'
          }
        },
        {
          text: 'Hello!',
          action: {
            type: CHAT_STRUCTURED_MESSAGE_ACTION_TYPE.LINK_ACTION,
            value: 'https://sample.com'
          }
        }
      ]
    };

    let component,
      result;

    beforeEach(() => {
      component = instanceRender(<ButtonCard {...componentProps} createAction={createActionSpy} />);
      result = component.render();
    });

    it('returns a PureButtonCard component', () => {
      expect(TestUtils.isElementOfType(result, PureButtonCard))
        .toEqual(true);
    });

    it('passes the message value', () => {
      expect(result.props.message)
        .toEqual(componentProps.msg);
    });

    it('renders correct number of Button components', () => {
      expect(result.props.children.length).toEqual(componentProps.buttons.length);

      result.props.children.forEach(child => {
        expect(TestUtils.isElementOfType(child, Button)).toEqual(true);
      });
    });

    it('passes the correct label props to the Button components', () => {
      result.props.children.forEach((child, index) => {
        expect(child.props.label).toEqual(componentProps.buttons[index].text);
      });
    });

    it('passes the correct onClick props to the Button components', () => {
      const buttonActions = componentProps.buttons.map(buttonSchema => buttonSchema.action);
      const expectedParams = {};

      // making createAction returns predefined spy depending on the call parameter
      buttonActions.forEach((buttonAction, index) => {
        const stringifiedParam = JSON.stringify(buttonAction);

        expectedParams[stringifiedParam] = jasmine.createSpy(`mockAction${index}`);
      });
      createActionSpy.and.callFake(function(param) {
        const stringifiedParam = JSON.stringify(param);

        return expectedParams[stringifiedParam];
      });

      // render again after createAction is spyed by returning correct value
      result = component.render();

      result.props.children.forEach((child, index) => {
        const stringifiedActionParam = JSON.stringify(componentProps.buttons[index].action);

        expect(child.props.onClick).toEqual(expectedParams[stringifiedActionParam]);
      });
    });
  });
});
