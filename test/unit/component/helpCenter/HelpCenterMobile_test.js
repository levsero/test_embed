describe('HelpCenterMobile component', () => {
  let HelpCenterMobile,
    onSearchFieldFocusSpy;

  const helpCenterMobilePath = buildSrcPath('component/helpCenter/HelpCenterMobile');

  const contextualSearchRequestSent = 'CONTEXTUAL_SEARCH_REQUEST_SENT';

  const LoadingBarContent = noopReactComponent();

  beforeEach(() => {
    onSearchFieldFocusSpy = jasmine.createSpy();
    mockery.enable();

    initMockRegistry({
      'React': React,
      'component/channelChoice/ChannelChoicePopupMobile': {
        ChannelChoicePopupMobile: class extends Component {
          render() {
            return <div className='ChannelChoicePopupMobile' />;
          }
        }
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
      'component/button/SearchFieldButton': {
        SearchFieldButton: noopReactComponent()
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
      'component/loading/LoadingBarContent': { LoadingBarContent },
      './HelpCenterMobile.scss': {
        locals: {
          container: 'containerClasses',
          channelChoiceContainer: 'channelChoiceContainer'
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
        CONTEXTUAL_SEARCH_REQUEST_SENT: contextualSearchRequestSent
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
        helpCenterMobile = domRender(
          <HelpCenterMobile hasSearched={true} onSearchFieldFocus={onSearchFieldFocusSpy}/>
        );

        helpCenterMobile.handleSearchBoxClicked();

        jasmine.clock().tick(1);
      });

      it('should hide when searchField is focused', () => {
        const footerContent = helpCenterMobile.refs.scrollContainer.props.footerContent;

        expect(footerContent)
          .toBeFalsy();
        expect(onSearchFieldFocusSpy)
          .toHaveBeenCalledWith(true);
      });

      it('should appear when searchField is blurred', () => {
        helpCenterMobile.handleOnBlur();

        jasmine.clock().tick(1);

        const footerContent = helpCenterMobile.refs.scrollContainer.props.footerContent;

        expect(footerContent.props.className)
          .not.toContain('u-isHidden');
        expect(onSearchFieldFocusSpy)
          .toHaveBeenCalledWith(false);
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
      helpCenterMobile = domRender(<HelpCenterMobile onSearchFieldFocus={onSearchFieldFocusSpy} />);
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
      expect(onSearchFieldFocusSpy)
        .toHaveBeenCalledWith(true);
    });
  });

  describe('render', () => {
    let helpCenterMobile,
      helpCenterMobileComponent,
      containerClasses;

    describe('when props.showNextButton is false', () => {
      describe('when zendesk logo is hidden', () => {
        beforeEach(() => {
          helpCenterMobile = domRender(
            <HelpCenterMobile
              showNextButton={false}
              hideZendeskLogo={true} />
          );
          containerClasses = helpCenterMobile.refs.scrollContainer.props.containerClasses;
        });

        it('should pass the container class to ScrollContainer', () => {
          expect(containerClasses)
            .toBe('containerClasses');
        });
      });

      describe('when props.hasSearched is true', () => {
        beforeEach(() => {
          helpCenterMobile = domRender(
            <HelpCenterMobile
              showNextButton={false}
              hasSearched={true} />
          );
          containerClasses = helpCenterMobile.refs.scrollContainer.props.containerClasses;
        });

        it('should pass the container class to ScrollContainer', () => {
          expect(containerClasses)
            .toBe('containerClasses');
        });
      });

      describe('when zendesk logo is not hidden', () => {
        beforeEach(() => {
          helpCenterMobile = domRender(<HelpCenterMobile showNextButton={false} />);
          containerClasses = helpCenterMobile.refs.scrollContainer.props.containerClasses;
        });

        it('should not pass the container class to ScrollContainer', () => {
          expect(containerClasses)
            .toBe('');
        });
      });
    });

    describe('when props.showNextButton is true', () => {
      beforeEach(() => {
        helpCenterMobile = domRender(<HelpCenterMobile showNextButton={true} />);
        containerClasses = helpCenterMobile.refs.scrollContainer.props.containerClasses;
      });

      it('should not pass the container class to ScrollContainer', () => {
        expect(containerClasses)
          .toBe('');
      });
    });

    describe('when props.channelChoice is true', () => {
      beforeEach(() => {
        helpCenterMobile = domRender(<HelpCenterMobile channelChoice={true} />);
        helpCenterMobileComponent = ReactDOM.findDOMNode(helpCenterMobile);
      });

      it('should render the ChannelChoicePopupDesktop component', () => {
        expect(helpCenterMobileComponent.querySelector('.ChannelChoicePopupMobile'))
          .not.toBeNull();
      });

      it('should have the channehChoiceContainer class on the container div', () => {
        expect(helpCenterMobileComponent.querySelector('.ChannelChoiceContainer'))
          .not.toBeNull();
      });
    });

    describe('when props.channelChoice is false', () => {
      beforeEach(() => {
        helpCenterMobile = domRender(<HelpCenterMobile channelChoice={false} />);
        helpCenterMobileComponent = ReactDOM.findDOMNode(helpCenterMobile);
      });

      it('should not render the ChannelChoicePopupMobile component', () => {
        expect(helpCenterMobileComponent.querySelector('.ChannelChoicePopupMobile'))
          .toBeNull();
      });
    });
  });

  describe('renderFooterContent', () => {
    it('is not rendered when show next button is false', () => {
      const component = instanceRender(<HelpCenterMobile showNextButton={false} />);

      expect(component.renderFooterContent())
        .toBeNull();
    });

    it('is not rendered when in intro screen', () => {
      const component = instanceRender(<HelpCenterMobile />);

      component.setState({ showIntroScreen: true });

      expect(component.renderFooterContent())
        .toBeNull();
    });

    it('is not rendered when search field is focused', () => {
      const component = instanceRender(<HelpCenterMobile />);

      component.setState({ searchFieldFocused: true });

      expect(component.renderFooterContent())
        .toBeNull();
    });

    it('is rendered when show next button is true and is in article view', () => {
      const component = instanceRender(<HelpCenterMobile articleViewActive={true} showNextButton={true} />);

      expect(component.renderFooterContent())
        .not.toBeNull();
    });
  });

  describe('renderChildContent', () => {
    let result,
      mockChildren,
      mockContextualSearchScreen,
      mockArticleViewActive,
      mockShowIntroScreen;

    beforeEach(() => {
      mockChildren = <div />;

      const component = instanceRender(
        <HelpCenterMobile
          articleViewActive={mockArticleViewActive}
          contextualSearchScreen={mockContextualSearchScreen}>
          {mockChildren}
        </HelpCenterMobile>
      );

      component.setState({ showIntroScreen: mockShowIntroScreen });

      result = component.renderChildContent();
    });

    describe('when showIntroScreen is true', () => {
      beforeAll(() => {
        mockShowIntroScreen = true;
      });

      it('returns null', () => {
        expect(result)
          .toBeNull();
      });
    });

    describe('when showIntroScreen is false', () => {
      beforeAll(() => {
        mockShowIntroScreen = false;
      });

      describe('when contextualSearchScreen is sent', () => {
        beforeAll(() => {
          mockContextualSearchScreen = contextualSearchRequestSent;
        });

        describe('when articleViewActive is true', () => {
          beforeAll(() => {
            mockArticleViewActive = true;
          });

          it('returns child contents', () => {
            expect(result)
              .toEqual(mockChildren);
          });
        });

        describe('when articleViewActive is false', () => {
          beforeAll(() => {
            mockArticleViewActive = false;
          });

          it('returns a LoadingBarContent component', () => {
            expect(TestUtils.isElementOfType(result, LoadingBarContent))
              .toEqual(true);
          });
        });
      });

      describe('when contextualSearchScreen is not sent', () => {
        beforeAll(() => {
          mockContextualSearchScreen = 'foo screen';
        });

        it('returns child contents', () => {
          expect(result)
            .toEqual(mockChildren);
        });
      });
    });
  });
});
