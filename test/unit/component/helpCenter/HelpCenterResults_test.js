describe('HelpCenterResults component', () => {
  let HelpCenterResults,
    component,
    mockRegistry,
    articles;

  const helpCenterResultsPath = buildSrcPath('component/helpCenter/HelpCenterResults');
  const contextualSearchRequestSuccess = 'CONTEXTUAL_SEARCH_REQUEST_SUCCESS';

  beforeEach(() => {
    mockery.enable();

    mockRegistry = initMockRegistry({
      'React': React,
      'component/button/ButtonPill': {
        ButtonPill: class extends Component {
          render() {
            return <input className='ButtonPill' type='button' />;
          }
        }
      },
      './HelpCenterResults.scss': {
        locals: {
          noResults: 'noResultsClasses',
          list: 'listClasses',
          listMobile: 'listMobileClasses',
          legend: 'legendClasses',
          resultsBorder: 'borderClasses',
          resultsPadding: 'resultsPaddingClasses',
          listBottom: 'listBottomClasses',
          contextualNoResultsMobile: 'contextualNoResultsMobileClass',
          useSearchBarTextMobile: 'useSearchBarTextMobileClass',
          useSearchBarTextDesktop: 'useSearchBarTextDesktopClass'
        }
      },
      'service/i18n': {
        i18n: {
          init: jasmine.createSpy(),
          setLocale: jasmine.createSpy(),
          getLocale: jasmine.createSpy(),
          isRTL: jasmine.createSpy(),
          t: _.identity
        }
      },
      'src/redux/modules/helpCenter/helpCenter-action-types': {
        CONTEXTUAL_SEARCH_REQUEST_SUCCESS: contextualSearchRequestSuccess
      }
    });

    articles = [
      { 'html_url': 'http://www.example.com', title: 'Test article one', name: 'Test article 1' },
      { 'html_url': 'http://www.example.com', title: 'Test article two', name: 'Test article 2' }
    ];

    mockery.registerAllowable(helpCenterResultsPath);
    HelpCenterResults = requireUncached(helpCenterResultsPath).HelpCenterResults;

    spyOn(mockRegistry['service/i18n'].i18n, 't').and.callThrough();
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#render', () => {
    describe('when there are no results', () => {
      beforeEach(() => {
        component = domRender(<HelpCenterResults />);
      });

      it('renders a noResults div', () => {
        expect(document.querySelector('.noResultsClasses'))
          .toBeTruthy();
      });

      it('does not render a results list', () => {
        expect(document.querySelector('.listClasses'))
          .toBeFalsy();
      });

      it('does not render a legend/header', () => {
        expect(document.querySelector('.legendClasses'))
          .toBeFalsy();
      });
    });

    describe('when there are results', () => {
      beforeEach(() => {
        component = domRender(<HelpCenterResults articles={articles} />);
      });

      it('renders a results list', () => {
        expect(document.querySelector('.listClasses'))
          .toBeTruthy();
      });

      it('does not render a noResults div', () => {
        expect(document.querySelector('.noResultsClasses'))
          .toBeFalsy();
      });

      it('renders a legend/header', () => {
        expect(document.querySelector('.legendClasses'))
          .toBeTruthy();
      });
    });

    describe('when props.hasContextualSearched is true', () => {
      beforeEach(() => {
        shallowRender(<HelpCenterResults articles={articles} hasContextualSearched={true} />);
      });

      it('displays the embeddable_framework.helpCenter.label.topSuggestions label', () => {
        expect(mockRegistry['service/i18n'].i18n.t)
          .toHaveBeenCalledWith('embeddable_framework.helpCenter.label.topSuggestions');
      });
    });

    describe('when props.hasContextualSearched is false', () => {
      beforeEach(() => {
        shallowRender(<HelpCenterResults articles={articles} hasContextualSearched={false} />);
      });

      it('displays the embeddable_framework.helpCenter.label.results label', () => {
        expect(mockRegistry['service/i18n'].i18n.t)
          .toHaveBeenCalledWith('embeddable_framework.helpCenter.label.results');
      });
    });
  });

  describe('#renderResults', () => {
    let result;

    describe('when fullscreen is true', () => {
      beforeEach(() => {
        component = instanceRender(<HelpCenterResults fullscreen={true} />);
        result = component.renderResults();
      });

      it('renders with listMobile styles', () => {
        expect(result.props.className)
          .toContain('listMobileClasses');
      });
    });

    describe('when fullscreen is false', () => {
      beforeEach(() => {
        component = instanceRender(<HelpCenterResults />);
        result = component.renderResults();
      });

      it('does not render listMobile styles', () => {
        expect(result.props.className)
          .not.toContain('listMobileClasses');
      });
    });

    describe('when either contactButton is not shown or search has not been initiated', () => {
      beforeEach(() => {
        const mockArticles = [{ id: 'terence' }, { id: 'fakeIdStringYesIknow' }];

        component = instanceRender(
          <HelpCenterResults showContactButton={true} articles={mockArticles} />
        );
        result = component.renderResults();
      });

      it('renders with listBottom styles', () => {
        expect(result.props.className)
          .toContain('listBottomClasses');
      });
    });

    describe('when contactButton is not shown and search is initiated', () => {
      describe('and the Zendesk logo is hidden', () => {
        beforeEach(() => {
          const mockArticles = [{ id: '32423' }];

          component = instanceRender(
            <HelpCenterResults
              showContactButton={false}
              hideZendeskLogo={true}
              articles={mockArticles} />
          );
          result = component.renderResults();
        });

        it('renders with listBottom styles', () => {
          expect(result.props.className)
            .toContain('listBottomClasses');
        });
      });

      describe('and the Zendesk logo is not hidden', () => {
        beforeEach(() => {
          const mockArticles = [{ id: '32423' }];

          component = instanceRender(
            <HelpCenterResults
              showContactButton={false}
              hideZendeskLogo={false}
              articles={mockArticles} />
          );
          result = component.renderResults();
        });

        it('does not render with listBottom styles', () => {
          expect(result.props.className)
            .not.toContain('listBottomClasses');
        });
      });
    });
  });

  describe('renderNoResults', () => {
    let component,
      mockHasContextualSearched,
      mockContextualSearchScreen;

    beforeEach(() => {
      component = instanceRender(
        <HelpCenterResults
          hasContextualSearched={mockHasContextualSearched}
          contextualSearchScreen={mockContextualSearchScreen}
        />);

      spyOn(component, 'renderContextualNoResults');
      spyOn(component, 'renderDefaultNoResults');

      component.renderNoResults();
    });

    describe('when props.hasContextualSearched is true', () => {
      beforeAll(() => {
        mockHasContextualSearched = true;
      });

      describe('when props.contextualSearchScreen is successful', () => {
        beforeAll(() => {
          mockContextualSearchScreen = contextualSearchRequestSuccess;
        });

        it('calls renderContextualNoResults', () => {
          expect(component.renderContextualNoResults)
            .toHaveBeenCalled();
        });

        it('does not call renderDefaultNoResults', () => {
          expect(component.renderDefaultNoResults)
            .not.toHaveBeenCalled();
        });
      });

      describe('when props.contextualSearchScreen is not successful', () => {
        beforeAll(() => {
          mockContextualSearchScreen = 'foo screen';
        });

        it('calls renderDefaultNoResults', () => {
          expect(component.renderDefaultNoResults)
            .toHaveBeenCalled();
        });

        it('does not call renderContextualNoResults', () => {
          expect(component.renderContextualNoResults)
            .not.toHaveBeenCalled();
        });
      });
    });

    describe('when props.hasContextualSearched is false', () => {
      beforeAll(() => {
        mockHasContextualSearched = false;
      });

      it('calls renderDefaultNoResults', () => {
        expect(component.renderDefaultNoResults)
          .toHaveBeenCalled();
      });

      it('does not call renderContextualNoResults', () => {
        expect(component.renderContextualNoResults)
          .not.toHaveBeenCalled();
      });
    });
  });

  describe('renderDefaultNoResults', () => {
    describe('when props.searchFailed is false', () => {
      beforeEach(() => {
        component = instanceRender(
          <HelpCenterResults
            searchFailed={false}
            previousSearchTerm={'Help me!'} />
        );
        component.renderDefaultNoResults();
      });

      it('displays the embeddable_framework.helpCenter.search.noResults.title label with the previousSearchTerm', () => {
        expect(mockRegistry['service/i18n'].i18n.t)
          .toHaveBeenCalledWith('embeddable_framework.helpCenter.search.noResults.title', { searchTerm: 'Help me!' });
      });

      it('displays the embeddable_framework.helpCenter.search.noResults.body label', () => {
        expect(mockRegistry['service/i18n'].i18n.t)
          .toHaveBeenCalledWith('embeddable_framework.helpCenter.search.noResults.body');
      });
    });

    describe('when props.searchFailed is true', () => {
      let mockI18n;

      beforeEach(() => {
        mockI18n = mockRegistry['service/i18n'].i18n;
        component = instanceRender(<HelpCenterResults searchFailed={true} />);
        component.renderDefaultNoResults();
      });

      it('displays the embeddable_framework.helpCenter.search.error.title label', () => {
        expect(mockI18n.t)
          .toHaveBeenCalledWith('embeddable_framework.helpCenter.search.error.title');
      });

      it('displays the embeddable_framework.helpCenter.search.error.body label', () => {
        domRender(<HelpCenterResults searchFailed={true} showContactButton={true} />);

        expect(mockI18n.t)
          .toHaveBeenCalledWith('embeddable_framework.helpCenter.search.error.body');
      });

      describe('props.showContactButton is false', () => {
        it('displays the embeddable_framework.helpCenter.search.noResults.body label', () => {
          mockI18n.t.calls.reset();
          instanceRender(<HelpCenterResults searchFailed={true} showContactButton={false} />);

          expect(mockI18n.t)
            .toHaveBeenCalledWith('embeddable_framework.helpCenter.search.noResults.body');
        });
      });

      describe('props.showContactButton is true', () => {
        it('displays the embeddable_framework.helpCenter.search.error.body label', () => {
          mockI18n.t.calls.reset();
          instanceRender(<HelpCenterResults searchFailed={true} showContactButton={true} />);

          expect(mockI18n.t)
            .toHaveBeenCalledWith('embeddable_framework.helpCenter.search.error.body');
        });
      });
    });
  });

  describe('renderContextualNoResults', () => {
    let result,
      mockFullscreen;

    beforeEach(() => {
      const component = instanceRender(<HelpCenterResults fullscreen={mockFullscreen} />);

      result = component.renderContextualNoResults();
    });

    it('displays the embeddable_framework.helpCenter.content.useSearchBar string', () => {
      const paragraphElement = result.props.children;
      const targetContent = paragraphElement.props.children;

      expect(targetContent)
        .toEqual('embeddable_framework.helpCenter.content.useSearchBar');
    });

    describe('useSearchBarStyles', () => {
      describe('when props.fullscreen is true', () => {
        beforeAll(() => {
          mockFullscreen = true;
        });

        it('renders with useSearchBarTextMobile class', () => {
          const targetElement = result.props.children;

          expect(targetElement.props.className)
            .toContain('useSearchBarTextMobileClass');
        });
      });

      describe('when props.fullscreen is false', () => {
        beforeAll(() => {
          mockFullscreen = false;
        });

        it('renders with useSearchBarTextDesktop class', () => {
          const targetElement = result.props.children;

          expect(targetElement.props.className)
            .toContain('useSearchBarTextDesktopClass');
        });
      });
    });

    describe('containerStyles', () => {
      describe('when props.fullscreen is true', () => {
        beforeAll(() => {
          mockFullscreen = true;
        });

        it('renders with contextualNoResultsMobile class', () => {
          expect(result.props.className)
            .toContain('contextualNoResultsMobileClass');
        });
      });

      describe('when props.fullscreen is false', () => {
        beforeAll(() => {
          mockFullscreen = false;
        });

        it('does not render with contextualNoResultsMobile class', () => {
          expect(result.props.className)
            .not.toContain('contextualNoResultsMobileClass');
        });
      });
    });
  });
});
