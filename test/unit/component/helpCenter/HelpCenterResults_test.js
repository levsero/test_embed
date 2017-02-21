describe('HelpCenterResults component', () => {
  let HelpCenterResults,
    component,
    mockRegistry,
    articles;

  const helpCenterResultsPath = buildSrcPath('component/helpCenter/HelpCenterResults');

  beforeEach(() => {
    resetDOM();

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
      './HelpCenterResults.sass': {
        locals: {
          noResults: 'noResultsClasses',
          list: 'listClasses',
          legend: 'legendClasses',
          resultsBorder: 'borderClasses',
          viewMore: 'viewMoreClasses',
          resultsPadding: 'resultsPaddingClasses',
          listBottom: 'listBottomClasses',
          listBottomViewMore: 'listBottomViewMoreClasses'
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
      '_': _
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

    describe('when props.showViewMore is true', () => {
      beforeEach(() => {
        component = domRender(<HelpCenterResults articles={articles} showViewMore={true} />);
      });

      it('renders a View More button', () => {
        expect(document.querySelector('.viewMoreClasses'))
          .toBeTruthy();
      });
    });

    describe('when props.showViewMore is false', () => {
      beforeEach(() => {
        component = domRender(<HelpCenterResults articles={articles} showViewMore={false} />);
      });

      it('does not render a View More button', () => {
        expect(document.querySelector('.viewMoreClasses'))
          .toBeFalsy();
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
    let helpCenterResults;

    describe('when view more button is visible', () => {
      beforeEach(() => {
        helpCenterResults = domRender(
          <HelpCenterResults
            showViewMore={true}
            articles={articles} />
        );
        helpCenterResults.renderResults();
      });

      it('should pass down the listBottomViewMore classes', () => {
        expect(document.querySelector('.listBottomViewMoreClasses'))
          .toBeTruthy();
      });
    });

    describe('when view more button is not visible', () => {
      describe('when props.showContactButton is false, there are 3 or less results, and zendesk logo is enabled', () => {
        beforeEach(() => {
          helpCenterResults = domRender(
            <HelpCenterResults
              showViewMore={false}
              showContactButton={false}
              showBottomBorder={true}
              articles={articles} />
          );
          helpCenterResults.renderResults();
        });

        it('should pass down no list bottom padding', () => {
          expect(document.querySelector('.listBottomClasses'))
            .toBeFalsy();

          expect(document.querySelector('.listBottomViewMoreClasses'))
            .toBeFalsy();
        });
      });

      describe('when props.showContactButton is true', () => {
        beforeEach(() => {
          helpCenterResults = domRender(
            <HelpCenterResults
              showViewMore={false}
              showContactButton={true}
              showBottomBorder={true}
              articles={articles} />
          );
          helpCenterResults.renderResults();
        });

        it('should pass down the listBottom classes', () => {
          expect(document.querySelector('.listBottomClasses'))
            .toBeTruthy();
        });
      });

      describe('when there are more than 3 results visible', () => {
        beforeEach(() => {
          articles.push(
            { 'html_url': 'http://www.example.com', title: 'Test article one', name: 'Test article 3' },
            { 'html_url': 'http://www.example.com', title: 'Test article two', name: 'Test article 4' }
          );
          helpCenterResults = domRender(
            <HelpCenterResults
              showViewMore={false}
              showContactButton={false}
              showBottomBorder={true}
              articles={articles} />
          );
          helpCenterResults.renderResults();
        });

        it('should pass down the listBottom classes', () => {
          expect(document.querySelector('.listBottomClasses'))
            .toBeTruthy();
        });
      });

      describe('when zendesk logo is disabled', () => {
        beforeEach(() => {
          helpCenterResults = domRender(
            <HelpCenterResults
              showViewMore={false}
              showContactButton={false}
              showBottomBorder={false}
              articles={articles} />
          );
          helpCenterResults.renderResults();
        });

        it('should pass down the listBottom classes', () => {
          expect(document.querySelector('.listBottomClasses'))
            .toBeTruthy();
        });
      });
    });
  });

  describe('#renderNoResults', () => {
    describe('when props.searchFailed is false', () => {
      beforeEach(() => {
        component = instanceRender(
          <HelpCenterResults
            searchFailed={false}
            previousSearchTerm={'Help me!'} />
        );
        component.renderNoResults();
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
        component.renderNoResults();
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

  describe('#borderBottom', () => {
    it('should display if there are results', () => {
      const component = shallowRender(<HelpCenterResults articles={articles} />);

      expect(component.props.className)
        .toMatch('borderClasses');
    });

    it('should not display if there are no results', () => {
      const component = shallowRender(<HelpCenterResults />);

      expect(component.props.className)
        .not.toMatch('borderClasses');
    });

    it('should not display if the showBottomBorder props is false', () => {
      const component = shallowRender(<HelpCenterResults articles={articles} showBottomBorder={false} />);

      expect(component.props.className)
        .not.toMatch('borderClasses');
    });

    describe('when `applyPadding` prop is true', () => {
      it('should apply padding to the border', () => {
        const component = shallowRender(<HelpCenterResults articles={articles} applyPadding={true} />);

        expect(component.props.className)
          .toMatch('resultsPaddingClasses');
      });
    });
  });
});
