describe('HelpCenterMobile component', function() {
  let HelpCenterMobile,
    mockRegistry,
    mockPageKeywords,
    trackSearch,
    updateResults;

  const searchFieldBlur = jasmine.createSpy();
  const searchFieldGetValue = jasmine.createSpy().and.returnValue('Foobar');
  const helpCenterMobilePath = buildSrcPath('component/HelpCenterMobile');

  beforeEach(function() {
    trackSearch = jasmine.createSpy('trackSearch');
    updateResults = jasmine.createSpy('updateResults');

    resetDOM();

    mockery.enable();

    mockPageKeywords = 'billy bob thorton';

    mockRegistry = initMockRegistry({
      'React': React,
      'component/field/SearchField': {
        SearchField: React.createClass({
          focus: function() {
            this.setState({
              focused: true
            });
          },
          getSearchField: function() {
            return this.refs.searchFieldInput;
          },
          blur: searchFieldBlur,
          getValue: searchFieldGetValue,
          render: function() {
            return (
              <div ref='searchField' type='search'>
                <input ref='searchFieldInput' value='' type='search' />
              </div>
            );
          }
        })
      },
      'component/button/SearchFieldButton': {
        SearchFieldButton: React.createClass({
          render: function() {
            return (
              <input
                ref='searchFieldButton'
                type='search'
                onClick={this.props.onClick} />
            );
          }
        })
      },
      'component/ZendeskLogo': {
        ZendeskLogo: noopReactComponent()
      },
      'component/ScrollContainer': {
        ScrollContainer: React.createClass({
          setScrollShadowVisible: noop,
          render: function() {
            return (
              <div>
                {this.props.headerContent}
                {this.props.children}
                {this.props.footerContent}
              </div>
            );
          }
        })
      },
      'component/Button': {
        Button: React.createClass({
          render: function() {
            return <input className='Button' type='button' />;
          }
        }),
        ButtonGroup: noopReactComponent()
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
      'utility/utils': {
        bindMethods: mockBindMethods
      }
    });

    mockery.registerAllowable(helpCenterMobilePath);

    HelpCenterMobile = requireUncached(helpCenterMobilePath).HelpCenterMobile;

    jasmine.clock().install();
  });

  afterEach(function() {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should call blur and hide the virtual keyboard', function() {
    const helpCenterMobile = domRender(<HelpCenterMobile searchSender={noop} />);

    helpCenterMobile.searchBoxClickHandler();

    const searchField = helpCenterMobile.refs.searchField;

    searchField.getValue = () => 'a search term';

    // blur is manually called in manualSearch to hide the virtual keyboard
    spyOn(searchField, 'blur');
    helpCenterMobile.manualSearch();

    jasmine.clock().tick(1);

    expect(searchField.blur)
      .toHaveBeenCalled();
  });

  describe('searchField', function() {
    it('should render component if fullscreen is false', function() {
      const helpCenterMobile = domRender(<HelpCenterMobile />);

      expect(helpCenterMobile.refs.searchField)
        .toBeTruthy();

      expect(helpCenterMobile.refs.searchFieldButton)
        .toBeFalsy();
    });
  });

  describe('nextButton', function() {
    let helpCenterMobile,
      searchField;

    beforeEach(function() {
      helpCenterMobile = domRender(<HelpCenterMobile searchSender={noop} />);

      helpCenterMobile.searchBoxClickHandler();

      // We need to simulate a search here so that we can properly test the on blur
      // case. If no search has been performed, 'helpCenterMobile.state.showIntroField' will be
      // true on a search and therefore the button will still be hidden.
      helpCenterMobile.refs.searchField.getValue = () => 'help';
      helpCenterMobile.manualSearch();

      searchField = helpCenterMobile.refs.searchField;
      searchField.props.onFocus();
    });

    it('should hide when searchField is focused', function() {
      const footerContent = helpCenterMobile.refs.scrollContainer.props.footerContent;

      expect(footerContent.props.className)
        .toContain('u-isHidden');
    });

    it('should appear when searchField is blurred', function() {
      searchField.props.onBlur();

      jasmine.clock().tick(1);

      const footerContent = helpCenterMobile.refs.scrollContainer.props.footerContent;

      expect(footerContent.props.className)
        .not.toContain('u-isHidden');
    });
  });

  describe('searchFieldButton', function() {
    let helpCenterMobile;

    beforeEach(function() {
      mockIsMobileBrowserValue = true;

      helpCenterMobile = domRender(<HelpCenterMobile />);
    });

    it('should render component if fullscreen is true', function() {
      expect(helpCenterMobile.refs.searchFieldButton)
        .toBeTruthy();

      expect(helpCenterMobile.refs.searchField)
        .toBeFalsy();
    });

    it('sets `showIntroScreen` state to false when component is clicked', function() {
      expect(helpCenterMobile.state.showIntroScreen)
        .toBe(true);

      helpCenterMobile.searchBoxClickHandler();

      expect(helpCenterMobile.state.showIntroScreen)
        .toBe(false);
    });

    it('sets focus state on searchField when component is clicked on mobile', function() {
      expect(helpCenterMobile.refs.searchField)
        .toBeFalsy();

      helpCenterMobile.searchBoxClickHandler();

      const searchField = helpCenterMobile.refs.searchField;

      expect(searchField.state.focused)
        .toEqual(true);
    });
  });
});
