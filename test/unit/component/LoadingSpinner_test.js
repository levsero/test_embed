describe('LoadingSpinner component', () => {
  let LoadingSpinner;
  const loadingPath = buildSrcPath('component/loading/LoadingSpinner');

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      'React': React,
      './LoadingSpinner.scss': {
        locals: {
          spinner: 'spinnerClass',
          circle: 'circleClass',
          circleClasses: 'circleClassesClass'
        }
      }
    });

    mockery.registerAllowable(loadingPath);

    LoadingSpinner = requireUncached(loadingPath).LoadingSpinner;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('passes on the spinner class to its child SVG element', () => {
    const spinner = shallowRender(<LoadingSpinner />);

    expect(spinner.props.className)
      .toMatch('spinnerClass');
  });

  it('composes the spinner class and the className prop', () => {
    const spinner = shallowRender(<LoadingSpinner className={'woot'} />);

    expect(spinner.props.className)
      .toMatch('spinnerClass woot');
  });

  it('relays the width prop', () => {
    const spinner = shallowRender(<LoadingSpinner width={1337} />);

    expect(spinner.props.width)
      .toEqual(1337);
  });

  it('relays the height prop', () => {
    const spinner = shallowRender(<LoadingSpinner width={42} />);

    expect(spinner.props.width)
      .toEqual(42);
  });

  it('relays the viewBox prop', () => {
    const spinner = shallowRender(<LoadingSpinner viewBox={'0 0 100 100'} />);

    expect(spinner.props.viewBox)
      .toEqual('0 0 100 100');
  });

  describe('the inner svg circle', () => {
    let circle;

    beforeEach(() => {
      const spinner = shallowRender(
        <LoadingSpinner circleClasses={'circleStylesClass'} />
      );

      circle = spinner.props.children;
    });

    it('composes its class with css and props', () => {
      expect(circle.props.className)
        .toEqual('u-userStrokeColor circleClass circleStylesClass');
    });

    it('passes a cx attribute', () => {
      expect(circle.props.cx)
        .toEqual('90');
    });

    it('passes a cy attribute', () => {
      expect(circle.props.cy)
        .toEqual('90');
    });

    it('passes a radius attribute', () => {
      expect(circle.props.r)
        .toEqual('70');
    });
  });
});
