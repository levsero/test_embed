describe('HelpCenterArticle component', () => {
  let HelpCenterArticle,
    scrollIntoView,
    mockArticle,
    mockOauthToken,
    mockParseUrlValue;
  const helpCenterArticlePath = buildSrcPath('component/helpCenter/HelpCenterArticle');

  beforeEach(() => {
    scrollIntoView = jasmine.createSpy();

    resetDOM();

    global.document.zendeskHost = 'dev.zd-dev.com';
    mockOauthToken = 'abc';
    mockParseUrlValue = {
      hostname: global.document.zendeskHost
    };

    mockery.enable({
      warnOnReplace: false
    });

    initMockRegistry({
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
      'utility/utils': {
        parseUrl: () => mockParseUrlValue
      },
      'imports?_=lodash!lodash': _,
      'component/button/ButtonPill': {
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

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('article body', () => {
    let helpCenterArticle,
      content;

    beforeEach(function(){
      helpCenterArticle = domRender(<HelpCenterArticle activeArticle={mockArticle} />);

      // componentdidupdate only fires after setState not on initial render
      helpCenterArticle.setState({ foo: 'bar' });

      content = ReactDOM.findDOMNode(helpCenterArticle.refs.article);
    });

    it('should inject html string on componentDidUpdate', () => {
      expect(content.children.length)
        .toEqual(5);

      expect(content.querySelector('div').style.cssText)
        .toEqual('');
    });

    it('should preserve ids on divs and headers', () => {
      expect(content.querySelector('div').id)
        .toEqual('preserved');

      expect(content.querySelector('h1').id)
        .toEqual('foo');
    });

    it('should preserve name attribute on anchors', () => {
      expect(content.querySelector('a[name="foo"]'))
        .not.toBeNull();
    });

    it('should preserve sub/sups on divs', () => {
      expect(content.querySelectorAll('sup, sub').length)
        .toBe(2);

      expect(content.querySelector('#notes').innerHTML)
        .toBe('<sup>1</sup>This explains the note');
    });

    it('should inject base tag to alter relative links base url', () => {
      const baseTag = global.document.querySelector('head base');
      const relativeAnchor = ReactDOM.findDOMNode(helpCenterArticle).querySelector('a[href^="/relative"]');
      const baseUrl = 'https://' + global.document.zendeskHost;

      expect(baseTag.href)
        .toMatch(baseUrl);

      expect(relativeAnchor.href)
        .toMatch(baseUrl + '/relative/link');
    });

    describe('when the article has ordered lists', () => {
      let list;

      beforeEach(() => {
        mockArticle.body += `
          <ol start="4" reversed="reversed">
          <li>six</li>
          <li>five</li>
          <li>four</li>
          </ol>
        `;

        helpCenterArticle = domRender(<HelpCenterArticle activeArticle={mockArticle} />);
        content = ReactDOM.findDOMNode(helpCenterArticle.refs.article);
        list = content.querySelector('ol');
      });

      it('preserves the `start` attribute', () => {
        expect(list.start)
          .not.toBeNull;
      });

      it('preserves the `reversed` attribute', () => {
        expect(list.reversed)
          .not.toBeNull;
      });
    });

    describe('when the article has images', () => {
      let mockUpdateFrameSize;

      beforeEach(() => {
        mockArticle.body += `
          <img src="imgur.mofo/quit-creepin.png" />
          <img src="giphy.mofo/thats-sick.jpg" />
          <img src="giphy.mofo/this-is-important.png" />
        `;

        mockUpdateFrameSize = jasmine.createSpy('mockUpdateFrameSize');
        helpCenterArticle = domRender(
          <HelpCenterArticle
            activeArticle={mockArticle}
            updateFrameSize={mockUpdateFrameSize} />
        );
        helpCenterArticle.setState({ foo: 'bar' });
        content = ReactDOM.findDOMNode(helpCenterArticle.refs.article);
      });

      it('should call `this.props.updateFrameSize` for each image onload event', () => {
        const imgs = content.getElementsByTagName('img');

        imgs[0].onload();
        imgs[1].onload();
        imgs[2].onload();

        expect(mockUpdateFrameSize.calls.count())
          .toBe(3);
      });
    });

    describe('when an anchor is present', () => {
      it('should hijack inpage anchor clicks and call scrollIntoView on correct element', () => {
        // save old version of query selector FIXME
        const oldQuerySelector = global.document.querySelector;

        global.document.querySelector = () => {
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
            getAttribute: () => {
              return '#foo';
            }
          }
        });

        expect(scrollIntoView)
          .toHaveBeenCalled();

        // reset querySelector to the previous, not spy, version.
        global.document.querySelector = oldQuerySelector;
      });

      describe('when clicking an external link', () => {
        let externalAnchor;

        beforeEach(() => {
          const helpCenterArticleNode = helpCenterArticle.refs.article;

          externalAnchor = helpCenterArticleNode.querySelector('a[href^="/relative"]');

          TestUtils.Simulate.click(helpCenterArticleNode, {
            target: externalAnchor
          });
        });

        it('adds target="_blank"  to anchor', () => {
          expect(externalAnchor.target)
            .toEqual('_blank');
        });

        it('adds rel="noopener noreferrer" to anchor', () => {
          expect(externalAnchor.rel)
            .toEqual('noopener noreferrer');
        });
      });

      describe('mailto link', () => {
        let anchor;

        beforeEach(() => {
          mockArticle.body += `
            <a name="mailto" href="mailto:bob@example.com">mailto link</a>
          `;

          helpCenterArticle = domRender(<HelpCenterArticle activeArticle={mockArticle} />);
          content = ReactDOM.findDOMNode(helpCenterArticle.refs.article);
          anchor = content.querySelector('a[name="mailto"]');
        });

        it('preserves the mailto link', () => {
          expect(anchor.href)
            .toBe('mailto:bob@example.com');
        });

        it('does not have target="_blank"', () => {
          expect(anchor.target)
            .toBeNull;
        });
      });
    });

    it('should display an article body if a prop was passed with truthy content body', () => {
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

    describe('filterVideoEmbed', () => {
      it('should return a filtered iframe object for video embeds that are from valid sources', () => {
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

      it('should return false for video embeds that are from invalid sources', () => {
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

  describe('empty article body', () => {
    it('should display an empty article body if a prop was passed with no content body', () => {
      const helpCenterArticle = domRender(<HelpCenterArticle activeArticle={{ body: '' }} />);

      // componentdidupdate only fires after setState not on initial render
      helpCenterArticle.setState({ foo: 'bar' });

      expect(ReactDOM.findDOMNode(helpCenterArticle.refs.article).innerHTML)
        .toEqual('');
    });
  });

  describe('replaceArticleImages', () => {
    let helpCenterArticle,
      mockZendeskHost,
      mockUpdateStoredImages,
      mockImagesSender;
    const lastActiveArticleId = 2;

    beforeEach(() => {
      mockZendeskHost = 'dev.zd-dev.com';
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

    describe('when there are no valid images in the article', () => {
      it('should return the unmodified article body', () => {
        expect(helpCenterArticle.replaceArticleImages(mockArticle, lastActiveArticleId))
          .toEqual(mockArticle.body);

        mockArticle.body += '<img src="https://cdn.com/id/img.png">';

        expect(helpCenterArticle.replaceArticleImages(mockArticle, lastActiveArticleId))
          .toEqual(mockArticle.body);
      });
    });

    describe('when there are images in the article with relative `/attachments/` paths', () => {
      it('should add the domain to the img src', () => {
        expect(helpCenterArticle.replaceArticleImages(mockArticle, lastActiveArticleId))
          .toEqual(mockArticle.body);

        mockArticle.body += '<img src="/attachments/img.png">';

        expect(helpCenterArticle.replaceArticleImages(mockArticle, lastActiveArticleId))
          .toContain(`//${mockZendeskHost}/attachments/img.png`);
      });
    });

    describe('when there is no valid oauth token', () => {
      it('should return the unmodified article body', () => {
        mockOauthToken = null;
        mockArticle.body += `<img src="https://${mockZendeskHost}/hc/article_attachments/img.png">`;

        expect(helpCenterArticle.replaceArticleImages(mockArticle, lastActiveArticleId))
          .toEqual(mockArticle.body);
      });
    });

    describe('when there are valid images and an oauth token', () => {
      beforeEach(() => {
        mockOauthToken = 'abc';
        mockArticle.body += `<img src="https://${mockZendeskHost}/hc/article_attachments/img0.png">
                             <img src="https://${mockZendeskHost}/hc/article_attachments/img1.png">`;
      });

      describe('when there are no images stored or already queued', () => {
        it('should queue the images for download', () => {
          helpCenterArticle.replaceArticleImages(mockArticle, lastActiveArticleId);

          expect(mockImagesSender.calls.count())
            .toBe(2);

          expect(mockImagesSender.calls.argsFor(0)[0])
            .toBe(`https://${mockZendeskHost}/hc/article_attachments/img0.png`);

          expect(mockImagesSender.calls.argsFor(1)[0])
            .toBe(`https://${mockZendeskHost}/hc/article_attachments/img1.png`);
        });
      });

      describe('when the same article is viewed again', () => {
        it('should not requeue the images for download', () => {
          helpCenterArticle.replaceArticleImages(mockArticle, 1);

          expect(mockImagesSender.calls.count())
            .toBe(0);
        });
      });

      describe('when there are queued images', () => {
        it('should not requeue the images for download', () => {
          helpCenterArticle.replaceArticleImages(mockArticle, lastActiveArticleId);

          expect(mockImagesSender.calls.count())
            .toBe(2);

          mockImagesSender.calls.reset();
          helpCenterArticle.replaceArticleImages(mockArticle, lastActiveArticleId);

          expect(mockImagesSender.calls.count())
            .toBe(0);
        });
      });

      describe('when an image successfully downloads', () => {
        let mockObjectUrl;

        beforeEach(() => {
          mockObjectUrl = `https://${mockZendeskHost}/abc/img0.png`;
          window.URL.createObjectURL = () => mockObjectUrl;
        });

        it('should store it in HelpCenter\'s storedImages state object', () => {
          helpCenterArticle.replaceArticleImages(mockArticle, lastActiveArticleId);

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
              [`https://${mockZendeskHost}/hc/article_attachments/img0.png`]: `https://${mockZendeskHost}/abc/img0.png`
            });

          mockObjectUrl = `https://${mockZendeskHost}/abc/img1.png`;
          mockImagesSender.calls.argsFor(1)[1](mockRes);

          expect(mockUpdateStoredImages)
            .toHaveBeenCalledWith({
              [`https://${mockZendeskHost}/hc/article_attachments/img1.png`]: `https://${mockZendeskHost}/abc/img1.png`
            });
        });

        it('The url of the new downloaded image should be used in the article body', () => {
          const storedImages = {
            [`https://${mockZendeskHost}/hc/article_attachments/img0.png`]: `https://${mockZendeskHost}/abc/img0.png`,
            [`https://${mockZendeskHost}/hc/article_attachments/img1.png`]: `https://${mockZendeskHost}/abc/img1.png`
          };

          helpCenterArticle = domRender(
            <HelpCenterArticle
              activeArticle={mockArticle}
              storedImages={storedImages}
              zendeskHost={mockZendeskHost} />
          );

          expect(helpCenterArticle.replaceArticleImages(mockArticle, lastActiveArticleId))
            .toContain(`https://${mockZendeskHost}/abc/img0.png`);

          expect(helpCenterArticle.replaceArticleImages(mockArticle, lastActiveArticleId))
            .toContain(`https://${mockZendeskHost}/abc/img1.png`);
        });
      });
    });
  });

  describe('view original article button', () => {
    it('is visible by default', () => {
      const helpCenterArticle = domRender(<HelpCenterArticle activeArticle={mockArticle} />);

      expect(ReactDOM.findDOMNode(helpCenterArticle).querySelector('.u-marginBM').className)
        .not.toMatch('u-isHidden');
    });

    it('is hidden if originalArticleButton prop is true', () => {
      const helpCenterArticle = domRender(
        <HelpCenterArticle
          activeArticle={mockArticle}
          originalArticleButton={false} />);

      expect(ReactDOM.findDOMNode(helpCenterArticle).querySelector('.u-marginBM').className)
        .toMatch('u-isHidden');
    });
  });
});
