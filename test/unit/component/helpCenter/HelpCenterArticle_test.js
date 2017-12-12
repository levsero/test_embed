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
      './HelpCenterArticle.sass': {
        locals: {
          originalArticleButton: 'originalArticleButtonClasses'
        }
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
      locale: 'en-us',
      body: `
        <h1 id="foo">Foobar</h1>
        <h2 name="1">Baz</h2>
        <a href="#foo">inpage link</a>
        <a href="#1">inpage link 2</a>
        <a class="relative" name="bar" href="/relative/link">relative link</a>
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

    describe('basic rendering', () => {
      beforeEach(() => {
        helpCenterArticle = domRender(<HelpCenterArticle activeArticle={mockArticle} />);

        content = ReactDOM.findDOMNode(helpCenterArticle.refs.article);
      });

      it('injects html string on componentDidMount', () => {
        expect(content.children.length)
          .toEqual(7);

        expect(content.querySelector('div').style.cssText)
          .toEqual('');
      });

      it('preserves ids on divs and headers', () => {
        expect(content.querySelector('div').id)
          .toEqual('preserved');

        expect(content.querySelector('h1').id)
          .toEqual('foo');
      });

      it('preserves name attribute on anchors', () => {
        expect(content.querySelector('a[name="bar"]'))
          .not.toBeNull();
      });

      it('preserves sub/sups on divs', () => {
        expect(content.querySelectorAll('sup, sub').length)
          .toBe(2);

        expect(content.querySelector('#notes').innerHTML)
          .toBe('<sup>1</sup>This explains the note');
      });

      it('injects base tag to alter relative links base url', () => {
        const baseTag = global.document.querySelector('head base');
        const relativeAnchor = ReactDOM.findDOMNode(helpCenterArticle).querySelector('a[href^="/relative"]');
        const baseUrl = 'https://' + global.document.zendeskHost;

        expect(baseTag.href)
          .toMatch(baseUrl);

        expect(relativeAnchor.href)
          .toMatch(baseUrl + '/relative/link');
      });
    });

    describe('when the article has a \\n between start and end tags', () => {
      beforeEach(() => {
        mockArticle.body += `<ul>\n<li>\n<p>One</p></li>\n<li>Two</li>\n</ul>`;

        helpCenterArticle = domRender(<HelpCenterArticle activeArticle={mockArticle} />);
        content = ReactDOM.findDOMNode(helpCenterArticle.refs.article);
      });

      it('removes the \\n between start and end tags', () => {
        expect(content.innerHTML)
          .toMatch(`<ul><li><p>One</p></li><li>Two</li></ul>`);
      });
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

      it('calls `this.props.updateFrameSize` for each image onload event', () => {
        const imgs = content.getElementsByTagName('img');

        imgs[0].onload();
        imgs[1].onload();
        imgs[2].onload();

        expect(mockUpdateFrameSize.calls.count())
          .toBe(3);
      });
    });

    describe('when an anchor is present', () => {
      let oldQuerySelector;

      beforeEach(() => {
        // save old version of query selector FIXME
        oldQuerySelector = global.document.querySelector;

        global.document.querySelector = () => {
          return {
            scrollIntoView: scrollIntoView
          };
        };
      });

      afterEach(() => {
        // reset querySelector to the previous, not spy, version.
        global.document.querySelector = oldQuerySelector;
      });

      describe('when the link refers to an element with a matching id attribute', () => {
        beforeEach(() => {
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
        });

        it('calls scrollIntoView', () => {
          expect(scrollIntoView)
            .toHaveBeenCalled();
        });
      });

      describe('when the link refers to an element with a matching name attribute', () => {
        beforeEach(() => {
          TestUtils.Simulate.click(helpCenterArticle.refs.article, {
            target: {
              nodeName: 'A',
              href: global.document.zendeskHost + '#1',
              ownerDocument: global.document,
              getAttribute: () => {
                return '#1';
              }
            }
          });
        });

        it('calls scrollIntoView', () => {
          expect(scrollIntoView)
            .toHaveBeenCalled();
        });
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

    it('displays an article body if a prop was passed with truthy content body', () => {
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
      describe('when the video source is valid', () => {
        const validUrls = [
          'https://player.vimeo.com/video/fooid',
          '//fast.wistia.net/embed/iframe/0kpsylzz9j',
          'https://youtube.com/embed/fooid',
          '//players.brightcove.net/fooid',
          '//content.jwplatform.com/players/fooid.html',
          '//screencast.com/users/fooid'
        ];
        let attribs = {
          allowfullscreen: '',
          width: '480px',
          height: '320px'
        };
        let returnObj = {
          tagName: 'iframe',
          attribs: {
            allowfullscreen: ''
          }
        };

        it('validUrls should contain elements', () => {
          expect(validUrls.length)
            .toBeTruthy();
        });

        _.forEach(validUrls, (url) => {
          beforeEach(() => {
            attribs.src = returnObj.attribs.src = url;
          });

          it(`returns a filtered frame object for ${url}`, () => {
            expect(helpCenterArticle.filterVideoEmbed('iframe', attribs))
              .toEqual(returnObj);
          });
        });
      });

      describe('when the video source is invalid', () => {
        const invalidUrls = [
          'https://yoVutube.com/embed/fooid',
          '//fast.wiStia.net/embed/iframe/0kpsylzz9j',
          '.com',
          'https://player.notvimeo.com/video/fooid',
          'https://content.jpmorgan.com/players/fooid.html',
          '//screenfast.com/users/fooid'
        ];

        it('invalidUrls should contain elements', () => {
          expect(invalidUrls.length)
            .toBeTruthy();
        });

        _.forEach(invalidUrls, (url) => {
          it(`returns false for ${url}`, () => {
            expect(helpCenterArticle.filterVideoEmbed('iframe', { src: url }))
            .toBe(false);
          });
        });
      });
    });
  });

  describe('empty article body', () => {
    it('displays an empty article body if a prop was passed with no content body', () => {
      const helpCenterArticle = domRender(<HelpCenterArticle activeArticle={{ body: '' }} />);

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
      it('returns the unmodified article body', () => {
        expect(helpCenterArticle.replaceArticleImages(mockArticle, lastActiveArticleId))
          .toEqual(mockArticle.body);

        mockArticle.body += '<img src="https://cdn.com/id/img.png" />';

        expect(helpCenterArticle.replaceArticleImages(mockArticle, lastActiveArticleId))
          .toEqual(mockArticle.body);
      });
    });

    describe('when there are images in the article with relative `/attachments/` paths', () => {
      it('adds the domain to the img src', () => {
        expect(helpCenterArticle.replaceArticleImages(mockArticle, lastActiveArticleId))
          .toEqual(mockArticle.body);

        mockArticle.body = '<img src="/attachments/token/abc/?name=img.png" />';

        expect(helpCenterArticle.replaceArticleImages(mockArticle, lastActiveArticleId))
          .toContain(`//${mockZendeskHost}/attachments/token/abc/?name=img.png`);
      });
    });

    describe('when there is no valid oauth token', () => {
      it('returns the unmodified article body', () => {
        mockOauthToken = null;
        mockArticle.body += `<img src="https://${mockZendeskHost}/hc/article_attachments/img.png" />`;

        expect(helpCenterArticle.replaceArticleImages(mockArticle, lastActiveArticleId))
          .toEqual(mockArticle.body);
      });
    });

    describe('when there are valid images and an oauth token', () => {
      beforeEach(() => {
        mockOauthToken = 'abc';
        mockArticle.body += `<img src="https://${mockZendeskHost}/hc/article_attachments/img0.png" />
                             <img src="https://${mockZendeskHost}/hc/article_attachments/img1.png" />`;
      });

      describe('when the img urls are missing the locale', () => {
        let calls;
        const expectedCallCount = 4;

        beforeEach(() => {
          mockArticle.body += `<img src="https://${mockZendeskHost}/hc/article_attachments/img2.png" />
                               <img src="https://${mockZendeskHost}/hc/article_attachments/img3.png" />`;

          helpCenterArticle.replaceArticleImages(mockArticle, lastActiveArticleId);
          calls = mockImagesSender.calls;
        });

        describe('when there are no images stored or already queued', () => {
          it('queues the images for download with patched in locale', () => {
            expect(calls.count())
              .toBe(expectedCallCount);

            for (let i = 0; i < expectedCallCount; i++) {
              expect(calls.argsFor(i)[0])
                .toBe(`https://${mockZendeskHost}/hc/en-us/article_attachments/img${i}.png`);
            }
          });
        });
      });

      describe('when the img urls are not missing the locale', () => {
        let calls;
        const expectedCallCount = 4;

        beforeEach(() => {
          mockArticle.body += `<img src="https://${mockZendeskHost}/hc/en-au/article_attachments/img2.png" />
                               <img src="https://${mockZendeskHost}/hc/en/article_attachments/img3.png" />`;

          helpCenterArticle.replaceArticleImages(mockArticle, lastActiveArticleId);
          calls = mockImagesSender.calls;
        });

        describe('when there are no images stored or already queued', () => {
          it('queues the images for download with existing locale', () => {
            expect(mockImagesSender.calls.count())
              .toBe(expectedCallCount);

            expect(calls.argsFor(0)[0])
              .toBe(`https://${mockZendeskHost}/hc/en-us/article_attachments/img0.png`);

            expect(calls.argsFor(1)[0])
              .toBe(`https://${mockZendeskHost}/hc/en-us/article_attachments/img1.png`);

            expect(calls.argsFor(2)[0])
              .toBe(`https://${mockZendeskHost}/hc/en-au/article_attachments/img2.png`);

            expect(calls.argsFor(3)[0])
              .toBe(`https://${mockZendeskHost}/hc/en/article_attachments/img3.png`);
          });
        });
      });

      describe('when the same article is viewed again', () => {
        it('does not requeue the images for download', () => {
          helpCenterArticle.replaceArticleImages(mockArticle, 1);

          expect(mockImagesSender.calls.count())
            .toBe(0);
        });
      });

      describe('when there are queued images', () => {
        it('does not requeue the images for download', () => {
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

        it('stores it in HelpCenter\'s storedImages state object', () => {
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
              [`https://${mockZendeskHost}/hc/en-us/article_attachments/img0.png`]: `https://${mockZendeskHost}/abc/img0.png`
            });

          mockObjectUrl = `https://${mockZendeskHost}/abc/img1.png`;
          mockImagesSender.calls.argsFor(1)[1](mockRes);

          expect(mockUpdateStoredImages)
            .toHaveBeenCalledWith({
              [`https://${mockZendeskHost}/hc/en-us/article_attachments/img1.png`]: `https://${mockZendeskHost}/abc/img1.png`
            });
        });

        it('The url of the new downloaded image should be used in the article body', () => {
          const storedImages = {
            [`https://${mockZendeskHost}/hc/en-us/article_attachments/img0.png`]: `https://${mockZendeskHost}/abc/img0.png`,
            [`https://${mockZendeskHost}/hc/en-us/article_attachments/img1.png`]: `https://${mockZendeskHost}/abc/img1.png`
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

  describe('getArticleImages', () => {
    let helpCenterArticle,
      parsedArticleBody,
      articleImages;
    const mockZendeskHost = 'dev.zd-dev.com';
    const parseHtml = (html) => {
      const el = document.createElement('html');

      el.innerHTML = html;
      return el;
    };

    beforeEach(() => {
      helpCenterArticle = domRender(
        <HelpCenterArticle
          activeArticle={mockArticle}
          zendeskHost={mockZendeskHost} />
      );
    });

    describe('when there are valid /hc/ image attachments', () => {
      describe('when an image url is missing the locale', () => {
        beforeEach(() => {
          mockArticle.body += `<img src="https://${mockZendeskHost}/hc/article_attachments/img1.png" />`;
          parsedArticleBody = parseHtml(mockArticle.body);

          articleImages = helpCenterArticle.getArticleImages(parsedArticleBody, mockZendeskHost, mockArticle.locale);
        });

        it('patches in the locale', () => {
          expect(articleImages[0].src)
            .toBe(`https://${mockZendeskHost}/hc/en-us/article_attachments/img1.png`);
        });
      });

      describe('when an image url has a locale', () => {
        beforeEach(() => {
          mockArticle.body += `
            <img src="https://${mockZendeskHost}/hc/en-au/article_attachments/img1.png" />
            <img src="https://${mockZendeskHost}/hc/fr/article_attachments/img1.png" />
          `;
          parsedArticleBody = parseHtml(mockArticle.body);

          articleImages = helpCenterArticle.getArticleImages(parsedArticleBody, mockZendeskHost, mockArticle.locale);
        });

        it('leaves the existing locale', () => {
          expect(articleImages[0].src)
            .toBe(`https://${mockZendeskHost}/hc/en-au/article_attachments/img1.png`);

          expect(articleImages[1].src)
            .toBe(`https://${mockZendeskHost}/hc/fr/article_attachments/img1.png`);
        });
      });
    });

    describe('when there are no valid /hc/ image attachments', () => {
      beforeEach(() => {
        mockArticle.body += `
          <img src="https://cdn.com/id/img.png" />
          <img src="/attachments/token/abc/?name=img.png" />
        `;
        parsedArticleBody = parseHtml(mockArticle.body);

        articleImages = helpCenterArticle.getArticleImages(parsedArticleBody, mockZendeskHost, mockArticle.locale);
      });

      it('returns an empty array', () => {
        expect(articleImages.length)
          .toBe(0);
      });
    });
  });

  describe('view original article button', () => {
    it('is visible by default', () => {
      const helpCenterArticle = domRender(<HelpCenterArticle activeArticle={mockArticle} />);

      expect(ReactDOM.findDOMNode(helpCenterArticle).querySelector('.originalArticleButtonClasses'))
        .toBeTruthy();
    });

    it('is hidden if originalArticleButton prop is true', () => {
      const helpCenterArticle = domRender(
        <HelpCenterArticle
          activeArticle={mockArticle}
          originalArticleButton={false} />);

      expect(ReactDOM.findDOMNode(helpCenterArticle).querySelector('.originalArticleButtonClasses'))
        .toBeFalsy();
    });
  });

  describe('handleClick', () => {
    let helpCenterArticle,
      oldQuerySelector,
      scrollIntoViewSpy,
      preventDefaultSpy,
      querySelectorSpy,
      setAttributeSpy,
      mockClosestAnchor,
      mockClosest,
      mockEvent,
      mockHref;

    describe('when the initial target is not an anchor link', () => {
      describe('when the browser is IE', () => {
        beforeEach(() => {
          preventDefaultSpy = jasmine.createSpy('preventDefault');
          mockEvent = {
            target: {
              nodeName: 'SPAN',
              closest: noop,
              getAttribute: noop
            },
            preventDefault: preventDefaultSpy
          };

          document.documentMode = 'This signifies that it is IE';

          helpCenterArticle = domRender(<HelpCenterArticle activeArticle={mockArticle}/>);
          helpCenterArticle.handleClick(mockEvent);
        });

        afterEach(() => {
          _.unset(document, 'documentMode');
        });

        it('calls preventDefault', () => {
          expect(preventDefaultSpy)
            .toHaveBeenCalled();
        });
      });

      describe('when a parent anchor link cannot be found', () => {
        beforeEach(() => {
          preventDefaultSpy = jasmine.createSpy('preventDefault');
          mockClosest = jasmine.createSpy().and.returnValue(null);
          mockEvent = {
            target: {
              nodeName: 'SPAN',
              closest: mockClosest,
              getAttribute: noop
            },
            preventDefault: preventDefaultSpy
          };

          helpCenterArticle = domRender(<HelpCenterArticle activeArticle={mockArticle}/>);
          helpCenterArticle.handleClick(mockEvent);
        });

        it('calls preventDefault', () => {
          expect(preventDefaultSpy)
            .toHaveBeenCalled();
        });
      });

      describe(`when the browser isn't IE and a parent anchor link is found`, () => {
        beforeEach(() => {
          preventDefaultSpy = jasmine.createSpy('preventDefault');
          mockClosestAnchor = { setAttribute: noop, getAttribute: noop };
          mockClosest = jasmine.createSpy().and.returnValue(mockClosestAnchor);
          mockEvent = {
            target: {
              nodeName: 'SPAN',
              closest: mockClosest,
              getAttribute: noop
            },
            preventDefault: preventDefaultSpy
          };

          helpCenterArticle = domRender(<HelpCenterArticle activeArticle={mockArticle}/>);
          helpCenterArticle.handleClick(mockEvent);
        });

        it('does not call preventDefault', () => {
          expect(preventDefaultSpy)
            .not.toHaveBeenCalled();
        });
      });
    });

    describe(`when the href refers to the article's body`, () => {
      beforeEach(() => {
        preventDefaultSpy = jasmine.createSpy('preventDefault');
        scrollIntoViewSpy = jasmine.createSpy('scrollIntoView');
        querySelectorSpy = jasmine.createSpy().and.returnValue({ scrollIntoView: scrollIntoViewSpy });
        mockHref = '#documentSummary';
        mockArticle.body = `<a href="${mockHref}"><span>bar</span></a>`;
        mockEvent = {
          target: {
            nodeName: 'A',
            getAttribute: jasmine.createSpy().and.returnValue(mockHref),
            ownerDocument: document
          },
          preventDefault: preventDefaultSpy
        };

        oldQuerySelector = document.querySelector;
        document.querySelector = querySelectorSpy;

        helpCenterArticle = domRender(<HelpCenterArticle activeArticle={mockArticle}/>);
        helpCenterArticle.handleClick(mockEvent);
      });

      afterEach(() => {
        document.querySelector = oldQuerySelector;
      });

      it('calls document.querySelector with an expected argument', () => {
        const hrefId = mockHref.slice(1);
        const expected = `[id="${hrefId}"],[name="${hrefId}"]`;

        expect(querySelectorSpy)
          .toHaveBeenCalledWith(expected);
      });

      it('scrolls the article into view', () => {
        expect(scrollIntoViewSpy)
          .toHaveBeenCalled();
      });

      it('prevents the link from opening relatively to a new tab', () => {
        expect(preventDefaultSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when the href has a mailing address pattern', () => {
      beforeEach(() => {
        setAttributeSpy = jasmine.createSpy('setAttribute');
        mockHref = 'mailto://terence@fakeEmail.com';
        mockArticle.body = `<a href="${mockHref}"><span>bar</span></a>`;
        mockEvent = {
          target: {
            nodeName: 'A',
            getAttribute: jasmine.createSpy().and.returnValue(mockHref),
            ownerDocument: document,
            setAttribute: setAttributeSpy
          }
        };

        helpCenterArticle = domRender(<HelpCenterArticle activeArticle={mockArticle}/>);
        helpCenterArticle.handleClick(mockEvent);
      });

      it('does not call setAttribute', () => {
        expect(setAttributeSpy)
          .not.toHaveBeenCalled();
      });
    });

    describe('when the href is not a mailing address', () => {
      beforeEach(() => {
        setAttributeSpy = jasmine.createSpy('setAttribute');
        mockHref = '/hc/en-us/articles/12345683274';
        mockArticle.body = `<a href="${mockHref}"><span>bar</span></a>`;
        mockEvent = {
          target: {
            nodeName: 'A',
            getAttribute: jasmine.createSpy().and.returnValue(mockHref),
            ownerDocument: document,
            setAttribute: setAttributeSpy
          }
        };

        helpCenterArticle = domRender(<HelpCenterArticle activeArticle={mockArticle}/>);
        helpCenterArticle.handleClick(mockEvent);
      });

      it(`calls setAttribute with target '_blank'`, () => {
        expect(setAttributeSpy)
          .toHaveBeenCalledWith('target', '_blank');
      });

      it(`calls setAttribute with rel 'noopener noreferrer'`, () => {
        expect(setAttributeSpy)
          .toHaveBeenCalledWith('rel', 'noopener noreferrer');
      });
    });
  });
});
