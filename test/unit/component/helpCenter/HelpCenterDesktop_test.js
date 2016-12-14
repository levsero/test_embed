describe('HelpCenterDesktop component', () => {
  let HelpCenterDesktop;

  const helpCenterDesktopPath = buildSrcPath('component/helpCenter/HelpCenterDesktop');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'React': React,
      'component/channelChoice/ChannelChoicePopup': {
        ChannelChoicePopup: noopReactComponent()
      },
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
      'component/ZendeskLogo': {
        ZendeskLogo: noopReactComponent()
      },
      'component/ScrollContainer': {
        ScrollContainer: class {
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

    mockery.registerAllowable(helpCenterDesktopPath);

    HelpCenterDesktop = requireUncached(helpCenterDesktopPath).HelpCenterDesktop;

    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('nextButton', () => {
    let helpCenterDesktop;

    beforeEach(() => {
      helpCenterDesktop = domRender(<HelpCenterDesktop hasSearched={true} />);
    });

    it('should not show initially', () => {
      helpCenterDesktop = domRender(<HelpCenterDesktop hasSearched={false} />);

      const footerContent = helpCenterDesktop.refs.scrollContainer.props.footerContent;

      expect(footerContent.props.className)
        .toContain('u-isHidden');
    });

    it('should show after something has been searched', () => {
      const footerContent = helpCenterDesktop.refs.scrollContainer.props.footerContent;

      expect(footerContent.props.className)
        .not.toContain('u-isHidden');
    });

    it('should not exist if the showNextButton prop is false', () => {
      const footerContent = helpCenterDesktop.refs.scrollContainer.props.footerContent;

      expect(TestUtils.isDOMComponent(footerContent))
        .toBe(false);
    });
  });

  describe('handleNextButtonClick', () => {
    let helpCenterDesktop;

    beforeEach(() => {
      helpCenterDesktop = domRender(<HelpCenterDesktop onNextClick={jasmine.createSpy()} />);
    });

    it('should call this.props.onNextClick', () => {
      helpCenterDesktop.handleNextButtonClick({ preventDefault: noop });

      expect(helpCenterDesktop.props.onNextClick)
        .toHaveBeenCalled();
    });

    it('should show ChannelChoicePopup if channelChoice prop is true', () => {
      helpCenterDesktop = domRender(
        <HelpCenterDesktop
          onNextClick={jasmine.createSpy()}
          channelChoice={true} />
      );

      helpCenterDesktop.handleNextButtonClick({ preventDefault: noop });
      jasmine.clock().tick();

      expect(helpCenterDesktop.state.channelChoiceShown)
        .toBe(true);

      expect(helpCenterDesktop.props.onNextClick)
        .not.toHaveBeenCalled();
    });
  });

  describe('channelChoice', () => {
    let helpCenterDesktop;

    beforeEach(() => {
      helpCenterDesktop = domRender(<HelpCenterDesktop channelChoice={true} />);
    });

    it('should be hidden by default', () => {
      expect(helpCenterDesktop.state.channelChoiceShown)
        .toBe(false);
    });
  });
});
