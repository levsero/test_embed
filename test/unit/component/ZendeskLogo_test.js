describe('ZendeskLogo component', function() {

  var mockRegistry,
      ZendeskLogo;
  const zendeskLogoPath = buildSrcPath('component/ZendeskLogo');

  beforeEach(function() {

    resetDOM();

    mockery.enable({
      useCleanCache: true
    });

    mockRegistry = initMockRegistry({
      'react/addons': React,
    });
    mockery.registerAllowable('utility/globals');
    mockery.registerAllowable(zendeskLogoPath);

    ZendeskLogo = require(zendeskLogoPath).ZendeskLogo;
  });

  describe('logo class names', function() {
    it('should not have the positional classnames when mobile browser is true', function() {
      const logo = React.render(<ZendeskLogo fullscreen={true} />, global.document.body);
      const logoNode = ReactTestUtils.findRenderedDOMComponentWithClass(logo, 'Icon--zendesk');
      const logoClasses = logoNode.props.className;

      expect(logoClasses)
        .not.toMatch('u-posAbsolute');
    });

    it('should have the positional classnames when mobile browser is false', function() {
      const logo = React.render(<ZendeskLogo />, global.document.body);
      const logoNode = ReactTestUtils.findRenderedDOMComponentWithClass(logo, 'Icon--zendesk');
      const logoClasses = logoNode.props.className;

      expect(logoClasses)
        .toMatch('u-posAbsolute');
    });

    it('has the positional classnames for mobile browser and formSuccess is true', function() {
      const logo = React.render(
        <ZendeskLogo formSuccess={true} rtl={true} />,
        global.document.body
      );
      const logoNode = ReactTestUtils.findRenderedDOMComponentWithClass(logo, 'Icon--zendesk');
      const logoClasses = logoNode.props.className;

      expect(logoClasses)
        .toMatch('u-posAbsolute');
    });

    it('does not has the rtl classnames when rtl language is false', function() {
      const logo = React.render(
        <ZendeskLogo formSuccess={true} rtl={false} />,
        global.document.body
      );
      const logoNode = ReactTestUtils.findRenderedDOMComponentWithClass(logo, 'Icon--zendesk');
      const logoClasses = logoNode.props.className;

      expect(logoClasses)
        .toMatch('u-posStart');
    });

    it('has the rtl classnames when rtl language is true', function() {
      const logo = React.render(
        <ZendeskLogo formSuccess={true} rtl={true} />,
        global.document.body
      );
      const logoNode = ReactTestUtils.findRenderedDOMComponentWithClass(logo, 'Icon--zendesk');
      const logoClasses = logoNode.props.className;

      expect(logoClasses)
        .not.toMatch('u-posStart');
    });
  });
});
