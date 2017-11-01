describe('LoadingEllipses component', () => {
  let LoadingEllipses;
  let mockIsDeviceValue;
  const loadingPath = buildSrcPath('component/loading/LoadingEllipses');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    mockIsDeviceValue = false;

    initMockRegistry({
      'React': React,
      'utility/devices': {
        isDevice: () => {
          return mockIsDeviceValue;
        }
      },
      './LoadingEllipses.sass': {
        locals: {
          bounce: 'bounce',
          fade: 'fade'
        }
      }
    });

    mockery.registerAllowable(loadingPath);

    LoadingEllipses = requireUncached(loadingPath).LoadingEllipses;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should have the class `bounce` when not ios8', () => {
    const ellipses = shallowRender(<LoadingEllipses />);

    expect(ellipses.props.children[0].props.className)
      .toMatch('bounce');
  });

  it('should have the class `fade` when ios8', () => {
    mockIsDeviceValue = true;
    const ellipses = shallowRender(<LoadingEllipses />);

    expect(ellipses.props.children[0].props.className)
      .toMatch('fade');
  });

  it('should have the class `u-userBackgroundColor` by default', () => {
    const ellipses = shallowRender(<LoadingEllipses />);

    expect(ellipses.props.children[0].props.className)
      .toMatch('u-userBackgroundColor');
  });

  it('should be able to disable the background color class', () => {
    const ellipses = shallowRender(<LoadingEllipses useUserColor={false} />);

    expect(ellipses.props.children[0].props.className)
      .not.toMatch('u-userBackgroundColor');
  });
});
