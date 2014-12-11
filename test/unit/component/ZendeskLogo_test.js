/** @jsx React.DOM */

describe('ZendeskLogo component', function() {

  var mockRegistry,
      zendeskLogoPath = buildSrcPath('component/ZendeskLogo');

  beforeEach(function() {

    resetDOM();

    mockery.enable({
      useCleanCache: true
    });

    mockRegistry = initMockRegistry({
      'react/addons': React,
      'utility/devices': {
        isMobileBrowser: function() {
          return false;
        }
      }
    });
    mockery.registerAllowable('utility/globals');
    mockery.registerAllowable(zendeskLogoPath);
  });

  describe('logo class names', function() {
    it('should not have the positional classnames when mobile browser is true', function() {
      mockRegistry['utility/devices'].isMobileBrowser = function() {
        return true;
      };
      mockery.resetCache();

      var ZendeskLogo = require(zendeskLogoPath).ZendeskLogo,
          logo = React.renderComponent(<ZendeskLogo />, global.document.body),
          logoNode = ReactTestUtils.findRenderedDOMComponentWithClass(logo, 'Icon--zendesk'),
          logoClasses;

      logoClasses = logoNode.props.className;

      expect(logoClasses.indexOf('u-posAbsolute'))
        .toEqual(-1);

      expect(logoClasses.indexOf('u-posStart'))
        .toEqual(-1);
    });

    it('should have the positional classnames when mobile browser is false', function() {
      mockRegistry['utility/devices'].isMobileBrowser = function() {
        return false;
      };

      mockery.resetCache();

      var ZendeskLogo = require(zendeskLogoPath).ZendeskLogo,
          logo = React.renderComponent(<ZendeskLogo />, global.document.body),
          logoNode = ReactTestUtils.findRenderedDOMComponentWithClass(logo, 'Icon--zendesk'),
          logoClasses;

      logoClasses = logoNode.props.className;

      expect(logoClasses.indexOf('u-posAbsolute'))
        .toBeGreaterThan(-1);

      expect(logoClasses.indexOf('u-posStart'))
        .toBeGreaterThan(-1);
    });

    it('has the positional classnames for mobile browser and formSuccess is true', function() {
      mockRegistry['utility/devices'].isMobileBrowser = function() {
        return true;
      };

      mockery.resetCache();

      var ZendeskLogo = require(zendeskLogoPath).ZendeskLogo,
          logo = React.renderComponent(<ZendeskLogo formSuccess={true} />, global.document.body),
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
