describe('HelpCenterResults component', () => {
  let HelpCenterResults,
    component,
    mockRegistry;

  const helpCenterResultsPath = buildSrcPath('component/helpCenter/HelpCenterResults');
  const articles = [
    { 'html_url': 'http://www.example.com', title: 'Test article one', name: 'Test article 1' },
    { 'html_url': 'http://www.example.com', title: 'Test article two', name: 'Test article 2' }
  ];

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
        expect(document.querySelector('.List--noResults'))
          .toBeTruthy();
      });

      it('does not render a results list', () => {
        expect(document.querySelector('.List'))
          .toBeFalsy();
      });

      it('does not render a legend/header', () => {
        expect(document.querySelector('.Legend'))
          .toBeFalsy();
      });
    });

    describe('when there are results', () => {
      beforeEach(() => {
        component = domRender(<HelpCenterResults articles={articles} />);
      });

      it('renders a results list', () => {
        expect(document.querySelector('.List'))
          .toBeTruthy();
      });

      it('does not render a noResults div', () => {
        expect(document.querySelector('.List--noResults'))
          .toBeFalsy();
      });

      it('renders a legend/header', () => {
        expect(document.querySelector('.Legend'))
          .toBeTruthy();
      });

      describe('when hideBottomPadding is true', () => {
        beforeEach(() => {
          component = domRender(
            <HelpCenterResults
              hideBottomPadding={true}
              articles={articles} />
          );
        });

        it('should not apply the u-paddingBM class', () => {
          expect(() => TestUtils.findRenderedDOMComponentWithClass(component, 'u-paddingBM')).toThrow();
        });
      });

      describe('when hideBottomPadding is false', () => {
        it('should apply the u-paddingBM class', () => {
          expect(() => TestUtils.findRenderedDOMComponentWithClass(component, 'u-paddingBM')).not.toThrow();
        });
      });
    });

    describe('when props.showViewMore is true', () => {
      beforeEach(() => {
        component = domRender(<HelpCenterResults articles={articles} showViewMore={true} />);
      });

      it('renders a View More button', () => {
        expect(document.querySelector('.ButtonPill'))
          .toBeTruthy();
      });
    });

    describe('when props.showViewMore is false', () => {
      beforeEach(() => {
        component = domRender(<HelpCenterResults articles={articles} showViewMore={false} />);
      });

      it('does not render a View More button', () => {
        expect(document.querySelector('.ButtonPill'))
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
        .toMatch('u-borderBottom');
    });

    it('should not display if there are no results', () => {
      const component = shallowRender(<HelpCenterResults />);

      expect(component.props.className)
        .not.toMatch('u-borderBottom');
    });

    it('should not display if the showBottomBorder props is false', () => {
      const component = shallowRender(<HelpCenterResults articles={articles} showBottomBorder={false} />);

      expect(component.props.className)
        .not.toMatch('u-borderBottom');
    });

    describe('when `applyPadding` prop is true', () => {
      it('should apply padding to the border', () => {
        const component = shallowRender(<HelpCenterResults articles={articles} applyPadding={true} />);

        expect(component.props.className)
          .toMatch('u-paddingBL');
      });
    });
  });
});
