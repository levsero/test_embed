describe('HelpCenterMobile component', () => {
  let HelpCenterMobile;

  const helpCenterMobilePath = buildSrcPath('component/helpCenter/HelpCenterMobile');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'React': React,
      'component/field/SearchField': {
        SearchField: class extends Component {
          focus() {}
          getSearchField() {
            return this.refs.searchFieldInput;
          }
          render() {
            return (
              <div ref='searchField' type='search'>
                <input ref='searchFieldInput' value='' type='search' />
              </div>
            );
          }
        }
      },
      'component/button/SearchFieldButton': {
        SearchFieldButton: noopReactComponent()
      },
      'component/ZendeskLogo': {
        ZendeskLogo: noopReactComponent()
      },
      'component/ScrollContainer': {
        ScrollContainer: class extends Component {
          setScrollShadowVisible() {}
          render() {
            return (
              <div>
                {this.props.headerContent}
                {this.props.children}
                {this.props.footerContent}
              </div>
            );
          }
        }
      },
      'component/button/Button': {
        Button: noopReactComponent()
      },
      'component/button/ButtonGroup': {
        ButtonGroup: noopReactComponent()
      },
      './HelpCenterMobile.sass': {
        locals: {}
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

    mockery.registerAllowable(helpCenterMobilePath);

    HelpCenterMobile = requireUncached(helpCenterMobilePath).HelpCenterMobile;

    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('nextButton', () => {
    let helpCenterMobile,
      footerContent;

    describe('when `hasSearched` prop is true', () => {
      beforeEach(() => {
        helpCenterMobile = domRender(<HelpCenterMobile hasSearched={true} />);

        helpCenterMobile.handleSearchBoxClicked();

        jasmine.clock().tick(1);
      });

      it('should hide when searchField is focused', () => {
        const footerContent = helpCenterMobile.refs.scrollContainer.props.footerContent;

        expect(footerContent)
          .toBeFalsy();
      });

      it('should appear when searchField is blurred', () => {
        helpCenterMobile.handleOnBlur();

        jasmine.clock().tick(1);

        const footerContent = helpCenterMobile.refs.scrollContainer.props.footerContent;

        expect(footerContent.props.className)
          .not.toContain('u-isHidden');
      });
    });

    describe('when `showNextButton` prop is true', () => {
      beforeEach(() => {
        helpCenterMobile = domRender(<HelpCenterMobile showNextButton={true} />);
        footerContent = helpCenterMobile.refs.scrollContainer.props.footerContent;
      });

      it('should be displayed', () => {
        expect(TestUtils.isDOMComponent(footerContent))
          .toBe(false);
      });
    });

    describe('when `showNextButton` prop is true', () => {
      beforeEach(() => {
        helpCenterMobile = domRender(<HelpCenterMobile showNextButton={false} />);
        footerContent = helpCenterMobile.refs.scrollContainer.props.footerContent;
      });

      it('should not be displayed', () => {
        expect(TestUtils.isDOMComponent(footerContent))
          .toBe(false);
      });
    });
  });

  describe('searchFieldButton', () => {
    let helpCenterMobile;

    beforeEach(() => {
      helpCenterMobile = domRender(<HelpCenterMobile />);
    });

    it('sets `showIntroScreen` state to false when component is clicked', () => {
      expect(helpCenterMobile.state.showIntroScreen)
        .toBe(true);

      helpCenterMobile.handleSearchBoxClicked();

      expect(helpCenterMobile.state.showIntroScreen)
        .toBe(false);
    });

    it('sets searchFieldFocused state when component is clicked', () => {
      expect(helpCenterMobile.state.searchFieldFocused)
        .toEqual(false);

      helpCenterMobile.handleSearchBoxClicked();
      jasmine.clock().tick(1);

      expect(helpCenterMobile.state.searchFieldFocused)
        .toEqual(true);
    });
  });
});
