describe('HelpCenter component', () => {
  let HelpCenter,
    mockRegistry,
    mockPageKeywords,
    trackSearch,
    updateResults,
    mockIsIEValue,
    search;

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
    trackSearch = jasmine.createSpy('trackSearch');
    updateResults = jasmine.createSpy('updateResults');
    search = jasmine.createSpy('search');

    resetDOM();

    mockery.enable();

    mockPageKeywords = 'billy bob thorton';
    mockIsIEValue = false;

    mockRegistry = initMockRegistry({
      'React': React,
      './HelpCenter.sass': {
        locals: {
          loadingSpinnerIE: 'loadingSpinnerIEClasses',
          loadingSpinner: 'loadingSpinnerClasses'
        }
      },
      'utility/devices': {
        isIE: () => mockIsIEValue
      },
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
      'component/container/Container': {
        Container: class extends Component {
          render() {
            return <div>{this.props.children}</div>;
          }
        }
      },
      'component/container/ScrollContainer': {
        ScrollContainer: class extends Component {
          render() {
            return <div>{this.props.children}</div>;
          }
        }
      },
      'component/loading/LoadingSpinner': {
        LoadingSpinner: noopReactComponent()
      },
      'service/i18n': {
        i18n: {
          init: jasmine.createSpy(),
          setLocale: jasmine.createSpy(),
          getLocale: jasmine.createSpy(),
          isRTL: jasmine.createSpy(),
          t: jasmine.createSpy()
        }
      },
      'utility/globals': {
        win: window,
        document: document
      }
    });

    mockery.registerAllowable(helpCenterPath);

    HelpCenter = requireUncached(helpCenterPath).HelpCenter;

    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('initial state', () => {
    let helpCenter;

    beforeEach(() => {
      helpCenter = instanceRender(<HelpCenter buttonLabelKey='contact' />);
    });

    it('has articles set to empty', () => {
      expect(helpCenter.state.articles)
        .toEqual([]);
    });

    it('has chatOnline set to false', () => {
      expect(helpCenter.state.chatOnline)
        .toEqual(false);
    });
  });

  describe('render', () => {
    let helpCenter,
      helpCenterNode,
      buttonLabelKey = 'contact';

    beforeEach(() => {
      helpCenter = domRender(<HelpCenter />);
      helpCenterNode = ReactDOM.findDOMNode(helpCenter);
    });

    describe('when state.loadingSpinnerActive is true', () => {
      beforeEach(() => {
        helpCenter.setLoading(true);
      });

      it('should render the loading spinner', () => {
        expect(helpCenterNode.querySelectorAll('.loadingSpinnerClasses').length)
          .toBe(1);
      });

      describe('when on IE', () => {
        beforeEach(() => {
          mockIsIEValue = true;

          helpCenter = domRender(<HelpCenter />);
          helpCenterNode = ReactDOM.findDOMNode(helpCenter);
          helpCenter.setLoading(true);
        });

        it('should have extra padding', () => {
          expect(helpCenterNode.querySelectorAll('.loadingSpinnerIEClasses').length)
            .toBe(1);
        });
      });
    });

    describe('when state.loadingSpinnerActive is false', () => {
      it('should not render the loading spinner', () => {
        expect(helpCenterNode.querySelectorAll('.loadingSpinnerClasses').length)
          .toBe(0);
      });
    });

    describe('when channel choice is on', () => {
      beforeEach(() => {
        helpCenter = instanceRender(<HelpCenter buttonLabelKey={buttonLabelKey} channelChoice={true} />);
        helpCenter.setChatOnline(true);
      });

      it('uses the contact us label for the button', () => {
        expect(mockRegistry['service/i18n'].i18n.t)
          .toHaveBeenCalledWith('embeddable_framework.helpCenter.submitButton.label.submitTicket.contact');
      });
    });

    describe('when channel choice is off', () => {
      beforeEach(() => {
        helpCenter = instanceRender(<HelpCenter buttonLabelKey={buttonLabelKey} channelChoice={false} />);
      });

      describe('when chat is online', () => {
        beforeEach(() => {
          helpCenter.setChatOnline(true);
        });

        it('uses the chat label for the button', () => {
          expect(mockRegistry['service/i18n'].i18n.t)
            .toHaveBeenCalledWith('embeddable_framework.helpCenter.submitButton.label.chat');
        });
      });

      describe('when chat is offline', () => {
        beforeEach(() => {
          helpCenter.setChatOnline(false);
        });

        it('uses the buttonLabelKey label for the button', () => {
          expect(mockRegistry['service/i18n'].i18n.t)
            .toHaveBeenCalledWith(`embeddable_framework.helpCenter.submitButton.label.submitTicket.${buttonLabelKey}`);
        });
      });
    });
  });

  describe('setChatOnline', () => {
    let helpCenter;

    beforeEach(() => {
      helpCenter = domRender(<HelpCenter buttonLabelKey='contact' />);
    });

    it('sets chatOnline state', () => {
      helpCenter.setChatOnline(true);

      expect(helpCenter.state.chatOnline)
        .toEqual(true);
    });
  });

  describe('updateResults', () => {
    let helpCenter,
      mockShowBackButton,
      responsePayloadResults;

    beforeEach(() => {
      mockShowBackButton = jasmine.createSpy('mockShowBackButton');

      helpCenter = domRender(<HelpCenter showBackButton={mockShowBackButton} />);

      responsePayloadResults = { ok: true, body: { results: [1, 2, 3], count: 3 } };
      helpCenter.updateResults(responsePayloadResults);
    });

    it('should set states matching the response with results', () => {
      expect(helpCenter.state.articles)
        .toEqual(responsePayloadResults.body.results);

      expect(helpCenter.state.resultsCount)
        .toEqual(responsePayloadResults.body.count);

      expect(helpCenter.state.articleViewActive)
        .toEqual(false);
    });

    it('should call props.showBackButton', () => {
      expect(mockShowBackButton)
        .toHaveBeenCalledWith(false);
    });

    it('should set states matching the response without results', () => {
      const responsePayloadNoResults = { ok: true, body: { results: [], count: 0 } };

      helpCenter.updateResults(responsePayloadNoResults);

      expect(helpCenter.state.articles)
        .toEqual(responsePayloadNoResults.body.results);

      expect(helpCenter.state.resultsCount)
        .toEqual(responsePayloadNoResults.body.count);
    });
  });

  describe('searchFail', () => {
    it('should set states accordingly to the search failure', () => {
      const searchTerm = 'abcd';
      const helpCenter = domRender(<HelpCenter />);

      helpCenter.setState({ searchTerm: searchTerm });

      helpCenter.searchFail();

      expect(helpCenter.state.isLoading)
        .toBeFalsy();

      expect(helpCenter.state.previousSearchTerm)
        .toEqual(searchTerm);

      expect(helpCenter.state.hasSearched)
        .toBeTruthy();

      expect(helpCenter.state.searchFailed)
        .toBeTruthy();
    });
  });

  describe('pauseAllVideos', () => {
    let helpCenter,
      videoList;

    beforeEach(() => {
      helpCenter = domRender(<HelpCenter />);
      helpCenter.setState({ articleViewActive: true });

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
      mockContextualSearchSender;

    beforeEach(() => {
      mockContextualSearchSender = jasmine.createSpy('mockContextualSearchSender');

      helpCenter = domRender(<HelpCenter contextualSearchSender={mockContextualSearchSender}/>);
    });

    it('should call contextualSearchSender', () => {
      helpCenter.contextualSearch({ search: 'foo bar' });

      expect(mockContextualSearchSender)
        .toHaveBeenCalled();
    });

    it('should call contextualSearchSender with the right payload for search attribute', () => {
      const searchOptions = { search: 'foo bar' };

      helpCenter.contextualSearch(searchOptions);

      const recentCallArgs = mockContextualSearchSender.calls.mostRecent().args[0];

      expect(recentCallArgs.query)
        .toEqual(searchOptions.search);

      expect(recentCallArgs.label_names)
        .toBeFalsy();
    });

    it('should call contextualSearchSender with the right payload for labels attribute', () => {
      const searchOptions = { labels: ['foo', 'bar'] };

      helpCenter.contextualSearch(searchOptions);

      const recentCallArgs = mockContextualSearchSender.calls.mostRecent().args[0];

      expect(recentCallArgs)
        .toEqual(jasmine.objectContaining({
          label_names: searchOptions.labels.join(',')
        }));
    });

    it('should call contextualSearchSender with the right payload for search and labels attribute', () => {
      const searchOptions = {
        search: 'my search',
        labels: ['foo', 'bar']
      };

      helpCenter.contextualSearch(searchOptions);

      const recentCallArgs = mockContextualSearchSender.calls.mostRecent().args[0];

      expect(recentCallArgs)
        .toEqual(jasmine.objectContaining({
          query: searchOptions.search
        }));
    });

    it('should call contextualSearchSender with the right payload for search, labels and url attribute', () => {
      const searchOptions = {
        search: 'my search',
        labels: ['foo', 'bar'],
        url: true,
        pageKeywords: mockPageKeywords
      };

      helpCenter.contextualSearch(searchOptions);

      const recentCallArgs = mockContextualSearchSender.calls.mostRecent().args[0];

      expect(recentCallArgs)
        .toEqual(jasmine.objectContaining({
          query: searchOptions.search
        }));
    });

    it('should call contextualSearchSender with the right payload for labels and url attribute', () => {
      const searchOptions = {
        labels: ['foo', 'bar'],
        url: true,
        pageKeywords: mockPageKeywords
      };

      helpCenter.contextualSearch(searchOptions);

      const recentCallArgs = mockContextualSearchSender.calls.mostRecent().args[0];

      expect(recentCallArgs)
        .toEqual(jasmine.objectContaining({
          label_names: searchOptions.labels.join(',')
        }));
    });

    it('should call contextualSearchSender with the right payload for url attribute', () => {
      const searchOptions = { url: true, pageKeywords: mockPageKeywords };

      helpCenter.contextualSearch(searchOptions);

      const recentCallArgs = mockContextualSearchSender.calls.mostRecent().args[0];

      expect(recentCallArgs)
        .toEqual(jasmine.objectContaining({
          query: mockPageKeywords
        }));
    });

    describe('when no valid searchOptions were passed', () => {
      const invalidSearchOptions = [
        { foo: 'bar' },
        5,
        false,
        'foo bar',
        { labels: [] },
        { search: '' }
      ];

      beforeEach(() => {
        spyOn(helpCenter, 'setLoading');
      });

      invalidSearchOptions.forEach((options) => {
        it(`shouldn\'t call contextualSearchSender using search options ${options}`, () => {
          helpCenter.contextualSearch(options);

          expect(mockContextualSearchSender)
            .not.toHaveBeenCalled();
        });

        it(`should call setLoading with false using search options ${options}`, () => {
          helpCenter.contextualSearch(options);

          expect(helpCenter.setLoading)
            .toHaveBeenCalledWith(false);
        });
      });
    });

    describe('when url keywords are empty', () => {
      beforeEach(() => {
        const searchOptions = { url: true, pageKeywords: '' };

        spyOn(helpCenter, 'setLoading');
        helpCenter.contextualSearch(searchOptions);
      });

      it('shouldn\'t call contextualSearchSender if url keywords are empty', () => {
        expect(mockContextualSearchSender)
          .not.toHaveBeenCalled();
      });

      it('should call setLoading with false', () => {
        expect(helpCenter.setLoading)
          .toHaveBeenCalledWith(false);
      });
    });

    it('shouldn\'t call updateResults if no results', () => {
      const searchOptions = { labels: ['foo', 'bar'] };

      helpCenter.updateResults = updateResults;

      helpCenter.contextualSearch(searchOptions);

      expect(mockContextualSearchSender)
        .toHaveBeenCalled();

      const recentCallArgs = mockContextualSearchSender.calls.mostRecent().args[0];

      expect(recentCallArgs.label_names)
        .toEqual(searchOptions.labels.join(','));

      expect(recentCallArgs.locale)
        .toBeFalsy();

      expect(recentCallArgs.origin)
        .toBeFalsy();

      mockContextualSearchSender.calls.mostRecent().args[1](responsePayloadNoResults);

      expect(helpCenter.updateResults)
        .not.toHaveBeenCalled();
    });

    it('should set states and call updateResults if results, with search', () => {
      const searchOptions = { search: 'foo bar' };

      helpCenter.updateResults = updateResults;

      helpCenter.contextualSearch(searchOptions);

      expect(mockContextualSearchSender)
        .toHaveBeenCalled();

      const recentCallArgs = mockContextualSearchSender.calls.mostRecent().args[0];

      expect(recentCallArgs)
        .toEqual(jasmine.objectContaining({
          query: searchOptions.search,
          locale: undefined,
          origin: null
        }));

      mockContextualSearchSender.calls.mostRecent().args[1](responsePayloadResults);

      expect(helpCenter.updateResults)
        .toHaveBeenCalledWith(responsePayloadResults);

      expect(helpCenter.state)
        .toEqual(jasmine.objectContaining({
          isLoading: false,
          searchTerm: searchOptions.search,
          hasContextualSearched: true
        }));
    });

    it('should set states and call updateResults if results, with labels', () => {
      /* eslint camelcase:0 */
      const searchOptions = { labels: ['foo', 'bar'] };

      helpCenter.updateResults = updateResults;

      helpCenter.contextualSearch(searchOptions);

      expect(mockContextualSearchSender)
        .toHaveBeenCalled();

      const recentCallArgs = mockContextualSearchSender.calls.mostRecent().args[0];

      expect(recentCallArgs)
        .toEqual(jasmine.objectContaining({
          origin: null,
          locale: undefined,
          label_names: searchOptions.labels.join(',')
        }));

      mockContextualSearchSender.calls.mostRecent().args[1](responsePayloadResults);

      expect(helpCenter.updateResults)
        .toHaveBeenCalledWith(responsePayloadResults);

      expect(helpCenter.state)
        .toEqual(jasmine.objectContaining({
          isLoading: false,
          searchTerm: searchOptions.labels.join(','),
          hasContextualSearched: true
        }));
    });

    it('should request 3 results', () => {
      const searchOptions = { search: 'foo bar' };

      helpCenter.contextualSearch(searchOptions);

      expect(mockContextualSearchSender)
        .toHaveBeenCalled();

      const recentCallArgs = mockContextualSearchSender.calls.mostRecent().args[0];

      expect(recentCallArgs.per_page)
        .toEqual(3);
    });

    it('should not call focusField', () => {
      const searchOptions = { search: 'foo bar' };
      const focusField = jasmine.createSpy('focusField');

      helpCenter.focusField = focusField;

      helpCenter.contextualSearch(searchOptions);

      mockContextualSearchSender.calls.mostRecent().args[1](responsePayloadResults);

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
      searchFail,
      successFn,
      mockOnSearch,
      mockSearchSender,
      mockContextualSearchSender,
      query;

    beforeEach(() => {
      searchFail = jasmine.createSpy('mockSearchFail');
      successFn = jasmine.createSpy('mockSuccessFn');
      mockOnSearch = jasmine.createSpy('mockOnSearch');
      mockSearchSender = jasmine.createSpy('mockSearchSender');
      mockContextualSearchSender = jasmine.createSpy('mockContextualSearchSender');
      query = { query: searchTerm, locale: 'en-us' };

      helpCenter = domRender(
        <HelpCenter
          onSearch={mockOnSearch}
          searchSender={mockSearchSender}
          contextualSearchSender={mockContextualSearchSender} />
      );

      helpCenter.searchFail = searchFail;
      helpCenter.getHelpCenterComponent().refs.searchField.getValue = () => 'valid';
    });

    describe('when performing a contextual search', () => {
      let recentCallArgs;

      beforeEach(() => {
        helpCenter.performContextualSearch(query, successFn);
        recentCallArgs = mockContextualSearchSender.calls.mostRecent().args;
      });

      it('should call contextualSearchSender with corrent payload', () => {
        expect(mockContextualSearchSender)
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
          it('should call searchFail', () => {
            recentCallArgs[1](responsePayloadError);

            expect(helpCenter.searchFail)
              .toHaveBeenCalled();
          });
        });

        describe('when the failFn callback is fired', () => {
          it('should call searchFail', () => {
            recentCallArgs[2]();

            expect(helpCenter.searchFail)
              .toHaveBeenCalled();
          });
        });
      });
    });

    describe('when performing a regular search', () => {
      let recentCallArgs;

      beforeEach(() => {
        helpCenter.performSearchWithLocaleFallback(query, successFn);
        recentCallArgs = mockSearchSender.calls.mostRecent().args;
      });

      it('should call search sender with correct payload', () => {
        expect(mockSearchSender)
          .toHaveBeenCalled();

        expect(recentCallArgs[0])
          .toEqual(jasmine.objectContaining({
            query: searchTerm,
            locale: 'en-us'
          }));
      });

      describe('when there are no user defined locale fallbacks', () => {
        beforeEach(() => {
          expect(mockSearchSender)
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

            recentCallArgs = mockSearchSender.calls.mostRecent().args;

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
              onSearch={mockOnSearch}
              searchSender={mockSearchSender}
              contextualSearchSender={mockContextualSearchSender} />
          );

          helpCenter.searchFail = searchFail;
          helpCenter.getHelpCenterComponent().refs.searchField.getValue = () => 'valid';

          helpCenter.performSearchWithLocaleFallback(query, successFn);
        });

        describe('when there are results', () => {
          it('should call successFn', () => {
            mockSearchSender.calls.mostRecent().args[1](responsePayloadResults);

            expect(successFn)
              .toHaveBeenCalled();
          });
        });

        describe('when there are no results', () => {
          it('should search again with the next fallback locale', () => {
            mockSearchSender.calls.mostRecent().args[1](responsePayloadNoResults);

            expect(mockSearchSender)
              .toHaveBeenCalled();

            let recentCallArgs = mockSearchSender.calls.mostRecent().args;

            expect(recentCallArgs[0])
              .toEqual({
                query: searchTerm,
                locale: 'zh-CH'
              });

            mockSearchSender.calls.mostRecent().args[1](responsePayloadNoResults);
            recentCallArgs = mockSearchSender.calls.mostRecent().args;

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

        const recentCallArgs = mockSearchSender.calls.mostRecent().args;

        expect(recentCallArgs[0].origin)
          .toEqual('web_widget');
      });

      describe('when the search fails', () => {
        beforeEach(() => {
          helpCenter.performSearchWithLocaleFallback({});
        });

        describe('when the response status is not 200 OK', () => {
          it('should call searchFail', () => {
            recentCallArgs[1](responsePayloadError);

            expect(helpCenter.searchFail)
              .toHaveBeenCalled();
          });
        });

        describe('when the failFn callback is fired', () => {
          it('should call searchFail', () => {
            recentCallArgs[2]();

            expect(helpCenter.searchFail)
              .toHaveBeenCalled();
          });
        });
      });
    });
  });

  describe('backtrack search', () => {
    it('should send the right request params when backtracking', () => {
      /* eslint camelcase:0 */
      const mockSearchSender = jasmine.createSpy('mockSearchSender');
      const helpCenter = domRender(
        <HelpCenter
          searchSender={mockSearchSender}
          trackSearch={trackSearch} />
      );
      const searchTerm = 'abcd';

      helpCenter.setState({
        searchTracked: false,
        searchTerm: searchTerm
      });

      helpCenter.backtrackSearch();

      expect(mockSearchSender)
        .toHaveBeenCalledWith({
          query: searchTerm,
          per_page: 0,
          origin: 'web_widget'
        });
    });

    it('should correctly backtrack if not done before and have searched', () => {
      const helpCenter = domRender(<HelpCenter trackSearch={trackSearch} />);

      helpCenter.setState({
        searchTracked: false,
        searchTerm: 'abcd'
      });

      helpCenter.trackSearch = trackSearch;

      helpCenter.backtrackSearch();

      expect(trackSearch)
        .toHaveBeenCalled();
    });

    it('shouldn\'t backtrack if already tracked', () => {
      const helpCenter = domRender(<HelpCenter trackSearch={trackSearch} />);

      helpCenter.setState({
        searchTracked: true,
        searchTerm: 'abcd'
      });

      helpCenter.trackSearch = trackSearch;

      helpCenter.backtrackSearch();

      expect(trackSearch)
        .not.toHaveBeenCalled();
    });

    it('shouldn\'t backtrack if no search has been performed', () => {
      const helpCenter = domRender(<HelpCenter trackSearch={trackSearch} />);

      helpCenter.setState({
        searchTracked: false,
        searchTerm: ''
      });

      helpCenter.trackSearch = trackSearch;

      helpCenter.backtrackSearch();

      expect(trackSearch)
        .not.toHaveBeenCalled();
    });
  });

  describe('interactiveSearchSuccessFn', () => {
    let mockOnSearch, helpCenter, result, query;

    beforeEach(() => {
      mockOnSearch = jasmine.createSpy('onSearch');
      helpCenter = domRender(<HelpCenter onSearch={mockOnSearch} />);

      result = {
        body: {
          results: []
        }
      };

      query = {
        query: 'a search query',
        locale: 'en-US'
      };

      helpCenter.updateResults = jasmine.createSpy('updateResults');
      helpCenter.getHelpCenterComponent().focusField = jasmine.createSpy('focusField');

      helpCenter.interactiveSearchSuccessFn(result, query);
    });

    it('calls props.onSearch', () => {
      expect(mockOnSearch)
        .toHaveBeenCalled();

      expect(mockOnSearch.calls.mostRecent().args[0])
        .toEqual(jasmine.objectContaining({
          searchTerm: query.query,
          searchLocale: query.locale
        }));
    });

    it('calls updateResults', () => {
      expect(helpCenter.updateResults)
        .toHaveBeenCalled();

      expect(helpCenter.updateResults.calls.mostRecent().args[0])
        .toEqual(result);
    });

    it('calls focusField', () => {
      expect(helpCenter.getHelpCenterComponent().focusField)
        .toHaveBeenCalled();
    });
  });

  it('searchStartState sets the correct values', () => {
    const helpCenter = domRender(<HelpCenter />);
    const result = helpCenter.searchStartState({});

    expect(result)
      .toEqual(jasmine.objectContaining({
        isLoading: true,
        searchResultClicked: false
      }));
  });

  it('searchCompleteState sets the correct values', () => {
    const helpCenter = domRender(<HelpCenter />);
    const result = helpCenter.searchCompleteState({});

    expect(result)
      .toEqual(jasmine.objectContaining({
        hasSearched: true,
        isLoading: false,
        searchFailed: false,
        searchResultClicked: false
      }));
  });

  describe('search', () => {
    it('should not call performSearch if the string is empty', () => {
      const mockPerformSearchWithLocaleFallback = jasmine.createSpy('mockPerformSearchWithLocaleFallback');
      const helpCenter = domRender(<HelpCenter searchSender={noop} />);

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
      const helpCenter = domRender(<HelpCenter searchSender={noop} fullscreen={true} />);
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
      const helpCenter = domRender(<HelpCenter searchSender={noop} />);

      helpCenter.performSearchWithLocaleFallback = mockPerformSearchWithLocaleFallback;

      helpCenter.getHelpCenterComponent().refs.searchField.getValue = () => searchTerm;

      helpCenter.search();

      const recentCallArgs = mockPerformSearchWithLocaleFallback.calls.mostRecent().args;

      expect(recentCallArgs[0])
        .toEqual(jasmine.objectContaining({
          query: searchTerm,
          per_page: 3,
          origin: 'web_widget'
        }));
    });

    it('should set the states correctly', () => {
      const searchTerm = 'a search term';
      const helpCenter = domRender(<HelpCenter searchSender={noop} />);

      helpCenter.getHelpCenterComponent().refs.searchField.getValue = () => searchTerm;

      helpCenter.search();

      expect(helpCenter.state)
        .toEqual(jasmine.objectContaining({
          isLoading: true,
          searchResultClicked: false,
          searchTerm: searchTerm,
          searchTracked: true
        }));
    });

    it('should call performSearch given a valid search string', () => {
      const mockPerformSearchWithLocaleFallback = jasmine.createSpy('mockPerformSearchWithLocaleFallback');
      const mockSearchSuccessFn = jasmine.createSpy('mockSearchSuccess');
      const helpCenter = domRender(<HelpCenter searchSender={noop} />);

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
      const mockSearchSender = jasmine.createSpy('mockSearchSender');
      const mockOnArticleClick = jasmine.createSpy('mockOnArticleClick');
      const helpCenter = domRender(
        <HelpCenter
          searchSender={mockSearchSender}
          onArticleClick={mockOnArticleClick}
          onSearch={noop}
          onLinkClick={noop}
          showBackButton={noop} />
      );
      const searchTerm = 'help, I\'ve fallen and can\'t get up!';
      const responseArticle = {
        id: 0,
        title: 'bob',
        name: 'bob',
        html_url: 'bob.com'
      };
      const responsePayload = {
        body: {
          results: [responseArticle, responseArticle, responseArticle],
          count: 3
        },
        ok: true
      };

      helpCenter.trackSearch = trackSearch;

      helpCenter.getHelpCenterComponent().refs.searchField.getValue = () => searchTerm;

      helpCenter.performSearchWithLocaleFallback({query: searchTerm}, helpCenter.interactiveSearchSuccessFn);

      // THIS setState BLOCK TO SIMULATE search triggering performSearch
      // TODO: make a better version of this test case
      helpCenter.setState({
        searchTerm: searchTerm,
        searchTracked: true
      });

      mockSearchSender.calls.mostRecent().args[1](responsePayload);

      expect(() => TestUtils.findRenderedDOMComponentWithClass(helpCenter, 'UserContent'))
        .toThrow();

      helpCenter.handleArticleClick(1, { preventDefault: noop });

      jasmine.clock().tick(1);

      expect(trackSearch)
        .not.toHaveBeenCalled();

      expect(mockOnArticleClick)
        .toHaveBeenCalledWith({
          query: searchTerm,
          resultsCount: 3,
          uniqueSearchResultClick: true,
          articleId: 0,
          locale: undefined
        });

      expect(() => TestUtils.findRenderedDOMComponentWithClass(helpCenter, 'UserContent'))
        .toBeTruthy();
    });
  });

  describe('results', () => {
    let helpCenter,
      results;

    beforeEach(() => {
      helpCenter = domRender(<HelpCenter />);
    });

    it('renders HelpCenterResults when state.hasSearched is true', () => {
      helpCenter.setState({ hasSearched: true });

      jasmine.clock().tick(1);

      results = ReactDOM.findDOMNode(
        TestUtils.findRenderedDOMComponentWithClass(helpCenter, 'HelpCenterResults')
      ).parentNode;

      expect(results)
        .toBeTruthy();
    });

    it('renders HelpCenterResults when state.hasContextualSearched is true', () => {
      helpCenter.setState({ hasContextualSearched: true });

      results = ReactDOM.findDOMNode(
        TestUtils.findRenderedDOMComponentWithClass(helpCenter, 'HelpCenterResults')
      ).parentNode;

      expect(results)
        .toBeTruthy();
    });
  });

  describe('handleViewMoreClick', () => {
    let helpCenter;

    beforeEach(() => {
      helpCenter = domRender(<HelpCenter searchSender={noop}/>);
      helpCenter.search = search;
    });

    it('sets state.resultsPerPage to 9', () => {
      expect(helpCenter.state.resultsPerPage)
        .toEqual(3);

      helpCenter.handleViewMoreClick({ preventDefault: noop });

      expect(helpCenter.state.resultsPerPage)
        .toEqual(9);
    });

    it('sets state.viewMoreActive to true', () => {
      expect(helpCenter.state.viewMoreActive)
        .toEqual(false);

      helpCenter.handleViewMoreClick({ preventDefault: noop });

      expect(helpCenter.state.viewMoreActive)
        .toEqual(true);
    });

    it('calls search', () => {
      helpCenter.handleViewMoreClick({ preventDefault: noop });

      jasmine.clock().tick(1);

      expect(helpCenter.search)
        .toHaveBeenCalled();
    });
  });

  describe('handleOriginalArticleClick', () => {
    let helpCenter,
      mockOnViewOriginalArticleClick;

    beforeEach(() => {
      mockOnViewOriginalArticleClick = jasmine.createSpy('mockOnViewOriginalArticleClick');
      helpCenter = domRender(<HelpCenter onViewOriginalArticleClick={mockOnViewOriginalArticleClick} />);
      helpCenter.handleOriginalArticleClick({ preventDefault: noop });
    });

    it('calls onViewOriginalArticleClick prop', () => {
      expect(mockOnViewOriginalArticleClick)
        .toHaveBeenCalled();
    });
  });
});
