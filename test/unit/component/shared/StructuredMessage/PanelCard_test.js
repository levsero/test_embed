describe('Pure PanelCard Component', () => {
  let PanelCard;

  const panelCardPath = buildSrcPath('component/shared/StructuredMessage/PanelCard');

  const Card = noopReactComponent();
  const ButtonList = noopReactComponent();
  const Panel = noopReactComponent();

  const expectedDefaultProps = {
    children: [],
    panel:
    {
      roundedTop: true
    }
  };

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      './pure/Card': {
        Card
      },
      './pure/ButtonList': {
        ButtonList
      },
      './pure/Panel': {
        Panel
      }
    });

    mockery.registerAllowable(panelCardPath);
    PanelCard = requireUncached(panelCardPath).PanelCard;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('has correct default value', () => {
    const component = instanceRender(<PanelCard />);

    expect(component.props).toEqual(expectedDefaultProps);
  });

  describe('when props are empty', () => {
    let result,
      props = {};

    beforeEach(() => {
      const component = instanceRender(<PanelCard {...props} />);

      result = component.render();
    });

    it('parent element should be Card component', () => {
      expect(TestUtils.isElementOfType(result, Card)).toEqual(true);
    });

    it('first child element should be div element', () => {
      const firstChild = result.props.children[0];

      expect(TestUtils.isElementOfType(firstChild, Panel));
    });

    it('second child element should be ButtonList component', () => {
      const secondChild = result.props.children[1];

      expect(TestUtils.isElementOfType(secondChild, ButtonList));
    });
  });

  describe('Panel element should receive the correct props', () => {
    let props;

    beforeEach(() => {
      props = {};
    });

    describe('when button list is empty', () => {
      it('should pass the correct props to Panel element', () => {
        const component = instanceRender(<PanelCard {...props} />);
        const result = component.render();
        const panel = result.props.children[0];

        expect(panel.props.panel).toEqual({ roundedTop: true, roundedBottom: true });
      });
    });

    describe('when button list is not empty', () => {
      it('should pass the correct props to Panel element', () => {
        const component = instanceRender(<PanelCard {...{ ...props, children: [1, 2] }} />);
        const result = component.render();
        const panel = result.props.children[0];

        expect(panel.props.panel).toEqual({ roundedTop: true, roundedBottom: false });
      });
    });
  });
});
