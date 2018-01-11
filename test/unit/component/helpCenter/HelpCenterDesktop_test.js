describe('HelpCenterDesktop component', () => {
  let HelpCenterDesktop;

  const prechatScreen = 'widget/chat/PRECHAT_SCREEN';
  const chattingScreen = 'widget/chat/CHATTING_SCREEN';
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
      'component/chat/ChatPopup': {
        ChatPopup: class extends Component {
          render() {
            return <div className={`${this.props.className} ChatPopup`} />;
          }
        }
      },
      'src/redux/modules/chat/reducer/chat-screen-types': {
        PRECHAT_SCREEN: prechatScreen,
        CHATTING_SCREEN: chattingScreen
      },
      './HelpCenterDesktop.scss': {
        locals: {
          footer: 'footerClasses',
          footerArticleView: 'footerArticleViewClasses',
          footerLogo: 'footerLogoClasses',
          ongoingNotificationCta: 'ongoingNotificationCtaClasses',
          ongoingNotification: 'ongoingNotificationClasses'
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
      footerClasses;

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

  describe('handleChatNotificationRespond', () => {
    let helpCenterDesktop,
      updateChatScreenSpy,
      handleNextClickSpy;

    beforeEach(() => {
      updateChatScreenSpy = jasmine.createSpy('updateChatScreen');
      handleNextClickSpy = jasmine.createSpy('handleNextClick');

      helpCenterDesktop = instanceRender(
        <HelpCenterDesktop
          updateChatScreen={updateChatScreenSpy}
          handleNextClick={handleNextClickSpy} />
      );
      helpCenterDesktop.handleChatNotificationRespond();
    });

    it('calls this.props.updateChatScreen with chatting screen', () => {
      expect(updateChatScreenSpy)
        .toHaveBeenCalledWith(chattingScreen);
    });

    it('calls this.props.handleNextClick', () => {
      expect(handleNextClickSpy)
        .toHaveBeenCalled();
    });
  });

  describe('chatNotification', () => {
    let helpCenterDesktop,
      helpCenterDesktopComponent,
      mockNotification;

    describe('when chat notification.show is true', () => {
      describe('when this.props.articleViewActive is true', () => {
        let hideChatNotificationSpy;

        beforeEach(() => {
          mockNotification = { show: true };
          hideChatNotificationSpy = jasmine.createSpy('hideChatNotification');

          helpCenterDesktop = domRender(
            <HelpCenterDesktop
              notification={mockNotification}
              articleViewActive={true}
              hideChatNotification={hideChatNotificationSpy} />
          );
          helpCenterDesktopComponent = ReactDOM.findDOMNode(helpCenterDesktop);
        });

        it('renders the ChatPopup component', () => {
          expect(helpCenterDesktopComponent.querySelector('.ChatPopup'))
            .not.toBeNull();
        });

        describe('when notification.proactive is true', () => {
          beforeEach(() => {
            mockNotification = { show: true, proactive: true };
            helpCenterDesktop = domRender(
              <HelpCenterDesktop
                notification={mockNotification}
                articleViewActive={true}
                hideChatNotification={hideChatNotificationSpy} />
            );
            helpCenterDesktopComponent = ReactDOM.findDOMNode(helpCenterDesktop);
          });

          it('applies the ongoingNotificationCta class', () => {
            expect(helpCenterDesktopComponent.querySelector('.ChatPopup').className)
              .toContain('ongoingNotificationCtaClasses');
          });

          it('does not call this.props.hideChatNotification immediately', () => {
            expect(hideChatNotificationSpy)
              .not.toHaveBeenCalled();
          });

          describe('when 8 seconds has passed', () => {
            beforeEach(() => {
              jasmine.clock().tick(8000);
            });

            it('calls this.props.hideChatNotification', () => {
              expect(hideChatNotificationSpy)
                .toHaveBeenCalled();
            });
          });
        });

        describe('when notification.proactive is false', () => {
          it('does not call this.props.hideChatNotification immediately', () => {
            expect(hideChatNotificationSpy)
              .not.toHaveBeenCalled();
          });

          it('applies the ongoingNotificationCta class', () => {
            expect(helpCenterDesktopComponent.querySelector('.ChatPopup').className)
              .toContain('ongoingNotificationClasses');
          });

          describe('when 4 seconds has passed', () => {
            beforeEach(() => {
              jasmine.clock().tick(4000);
            });

            it('calls this.props.hideChatNotification', () => {
              expect(hideChatNotificationSpy)
                .toHaveBeenCalled();
            });
          });
        });
      });

      describe('when this.props.articleViewActive is false', () => {
        beforeEach(() => {
          mockNotification = { show: true };

          helpCenterDesktop = domRender(
            <HelpCenterDesktop
              notification={mockNotification}
              articleViewActive={false} />
          );
          helpCenterDesktopComponent = ReactDOM.findDOMNode(helpCenterDesktop);
        });

        it('does not render the ChatPopup component', () => {
          expect(helpCenterDesktopComponent.querySelector('.ChatPopup'))
            .toBeNull();
        });
      });
    });

    describe('when chat notification.show is false', () => {
      beforeEach(() => {
        mockNotification = { show: false };

        helpCenterDesktop = domRender(
          <HelpCenterDesktop
            notification={mockNotification}
            articleViewActive={true} />
        );
        helpCenterDesktopComponent = ReactDOM.findDOMNode(helpCenterDesktop);
      });

      it('does not render the ChatPopup component', () => {
        expect(helpCenterDesktopComponent.querySelector('.ChatPopup'))
          .toBeNull();
      });
    });
  });
});
