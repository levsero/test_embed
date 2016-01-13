describe('HelpCenterArticle component', function() {
  let HelpCenterArticle,
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
      warnOnReplace: false
    });

    initMockRegistry({
      'React': React,
      'service/i18n': {
        i18n: jasmine.createSpyObj('i18n', [
          't'
        ])
      },
      'imports?_=lodash!lodash': _,
      'component/Button': {
        ButtonPill: noopReactComponent()
      }
    });

    mockery.registerAllowable(helpCenterArticlePath);

    HelpCenterArticle = requireUncached(helpCenterArticlePath).HelpCenterArticle;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should inject html string on componentDidUpdate', function() {
    const helpCenterArticle = ReactDOM.render(
      <HelpCenterArticle activeArticle={mockArticle} />,
      global.document.body
    );

    // componentdidupdate only fires after setState not on initial render
    helpCenterArticle.setState({foo: 'bar'});

    expect(ReactDOM.findDOMNode(helpCenterArticle.refs.article).children.length)
      .toEqual(5);

    expect(ReactDOM.findDOMNode(helpCenterArticle.refs.article).querySelector('div').style.cssText)
      .toEqual('');
  });

  it('should preserve ids on divs and headers', function() {
    const helpCenterArticle = ReactDOM.render(
      <HelpCenterArticle activeArticle={mockArticle} />,
      global.document.body
    );

    // componentdidupdate only fires after setState not on initial render
    helpCenterArticle.setState({foo: 'bar'});

    const content = ReactDOM.findDOMNode(helpCenterArticle.refs.article);

    expect(content.querySelector('div').id)
      .toEqual('preserved');

    expect(content.querySelector('h1').id)
      .toEqual('foo');
  });

  it('should preserve name attribute on anchors', function() {
    const helpCenterArticle = ReactDOM.render(
      <HelpCenterArticle activeArticle={mockArticle} />,
      global.document.body
    );

    // componentdidupdate only fires after setState not on initial render
    helpCenterArticle.setState({foo: 'bar'});

    const content = ReactDOM.findDOMNode(helpCenterArticle.refs.article);

    expect(content.querySelector('a[name="foo"]'))
      .not.toBeNull();
  });

  it('should preserve sub/sups on divs', function() {
    const helpCenterArticle = ReactDOM.render(
      <HelpCenterArticle activeArticle={mockArticle} />,
      global.document.body
    );

    // componentdidupdate only fires after setState not on initial render
    helpCenterArticle.setState({foo: 'bar'});

    const content = ReactDOM.findDOMNode(helpCenterArticle.refs.article);

    expect(content.querySelectorAll('sup, sub').length)
      .toBe(2);

    expect(content.querySelector('#notes').innerHTML)
      .toBe('<sup>1</sup>This explains the note');
  });

  it('should inject base tag to alter relative links base url', function() {
    const helpCenterArticle = ReactDOM.render(
      <HelpCenterArticle activeArticle={mockArticle} />,
      global.document.body
    );
    const baseUrl = 'https://' + global.document.zendeskHost;

    // componentdidupdate only fires after setState not on initial render
    helpCenterArticle.setState({foo: 'bar'});

    const baseTag = global.document.querySelector('head base');
    const relativeAnchor = ReactDOM.findDOMNode(helpCenterArticle).querySelector('a[href^="/relative"]');

    expect(baseTag.href)
      .toMatch(baseUrl);

    expect(relativeAnchor.href)
      .toMatch(baseUrl + '/relative/link');
  });

  it('should hijack inpage anchor clicks and call scrollIntoView on correct element', function() {
    const helpCenterArticle = ReactDOM.render(
      <HelpCenterArticle activeArticle={mockArticle} />,
      global.document.body
    );
    // save old version of query selector FIXME
    const oldQuerySelector = global.document.querySelector;

    global.document.querySelector = function() {
      return {
        scrollIntoView: scrollIntoView
      };
    };

    // componentdidupdate only fires after setState not on initial render
    helpCenterArticle.setState({foo: 'bar'});

    TestUtils.Simulate.click(helpCenterArticle.refs.article, {
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

    // reset querySelector to the previous, not spy, version.
    global.document.querySelector = oldQuerySelector;
  });

  it('should display an article body if a prop was passed with truthy content body', function() {
    const helpCenterArticle = ReactDOM.render(
      <HelpCenterArticle activeArticle={mockArticle} />,
      global.document.body
    );
    const helpCenterArticleNode = ReactDOM.findDOMNode(helpCenterArticle);

    // componentdidupdate only fires after setState not on initial render
    helpCenterArticle.setState({ foo: 'bar' });

    expect(helpCenterArticleNode.querySelector('#foo').innerHTML)
      .toMatch('Foobar');

    expect(helpCenterArticleNode.querySelector('a[href="#foo"]').innerHTML)
      .toMatch('inpage link');

    expect(helpCenterArticleNode.querySelector('a[href^="/relative"]').innerHTML)
      .toMatch('relative link');

    expect(helpCenterArticleNode.querySelector('#preserved').innerHTML)
      .toMatch('This text contains a sub-note<sub>1</sub>');

    expect(helpCenterArticleNode.querySelector('#notes').innerHTML)
      .toMatch('<sup>1</sup>This explains the note');
  });

  it('should display an empty article body if a prop was passed with no content body', function() {
    const helpCenterArticle = ReactDOM.render(
      <HelpCenterArticle activeArticle={{body: ``}} />,
      global.document.body
    );

    // componentdidupdate only fires after setState not on initial render
    helpCenterArticle.setState({ foo: 'bar' });

    expect(ReactDOM.findDOMNode(helpCenterArticle.refs.article).innerHTML)
      .toEqual('');
  });
});
