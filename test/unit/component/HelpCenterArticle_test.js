describe('HelpCenterArticle component', function() {
  let HelpCenterArticle,
    scrollIntoView,
    mockArticle,
    mockRegistry,
    mockOauthToken;
  const helpCenterArticlePath = buildSrcPath('component/HelpCenterArticle');

  beforeEach(function() {
    scrollIntoView = jasmine.createSpy();

    resetDOM();

    global.document.zendeskHost = 'dev.zd-dev.com';
    mockOauthToken = 'abc';

    mockery.enable({
      warnOnReplace: false
    });

    mockRegistry = initMockRegistry({
      'React': React,
      'service/authentication': {
        authentication: {
          getToken: () => mockOauthToken
        }
      },
      'service/i18n': {
        i18n: jasmine.createSpyObj('i18n', [
          't'
        ])
      },
      'utility/globals': {
        win: window,
        document: document
      },
      'utility/utils': {
        parseUrl: () => noop
      },
      'imports?_=lodash!lodash': _,
      'component/Button': {
        ButtonPill: noopReactComponent()
      }
    });

    mockery.registerAllowable(helpCenterArticlePath);

    HelpCenterArticle = requireUncached(helpCenterArticlePath).HelpCenterArticle;

    mockArticle = {
      id: 1,
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
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('article body', function() {
    let helpCenterArticle,
      content;

    beforeEach(function(){
      helpCenterArticle = domRender(<HelpCenterArticle activeArticle={mockArticle} />);

      // componentdidupdate only fires after setState not on initial render
      helpCenterArticle.setState({ foo: 'bar' });

      content = ReactDOM.findDOMNode(helpCenterArticle.refs.article);
    });

    it('should inject html string on componentDidUpdate', function() {
      expect(content.children.length)
        .toEqual(5);

      expect(content.querySelector('div').style.cssText)
        .toEqual('');
    });

    it('should preserve ids on divs and headers', function() {
      expect(content.querySelector('div').id)
        .toEqual('preserved');

      expect(content.querySelector('h1').id)
        .toEqual('foo');
    });

    it('should preserve name attribute on anchors', function() {
      expect(content.querySelector('a[name="foo"]'))
        .not.toBeNull();
    });

    it('should preserve sub/sups on divs', function() {
      expect(content.querySelectorAll('sup, sub').length)
        .toBe(2);

      expect(content.querySelector('#notes').innerHTML)
        .toBe('<sup>1</sup>This explains the note');
    });

    it('should inject base tag to alter relative links base url', function() {
      const baseTag = global.document.querySelector('head base');
      const relativeAnchor = ReactDOM.findDOMNode(helpCenterArticle).querySelector('a[href^="/relative"]');
      const baseUrl = 'https://' + global.document.zendeskHost;

      expect(baseTag.href)
        .toMatch(baseUrl);

      expect(relativeAnchor.href)
        .toMatch(baseUrl + '/relative/link');
    });

    it('should hijack inpage anchor clicks and call scrollIntoView on correct element', function() {
      // save old version of query selector FIXME
      const oldQuerySelector = global.document.querySelector;

      global.document.querySelector = function() {
        return {
          scrollIntoView: scrollIntoView
        };
      };

      // componentdidupdate only fires after setState not on initial render
      helpCenterArticle.setState({ foo: 'bar' });

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
      const helpCenterArticleNode = ReactDOM.findDOMNode(helpCenterArticle);

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

    describe('filterVideoEmbed', function() {
      it('should return a filtered iframe object for video embeds that are from valid sources', function() {
        const youtubeUrl = 'https://youtube.com/embed/fooid';
        let attribs = {
          src: youtubeUrl,
          allowfullscreen: '',
          width: '480px',
          height: '320px'
        };
        let returnObj = {
          tagName: 'iframe',
          attribs: {
            src: youtubeUrl,
            allowfullscreen: ''
          }
        };

        expect(helpCenterArticle.filterVideoEmbed('iframe', attribs))
          .toEqual(returnObj);

        const vimeoUrl = 'https://player.vimeo.com/video/fooid';

        attribs.src = returnObj.attribs.src = vimeoUrl;
        expect(helpCenterArticle.filterVideoEmbed('iframe', attribs))
          .toEqual(returnObj);

        const wistiaUrl = '//fast.wistia.net/embed/iframe/0kpsylzz9j';

        attribs.src = returnObj.attribs.src = wistiaUrl;
        expect(helpCenterArticle.filterVideoEmbed('iframe', attribs))
          .toEqual(returnObj);
      });

      it('should return false for video embeds that are from invalid sources', function() {
        let url = 'https://yoVutube.com/embed/fooid';

        expect(helpCenterArticle.filterVideoEmbed('iframe', { src: url }))
          .toBe(false);

        url = '//fast.wiStia.net/embed/iframe/0kpsylzz9j';
        expect(helpCenterArticle.filterVideoEmbed('iframe', { src: url }))
          .toBe(false);

        url = '.com';
        expect(helpCenterArticle.filterVideoEmbed('iframe', { src: url }))
          .toBe(false);

        url = 'https://player.notvimeo.com/video/fooid';
        expect(helpCenterArticle.filterVideoEmbed('iframe', { src: url }))
          .toBe(false);
      });
    });
  });

  describe('empty article body', function() {
    it('should display an empty article body if a prop was passed with no content body', function() {
      const helpCenterArticle = domRender(<HelpCenterArticle activeArticle={{ body: '' }} />);

      // componentdidupdate only fires after setState not on initial render
      helpCenterArticle.setState({ foo: 'bar' });

      expect(ReactDOM.findDOMNode(helpCenterArticle.refs.article).innerHTML)
        .toEqual('');
    });
  });

  describe('replaceArticleImages', function() {
    let helpCenterArticle,
      mockZendeskHost,
      mockUpdateStoredImages,
      mockImagesSender;

    beforeEach(function() {
      global.document.zendeskHost = 'dev.zd-dev.com';
      mockZendeskHost = 'dev.zd.dev.com';
      mockImagesSender = jasmine.createSpy('mockImagesSender');
      mockUpdateStoredImages = jasmine.createSpy('mockUpdateStoredImages');

      helpCenterArticle = domRender(
        <HelpCenterArticle
          activeArticle={mockArticle}
          storedImages={{}}
          imagesSender={mockImagesSender}
          updateStoredImages={mockUpdateStoredImages}
          zendeskHost={mockZendeskHost} />
      );
    });

    describe('when there are no valid images in the article', function() {
      it('should return the unmodified article body', function() {
        expect(helpCenterArticle.replaceArticleImages(mockArticle))
          .toEqual(mockArticle.body);

        mockArticle.body += `<img src="https://cdn.com/id/img.png">`;

        expect(helpCenterArticle.replaceArticleImages(mockArticle))
          .toEqual(mockArticle.body);
      });
    });

    describe('when there is no valid oauth token', function() {
      it('should return the unmodified article body', function() {
        mockOauthToken = null;
        mockArticle.body += `<img src="https://${mockZendeskHost}/article_attachments/img.png">`;

        expect(helpCenterArticle.replaceArticleImages(mockArticle))
          .toEqual(mockArticle.body);
      });
    });

    describe('when there are valid images and an oauth token', function() {
      beforeEach(function() {
        mockOauthToken = 'abc';
        mockArticle.body += `<img src="https://${mockZendeskHost}/article_attachments/img0.png">
                             <img src="https://${mockZendeskHost}/article_attachments/img1.png">`;
      });

      describe('when there are no images stored or already queued', function() {
        it('should queue the images for download', function() {
          helpCenterArticle.replaceArticleImages(mockArticle);

          expect(mockImagesSender.calls.count())
            .toBe(2);

          expect(mockImagesSender.calls.argsFor(0)[0])
            .toBe(`https://${mockZendeskHost}/article_attachments/img0.png`);

          expect(mockImagesSender.calls.argsFor(1)[0])
            .toBe(`https://${mockZendeskHost}/article_attachments/img1.png`);
        });
      });

      describe('when there are queued images', function() {
        it('should not requeue the images for download', function() {
          helpCenterArticle.replaceArticleImages(mockArticle);

          expect(mockImagesSender.calls.count())
            .toBe(2);

          mockImagesSender.calls.reset();
          helpCenterArticle.replaceArticleImages(mockArticle);

          expect(mockImagesSender.calls.count())
            .toBe(0);
        });
      });

      describe('when an image successfully downloads', function() {
        let mockObjectUrl;

        beforeEach(function() {
          mockObjectUrl = `https://${mockZendeskHost}/abc/img0.png`;
          mockRegistry['utility/globals'].win.URL.createObjectURL = () => mockObjectUrl;
        });

        it('should store it in HelpCenter\'s storedImages state object', function() {
          helpCenterArticle.replaceArticleImages(mockArticle);

          expect(mockImagesSender.calls.count())
            .toBe(2);

          const mockRes = {
            xhr: {
              response: new window.Blob([''], { type: 'image/png' })
            }
          };

          mockImagesSender.calls.argsFor(0)[1](mockRes);

          expect(mockUpdateStoredImages)
            .toHaveBeenCalledWith({
              [`https://${mockZendeskHost}/article_attachments/img0.png`]: `https://${mockZendeskHost}/abc/img0.png`
            });

          mockObjectUrl = `https://${mockZendeskHost}/abc/img1.png`;
          mockImagesSender.calls.argsFor(1)[1](mockRes);

          expect(mockUpdateStoredImages)
            .toHaveBeenCalledWith({
              [`https://${mockZendeskHost}/article_attachments/img1.png`]: `https://${mockZendeskHost}/abc/img1.png`
            });
        });

        it('The url of the new downloaded image should be used in the article body', function() {
          const storedImages = {
            [`https://${mockZendeskHost}/article_attachments/img0.png`]: `https://${mockZendeskHost}/abc/img0.png`,
            [`https://${mockZendeskHost}/article_attachments/img1.png`]: `https://${mockZendeskHost}/abc/img1.png`
          };

          helpCenterArticle = domRender(
            <HelpCenterArticle
              activeArticle={mockArticle}
              storedImages={storedImages}
              zendeskHost={mockZendeskHost} />
          );

          expect(helpCenterArticle.replaceArticleImages(mockArticle))
            .toContain(`https://${mockZendeskHost}/abc/img0.png`);

          expect(helpCenterArticle.replaceArticleImages(mockArticle))
            .toContain(`https://${mockZendeskHost}/abc/img1.png`);
        });
      });
    });
  });
});
