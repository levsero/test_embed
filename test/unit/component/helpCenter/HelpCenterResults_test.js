describe('HelpCenterResults component', () => {
  let HelpCenterResults,
    component,
    mockRegistry,
    articles;

  const helpCenterResultsPath = buildSrcPath('component/helpCenter/HelpCenterResults');

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
          listBottom: 'listBottomClasses'
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
          <HelpCenterResults
            showContactButton={true}
            articles={mockArticles} />
        );
        result = component.renderResults();
      });

      it('renders with listBottom styles', () => {
        expect(result.props.className)
          .toContain('listBottomClasses');
      });
    });

    describe('when contactButton is not shown and search is initiated', () => {
      beforeEach(() => {
        const mockArticles = [{ id: '32423' }];

        component = instanceRender(
          <HelpCenterResults
            showContactButton={false}
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
});
