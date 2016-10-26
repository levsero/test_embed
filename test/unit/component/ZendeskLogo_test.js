describe('ZendeskLogo component', () => {
  let ZendeskLogo;
  const zendeskLogoPath = buildSrcPath('component/ZendeskLogo');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'React': React,
      'component/Icon': {
        Icon: noopReactComponent()
      },
      'service/i18n': {
        i18n: {
          t: _.identity
        }
      }
    });
    mockery.registerAllowable('utility/globals');
    mockery.registerAllowable(zendeskLogoPath);

    ZendeskLogo = requireUncached(zendeskLogoPath).ZendeskLogo;
  });

  describe('logo class names', () => {
    it('should not have the positional classnames when mobile browser is true', () => {
      const logo = shallowRender(<ZendeskLogo fullscreen={true} />);

      expect(logo.props.className)
        .not.toMatch('u-posAbsolute');
    });

    it('should have the positional classnames when mobile browser is false', () => {
      const logo = shallowRender(<ZendeskLogo />);

      expect(logo.props.className)
        .toMatch('u-posAbsolute');
    });

    it('has the positional classnames for mobile browser and formSuccess is true', () => {
      const logo = shallowRender(<ZendeskLogo formSuccess={true} fullscreen={true} />);

      expect(logo.props.className)
        .toMatch('u-posAbsolute');
    });

    it('does not has the rtl classnames when rtl language is false', () => {
      const logo = shallowRender(<ZendeskLogo formSuccess={true} rtl={false} />);

      expect(logo.props.className)
        .toMatch('u-posStart');
    });

    it('has the rtl classnames when rtl language is true', () => {
      const logo = shallowRender(<ZendeskLogo formSuccess={true} rtl={true} />);

      expect(logo.props.className)
        .not.toMatch('u-posStart');
    });
  });

  describe('logo type', () => {
    it('should be type `Icon--zendesk` when golionLogo prop is false', () => {
      const logo = shallowRender(<ZendeskLogo />);
      const icon = logo.props.children[0];

      expect(icon.props.type)
        .toMatch('Icon--zendesk');
    });

    it('should be type `Icon--golion` when golionLogo prop is true', () => {
      const logo = shallowRender(<ZendeskLogo golionLogo={true} />);
      const icon = logo.props.children[0];

      expect(icon.props.type)
        .toMatch('Icon--golion');
    });
  });
});
