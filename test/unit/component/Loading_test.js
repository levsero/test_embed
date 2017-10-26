describe('Loading component', function() {
  let LoadingEllipses;
  let mockIsDeviceValue;
  const loadingPath = buildSrcPath('component/loading/Loading');

  beforeEach(function() {
    resetDOM();

    mockery.enable();

    mockIsDeviceValue = false;

    initMockRegistry({
      'React': React,
      'utility/devices': {
        isDevice: function() {
          return mockIsDeviceValue;
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

  describe('Loading Ellipses', function() {
    it('should have the classname `LoadingEllipses-item--bounce` when not ios8', function() {
      const ellipses = shallowRender(<LoadingEllipses />);

      expect(ellipses.props.children[0].props.className)
        .toMatch('LoadingEllipses-item--bounce');
    });

    it('should have the classname `LoadingEllipses-item--fade` when ios8', function() {
      mockIsDeviceValue = true;
      const ellipses = shallowRender(<LoadingEllipses />);

      expect(ellipses.props.children[0].props.className)
        .toMatch('LoadingEllipses-item--fade');
    });

    it('should have the class `u-userBackgroundColor` by default', function() {
      const ellipses = shallowRender(<LoadingEllipses />);

      expect(ellipses.props.children[0].props.className)
        .toMatch('u-userBackgroundColor');
    });

    it('should be able to disable the background color class', function() {
      const ellipses = shallowRender(<LoadingEllipses useUserColor={false} />);

      expect(ellipses.props.children[0].props.className)
        .not.toMatch('u-userBackgroundColor');
    });
  });
});
