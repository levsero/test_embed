describe('HelpCenter component', () => {
  let HelpCenter,
    mockRegistry,
    mockPageKeywords,
    showBackButton;

  const helpCenterPath = buildSrcPath('component/helpCenter/HelpCenter');

  class SearchField extends Component {
    constructor() {
      super();
      this.blur = jasmine.createSpy();
    }
    getValue() {
      return '';
    }
    render() {
      return <input ref='searchField' value='' type='search' />;
    }
  }

  beforeEach(() => {
    showBackButton = jasmine.createSpy('showBackButton');

    mockery.enable();

    mockPageKeywords = 'billy bob thorton';

    mockRegistry = initMockRegistry({
      'React': React,
      'component/helpCenter/HelpCenterArticle': {
        HelpCenterArticle: class extends Component {
          render() {
            return (
              <div className='UserContent'>
                <video src='sizuki' />
                <video src='not-tay-tay' />
              </div>
            );
          }
        }
      },
      'component/helpCenter/HelpCenterResults': {
        HelpCenterResults: class extends Component {
          render() {
            return <div className='HelpCenterResults' />;
          }
        }
      },
      'component/helpCenter/HelpCenterDesktop': {
        HelpCenterDesktop: class extends Component {
          focusField() {}
          render() {
            return (
              <div>
                <SearchField ref='searchField' />
                {this.props.children}
              </div>
            );
          }
        }
      },
      'component/helpCenter/HelpCenterMobile': {
        HelpCenterMobile: class extends Component {
          hasContextualSearched() {}
          render() {
            return (
              <div>
                <SearchField ref='searchField' />
                {this.props.children}
              </div>
            );
          }
        }
      },
      'src/redux/modules/helpCenter': {
        showBackButton: noop
      },
      'src/redux/modules/helpCenter/helpCenter-selectors': {},
      'src/redux/modules/talk/talk-selectors': {},
      'src/redux/modules/chat/chat-selectors': {
        getNotificationCount: () => 0
      },
      'src/redux/modules/selectors': {},
      'service/i18n': {
        i18n: {
          init: jasmine.createSpy(),
          setLocale: jasmine.createSpy(),
          getLocale: jasmine.createSpy(),
          isRTL: jasmine.createSpy(),
          t: jasmine.createSpy()
        }
      },
      'src/redux/modules/base/base-selectors': {
        getNewHeight: () => true
      },
      'utility/globals': {
        win: window,
        document: document
      }
    });

    mockery.registerAllowable(helpCenterPath);

    HelpCenter = requireUncached(helpCenterPath).default.WrappedComponent;

    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('render', () => {
    let buttonLabelKey = 'contact';

    describe('when chatting', () => {
      describe('no notifications', () => {
        beforeEach(() => {
          instanceRender(
            <HelpCenter chatAvailable={true} buttonLabelKey={buttonLabelKey} channelChoice={false} />
          );
        });

        it('uses the chat label for the button', () => {
          expect(mockRegistry['service/i18n'].i18n.t)
            .toHaveBeenCalledWith('embeddable_framework.common.button.chat');
        });
      });

      describe('1 notification', () => {
        beforeEach(() => {
          instanceRender(
            <HelpCenter chatNotificationCount={1} chatAvailable={true} buttonLabelKey={buttonLabelKey} channelChoice={false} />
          );
        });

        it('uses the chat notification label for the button', () => {
          expect(mockRegistry['service/i18n'].i18n.t)
            .toHaveBeenCalledWith('embeddable_framework.chat.button.oneMessage');
        });
      });

      describe('more than 1 notification', () => {
        beforeEach(() => {
          instanceRender(
            <HelpCenter chatNotificationCount={3} chatAvailable={true} buttonLabelKey={buttonLabelKey} channelChoice={false} />
          );
        });

        it('uses the chat notification label for the button', () => {
          expect(mockRegistry['service/i18n'].i18n.t)
            .toHaveBeenCalledWith('embeddable_framework.chat.button.manyMessages', { plural_number: 3 });
        });
      });
    });

    describe('when channel choice is on', () => {
      beforeEach(() => {
        instanceRender(
          <HelpCenter chatAvailable={true} buttonLabelKey={buttonLabelKey} channelChoice={true} />
        );
      });

      it('uses the contact us label for the button', () => {
        expect(mockRegistry['service/i18n'].i18n.t)
          .toHaveBeenCalledWith('embeddable_framework.helpCenter.submitButton.label.submitTicket.contact');
      });
    });

    describe('when channelchoice is off', () => {
      describe('when chat is online', () => {
        describe('no notifications', () => {
          beforeEach(() => {
            instanceRender(
              <HelpCenter chatAvailable={true} buttonLabelKey={buttonLabelKey} channelChoice={false} />
            );
          });

          it('uses the chat label for the button', () => {
            expect(mockRegistry['service/i18n'].i18n.t)
              .toHaveBeenCalledWith('embeddable_framework.common.button.chat');
          });
        });

        describe('1 notification', () => {
          beforeEach(() => {
            instanceRender(
              <HelpCenter chatNotificationCount={1} chatAvailable={true} buttonLabelKey={buttonLabelKey} channelChoice={false} />
            );
          });

          it('uses the chat notification label for the button', () => {
            expect(mockRegistry['service/i18n'].i18n.t)
              .toHaveBeenCalledWith('embeddable_framework.chat.button.oneMessage');
          });
        });

        describe('more than 1 notification', () => {
          beforeEach(() => {
            instanceRender(
              <HelpCenter chatNotificationCount={3} chatAvailable={true} buttonLabelKey={buttonLabelKey} channelChoice={false} />
            );
          });

          it('uses the chat notification label for the button', () => {
            expect(mockRegistry['service/i18n'].i18n.t)
              .toHaveBeenCalledWith('embeddable_framework.chat.button.manyMessages', { plural_number: 3 });
          });
        });
      });

      describe('when talk is online', () => {
        describe('when callback is enabled', () => {
          beforeEach(() => {
            instanceRender(
              <HelpCenter talkAvailable={true} callbackEnabled={true} />
            );
          });

          it('uses the callback label for the button', () => {
            expect(mockRegistry['service/i18n'].i18n.t.calls.mostRecent().args[0])
              .toEqual('embeddable_framework.helpCenter.submitButton.label.callback');
          });
        });

        describe('when callback is not enabled', () => {
          beforeEach(() => {
            instanceRender(
              <HelpCenter talkAvailable={true} callbackEnabled={false} />
            );
          });

          it('uses the phone label for the button', () => {
            expect(mockRegistry['service/i18n'].i18n.t.calls.mostRecent().args[0])
              .toEqual('embeddable_framework.helpCenter.submitButton.label.phone');
          });
        });
      });

      describe('when chat is offline', () => {
        beforeEach(() => {
          instanceRender(
            <HelpCenter chatOnline={false} buttonLabelKey={buttonLabelKey} channelChoice={false} />
          );
        });

        it('uses the buttonLabelKey label for the button', () => {
          expect(mockRegistry['service/i18n'].i18n.t)
            .toHaveBeenCalledWith(`embeddable_framework.helpCenter.submitButton.label.submitTicket.${buttonLabelKey}`);
        });
      });
    });
  });

  describe('pauseAllVideos', () => {
    let helpCenter,
      videoList;

    beforeEach(() => {
      helpCenter = domRender(<HelpCenter />);

      const helpCenterNode = ReactDOM.findDOMNode(helpCenter);

      videoList = helpCenterNode.getElementsByTagName('video');

      _.forEach(videoList, (video) => {
        spyOn(video, 'pause');
      });

      helpCenter.pauseAllVideos();
    });

    it('should invoke pause on each video', () => {
      _.forEach(videoList, (video) => {
        expect(video.pause)
          .toHaveBeenCalled();
      });
    });
  });

  describe('contextualSearch', () => {
    const responsePayloadResults = {ok: true, body: {results: [1, 2, 3], count: 3}};
    const responsePayloadNoResults = {ok: true, body: {results: [], count: 0}};

    let helpCenter,
      showBackButtonSpy,
      mockPerformContextualSearch,
      mockArticleClicked = false;

    beforeEach(() => {
      mockPerformContextualSearch = jasmine.createSpy('mockPerformContextualSearch');
      showBackButtonSpy = jasmine.createSpy('showBackButton');

      helpCenter = domRender(
        <HelpCenter
          showBackButton={showBackButtonSpy}
          performContextualSearch={mockPerformContextualSearch}
          articleClicked={mockArticleClicked} />
      );
    });

    it('should call performContextualSearch', () => {
      helpCenter.contextualSearch({ search: 'foo bar' });

      expect(mockPerformContextualSearch)
        .toHaveBeenCalled();
    });

    it('should call performContextualSearch with the right payload for search attribute', () => {
      const searchOptions = { search: 'foo bar' };

      helpCenter.contextualSearch(searchOptions);

      const recentCallArgs = mockPerformContextualSearch.calls.mostRecent().args[0];

      expect(recentCallArgs.query)
        .toEqual(searchOptions.search);

      expect(recentCallArgs.label_names)
        .toBeFalsy();
    });

    it('should call performContextualSearch with the right payload for labels attribute', () => {
      const searchOptions = { labels: ['foo', 'bar'] };

      helpCenter.contextualSearch(searchOptions);

      const recentCallArgs = mockPerformContextualSearch.calls.mostRecent().args[0];

      expect(recentCallArgs)
        .toEqual(jasmine.objectContaining({
          label_names: searchOptions.labels.join(',')
        }));
    });

    it('should call performContextualSearch with the right payload for search and labels attribute', () => {
      const searchOptions = {
        search: 'my search',
        labels: ['foo', 'bar']
      };

      helpCenter.contextualSearch(searchOptions);

      const recentCallArgs = mockPerformContextualSearch.calls.mostRecent().args[0];

      expect(recentCallArgs)
        .toEqual(jasmine.objectContaining({
          query: searchOptions.search
        }));
    });

    it('should call performContextualSearch with the right payload for search, labels and url attribute', () => {
      const searchOptions = {
        search: 'my search',
        labels: ['foo', 'bar'],
        url: true,
        pageKeywords: mockPageKeywords
      };

      helpCenter.contextualSearch(searchOptions);

      const recentCallArgs = mockPerformContextualSearch.calls.mostRecent().args[0];

      expect(recentCallArgs)
        .toEqual(jasmine.objectContaining({
          query: searchOptions.search
        }));
    });

    it('should call performContextualSearch with the right payload for labels and url attribute', () => {
      const searchOptions = {
        labels: ['foo', 'bar'],
        url: true,
        pageKeywords: mockPageKeywords
      };

      helpCenter.contextualSearch(searchOptions);

      const recentCallArgs = mockPerformContextualSearch.calls.mostRecent().args[0];

      expect(recentCallArgs)
        .toEqual(jasmine.objectContaining({
          label_names: searchOptions.labels.join(',')
        }));
    });

    it('should call performContextualSearch with the right payload for url attribute', () => {
      const searchOptions = { url: true, pageKeywords: mockPageKeywords };

      helpCenter.contextualSearch(searchOptions);

      const recentCallArgs = mockPerformContextualSearch.calls.mostRecent().args[0];

      expect(recentCallArgs)
        .toEqual(jasmine.objectContaining({
          query: mockPageKeywords
        }));
    });

    it('shouldn\'t call performContextualSearch if no valid search options were passed', () => {
      let searchOptions = { foo: 'bar' };

      helpCenter.contextualSearch(searchOptions);

      expect(mockPerformContextualSearch)
        .not.toHaveBeenCalled();

      searchOptions = 5;

      helpCenter.contextualSearch(searchOptions);

      expect(mockPerformContextualSearch)
        .not.toHaveBeenCalled();

      searchOptions = false;

      helpCenter.contextualSearch(searchOptions);

      expect(mockPerformContextualSearch)
        .not.toHaveBeenCalled();

      searchOptions = 'foo bar';

      helpCenter.contextualSearch(searchOptions);

      expect(mockPerformContextualSearch)
        .not.toHaveBeenCalled();

      searchOptions = { labels: [] };

      helpCenter.contextualSearch(searchOptions);

      expect(mockPerformContextualSearch)
        .not.toHaveBeenCalled();

      searchOptions = { search: '' };

      helpCenter.contextualSearch(searchOptions);

      expect(mockPerformContextualSearch)
        .not.toHaveBeenCalled();
    });

    it('shouldn\'t call performContextualSearch if url keywords are empty', () => {
      let searchOptions = { url: true, pageKeywords: '' };

      helpCenter.contextualSearch(searchOptions);

      expect(mockPerformContextualSearch)
        .not.toHaveBeenCalled();
    });

    describe('if there are no results', () => {
      it('does not call showBackButton', () => {
        const searchOptions = { labels: ['foo', 'bar'] };

        helpCenter.showBackButton = showBackButton;

        helpCenter.contextualSearch(searchOptions);

        expect(mockPerformContextualSearch)
          .toHaveBeenCalled();

        const recentCallArgs = mockPerformContextualSearch.calls.mostRecent().args[0];

        expect(recentCallArgs.label_names)
          .toEqual(searchOptions.labels.join(','));

        expect(recentCallArgs.locale)
          .toBeFalsy();

        expect(recentCallArgs.origin)
          .toBeFalsy();

        mockPerformContextualSearch.calls.mostRecent().args[1](responsePayloadNoResults);

        expect(helpCenter.showBackButton)
          .not.toHaveBeenCalled();
      });
    });

    describe('if there are results', () => {
      describe('with search', () => {
        let searchOptions;

        beforeEach(() => {
          searchOptions = { search: 'foo bar' };
          helpCenter.contextualSearch(searchOptions);
        });

        it('sets states', () => {
          expect(mockPerformContextualSearch)
            .toHaveBeenCalled();

          const recentCallArgs = mockPerformContextualSearch.calls.mostRecent().args[0];

          expect(recentCallArgs)
            .toEqual(jasmine.objectContaining({
              query: searchOptions.search,
              locale: undefined
            }));
        });

        describe('when viewing the result list', () => {
          beforeAll(() => {
            mockArticleClicked = false;
          });

          it('calls showBackButton', () => {
            mockPerformContextualSearch.calls.mostRecent().args[1](responsePayloadResults);

            expect(showBackButtonSpy)
              .toHaveBeenCalledWith(false);
          });
        });

        describe('when viewing the article', () => {
          beforeAll(() => {
            mockArticleClicked = true;
          });

          it('does not call showBackButton', () => {
            mockPerformContextualSearch.calls.mostRecent().args[1](responsePayloadResults);

            expect(showBackButtonSpy)
              .not.toHaveBeenCalled();
          });
        });
      });

      describe('with labels', () => {
        let searchOptions;

        beforeEach(() => {
          searchOptions = { labels: ['foo', 'bar'] };
          helpCenter.contextualSearch(searchOptions);
        });

        it('sets states', () => {
          expect(mockPerformContextualSearch)
            .toHaveBeenCalled();

          const recentCallArgs = mockPerformContextualSearch.calls.mostRecent().args[0];

          expect(recentCallArgs)
            .toEqual(jasmine.objectContaining({
              locale: undefined,
              label_names: searchOptions.labels.join(',')
            }));
        });

        describe('when viewing the result list', () => {
          beforeAll(() => {
            mockArticleClicked = false;
          });

          it('calls showBackButton', () => {
            mockPerformContextualSearch.calls.mostRecent().args[1](responsePayloadResults);

            expect(showBackButtonSpy)
              .toHaveBeenCalledWith(false);
          });
        });

        describe('when viewing the article', () => {
          beforeAll(() => {
            mockArticleClicked = true;
          });

          it('does not call showBackButton', () => {
            mockPerformContextualSearch.calls.mostRecent().args[1](responsePayloadResults);

            expect(showBackButtonSpy)
              .not.toHaveBeenCalled();
          });
        });
      });
    });

    it('should request 3 results', () => {
      const searchOptions = { search: 'foo bar' };

      helpCenter.contextualSearch(searchOptions);

      expect(mockPerformContextualSearch)
        .toHaveBeenCalled();

      const recentCallArgs = mockPerformContextualSearch.calls.mostRecent().args[0];

      expect(recentCallArgs.per_page)
        .toEqual(3);
    });

    it('should not call focusField', () => {
      const searchOptions = { search: 'foo bar' };
      const focusField = jasmine.createSpy('focusField');

      helpCenter.focusField = focusField;

      helpCenter.contextualSearch(searchOptions);

      mockPerformContextualSearch.calls.mostRecent().args[1](responsePayloadResults);

      expect(focusField)
        .not.toHaveBeenCalled();
    });
  });

  describe('performing a search', () => {
    const responsePayloadError = {ok: false, body: {}};
    const responsePayloadResults = {ok: true, body: {results: [1, 2, 3], count: 3}};
    const responsePayloadNoResults = {ok: true, body: {results: [], count: 0}};
    const searchTerm = 'help me please';

    let helpCenter,
      focusField,
      successFn,
      mockPerformSearch,
      mockPerformContextualSearch,
      query;

    beforeEach(() => {
      focusField = jasmine.createSpy('mockFocusField');
      successFn = jasmine.createSpy('mockSuccessFn');
      mockPerformSearch = jasmine.createSpy('mockPerformSearch');
      mockPerformContextualSearch = jasmine.createSpy('mockPerformContextualSearch');
      query = { query: searchTerm, locale: 'en-us' };

      helpCenter = domRender(
        <HelpCenter
          performSearch={mockPerformSearch}
          performContextualSearch={mockPerformContextualSearch} />
      );

      helpCenter.focusField = focusField;
      helpCenter.getHelpCenterComponent().refs.searchField.getValue = () => 'valid';
    });

    describe('when performing a contextual search', () => {
      let recentCallArgs;

      beforeEach(() => {
        helpCenter.performContextualSearch(query, successFn);
        recentCallArgs = mockPerformContextualSearch.calls.mostRecent().args;
      });

      it('should call performContextualSearch with corrent payload', () => {
        expect(mockPerformContextualSearch)
          .toHaveBeenCalled();

        expect(recentCallArgs[0])
          .toEqual(jasmine.objectContaining({
            query: searchTerm,
            locale: 'en-us'
          }));
      });

      describe('when the search is successful', () => {
        it('should call successFn', () => {
          recentCallArgs[1](responsePayloadResults);

          expect(successFn)
            .toHaveBeenCalled();
        });
      });

      describe('when the search fails', () => {
        describe('when the response status is not 200 OK', () => {
          it('should call focusField', () => {
            recentCallArgs[1](responsePayloadError);

            expect(helpCenter.focusField)
              .toHaveBeenCalled();
          });
        });

        describe('when the failFn callback is fired', () => {
          it('should call focusField', () => {
            recentCallArgs[2]();

            expect(helpCenter.focusField)
              .toHaveBeenCalled();
          });
        });
      });
    });

    describe('when performing a regular search', () => {
      let recentCallArgs;

      beforeEach(() => {
        helpCenter.performSearchWithLocaleFallback(query, successFn);
        recentCallArgs = mockPerformSearch.calls.mostRecent().args;
      });

      it('should call search sender with correct payload', () => {
        expect(mockPerformSearch)
          .toHaveBeenCalled();

        expect(recentCallArgs[0])
          .toEqual(jasmine.objectContaining({
            query: searchTerm,
            locale: 'en-us'
          }));
      });

      describe('when there are no user defined locale fallbacks', () => {
        beforeEach(() => {
          expect(mockPerformSearch)
            .toHaveBeenCalled();

          expect(recentCallArgs[0])
            .toEqual(jasmine.objectContaining({
              query: searchTerm,
              locale: 'en-us'
            }));
        });

        describe('when there are results', () => {
          it('should call successFn', () => {
            recentCallArgs[1](responsePayloadResults);

            expect(successFn)
              .toHaveBeenCalled();
          });
        });

        describe('when there are no results', () => {
          it('should search again with no locale', () => {
            recentCallArgs[1](responsePayloadNoResults);

            recentCallArgs = mockPerformSearch.calls.mostRecent().args;

            expect(recentCallArgs[0])
              .toEqual({ query: searchTerm });
          });
        });
      });

      describe('when there are user defined locale fallbacks', () => {
        const mockLocaleFallbacks = [
          'zh-CH',
          'en-AU'
        ];

        beforeEach(() => {
          helpCenter = domRender(
            <HelpCenter
              localeFallbacks={mockLocaleFallbacks}
              performSearch={mockPerformSearch}
              performContextualSearch={mockPerformContextualSearch} />
          );

          helpCenter.focusField = focusField;
          helpCenter.getHelpCenterComponent().refs.searchField.getValue = () => 'valid';

          helpCenter.performSearchWithLocaleFallback(query, successFn);
        });

        describe('when there are results', () => {
          it('should call successFn', () => {
            mockPerformSearch.calls.mostRecent().args[1](responsePayloadResults);

            expect(successFn)
              .toHaveBeenCalled();
          });
        });

        describe('when there are no results', () => {
          it('should search again with the next fallback locale', () => {
            mockPerformSearch.calls.mostRecent().args[1](responsePayloadNoResults);

            expect(mockPerformSearch)
              .toHaveBeenCalled();

            let recentCallArgs = mockPerformSearch.calls.mostRecent().args;

            expect(recentCallArgs[0])
              .toEqual({
                query: searchTerm,
                locale: 'zh-CH'
              });

            mockPerformSearch.calls.mostRecent().args[1](responsePayloadNoResults);
            recentCallArgs = mockPerformSearch.calls.mostRecent().args;

            expect(recentCallArgs[0])
              .toEqual({
                query: searchTerm,
                locale: 'en-AU'
              });
          });
        });
      });

      it('should set origin properly if search', () => {
        helpCenter.search();

        const recentCallArgs = mockPerformSearch.calls.mostRecent().args;

        expect(recentCallArgs[0].origin)
          .toEqual('web_widget');
      });

      describe('when the search fails', () => {
        beforeEach(() => {
          helpCenter.performSearchWithLocaleFallback({});
        });

        describe('when the response status is not 200 OK', () => {
          it('should call focusField', () => {
            recentCallArgs[1](responsePayloadError);

            expect(helpCenter.focusField)
              .toHaveBeenCalled();
          });
        });

        describe('when the failFn callback is fired', () => {
          it('should call focusField', () => {
            recentCallArgs[2]();

            expect(helpCenter.focusField)
              .toHaveBeenCalled();
          });
        });
      });
    });
  });

  describe('interactiveSearchSuccessFn', () => {
    let showBackButtonSpy,
      helpCenter,
      result,
      query;

    beforeEach(() => {
      showBackButtonSpy = jasmine.createSpy('showBackButton');

      helpCenter = domRender(
        <HelpCenter
          showBackButton={showBackButtonSpy} />
      );
      result = {
        body: {
          results: []
        }
      };
      query = {
        query: 'a search query',
        locale: 'en-US'
      };

      helpCenter.getHelpCenterComponent().focusField = jasmine.createSpy('focusField');
      helpCenter.interactiveSearchSuccessFn(result, query);
    });

    it('calls showBackButton with false', () => {
      expect(showBackButtonSpy)
        .toHaveBeenCalledWith(false);
    });

    it('calls focusField', () => {
      expect(helpCenter.getHelpCenterComponent().focusField)
        .toHaveBeenCalled();
    });
  });

  describe('search', () => {
    it('should not call performSearch if the string is empty', () => {
      const mockPerformSearchWithLocaleFallback = jasmine.createSpy('mockPerformSearchWithLocaleFallback');
      const helpCenter = domRender(<HelpCenter performSearch={noop} />);

      helpCenter.performSearchWithLocaleFallback = mockPerformSearchWithLocaleFallback;

      helpCenter.getHelpCenterComponent().refs.searchField.getValue = () => '';

      helpCenter.search();

      expect(mockPerformSearchWithLocaleFallback.calls.count())
        .toEqual(0);

      helpCenter.getHelpCenterComponent().refs.searchField.getValue = () => 'valid';

      helpCenter.search();

      expect(mockPerformSearchWithLocaleFallback.calls.count())
        .toEqual(1);
    });

    it('should call blur and hide the virtual keyboard', () => {
      const helpCenter = domRender(<HelpCenter performSearch={noop} fullscreen={true} />);
      const searchField = helpCenter.getHelpCenterComponent().refs.searchField;

      searchField.getValue = () => 'valid';

      helpCenter.search();

      jasmine.clock().tick(1);

      expect(searchField.blur)
        .toHaveBeenCalled();
    });

    it('should build up the query object correctly', () => {
      const searchTerm = 'a search term';
      const mockPerformSearchWithLocaleFallback = jasmine.createSpy('mockPerformSearchWithLocaleFallback');
      const helpCenter = domRender(<HelpCenter performSearch={noop} />);

      helpCenter.performSearchWithLocaleFallback = mockPerformSearchWithLocaleFallback;

      helpCenter.getHelpCenterComponent().refs.searchField.getValue = () => searchTerm;

      helpCenter.search();

      const recentCallArgs = mockPerformSearchWithLocaleFallback.calls.mostRecent().args;

      expect(recentCallArgs[0])
        .toEqual(jasmine.objectContaining({
          query: searchTerm,
          per_page: 9,
          origin: 'web_widget'
        }));
    });

    it('should call performSearch given a valid search string', () => {
      const mockPerformSearchWithLocaleFallback = jasmine.createSpy('mockPerformSearchWithLocaleFallback');
      const mockSearchSuccessFn = jasmine.createSpy('mockSearchSuccess');
      const helpCenter = domRender(<HelpCenter performSearch={noop} />);

      helpCenter.performSearchWithLocaleFallback = mockPerformSearchWithLocaleFallback;
      helpCenter.interactiveSearchSuccessFn = mockSearchSuccessFn;

      helpCenter.getHelpCenterComponent().refs.searchField.getValue = () => 'valid';

      mockPerformSearchWithLocaleFallback.calls.reset();
      mockSearchSuccessFn.calls.reset();

      helpCenter.search();

      expect(mockPerformSearchWithLocaleFallback.calls.count())
        .toEqual(1);

      mockPerformSearchWithLocaleFallback.calls.mostRecent().args[1]();

      expect(mockSearchSuccessFn.calls.count())
        .toEqual(1);
    });

    it('should track view and render the inline article', () => {
      /* eslint camelcase:0 */
      // TODO: Ported over from old performSearch test to catch regression
      // Needs to be rewritten
      const mockPerformSearch = jasmine.createSpy('mockPerformSearch');
      const searchTerm = 'help, I\'ve fallen and can\'t get up!';
      const resultsCount = 3;
      const responseArticle = {
        id: 0,
        title: 'bob',
        name: 'bob',
        html_url: 'bob.com'
      };
      const responsePayload = {
        body: {
          results: [responseArticle, responseArticle, responseArticle],
          count: resultsCount
        },
        ok: true
      };
      let helpCenter = domRender(
        <HelpCenter
          performSearch={mockPerformSearch}
          searchTerm={searchTerm}
          onLinkClick={noop}
          showBackButton={noop} />
      );

      helpCenter.getHelpCenterComponent().refs.searchField.getValue = () => searchTerm;
      helpCenter.performSearchWithLocaleFallback({query: searchTerm}, helpCenter.interactiveSearchSuccessFn);

      mockPerformSearch.calls.mostRecent().args[1](responsePayload);

      expect(() => TestUtils.findRenderedDOMComponentWithClass(helpCenter, 'UserContent'))
        .toThrow();

      // Simulate Redux prop update by re-rendering
      helpCenter = domRender(
        <HelpCenter
          resultsCount={resultsCount}
          activeArticle={{ id: 0 }}
          performSearch={mockPerformSearch}
          searchTerm={searchTerm}
          onLinkClick={noop}
          showBackButton={noop} />
      );
      helpCenter.handleArticleClick(1, { preventDefault: noop });

      jasmine.clock().tick(1);

      expect(() => TestUtils.findRenderedDOMComponentWithClass(helpCenter, 'UserContent'))
        .toBeTruthy();
    });
  });

  describe('results', () => {
    let helpCenter,
      results;

    describe('when hasSearched is true', () => {
      beforeEach(() => {
        helpCenter = domRender(<HelpCenter hasSearched={true} />);
      });

      it('renders HelpCenterResults', () => {
        results = ReactDOM.findDOMNode(
          TestUtils.findRenderedDOMComponentWithClass(helpCenter, 'HelpCenterResults')
        ).parentNode;

        expect(results)
          .toBeTruthy();
      });
    });
  });

  describe('handleNextClick', () => {
    let componentProps,
      mockUpdateChannelChoiceShown,
      mockOnNextClick,
      mockEvent;

    beforeEach(() => {
      mockEvent = { preventDefault: jasmine.createSpy('preventDefault') };
      mockUpdateChannelChoiceShown = jasmine.createSpy('updateChannelChoiceShown');
      mockOnNextClick = jasmine.createSpy('onNextClick');

      const component = instanceRender(
        <HelpCenter
          updateChannelChoiceShown={mockUpdateChannelChoiceShown}
          onNextClick={mockOnNextClick}
          {...componentProps} />
      );

      component.handleNextClick(mockEvent);

      jasmine.clock().tick(0);
    });

    describe('when called', () => {
      it('calls preventDefault', () => {
        expect(mockEvent.preventDefault)
          .toHaveBeenCalled();
      });
    });

    describe('when newChannelChoice is true', () => {
      beforeAll(() => {
        componentProps = { newChannelChoice: true };
      });

      describe('when channelChoice is true', () => {
        beforeAll(() => {
          componentProps = {
            ...componentProps,
            channelChoice: true
          };
        });

        it('calls onNextClick', () => {
          expect(mockOnNextClick)
            .toHaveBeenCalled();
        });

        it('does not call updateChannelChoiceShown', () => {
          expect(mockUpdateChannelChoiceShown)
            .not.toHaveBeenCalled();
        });
      });

      describe('when channelChoice is false', () => {
        beforeAll(() => {
          componentProps = {
            ...componentProps,
            channelChoice: false
          };
        });

        it('calls onNextClick', () => {
          expect(mockOnNextClick)
            .toHaveBeenCalled();
        });

        it('does not call updateChannelChoiceShown', () => {
          expect(mockUpdateChannelChoiceShown)
            .not.toHaveBeenCalled();
        });
      });
    });

    describe('when newChannelChoice is false', () => {
      beforeAll(() => {
        componentProps = { newChannelChoice: false };
      });

      describe('when channelChoice is true', () => {
        beforeAll(() => {
          componentProps = {
            ...componentProps,
            channelChoice: true
          };
        });

        it('does not call onNextClick', () => {
          expect(mockOnNextClick)
            .not.toHaveBeenCalled();
        });

        it('calls updateChannelChoiceShown with true', () => {
          expect(mockUpdateChannelChoiceShown)
            .toHaveBeenCalledWith(true);
        });
      });

      describe('when channelChoice is false', () => {
        beforeAll(() => {
          componentProps = {
            ...componentProps,
            channelChoice: false
          };
        });

        it('calls onNextClick', () => {
          expect(mockOnNextClick)
            .toHaveBeenCalled();
        });

        it('does not call updateChannelChoiceShown', () => {
          expect(mockUpdateChannelChoiceShown)
            .not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('onContainerClick', () => {
    let helpCenter,
      updateChannelChoiceShownSpy,
      channelChoiceShown;

    beforeEach(() => {
      updateChannelChoiceShownSpy = jasmine.createSpy('updateChannelChoiceShown');

      helpCenter = instanceRender(<HelpCenter updateChannelChoiceShown={updateChannelChoiceShownSpy} channelChoiceShown={channelChoiceShown}/>);

      helpCenter.onContainerClick();
    });

    describe('when channelChoiceShown prop is true', () => {
      beforeAll(() => {
        channelChoiceShown = true;
      });

      it('calls updateChannelChoiceShown with false', () => {
        expect(updateChannelChoiceShownSpy)
          .toHaveBeenCalledWith(false);
      });
    });

    describe('when channelChoiceShown prop is false', () => {
      beforeAll(() => {
        channelChoiceShown = false;
      });

      it('does not call updateChannelChoiceShown', () => {
        expect(updateChannelChoiceShownSpy)
          .not
          .toHaveBeenCalled();
      });
    });
  });

  describe('handleArticleClick', () => {
    let helpCenter,
      articleIndex,
      mockArticles,
      updateActiveArticleSpy,
      showBackButtonSpy;

    beforeEach(() => {
      const mockEvent = { preventDefault: () => {} };

      articleIndex = 1;
      showBackButtonSpy = jasmine.createSpy('showBackButton');
      updateActiveArticleSpy = jasmine.createSpy('handleArticleClick');
      mockArticles = [
        { 'foo': 123 },
        { 'bar': 456 }
      ];

      helpCenter = instanceRender(
        <HelpCenter
          articles={mockArticles}
          handleArticleClick={updateActiveArticleSpy}
          showBackButton={showBackButtonSpy} />
      );
      helpCenter.handleArticleClick(articleIndex, mockEvent);
    });

    it('calls handleArticleClick with an article', () => {
      expect(updateActiveArticleSpy)
        .toHaveBeenCalledWith(mockArticles[articleIndex]);
    });

    it('calls showBackButton', () => {
      expect(showBackButtonSpy)
        .toHaveBeenCalled();
    });
  });
});
