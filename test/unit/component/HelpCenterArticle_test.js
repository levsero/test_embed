/** @jsx React.DOM */

describe('HelpCenterArticle component', function() {
  var HelpCenterArticle,
      mockRegistry,
      mockArticle,
      helpCenterArticlePath = buildSrcPath('component/HelpCenterArticle');

  beforeEach(function() {

    resetDOM();

    mockery.enable({
      useCleanCache: true
    });

    mockRegistry = initMockRegistry({
      'react/addons': React,
      'service/i18n': {
        i18n: jasmine.createSpyObj('i18n', [
          'init',
          'setLocale',
          't',
          'isRTL'
        ])
      },
      'imports?_=lodash!lodash': _
    });

    mockArticle = {
      /* jshint camelcase: false */
      title: 'Test Article',
      html_url: 'www.x.com',
      body: '<div style="bad styles not allowed" />'
    };

    mockery.registerAllowable(helpCenterArticlePath);

    HelpCenterArticle = require(helpCenterArticlePath).HelpCenterArticle;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should not have fullscreen classes when fullscreen is false', function() {
    var helpCenterArticle = React.renderComponent(
          <HelpCenterArticle activeArticle={mockArticle} />,
          global.document.body
        ),
        articleNode = ReactTestUtils
                        .findRenderedDOMComponentWithClass(helpCenterArticle, 'UserContent'),
        articleClasses;

      articleClasses = articleNode.props.className;

      expect(articleClasses)
        .not.toMatch('UserContent--Mobile');
  });

  it('should have fullscreen classes when fullscreen is true', function() {
    var helpCenterArticle = React.renderComponent(
          <HelpCenterArticle activeArticle={mockArticle} fullscreen={true} />,
          global.document.body
        ),
        articleNode = ReactTestUtils
                        .findRenderedDOMComponentWithClass(helpCenterArticle, 'UserContent'),
        articleClasses;

      articleClasses = articleNode.props.className;

      expect(articleClasses)
        .toMatch('UserContent--mobile');
  });
});

