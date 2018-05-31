describe('HelpCenterDesktop component', () => {
  let HelpCenterDesktop;

  const helpCenterDesktopPath = buildSrcPath('component/helpCenter/HelpCenterDesktop');

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      'React': React,
      'component/channelChoice/ChannelChoicePopupDesktop': {
        ChannelChoicePopupDesktop: class extends Component {
          render() {
            return <div className='ChannelChoicePopupDesktop' />;
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
      'component/button/Button': {
        Button: noopReactComponent()
      },
      'component/button/ButtonGroup': {
        ButtonGroup: noopReactComponent()
      },
      './HelpCenterDesktop.scss': {
        locals: {
          footer: 'footerClasses',
          footerArticleView: 'footerArticleViewClasses',
          footerLogo: 'footerLogoClasses',
          noCustomHeight: 'noCustomHeight'
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

  describe('channelChoice', () => {
    let helpCenterDesktop,
      helpCenterDesktopComponent;

    describe('when props.channelChoice is true', () => {
      beforeEach(() => {
        helpCenterDesktop = domRender(
          <HelpCenterDesktop
            hasSearched={true}
            showNextButton={true}
            channelChoice={true} />
        );
        helpCenterDesktopComponent = ReactDOM.findDOMNode(helpCenterDesktop);
      });

      it('should render the ChannelChoicePopupDesktop component', () => {
        expect(helpCenterDesktopComponent.querySelector('.ChannelChoicePopupDesktop'))
          .not.toBeNull();
      });
    });

    describe('when props.channelChoice is false', () => {
      beforeEach(() => {
        helpCenterDesktop = domRender(
          <HelpCenterDesktop
            hasSearched={true}
            showNextButton={true}
            channelChoice={false} />
        );
        helpCenterDesktopComponent = ReactDOM.findDOMNode(helpCenterDesktop);
      });

      it('should not render the ChannelChoicePopupDesktop component', () => {
        expect(helpCenterDesktopComponent.querySelector('.ChannelChoicePopupDesktop'))
          .toBeNull();
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
        mockHasSearched,
        mockNewHeight;

      beforeEach(() => {
        helpCenterDesktop = domRender(
          <HelpCenterDesktop
            hasSearched={mockHasSearched}
            newHeight={mockNewHeight} />
        );

        result = helpCenterDesktop.render();
      });

      describe('when newHeight is true', () => {
        beforeAll(() => {
          mockNewHeight = true;
        });

        describe('when hasSearched is true', () => {
          beforeAll(() => {
            mockHasSearched = true;
          });

          it('should render 550px height', () => {
            expect(result.props.children[0].props.classes)
              .toEqual('');
          });
        });

        describe('when hasSearched is false', () => {
          beforeAll(() => {
            mockHasSearched = false;
          });

          it('should not render the new 550px height', () => {
            expect(result.props.children[0].props.classes)
              .toEqual('noCustomHeight');
          });
        });
      });

      describe('when newHeight is false', () => {
        beforeAll(() => {
          mockNewHeight = false;
        });

        it('should not apply any custom height classes', () => {
          expect(result.props.children[0].props.classes)
            .toEqual('');
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
  });

  describe('renderFooterContent', () => {
    it('is not rendered when user has not searched', () => {
      const component = instanceRender(<HelpCenterDesktop hasSearched={false} />);

      expect(component.renderFooterContent())
        .toBeNull();
    });

    it('is not rendered when show next button is false', () => {
      const component = instanceRender(<HelpCenterDesktop showNextButton={false} />);

      expect(component.renderFooterContent())
        .toBeNull();
    });

    it('is rendered when show next button is true and user has searched', () => {
      const component = instanceRender(<HelpCenterDesktop showNextButton={true} hasSearched={true} />);

      expect(component.renderFooterContent())
        .not.toBeNull();
    });

    it('is rendered when show next button is true and in article view', () => {
      const component = instanceRender(<HelpCenterDesktop showNextButton={true} articleViewActive={true} />);

      expect(component.renderFooterContent())
        .not.toBeNull();
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
});
