describe('Carousel Component', () => {
  let Carousel;

  const carouselPath = buildSrcPath('component/shared/Carousel');
  const Slider = noopReactComponent();

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      './Carousel.scss': {
        locals: {
          carouselSlider: 'carouselSlider'
        }
      },
      '../SliderContainer': Slider
    });

    mockery.registerAllowable(carouselPath);
    Carousel = requireUncached(carouselPath).default;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('.render', () => {
    const mockChildren = <div/>;
    const mockProps = {
      children: [mockChildren]
    };

    let component, result;

    beforeEach(() => {
      component = instanceRender(<Carousel {...mockProps}/>);
      result = component.render();
    });

    it('should get the correct containerStyle', () => {
      const classNames = result.props.className.split(' ');

      expect(classNames.indexOf('structuredMessageSlider'))
        .not.toEqual(-1);
      expect(classNames.indexOf('carouselSlider'))
        .not.toEqual(-1);
    });

    it('should render Slider component', () => {
      expect(TestUtils.isElementOfType(result.props.children, Slider))
        .toEqual(true);
    });

    it('should render the children inside Slider component', () => {
      expect(result.props.children.props.children[0])
        .toEqual(mockChildren);
    });

    it('should pass in correct children length inside Slider component', () => {
      expect(result.props.children.props.children.length)
        .toEqual(mockProps.children.length);
    });
  });
})