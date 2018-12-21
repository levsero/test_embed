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
        ButtonCard: PureButtonCard
      },
      './Button': {
        Button
      },
      './ButtonCard.scss': {
        locals: {
          mobile: 'mobile'
        }
      }
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

    describe('default props', () => {
      beforeEach(() => {
        component = instanceRender(<ButtonCard {...componentProps} createAction={createActionSpy} />);
        result = component.render();
      });

      it('returns a PureButtonCard component', () => {
        expect(TestUtils.isElementOfType(result, PureButtonCard))
          .toEqual(true);
      });

      it('passes no custom class to PureButtonCard', () => {
        expect(result.props.className).toEqual('');
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
    });

    describe('custom props', () => {
      describe('isMobile', () => {
        it('should pass mobile class to PureButtonCard', () => {
          component = instanceRender(<ButtonCard {...{ ...componentProps, isMobile: true }} createAction={createActionSpy} />);
          result = component.render();

          expect(result.props.className).toEqual('mobile');
        });
      });
    });
  });
});
