/** @jsx React.DOM */

describe('HelpCenterArticle component', function() {
  var HelpCenterArticle,
      mockRegistry,
      helpCenterArticlePath = buildSrcPath('component/HelpCenterArticle'),
      mockArticle = {
        body: `
          <h1 id="foo">Foobar</h1>
          <a href="#foo" name="foo">inpage link</a>
          <a class="relative" href="/relative/link">relative link</a>
          <div id="preserved" style="bad styles not allowed">
            This text contains a sub-note<sub>1</sub>
          </div>
          <div id="notes"><sup>1</sup>This explains the note</div>
        `
      },
      scrollIntoView;

  beforeEach(function() {

    scrollIntoView = jasmine.createSpy();

    global.document.zendeskHost = 'dev.zd-dev.com';

    resetDOM();

    mockery.enable({
      warnOnReplace:false,
      useCleanCache: true
    });

    mockRegistry = initMockRegistry({
      'react/addons': React,
      'service/i18n': {
        i18n: jasmine.createSpyObj('i18n', [
          't',
        ])
      },
      'imports?_=lodash!lodash': _
    });

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
        .not.toMatch('UserContent--mobile');
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

  it('should inject html string on componentDidUpdate', function() {
    var helpCenterArticle = React.renderComponent(
      <HelpCenterArticle activeArticle={mockArticle} />,
      global.document.body
    );

    // componentdidupdate only fires after setState not on initial render
    helpCenterArticle.setState({foo: 'bar'});

    expect(helpCenterArticle.refs.article.getDOMNode().children.length)
      .toEqual(5);

    expect(helpCenterArticle.refs.article.getDOMNode().querySelector('div').style.cssText)
      .toEqual('');
  });

  it('should preserve ids on divs', function() {
    var helpCenterArticle = React.renderComponent(
          <HelpCenterArticle activeArticle={mockArticle} />,
          global.document.body
        ),
        content;

    // componentdidupdate only fires after setState not on initial render
    helpCenterArticle.setState({foo: 'bar'});

    content = helpCenterArticle.refs.article.getDOMNode();

    expect(content.querySelector('div').id)
      .toEqual('preserved');

    expect(content.querySelector('h1').id)
      .not.toEqual('foo');
  });

  it('should preserve name attribute on anchors', function() {
    var helpCenterArticle = React.renderComponent(
          <HelpCenterArticle activeArticle={mockArticle} />,
          global.document.body
        ),
        content;

    // componentdidupdate only fires after setState not on initial render
    helpCenterArticle.setState({foo: 'bar'});

    content = helpCenterArticle.refs.article.getDOMNode();

    expect(content.querySelector('a[name="foo"]'))
      .not.toBeNull();
  });

  it('should preserve sub/sups on divs', function() {
    var helpCenterArticle = React.renderComponent(
          <HelpCenterArticle activeArticle={mockArticle} />,
          global.document.body
        ),
        content;

    // componentdidupdate only fires after setState not on initial render
    helpCenterArticle.setState({foo: 'bar'});

    content = helpCenterArticle.refs.article.getDOMNode();

    expect(content.querySelectorAll('sup, sub').length)
      .toBe(2);

    expect(content.querySelector('#notes').innerHTML)
      .toBe('<sup>1</sup>This explains the note');
  });

  it('should inject base tag to alter relative links base url', function() {
    var helpCenterArticle = React.renderComponent(
          <HelpCenterArticle activeArticle={mockArticle} />,
          global.document.body
        ),
        relativeAnchor,
        baseTag,
        baseUrl = 'https://' + global.document.zendeskHost;

    // componentdidupdate only fires after setState not on initial render
    helpCenterArticle.setState({foo: 'bar'});

    baseTag = global.document.querySelector('head base');
    relativeAnchor = helpCenterArticle.getDOMNode().querySelector('a[href^="/relative"]');

    expect(baseTag.href)
      .toMatch(baseUrl);

    expect(relativeAnchor.href)
      .toMatch(baseUrl + '/relative/link');
  });

  it('should hijack inpage anchor clicks and call scrollIntoView on correct element', function() {
    var helpCenterArticle = React.renderComponent(
          <HelpCenterArticle activeArticle={mockArticle} />,
          global.document.body
        );

    global.document.querySelector = function() {
      return {
        scrollIntoView: scrollIntoView
      };
    };

    // componentdidupdate only fires after setState not on initial render
    helpCenterArticle.setState({foo: 'bar'});

    ReactTestUtils.Simulate.click(helpCenterArticle.refs.article, {
      target: {
        nodeName: 'A',
        href: global.document.zendeskHost + '#foo',
        ownerDocument: global.document,
        getAttribute: function() {
          return '#foo';
        }
      }
    });

    expect(scrollIntoView)
      .toHaveBeenCalled();
  });
});
