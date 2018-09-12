describe('HelpCenterDesktop component', () => {
  let HelpCenterDesktop;

  const helpCenterDesktopPath = buildSrcPath('component/helpCenter/HelpCenterDesktop');

  const ChannelChoicePopupDesktop = noopReactComponent();
  const LoadingBarContent = noopReactComponent();

  const MAX_WIDGET_HEIGHT_NO_SEARCH = 150;

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      'React': React,
      'component/channelChoice/ChannelChoicePopupDesktop': { ChannelChoicePopupDesktop },
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
      'component/Avatar': {
        Avatar: noopReactComponent()
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
      '@zendeskgarden/react-buttons': {
        Button: noopReactComponent()
      },
      'component/button/ButtonGroup': {
        ButtonGroup: noopReactComponent()
      },
      'component/loading/LoadingBarContent': { LoadingBarContent },
      './HelpCenterDesktop.scss': {
        locals: {
          footer: 'footerClasses',
          footerArticleView: 'footerArticleViewClasses',
          footerLogo: 'footerLogoClasses',
          noCustomHeight: 'noCustomHeight'
        }
      },
      'constants/shared': {
        MAX_WIDGET_HEIGHT_NO_SEARCH,
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

  describe('render', () => {
    const mockNotification = { show: false };
    let helpCenterDesktop,
      footerClasses,
      result;

    describe('height of HC', () => {
      let helpCenterDesktop,
        mockArticleViewActive,
        mockHasSearched;

      beforeEach(() => {
        helpCenterDesktop = domRender(
          <HelpCenterDesktop
            articleViewActive={mockArticleViewActive}
            hasSearched={mockHasSearched} />
        );

        result = helpCenterDesktop.render();
      });

      describe('when hasSearched is true', () => {
        beforeAll(() => {
          mockHasSearched = true;
        });

        it('does not apply any custom height classes', () => {
          expect(result.props.children[0].props.classes)
            .toEqual('');
        });

        it('passes undefined through as maxHeight prop to scrollContainer', () => {
          expect(result.props.children[0].props.maxHeight)
            .toEqual(undefined);
        });
      });

      describe('when articleViewActive is true', () => {
        beforeAll(() => {
          mockArticleViewActive = true;
        });

        it('does not apply any custom height classes', () => {
          expect(result.props.children[0].props.classes)
            .toEqual('');
        });

        it('passes undefined through as maxHeight prop to scrollContainer', () => {
          expect(result.props.children[0].props.maxHeight)
            .toEqual(undefined);
        });
      });

      describe('when hasSearched and mock article view active are false', () => {
        beforeAll(() => {
          mockHasSearched = false;
          mockArticleViewActive = false;
        });

        it('does not render the new 550px height', () => {
          expect(result.props.children[0].props.classes)
            .toEqual('noCustomHeight');
        });

        it('passes the MAX_WIDGET_HEIGHT_NO_SEARCH through as maxHeight prop to scrollContainer', () => {
          expect(result.props.children[0].props.maxHeight)
            .toEqual(MAX_WIDGET_HEIGHT_NO_SEARCH);
        });
      });
    });

    describe('when props.showNextButton is false and props.hasSearched is true', () => {
      describe('when props.articleViewActive is true and zendesk logo is hidden', () => {
        beforeEach(() => {
          helpCenterDesktop = domRender(
            <HelpCenterDesktop
              notification={mockNotification}
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
              notification={mockNotification}
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
              notification={mockNotification}
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

    describe('when props.showNextButton is false and props.articleViewActive is true', () => {
      describe('when zendesk logo is hidden', () => {
        beforeEach(() => {
          helpCenterDesktop = domRender(
            <HelpCenterDesktop
              notification={mockNotification}
              showNextButton={false}
              articleViewActive={true}
              hideZendeskLogo={true} />
          );
          footerClasses = helpCenterDesktop.refs.scrollContainer.props.footerClasses;
        });

        it('passes footerArticleView class to ScrollContainer', () => {
          expect(footerClasses)
            .toBe('footerArticleViewClasses');
        });
      });

      describe('when zendesk logo is not hidden', () => {
        beforeEach(() => {
          helpCenterDesktop = domRender(
            <HelpCenterDesktop
              notification={mockNotification}
              showNextButton={false}
              hasSearched={true}
              articleViewActive={true}
              hideZendeskLogo={false} />
          );
          footerClasses = helpCenterDesktop.refs.scrollContainer.props.footerClasses;
        });

        it('passes footerLogo class to ScrollContainer', () => {
          expect(footerClasses)
            .toBe('footerLogoClasses');
        });
      });
    });
  });

  describe('renderFooterContent', () => {
    let result,
      componentProps,
      buttonComponent,
      onNextClickSpy,
      handleNextClickSpy;

    beforeEach(() => {
      const component = instanceRender(<HelpCenterDesktop {...componentProps} />);

      result = component.renderFooterContent();
      buttonComponent = _.get(result, 'props.children[0].props.children');
    });

    describe('onClickHandler', () => {
      beforeAll(() => {
        onNextClickSpy = jasmine.createSpy('onNextClick');
        handleNextClickSpy = jasmine.createSpy('handleNextClick');

        // To render component with onClick prop
        componentProps = {
          showNextButton: true,
          hasSearched: true,
          onNextClick: onNextClickSpy,
          handleNextClick: handleNextClickSpy
        };
      });

      afterEach(() => {
        onNextClickSpy.calls.reset();
        handleNextClickSpy.calls.reset();
      });

      describe('when channelChoice is true', () => {
        beforeAll(() => {
          componentProps = {
            ...componentProps,
            channelChoice: true
          };
        });

        it('calls onNextClick', () => {
          buttonComponent.props.onClick();

          expect(onNextClickSpy)
            .toHaveBeenCalled();
        });

        it('does not call handleNextClick', () => {
          buttonComponent.props.onClick();

          expect(handleNextClickSpy)
            .not.toHaveBeenCalled();
        });
      });

      describe('when channelChoice is false', () => {
        beforeAll(() => {
          componentProps = {
            ...componentProps,
            channelChoice: false
          };
        });

        it('does not call onNextClick', () => {
          buttonComponent.props.onClick();

          expect(onNextClickSpy)
            .not.toHaveBeenCalled();
        });

        it('calls handleNextClick', () => {
          buttonComponent.props.onClick();

          expect(handleNextClickSpy)
            .toHaveBeenCalled();
        });
      });
    });

    describe('when showNextButton is true', () => {
      beforeAll(() => {
        componentProps = { showNextButton: true };
      });

      describe('when hasSearched is true', () => {
        beforeAll(() => {
          componentProps = {
            ...componentProps,
            hasSearched: true
          };
        });

        it('returns a div', () => {
          expect(result.type)
            .toEqual('div');
        });
      });

      describe('when articleViewActive is true', () => {
        beforeAll(() => {
          componentProps = {
            ...componentProps,
            articleViewActive: true
          };
        });

        it('returns a div', () => {
          expect(result.type)
            .toEqual('div');
        });
      });

      describe('when hasSearched and articleViewActive are both false', () => {
        beforeAll(() => {
          componentProps = {
            ...componentProps,
            articleViewActive: false,
            hasSearched: false
          };
        });

        it('returns null', () => {
          expect(result)
            .toBeNull();
        });
      });
    });

    describe('when showNextButton is false', () => {
      beforeAll(() => {
        componentProps = { showNextButton: false };
      });

      it('returns null', () => {
        expect(result)
          .toBeNull();
      });
    });
  });

  describe('renderBodyForm', () => {
    it('is not rendered when user has searched', () => {
      const component = instanceRender(<HelpCenterDesktop hasSearched={true} />);

      expect(component.renderBodyForm())
        .toBeNull();
    });

    it('is not rendered when article view is active', () => {
      const component = instanceRender(<HelpCenterDesktop articleViewActive={true} />);

      expect(component.renderBodyForm())
        .toBeNull();
    });

    it('is rendered when not in article view and user has not searched', () => {
      const component = instanceRender(<HelpCenterDesktop articleViewActive={false} hasSearched={false} />);

      expect(component.renderBodyForm())
        .not.toBeNull();
    });
  });

  describe('renderChannelChoice', () => {
    let result,
      mockChannelChoiceShown;

    beforeEach(() => {
      const component = instanceRender(<HelpCenterDesktop channelChoiceShown={mockChannelChoiceShown} />);

      result = component.renderChannelChoice();
    });

    describe('when channelChoiceShown is true', () => {
      beforeAll(() => {
        mockChannelChoiceShown = true;
      });

      it('returns a ChannelChoicePopupDesktop component', () => {
        expect(TestUtils.isElementOfType(result, ChannelChoicePopupDesktop))
          .toEqual(true);
      });
    });

    describe('when channelChoiceShown is false', () => {
      beforeAll(() => {
        mockChannelChoiceShown = false;
      });

      it('returns null', () => {
        expect(result)
          .toBeNull();
      });
    });
  });

  describe('renderHeaderContent', () => {
    let component,
      componentProps;

    beforeEach(() => {
      component = instanceRender(<HelpCenterDesktop {...componentProps} />);

      spyOn(component, 'renderForm');

      component.renderHeaderContent();
    });

    describe('when articleViewActive is true', () => {
      beforeAll(() => {
        componentProps = { articleViewActive: true };
      });

      it('does not call renderForm', () => {
        expect(component.renderForm)
          .not.toHaveBeenCalled();
      });
    });

    describe('when articleViewActive is false', () => {
      beforeAll(() => {
        componentProps = { articleViewActive: false };
      });

      describe('when any searched method is used', () => {
        beforeAll(() => {
          _.assignIn(componentProps, {
            hasContextualSearched: true,
            hasSearched: true
          });
        });

        it('calls renderForm', () => {
          expect(component.renderForm)
            .toHaveBeenCalled();
        });
      });

      describe('when no searched method is used', () => {
        beforeAll(() => {
          _.assignIn(componentProps, {
            hasContextualSearched: false,
            hasSearched: false
          });
        });

        it('does not call renderForm', () => {
          expect(component.renderForm)
            .not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('renderBodyForm', () => {
    let component,
      componentProps;

    beforeEach(() => {
      component = instanceRender(<HelpCenterDesktop {...componentProps} />);

      spyOn(component, 'renderForm');

      component.renderBodyForm();
    });

    describe('when articleViewActive is true', () => {
      beforeAll(() => {
        componentProps = { articleViewActive: true };
      });

      it('does not call renderForm', () => {
        expect(component.renderForm)
          .not.toHaveBeenCalled();
      });
    });

    describe('when articleViewActive is false', () => {
      beforeAll(() => {
        componentProps = { articleViewActive: false };
      });

      describe('when any searched method is used', () => {
        beforeAll(() => {
          _.assignIn(componentProps, { hasSearched: true });
        });

        it('does not call renderForm', () => {
          expect(component.renderForm)
            .not.toHaveBeenCalled();
        });
      });

      describe('when no searched method is used', () => {
        beforeAll(() => {
          _.assignIn(componentProps, { hasSearched: false });
        });

        it('calls renderForm', () => {
          expect(component.renderForm)
            .toHaveBeenCalled();
        });
      });
    });
  });

  describe('renderChildContent', () => {
    let result,
      mockChildren,
      mockIsContextualSearchPending,
      mockArticleViewActive;

    beforeEach(() => {
      mockChildren = <div />;

      const component = instanceRender(
        <HelpCenterDesktop
          articleViewActive={mockArticleViewActive}
          isContextualSearchPending={mockIsContextualSearchPending}>
          {mockChildren}
        </HelpCenterDesktop>
      );

      result = component.renderChildContent();
    });

    describe('when isContextualSearchPending is true', () => {
      beforeAll(() => {
        mockIsContextualSearchPending = true;
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

    describe('when isContextualSearchPending is false', () => {
      beforeAll(() => {
        mockIsContextualSearchPending = false;
      });

      it('returns child contents', () => {
        expect(result)
          .toEqual(mockChildren);
      });
    });
  });
});
