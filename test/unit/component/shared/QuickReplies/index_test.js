describe('QuickReplies Component', () => {
  let QuickReplies;

  const quickRepliesPath = buildSrcPath('component/shared/QuickReplies');
  const Slider = noopReactComponent();

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      './QuickReplies.scss': {
        locals: {
          messageBubbleWithOptions: 'messageBubbleWithOptions',
          messageBubble: 'messageBubble'
        }
      },
      '../SliderContainer': {
        SliderContainer: Slider
      }
    });

    mockery.registerAllowable(quickRepliesPath);
    QuickReplies = requireUncached(quickRepliesPath).QuickReplies;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('componentDidMount', () => {
    let mockProps = {};
    let component;

    beforeEach(() => {
      component = instanceRender(<QuickReplies {...mockProps}/>);
    });

    afterEach(() => {
      mockProps = {};
    });

    describe('props.isMobile is true', () => {
      beforeAll(() => {
        mockProps = { isMobile: true };
      });

      it('state.useCarousel should be false', () => {
        component.componentDidMount();
        expect(component.state.useCarousel).toEqual(false);
      });
    });

    it('state.useCarousel should be false if container.scrollWidth is less than container.clientWidth', () => {
      component.container = {
        scrollWidth: 1,
        clientWidth: 2
      };

      component.componentDidMount();
      expect(component.state.useCarousel).toEqual(false);
    });

    it('state.useCarousel should be true if container.scrollWidth is greater than container.clientWidth', () => {
      component.container = {
        scrollWidth: 2,
        clientWidth: 1
      };

      component.componentDidMount();
      expect(component.state.useCarousel).toEqual(true);
    });
  });

  describe('render', () => {
    let component;

    beforeEach(() => {
      component = instanceRender(<QuickReplies />);
    });

    it('does not render Slider component when state.useCarousel is false', () => {
      component.container = {
        scrollWidth: 1,
        clientWidth: 2
      };

      component.componentDidMount();

      const result = component.render();

      expect(TestUtils.isElementOfType(result.props.children, Slider)).toEqual(false);
    });

    it('render Slider component when state.useCarousel is true', () => {
      component.container = {
        scrollWidth: 2,
        clientWidth: 1
      };

      component.componentDidMount();

      const result = component.render();

      expect(TestUtils.isElementOfType(result.props.children, Slider)).toEqual(true);
    });
  });
});
