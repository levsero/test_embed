describe('PanelCard Component', () => {
  let PanelCard;

  const panelCardPath = buildSrcPath('component/chat/chatting/structuredMessage/PanelCard');
  const chatConstantsPath = buildSrcPath('constants/chat');

  const PurePanelCard = noopReactComponent();
  const Button = noopReactComponent();
  const ButtonSchemaPropType = noopReactComponent();

  const createActionSpy = jasmine.createSpy('createAction');

  const chatConstants = requireUncached(chatConstantsPath);
  let CHAT_STRUCTURED_MESSAGE_ACTION_TYPE = chatConstants.CHAT_STRUCTURED_MESSAGE_ACTION_TYPE;

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      'component/shared/StructuredMessage/PanelCard': {
        PanelCard: PurePanelCard
      },
      './Button': {
        Button,
        ButtonSchemaPropType
      },
      'constants/chat': {
        CHAT_STRUCTURED_MESSAGE_ACTION_TYPE
      }
    });

    mockery.registerAllowable(panelCardPath);
    PanelCard = requireUncached(panelCardPath).PanelCard;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();

    createActionSpy.calls.reset();
  });

  let result,
    component;

  describe('#render', () => {
    const mockProps = {
      panel: {
        heading: 'header 1',
        paragraph: 'this is a paragraph'
      },
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

    const additionalPanelProps = {
      image_url: 'https://google.com',
      action: {
        type: CHAT_STRUCTURED_MESSAGE_ACTION_TYPE.LINK_ACTION,
        value: 'https://yahoo.com'
      }
    };

    beforeEach(() => {
      result = instanceRender(<PanelCard {...mockProps} createAction={createActionSpy} />).render();

      const fullPanelProps = {
        ...mockProps.panel,
        ...additionalPanelProps
      };

      component = instanceRender(<PanelCard panel={fullPanelProps} createAction={createActionSpy}/>);
    });

    it('returns a PurePanelCard component', () => {
      expect(TestUtils.isElementOfType(result, PurePanelCard)).toEqual(true);
    });

    it('returns the panel prop', () => {
      expect(result.props.panel).toEqual({
        ...mockProps.panel,
        imageUrl: undefined,
        onClick: null
      });
    });

    it('returns the panel prop with additional props', () => {
      const mockActionSpy = jasmine.createSpy('mockActionSpy');

      createActionSpy.and.callFake(() => {
        return mockActionSpy;
      });

      const result = component.render();

      expect(result.props.panel).toEqual({
        ...mockProps.panel,
        imageUrl: additionalPanelProps.image_url,
        onClick: mockActionSpy
      });
    });

    it('renders correct number of Button components', () => {
      expect(result.props.children.length).toEqual(mockProps.buttons.length);

      result.props.children.forEach(child => {
        expect(TestUtils.isElementOfType(child, Button)).toEqual(true);
      });
    });

    it('passes correct props to Button component', () => {
      result.props.children.forEach((child, index) => {
        expect(child.props.text).toEqual(mockProps.buttons[index].text);
        expect(child.props.action).toEqual(mockProps.buttons[index].action);

        expect(child.props.createAction).toEqual(createActionSpy);
      });
    });
  });
});
