describe('HelpCenterMobile component', function() {
  let HelpCenterMobile;

  const helpCenterMobilePath = buildSrcPath('component/HelpCenterMobile');

  beforeEach(function() {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'React': React,
      'component/field/SearchField': {
        SearchField: React.createClass({
          focus: noop,
          getSearchField: function() {
            return this.refs.searchFieldInput;
          },
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
        SearchFieldButton: noopReactComponent()
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
        Button: noopReactComponent(),
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

  describe('nextButton', function() {
    let helpCenterMobile;

    beforeEach(function() {
      helpCenterMobile = domRender(<HelpCenterMobile hasSearched={true} />);

      helpCenterMobile.handleSearchBoxClicked();

      jasmine.clock().tick(1);
    });

    it('should hide when searchField is focused', function() {
      const footerContent = helpCenterMobile.refs.scrollContainer.props.footerContent;

      expect(footerContent.props.className)
        .toContain('u-isHidden');
    });

    it('should appear when searchField is blurred', function() {
      helpCenterMobile.handleOnBlur();

      jasmine.clock().tick(1);

      const footerContent = helpCenterMobile.refs.scrollContainer.props.footerContent;

      expect(footerContent.props.className)
        .not.toContain('u-isHidden');
    });
  });

  describe('searchFieldButton', function() {
    let helpCenterMobile;

    beforeEach(function() {
      helpCenterMobile = domRender(<HelpCenterMobile />);
    });

    it('sets `showIntroScreen` state to false when component is clicked', function() {
      expect(helpCenterMobile.state.showIntroScreen)
        .toBe(true);

      helpCenterMobile.handleSearchBoxClicked();

      expect(helpCenterMobile.state.showIntroScreen)
        .toBe(false);
    });

    it('sets searchFieldFocused state when component is clicked', function() {
      expect(helpCenterMobile.state.searchFieldFocused)
        .toEqual(false);

      helpCenterMobile.handleSearchBoxClicked();
      jasmine.clock().tick(1);

      expect(helpCenterMobile.state.searchFieldFocused)
        .toEqual(true);
    });
  });
});
