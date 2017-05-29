describe('WebWidget component', () => {
  let WebWidget,
    mockUpdateActiveEmbed;
  const setArticleViewSpy = jasmine.createSpy();
  const clearFormSpy = jasmine.createSpy();
  const webWidgetPath = buildSrcPath('component/webWidget/WebWidget');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    mockUpdateActiveEmbed = jasmine.createSpy('updateActiveEmbed');

    class MockHelpCenter extends Component {
      constructor() {
        super();
        this.state = {
          articleViewActive: false
        };
        this.setArticleView = setArticleViewSpy;
      }
      render() {
        return <div />;
      }
    }

    class MockSubmitTicket extends Component {
      constructor() {
        super();
        this.state = {
          selectedTicketForm: null
        };
        this.clearForm = clearFormSpy;
      }
      render() {
        return <div />;
      }
    }

    class MockChat extends Component {
      constructor() {
        super();
        this.state = {};
      }
      render() {
        return <div />;
      }
    }

    initMockRegistry({
      'React': React,
      'component/chat/Chat': MockChat,
      'component/helpCenter/HelpCenter': {
        HelpCenter: MockHelpCenter
      },
      'component/submitTicket/SubmitTicket': {
        SubmitTicket: MockSubmitTicket
      },
      'src/redux/modules/base': {
        updateActiveEmbed: noop,
        updateEmbedAccessible: noop
      }
    });

    mockery.registerAllowable(webWidgetPath);
    WebWidget = requireUncached(webWidgetPath).default.WrappedComponent;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#render', () => {
    let webWidget;

    beforeEach(() => {
      webWidget = domRender(<WebWidget activeEmbed='helpCenterForm' />);
    });

    it('should show help center component by default', () => {
      expect(webWidget.renderHelpCenter().props.className)
        .not.toContain('u-isHidden');

      expect(webWidget.renderSubmitTicket().props.className)
        .toContain('u-isHidden');

      expect(webWidget.renderChat().props.className)
        .toContain('u-isHidden');
    });

    describe('when component is set to submitTicket', () => {
      beforeEach(() => {
        webWidget = domRender(<WebWidget activeEmbed='ticketSubmissionForm' />);
      });

      it('should show submit ticket component', () => {
        expect(webWidget.renderHelpCenter().props.className)
          .toContain('u-isHidden');

        expect(webWidget.renderSubmitTicket().props.className)
          .not.toContain('u-isHidden');

        expect(webWidget.renderChat().props.className)
          .toContain('u-isHidden');
      });
    });

    describe('when component is set to chat', () => {
      beforeEach(() => {
        webWidget = domRender(<WebWidget activeEmbed='chat' />);
      });

      it('should show chat component', () => {
        expect(webWidget.renderHelpCenter().props.className)
          .toContain('u-isHidden');

        expect(webWidget.renderSubmitTicket().props.className)
          .toContain('u-isHidden');

        expect(webWidget.renderChat().props.className)
          .not.toContain('u-isHidden');
      });
    });
  });

  describe('#onCancelClick', () => {
    let webWidget;

    describe('when helpCenter is available', () => {
      beforeEach(() => {
        webWidget = domRender(<WebWidget helpCenterAvailable={true} />);
        spyOn(webWidget, 'showHelpCenter');
        webWidget.onCancelClick();
      });

      it('calls showHelpCenter', () => {
        expect(webWidget.showHelpCenter)
          .toHaveBeenCalled();
      });
    });

    describe('when help center is not available', () => {
      let onCancelSpy;

      beforeEach(() => {
        onCancelSpy = jasmine.createSpy('onCancelSpy');
        webWidget = domRender(<WebWidget onCancel={onCancelSpy} />);
        webWidget.onCancelClick();
      });

      it('should call onCancel prop', () => {
        expect(onCancelSpy)
          .toHaveBeenCalled();
      });
    });
  });

  describe('#onNextClick', () => {
    let webWidget, showBackButtonSpy;

    beforeEach(() => {
      showBackButtonSpy = jasmine.createSpy('showBackButtonSpy');
    });

    describe('when chat is online', () => {
      beforeEach(() => {
        const chatProp = { account_status: 'online' }; // eslint-disable-line camelcase

        webWidget = domRender(
          <WebWidget
            chat={chatProp}
            helpCenterAvailable={true}
            showBackButton={showBackButtonSpy}
            updateActiveEmbed={mockUpdateActiveEmbed} />
        );
        webWidget.onNextClick();
      });

      it('should call updateActiveEmbed with chat', () => {
        expect(mockUpdateActiveEmbed)
          .toHaveBeenCalledWith('chat');
      });

      it('should call showBackButton with true', () => {
        expect(showBackButtonSpy)
          .toHaveBeenCalledWith(true);
      });
    });

    describe('when chat is offline', () => {
      beforeEach(() => {
        const chatProp = { account_status: 'offline' }; // eslint-disable-line camelcase

        webWidget = domRender(
          <WebWidget
            chat={chatProp}
            helpCenterAvailable={true}
            showBackButton={showBackButtonSpy}
            updateActiveEmbed={mockUpdateActiveEmbed} />
        );
        webWidget.onNextClick();
      });

      it('should call updateActiveEmbed with ticketSubmissionForm', () => {
        expect(mockUpdateActiveEmbed)
          .toHaveBeenCalledWith('ticketSubmissionForm');
      });

      it('should call showBackButton with true', () => {
        expect(showBackButtonSpy)
          .toHaveBeenCalledWith(true);
      });
    });
  });

  describe('#onBackClick', () => {
    let webWidget,
      showBackButtonSpy;

    beforeEach(() => {
      showBackButtonSpy = jasmine.createSpy('showBackButtonSpy');
    });

    describe('when help center is the active component', () => {
      beforeEach(() => {
        webWidget = domRender(
          <WebWidget
            activeEmbed='helpCenterForm'
            helpCenterAvailable={true}
            showBackButton={showBackButtonSpy} />
        );
        webWidget.onBackClick();
      });

      it('should set the state of article view', () => {
        expect(setArticleViewSpy)
          .toHaveBeenCalled();
      });

      it('should call showBackButton prop with false', () => {
        expect(showBackButtonSpy)
          .toHaveBeenCalledWith(false);
      });
    });

    describe('when submit ticket is the active component', () => {
      describe('and it has a ticket form selected with > 1 ticket forms', () => {
        beforeEach(() => {
          webWidget = domRender(
            <WebWidget
              updateActiveEmbed={() => {}}
              activeEmbed='ticketSubmissionForm'
              helpCenterAvailable={true}
              showBackButton={showBackButtonSpy} />
          );
          webWidget.getRootComponent().setState({
            selectedTicketForm: { id: '1' },
            ticketForms: [{ id: '1' }, { id: '2' }]
          });
          webWidget.onBackClick();
        });

        it('should call showBackButton prop', () => {
          expect(showBackButtonSpy)
            .toHaveBeenCalled();
        });

        it('should call clear form on the rootComponent', () => {
          expect(clearFormSpy)
            .toHaveBeenCalled();
        });
      });

      describe('when it does not have a ticket form selected', () => {
        beforeEach(() => {
          webWidget = domRender(
            <WebWidget
              updateActiveEmbed={noop}
              activeEmbed='ticketSubmissionForm'
              helpCenterAvailable={true}
              showBackButton={showBackButtonSpy} />
          );
          spyOn(webWidget, 'showHelpCenter');
          webWidget.onBackClick();
        });

        it('should call showHelpCenter', () => {
          expect(webWidget.showHelpCenter)
            .toHaveBeenCalled();
        });

        describe('when an article is not active', () => {
          beforeEach(() => {
            webWidget.getHelpCenterComponent().setState({
              articleViewActive: false
            });
            webWidget.onBackClick();
          });

          it('should call showBackButton prop with false', () => {
            expect(showBackButtonSpy)
              .toHaveBeenCalledWith(false);
          });
        });

        describe('when an article is active', () => {
          beforeEach(() => {
            webWidget.refs.helpCenterForm.setState({
              articleViewActive: true
            });
            webWidget.onBackClick();
          });

          it('should call showBackButton prop with true', () => {
            expect(showBackButtonSpy)
              .toHaveBeenCalledWith(true);
          });
        });
      });
    });

    describe('when chat is the active component', () => {
      beforeEach(() => {
        webWidget = domRender(
          <WebWidget
            updateActiveEmbed={() => {}}
            activeEmbed='chat'
            helpCenterAvailable={true}
            showBackButton={showBackButtonSpy} />
        );
        spyOn(webWidget, 'showHelpCenter');
        webWidget.onBackClick();
      });

      it('should call showHelpCenter', () => {
        expect(webWidget.showHelpCenter)
          .toHaveBeenCalled();
      });

      it('should call showBackButton prop', () => {
        expect(showBackButtonSpy)
          .toHaveBeenCalled();
      });
    });
  });

  describe('#show', () => {
    let webWidget, updateActiveEmbedSpy;

    beforeEach(() => {
      updateActiveEmbedSpy = jasmine.createSpy();
    });

    describe('when there is an active embed', () => {
      beforeEach(() => {
        webWidget = domRender(
          <WebWidget updateActiveEmbed={updateActiveEmbedSpy} activeEmbed='chat' />
        );
        webWidget.show();
      });

      it('should not call updateActiveEmbed', () => {
        expect(updateActiveEmbedSpy)
          .not.toHaveBeenCalled();
      });

      describe('when viaActivate is true', () => {
        beforeEach(() => {
          webWidget = domRender(
            <WebWidget
              helpCenterAvailable={true}
              updateActiveEmbed={updateActiveEmbedSpy}
              activeEmbed='chat' />
          );
          webWidget.show(true);
        });

        it('should reset the state and call updateActiveEmbed with help center', () => {
          expect(updateActiveEmbedSpy)
            .toHaveBeenCalledWith('helpCenterForm');
        });
      });
    });

    describe('when there is not an active embed', () => {
      describe('when help center is available', () => {
        beforeEach(() => {
          webWidget = domRender(
            <WebWidget
              helpCenterAvailable={true}
              updateActiveEmbed={updateActiveEmbedSpy}
              activeEmbed='' />
          );
          webWidget.show();
        });

        it('calls updateActiveEmbed with help center', () => {
          expect(updateActiveEmbedSpy)
            .toHaveBeenCalledWith('helpCenterForm');
        });
      });

      describe('when help center is not available', () => {
        describe('when chat is online', () => {
          beforeEach(() => {
            webWidget = domRender(
              <WebWidget
                activeEmbed=''
                chat={{ account_status: 'online' }} // eslint-disable-line camelcase
                updateActiveEmbed={updateActiveEmbedSpy}
                helpCenterAvailable={false} />
            );
            webWidget.show();
          });

          it('calls updateActiveEmbed with chat', () => {
            expect(updateActiveEmbedSpy)
              .toHaveBeenCalledWith('chat');
          });
        });

        describe('when chat is offline', () => {
          beforeEach(() => {
            webWidget = domRender(
              <WebWidget
                activeEmbed=''
                chat={{ account_status: 'offline' }} // eslint-disable-line camelcase
                updateActiveEmbed={updateActiveEmbedSpy}
                helpCenterAvailable={false} />
            );
            webWidget.show();
          });

          it('calls updateActiveEmbed with submit ticket', () => {
            expect(updateActiveEmbedSpy)
              .toHaveBeenCalledWith('ticketSubmissionForm');
          });
        });
      });
    });
  });
});
