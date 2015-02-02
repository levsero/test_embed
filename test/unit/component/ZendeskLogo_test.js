/** @jsx React.DOM */

describe('ZendeskLogo component', function() {

  var mockRegistry,
      zendeskLogoPath = buildSrcPath('component/ZendeskLogo'),
      ZendeskLogo;

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
      var logo = React.renderComponent(<ZendeskLogo fullscreen={true} />, global.document.body),
          logoNode = ReactTestUtils.findRenderedDOMComponentWithClass(logo, 'Icon--zendesk'),
          logoClasses;

      logoClasses = logoNode.props.className;

      expect(logoClasses.indexOf('u-posAbsolute'))
        .toEqual(-1);

      expect(logoClasses.indexOf('u-posStart'))
        .toEqual(-1);
    });

    it('should have the positional classnames when mobile browser is false', function() {
      var logo = React.renderComponent(<ZendeskLogo />, global.document.body),
          logoNode = ReactTestUtils.findRenderedDOMComponentWithClass(logo, 'Icon--zendesk'),
          logoClasses;

      logoClasses = logoNode.props.className;

      expect(logoClasses.indexOf('u-posAbsolute'))
        .toBeGreaterThan(-1);

      expect(logoClasses.indexOf('u-posStart'))
        .toBeGreaterThan(-1);
    });

    it('has the positional classnames for mobile browser and formSuccess is true', function() {
      var logo = React.renderComponent(
            <ZendeskLogo formSuccess={true} fullscreen={true} />,
            global.document.body
          ),
          logoNode = ReactTestUtils.findRenderedDOMComponentWithClass(logo, 'Icon--zendesk'),
          logoClasses;

      logoClasses = logoNode.props.className;

      expect(logoClasses.indexOf('u-posAbsolute'))
        .toBeGreaterThan(-1);

      expect(logoClasses.indexOf('u-posStart'))
        .toBeGreaterThan(-1);
    });
  });
});
