describe('ZendeskLogo component', function() {
  let ZendeskLogo;
  const zendeskLogoPath = buildSrcPath('component/ZendeskLogo');

  beforeEach(function() {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'React': React,
      'component/Icon': {
        Icon: noopReactComponent()
      }
    });
    mockery.registerAllowable('utility/globals');
    mockery.registerAllowable(zendeskLogoPath);

    ZendeskLogo = requireUncached(zendeskLogoPath).ZendeskLogo;
  });

  describe('logo class names', function() {
    it('should not have the positional classnames when mobile browser is true', function() {
      const logo = shallowRender( <ZendeskLogo fullscreen={true} />);

      expect(logo.props.className)
        .not.toMatch('u-posAbsolute');
    });

    it('should have the positional classnames when mobile browser is false', function() {
      const logo = shallowRender( <ZendeskLogo />);

      expect(logo.props.className)
        .toMatch('u-posAbsolute');
    });

    it('has the positional classnames for mobile browser and formSuccess is true', function() {
      const logo = shallowRender( <ZendeskLogo formSuccess={true} fullscreen={true} />);

      expect(logo.props.className)
        .toMatch('u-posAbsolute');
    });

    it('does not has the rtl classnames when rtl language is false', function() {
      const logo = shallowRender( <ZendeskLogo formSuccess={true} rtl={false} />);

      expect(logo.props.className)
        .toMatch('u-posStart');
    });

    it('has the rtl classnames when rtl language is true', function() {
      const logo = shallowRender( <ZendeskLogo formSuccess={true} rtl={true} />);

      expect(logo.props.className)
        .not.toMatch('u-posStart');
    });
  });
});
