describe('ButtonPill component', function() {
  let ButtonPill;
  const buttonPath = buildSrcPath('component/button/ButtonPill');

  beforeEach(function() {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'React': React,
      'component/Icon': {
        Icon: noopReactComponent()
      },
      'component/Loading': {
        LoadingEllipses: noopReactComponent()
      },
      'utility/utils': {
        'generateConstrastColor': noop
      },
      'service/i18n': {
        i18n: {
          isRTL: noop
        }
      }
    });

    mockery.registerAllowable(buttonPath);

    ButtonPill = requireUncached(buttonPath).ButtonPill;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('ButtonPill', function() {
    it('should not have is-mobile class when fullscreen is false', function() {
      const button = shallowRender(<ButtonPill />);

      expect(button.props.className)
        .not.toMatch('is-mobile');
    });

    it('should have is-mobile class when fullscreen is true', function() {
      const button = shallowRender(<ButtonPill fullscreen={true} />);

      expect(button.props.className)
        .toMatch('is-mobile');
    });
  });
});
