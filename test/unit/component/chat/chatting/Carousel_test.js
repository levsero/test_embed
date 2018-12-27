describe('Carousel Component', () => {
  let Carousel;

  const carouselPath = buildSrcPath('component/chat/chatting/Carousel');

  const PureCarousel = noopReactComponent();
  const StructuredMessage = noopReactComponent();

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      '../../shared/Carousel': PureCarousel,
      './StructuredMessage': StructuredMessage
    });

    mockery.registerAllowable(carouselPath);
    Carousel = requireUncached(carouselPath).default;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('.render', () => {
    let component, result;

    const mockItem1 = {
      name: 'mockName1'
    };
    const mockItem2 = {
      name: 'mockName2'
    };

    let mockProps = {
      items: [mockItem1, mockItem2]
    };

    describe('Default Props', () => {
      beforeEach(() => {
        component = instanceRender(<Carousel {...mockProps}/>);

        result = component.render();
      });

      it('should render PureCarousel', () => {
        expect(TestUtils.isElementOfType(result, PureCarousel))
          .toEqual(true);
      });

      it('should render the correct number of children within PureCarousel', () => {
        expect(result.props.children.length)
          .toEqual(mockProps.items.length);
      });

      it('should render StructuredMessage as a child type within PureCarousel', () => {
        expect(TestUtils.isElementOfType(result.props.children[0], StructuredMessage))
          .toEqual(true);
      });

      it('should accept the correct schema for each children', () => {
        const scenarios = [
          {
            schema: mockItem1,
            isMobile: false,
            inCarousel: true
          },
          {
            schema: mockItem2,
            isMobile: false,
            inCarousel: true
          }
        ];

        scenarios.forEach((scenario, index) => {
          const child = result.props.children[index];

          for (const key in scenario) {
            expect(child.props[key])
              .toEqual(scenario[key]);
          }
        });
      });
    });
  });
});
