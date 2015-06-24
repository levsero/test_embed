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
      'component/SvgIcon': {
        SVGIcon: jasmine.createSpy('mockSubmitTicketForm')
          .and.callFake(React.createClass({
            render: function() {
              return <span className={"Icon "+this.props.type}></span>;
            }
          }))
      }
    });
    mockery.registerAllowable('utility/globals');
    mockery.registerAllowable(zendeskLogoPath);

    ZendeskLogo = require(zendeskLogoPath).ZendeskLogo;
  });

  describe('logo class names', function() {
    it('should not have the positional classnames when mobile browser is true', function() {
      var logo = React.render(<ZendeskLogo fullscreen={true} />, global.document.body),
          logoNode = ReactTestUtils.findRenderedDOMComponentWithTag(logo, 'a'),
          logoClasses;

      logoClasses = logoNode.props.className;

      expect(logoClasses)
        .not.toMatch('u-posAbsolute');
    });

    it('should have the positional classnames when mobile browser is false', function() {
      var logo = React.render(<ZendeskLogo />, global.document.body),
          logoNode = ReactTestUtils.findRenderedDOMComponentWithTag(logo, 'a'),
          logoClasses;

      logoClasses = logoNode.props.className;

      expect(logoClasses)
        .toMatch('u-posAbsolute');
    });

    it('has the positional classnames for mobile browser and formSuccess is true', function() {
      var logo = React.render(
            <ZendeskLogo formSuccess={true} fullscreen={true} />,
            global.document.body
          ),
          logoNode = ReactTestUtils.findRenderedDOMComponentWithTag(logo, 'a'),
          logoClasses;

      logoClasses = logoNode.props.className;

      expect(logoClasses)
        .toMatch('u-posAbsolute');
    });

    it('does not has the rtl classnames when rtl language is false', function() {
      var logo = React.render(
            <ZendeskLogo formSuccess={true} rtl={false} />,
            global.document.body
          ),
          logoNode = ReactTestUtils.findRenderedDOMComponentWithTag(logo, 'a'),
          logoClasses;

      logoClasses = logoNode.props.className;

      expect(logoClasses)
        .toMatch('u-posStart');
    });

    it('has the rtl classnames when rtl language is true', function() {
      var logo = React.render(
            <ZendeskLogo formSuccess={true} rtl={true} />,
            global.document.body
          ),
          logoNode = ReactTestUtils.findRenderedDOMComponentWithTag(logo, 'a'),
          logoClasses;

      logoClasses = logoNode.props.className;

      expect(logoClasses)
        .not.toMatch('u-posStart');
    });
  });
});
