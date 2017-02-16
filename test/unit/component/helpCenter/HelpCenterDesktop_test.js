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
      'component/container/ScrollContainer': {
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
      './HelpCenterDesktop.sass': {
        locals: {
          footer: 'footerClasses',
          footerArticleView: 'footerArticleViewClasses',
          footerLogo: 'footerLogoClasses'
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

      expect(footerContent)
        .toBeFalsy();
    });

    it('should show after something has been searched', () => {
      const footerContent = helpCenterDesktop.refs.scrollContainer.props.footerContent;

      expect(footerContent.props.className)
        .not.toContain('u-isHidden');
    });

    describe('when showNextButton is false', () => {
      beforeEach(() => {
        helpCenterDesktop = domRender(<HelpCenterDesktop hasSearched={true} showNextButton={false} />);
      });

      it('should not exist', () => {
        const footerContent = helpCenterDesktop.refs.scrollContainer.props.footerContent;

        expect(TestUtils.isDOMComponent(footerContent))
          .toBe(false);
      });

      describe('when ZendeskLogo is enabled', () => {
        it('should pass the correct classes through to scroll container', () => {
          const footerClasses = helpCenterDesktop.refs.scrollContainer.props.footerClasses;

          expect(footerClasses)
            .toBe('footerLogoClasses');
        });
      });

      describe('when ZendeskLogo is disabled', () => {
        beforeEach(() => {
          helpCenterDesktop = domRender(
            <HelpCenterDesktop
              hideZendeskLogo={true}
              hasSearched={true}
              showNextButton={false} />
          );
        });

        it('should pass the correct classes through to scroll container', () => {
          const footerClasses = helpCenterDesktop.refs.scrollContainer.props.footerClasses;

          expect(footerClasses)
            .toBe('footerClasses');
        });
      });
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

  describe('render', () => {
    let helpCenterDesktop,
      footerClasses;

    describe('when contact form is suppressed and props.hasSeached is true', () => {
      describe('when props.articleViewActive is true and zendesk logo is hidden', () => {
        beforeEach(() => {
          helpCenterDesktop = domRender(
            <HelpCenterDesktop
              showNextButton={false}
              hasSearched={true}
              articleViewActive={true}
              hideZendeskLogo={true} />
          );
          footerClasses = helpCenterDesktop.refs.scrollContainer.props.footerClasses;
        });

        it('should pass footerArticleView class to ScrollContainer', () => {
          expect(footerClasses)
            .toBe('footerArticleViewClasses');
        });
      });

      describe('when props.articleViewActive is false', () => {
        beforeEach(() => {
          helpCenterDesktop = domRender(
            <HelpCenterDesktop
              showNextButton={false}
              hasSearched={true}
              articleViewActive={false}
              hideZendeskLogo={true} />
          );
          footerClasses = helpCenterDesktop.refs.scrollContainer.props.footerClasses;
        });

        it('should pass footer class to ScrollContainer', () => {
          expect(footerClasses)
            .toBe('footerClasses');
        });
      });

      describe('when zendesk logo is not hidden', () => {
        beforeEach(() => {
          helpCenterDesktop = domRender(
            <HelpCenterDesktop
              showNextButton={false}
              hasSearched={true}
              articleViewActive={true}
              hideZendeskLogo={false} />
          );
          footerClasses = helpCenterDesktop.refs.scrollContainer.props.footerClasses;
        });

        it('should pass footerLogo class to ScrollContainer', () => {
          expect(footerClasses)
            .toBe('footerLogoClasses');
        });
      });
    });
  });
});
