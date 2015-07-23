describe('HelpCenterArticle component', function() {
  let HelpCenterArticle,
      mockRegistry,
      scrollIntoView;
  const helpCenterArticlePath = buildSrcPath('component/HelpCenterArticle');
  const mockArticle = {
    body: `
      <h1 id="foo">Foobar</h1>
      <a href="#foo" name="foo">inpage link</a>
      <a class="relative" href="/relative/link">relative link</a>
      <div id="preserved" style="bad styles not allowed">
        This text contains a sub-note<sub>1</sub>
      </div>
      <div id="notes"><sup>1</sup>This explains the note</div>
    `
  };

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
      }
    });

    mockery.registerAllowable(helpCenterArticlePath);

    HelpCenterArticle = require(helpCenterArticlePath).HelpCenterArticle;

  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should not have fullscreen classes when fullscreen is false', function() {
    const helpCenterArticle = React.render(
      <HelpCenterArticle activeArticle={mockArticle} />,
      global.document.body
    );
    const articleNode = ReactTestUtils
      .findRenderedDOMComponentWithClass(helpCenterArticle, 'UserContent');

    const articleClasses = articleNode.props.className;

    expect(articleClasses)
      .not.toMatch('UserContent--mobile');
  });

  it('should have fullscreen classes when fullscreen is true', function() {
    const helpCenterArticle = React.render(
      <HelpCenterArticle activeArticle={mockArticle} fullscreen={true} />,
      global.document.body
    );
    const articleNode = ReactTestUtils
      .findRenderedDOMComponentWithClass(helpCenterArticle, 'UserContent');

    const articleClasses = articleNode.props.className;

    expect(articleClasses)
      .toMatch('UserContent--mobile');
  });

  it('should inject html string on componentDidUpdate', function() {
    const helpCenterArticle = React.render(
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
    const helpCenterArticle = React.render(
      <HelpCenterArticle activeArticle={mockArticle} />,
      global.document.body
    );

    // componentdidupdate only fires after setState not on initial render
    helpCenterArticle.setState({foo: 'bar'});

    const content = helpCenterArticle.refs.article.getDOMNode();

    expect(content.querySelector('div').id)
      .toEqual('preserved');

    expect(content.querySelector('h1').id)
      .not.toEqual('foo');
  });

  it('should preserve name attribute on anchors', function() {
    const helpCenterArticle = React.render(
      <HelpCenterArticle activeArticle={mockArticle} />,
      global.document.body
    );

    // componentdidupdate only fires after setState not on initial render
    helpCenterArticle.setState({foo: 'bar'});

    const content = helpCenterArticle.refs.article.getDOMNode();

    expect(content.querySelector('a[name="foo"]'))
      .not.toBeNull();
  });

  it('should preserve sub/sups on divs', function() {
    const helpCenterArticle = React.render(
          <HelpCenterArticle activeArticle={mockArticle} />,
          global.document.body
    );

    // componentdidupdate only fires after setState not on initial render
    helpCenterArticle.setState({foo: 'bar'});

    const content = helpCenterArticle.refs.article.getDOMNode();

    expect(content.querySelectorAll('sup, sub').length)
      .toBe(2);

    expect(content.querySelector('#notes').innerHTML)
      .toBe('<sup>1</sup>This explains the note');
  });

  it('should inject base tag to alter relative links base url', function() {
    const helpCenterArticle = React.render(
      <HelpCenterArticle activeArticle={mockArticle} />,
      global.document.body
    );
    const baseUrl = 'https://' + global.document.zendeskHost;

    // componentdidupdate only fires after setState not on initial render
    helpCenterArticle.setState({foo: 'bar'});

    const baseTag = global.document.querySelector('head base');
    const relativeAnchor = helpCenterArticle.getDOMNode().querySelector('a[href^="/relative"]');

    expect(baseTag.href)
      .toMatch(baseUrl);

    expect(relativeAnchor.href)
      .toMatch(baseUrl + '/relative/link');
  });

  it('should hijack inpage anchor clicks and call scrollIntoView on correct element', function() {
    const helpCenterArticle = React.render(
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
