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
      },
      './ZendeskLogo.scss': {
        locals: {
          rtl: 'rtl',
          ltr: 'ltr',
          formSuccess: 'formsuccess'
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
        .not.toMatch('formsuccess');
    });

    it('should have the positional classnames when mobile browser is false', () => {
      const logo = shallowRender(<ZendeskLogo />);

      expect(logo.props.className)
        .toMatch('formsuccess');
    });

    it('has the positional classnames for mobile browser and formSuccess is true', () => {
      const logo = shallowRender(<ZendeskLogo formSuccess={true} fullscreen={true} />);

      expect(logo.props.className)
        .toMatch('formsuccess');
    });

    it('does not has the rtl classnames when rtl language is false', () => {
      const logo = shallowRender(<ZendeskLogo formSuccess={true} rtl={false} />);

      expect(logo.props.className)
        .toMatch('ltr');
    });

    it('has the rtl classnames when rtl language is true', () => {
      const logo = shallowRender(<ZendeskLogo formSuccess={true} rtl={true} />);

      expect(logo.props.className)
        .toMatch('rtl');
    });
  });
});
