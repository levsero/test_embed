describe('WebWidget component', () => {
  let WebWidget,
    chatOnContainerClickSpy,
    helpCenterOnContainerClickSpy,
    submitTicketOnDragEnterSpy,
    mockUpdateActiveEmbed;
  const setArticleViewSpy = jasmine.createSpy();
  const clearFormSpy = jasmine.createSpy();
  const webWidgetPath = buildSrcPath('component/webWidget/WebWidget');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    mockUpdateActiveEmbed = jasmine.createSpy('updateActiveEmbed');

    chatOnContainerClickSpy = jasmine.createSpy('chatOnContainerClick');
    helpCenterOnContainerClickSpy = jasmine.createSpy('helpCenterOnContainerClick');
    submitTicketOnDragEnterSpy = jasmine.createSpy('submitTicketOnDragEnter');

    class MockHelpCenter extends Component {
      constructor() {
        super();
        this.state = {
          articleViewActive: false
        };
        this.setArticleView = setArticleViewSpy;
        this.onContainerClick = helpCenterOnContainerClickSpy;
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
        this.handleDragEnter = submitTicketOnDragEnterSpy;
      }
      render() {
        return <div />;
      }
    }

    class MockChat extends Component {
      constructor() {
        super();
        this.state = {};
        this.onContainerClick = chatOnContainerClickSpy;
      }
      render() {
        return <div ref='chat' />;
      }
    }

    class MockTalk extends Component {
      constructor() {
        super();
        this.state = {};
      }
      render() {
        return <div ref='talk' />;
      }
    }

    initMockRegistry({
      'React': React,
      'component/container/Container': {
        Container: class extends Component {
          render() {
            return (
              <div>{this.props.children}</div>
            );
          }
        }
      },
      'component/chat/Chat': connectedComponent(<MockChat />),
      'component/helpCenter/HelpCenter': connectedComponent(<MockHelpCenter />),
      'component/submitTicket/SubmitTicket': {
        SubmitTicket: MockSubmitTicket
      },
      'component/talk/Talk': {
        Talk: MockTalk
      },
      'component/channelChoice/ChannelChoice': {
        ChannelChoice: noopReactComponent()
      },
      'src/redux/modules/base': {
        updateActiveEmbed: noop,
        updateEmbedAccessible: noop,
        updateBackButtonVisibility: noop,
        updateAuthenticated: noop
      },
      'src/redux/modules/chat': {
        hideChatNotification: noop,
        updateChatScreen: noop
      },
      'src/redux/modules/chat/selectors': {
        getChatNotification: noop
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

    it('should have a data-embed value', () => {
      expect(ReactDOM.findDOMNode(webWidget).attributes['data-embed'])
        .toBeTruthy();
    });

    it('should show help center component by default', () => {
      expect(webWidget.renderHelpCenter().props.className)
        .not.toContain('u-isHidden');

      expect(webWidget.renderSubmitTicket().props.className)
        .toContain('u-isHidden');

      expect(webWidget.renderChat())
        .toBeFalsy();
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

        expect(webWidget.renderChat())
          .toBeFalsy();
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

        expect(webWidget.renderChat())
          .toBeTruthy();
      });
    });

    describe('when component is set to talk', () => {
      beforeEach(() => {
        webWidget = domRender(<WebWidget activeEmbed='talk' />);
      });

      it('should show talk component', () => {
        expect(webWidget.renderTalk())
          .toBeTruthy();
      });
    });
  });

  describe('setAuthenticated', () => {
    let webWidget,
      updateAuthenticatedSpy;

    beforeEach(() => {
      updateAuthenticatedSpy = jasmine.createSpy('updateAuthenticated');
      webWidget = instanceRender(<WebWidget updateAuthenticated={updateAuthenticatedSpy} />);
      webWidget.setAuthenticated(true);
    });

    it('should call props.updateAuthenticated with a boolean value', () => {
      expect(updateAuthenticatedSpy)
        .toHaveBeenCalledWith(true);
    });
  });

  describe('#onCancelClick', () => {
    let webWidget;

    describe('when helpCenter is available', () => {
      beforeEach(() => {
        webWidget = instanceRender(<WebWidget />);

        spyOn(webWidget, 'isHelpCenterAvailable').and.returnValue(true);
        spyOn(webWidget, 'showHelpCenter');
        webWidget.onCancelClick();
      });

      it('calls showHelpCenter', () => {
        expect(webWidget.showHelpCenter)
          .toHaveBeenCalled();
      });
    });

    describe('when help center is not available', () => {
      describe('when channel choice is available', () => {
        beforeEach(() => {
          webWidget = instanceRender(<WebWidget updateActiveEmbed={mockUpdateActiveEmbed} />);

          spyOn(webWidget, 'isHelpCenterAvailable').and.returnValue(false);
          spyOn(webWidget, 'isChannelChoiceAvailable').and.returnValue(true);
          webWidget.onCancelClick();
        });

        it('should call updateActiveEmbed with channelChoice', () => {
          expect(mockUpdateActiveEmbed)
            .toHaveBeenCalledWith('channelChoice');
        });
      });

      describe('when channel choice is not available', () => {
        let onCancelSpy;

        beforeEach(() => {
          onCancelSpy = jasmine.createSpy('onCancelSpy');
          webWidget = instanceRender(
            <WebWidget
              onCancel={onCancelSpy}
              updateActiveEmbed={mockUpdateActiveEmbed} />
          );

          spyOn(webWidget, 'isHelpCenterAvailable').and.returnValue(false);
          spyOn(webWidget, 'isChannelChoiceAvailable').and.returnValue(false);
          webWidget.onCancelClick();
        });

        it('should call onCancel prop', () => {
          expect(onCancelSpy)
            .toHaveBeenCalled();
        });

        it('should call updateActiveEmbed with an empty string', () => {
          expect(mockUpdateActiveEmbed)
            .toHaveBeenCalledWith('');
        });
      });
    });
  });

  describe('#onNextClick', () => {
    let webWidget, updateBackButtonVisibilitySpy;

    beforeEach(() => {
      updateBackButtonVisibilitySpy = jasmine.createSpy('updateBackButtonVisibilitySpy');
    });

    describe('when a param is passed in', () => {
      beforeEach(() => {
        webWidget = instanceRender(
          <WebWidget
            zopimOnline={true}
            helpCenterAvailable={true}
            updateBackButtonVisibility={updateBackButtonVisibilitySpy}
            updateActiveEmbed={mockUpdateActiveEmbed} />
        );
        webWidget.onNextClick('foo');
      });

      it('should call updateActiveEmbed with that param', () => {
        expect(mockUpdateActiveEmbed)
          .toHaveBeenCalledWith('foo');
      });

      describe('when that param is chat and zopim is online', () => {
        beforeEach(() => {
          webWidget.onNextClick('chat');
        });

        it('should call updateActiveEmbed with that zopims variable', () => {
          expect(mockUpdateActiveEmbed)
            .toHaveBeenCalledWith('zopimChat');
        });
      });
    });

    describe('when chat is online', () => {
      beforeEach(() => {
        const chatProp = { account_status: 'online' }; // eslint-disable-line camelcase

        webWidget = instanceRender(
          <WebWidget
            chat={chatProp}
            helpCenterAvailable={true}
            updateBackButtonVisibility={updateBackButtonVisibilitySpy}
            updateActiveEmbed={mockUpdateActiveEmbed} />
        );
        webWidget.onNextClick();
      });

      it('should call updateActiveEmbed with chat', () => {
        expect(mockUpdateActiveEmbed)
          .toHaveBeenCalledWith('chat');
      });

      it('should call updateBackButtonVisibility with true', () => {
        expect(updateBackButtonVisibilitySpy)
          .toHaveBeenCalledWith(true);
      });
    });

    describe('when chat is offline', () => {
      beforeEach(() => {
        const chatProp = { account_status: 'offline' }; // eslint-disable-line camelcase

        webWidget = instanceRender(
          <WebWidget
            chat={chatProp}
            helpCenterAvailable={true}
            updateBackButtonVisibility={updateBackButtonVisibilitySpy}
            updateActiveEmbed={mockUpdateActiveEmbed} />
        );
        webWidget.onNextClick();
      });

      it('should call updateActiveEmbed with ticketSubmissionForm', () => {
        expect(mockUpdateActiveEmbed)
          .toHaveBeenCalledWith('ticketSubmissionForm');
      });

      it('should call updateBackButtonVisibility with true', () => {
        expect(updateBackButtonVisibilitySpy)
          .toHaveBeenCalledWith(true);
      });
    });
  });

  describe('#onBackClick', () => {
    let webWidget,
      updateBackButtonVisibilitySpy;

    beforeEach(() => {
      updateBackButtonVisibilitySpy = jasmine.createSpy('updateBackButtonVisibilitySpy');
    });

    describe('when help center is the active component', () => {
      beforeEach(() => {
        webWidget = domRender(
          <WebWidget
            activeEmbed='helpCenterForm'
            helpCenterAvailable={true}
            updateBackButtonVisibility={updateBackButtonVisibilitySpy} />
        );
        webWidget.onBackClick();
      });

      it('should set the state of article view', () => {
        expect(setArticleViewSpy)
          .toHaveBeenCalled();
      });

      it('should call updateBackButtonVisibility prop with false', () => {
        expect(updateBackButtonVisibilitySpy)
          .toHaveBeenCalledWith(false);
      });
    });

    describe('when submit ticket is the active component', () => {
      const ticketFormsState = {
        selectedTicketForm: { id: '1' },
        ticketForms: { ticket_forms: [{ id: '1' }, { id: '2' }] } // eslint-disable-line camelcase
      };

      describe('and it has a ticket form selected with > 1 ticket forms', () => {
        beforeEach(() => {
          webWidget = domRender(
            <WebWidget
              updateActiveEmbed={() => {}}
              activeEmbed='ticketSubmissionForm'
              helpCenterAvailable={true}
              updateBackButtonVisibility={updateBackButtonVisibilitySpy} />
          );
          webWidget.getRootComponent().setState(ticketFormsState);
          webWidget.onBackClick();
        });

        it('should call updateBackButtonVisibility prop', () => {
          expect(updateBackButtonVisibilitySpy)
            .toHaveBeenCalledWith(true);
        });

        it('should call clear form on the rootComponent', () => {
          expect(clearFormSpy)
            .toHaveBeenCalled();
        });

        describe('when helpCenter is not available and channel choice is', () => {
          beforeEach(() => {
            webWidget = domRender(
              <WebWidget
                updateActiveEmbed={() => {}}
                activeEmbed='ticketSubmissionForm'
                helpCenterAvailable={false}
                channelChoice={true}
                updateBackButtonVisibility={updateBackButtonVisibilitySpy} />
            );
            webWidget.getRootComponent().setState(ticketFormsState);
            webWidget.onBackClick();
          });

          it('should still call updateBackButtonVisibility prop with true', () => {
            expect(updateBackButtonVisibilitySpy)
              .toHaveBeenCalledWith(true);
          });
        });

        describe('when helpCenter and channel choice are not available', () => {
          beforeEach(() => {
            webWidget = domRender(
              <WebWidget
                updateActiveEmbed={() => {}}
                activeEmbed='ticketSubmissionForm'
                helpCenterAvailable={false}
                channelChoice={false}
                updateBackButtonVisibility={updateBackButtonVisibilitySpy} />
            );
            webWidget.getRootComponent().setState(ticketFormsState);
            webWidget.onBackClick();
          });

          it('should call updateBackButtonVisibility prop with false', () => {
            expect(updateBackButtonVisibilitySpy)
              .toHaveBeenCalledWith(false);
          });
        });
      });

      describe('when it does not have a ticket form selected', () => {
        beforeEach(() => {
          webWidget = domRender(
            <WebWidget
              updateActiveEmbed={noop}
              activeEmbed='ticketSubmissionForm'
              helpCenterAvailable={true}
              updateBackButtonVisibility={updateBackButtonVisibilitySpy} />
          );
          spyOn(webWidget, 'showHelpCenter').and.callThrough();
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

          it('should call updateBackButtonVisibility prop with false', () => {
            expect(updateBackButtonVisibilitySpy)
              .toHaveBeenCalledWith(false);
          });
        });

        describe('when an article is active', () => {
          beforeEach(() => {
            webWidget.refs.helpCenterForm.getWrappedInstance().setState({
              articleViewActive: true
            });
            webWidget.onBackClick();
          });

          it('should call updateBackButtonVisibility prop with true', () => {
            expect(updateBackButtonVisibilitySpy)
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
            updateBackButtonVisibility={updateBackButtonVisibilitySpy} />
        );
        spyOn(webWidget, 'showHelpCenter').and.callThrough();
        webWidget.onBackClick();
      });

      it('should call showHelpCenter', () => {
        expect(webWidget.showHelpCenter)
          .toHaveBeenCalled();
      });

      it('should call updateBackButtonVisibility prop', () => {
        expect(updateBackButtonVisibilitySpy)
          .toHaveBeenCalled();
      });

      describe('when help center is not available and channel choice is', () => {
        let updateActiveEmbedSpy;

        beforeEach(() => {
          updateActiveEmbedSpy = jasmine.createSpy();

          webWidget = domRender(
            <WebWidget
              updateActiveEmbed={updateActiveEmbedSpy}
              activeEmbed='chat'
              helpCenterAvailable={false}
              channelChoice={true}
              updateBackButtonVisibility={updateBackButtonVisibilitySpy} />
          );
          webWidget.onBackClick();
        });

        it('should call call updateActiveEmbed with channelChoice', () => {
          expect(updateActiveEmbedSpy)
            .toHaveBeenCalledWith('channelChoice');
        });

        it('should call updateBackButtonVisibility prop with false', () => {
          expect(updateBackButtonVisibilitySpy)
            .toHaveBeenCalledWith(false);
        });
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
          <WebWidget updateActiveEmbed={noop} activeEmbed='chat' />
        );

        spyOn(webWidget, 'resetActiveEmbed');
        webWidget.show();
      });

      it('does not call resetActiveEmbed', () => {
        expect(webWidget.resetActiveEmbed)
          .not.toHaveBeenCalled();
      });

      describe('when viaActivate is true', () => {
        beforeEach(() => {
          webWidget = domRender(
            <WebWidget
              helpCenterAvailable={true}
              updateActiveEmbed={noop}
              activeEmbed='chat' />
          );

          webWidget.show(true);
        });

        it('calls resetActiveEmbed', () => {
          expect(webWidget.resetActiveEmbed)
            .toHaveBeenCalled();
        });
      });

      describe('when the activeEmbed is submit ticket and chat is online', () => {
        beforeEach(() => {
          webWidget = domRender(
            <WebWidget
              submitTicketAvailable={true}
              updateActiveEmbed={updateActiveEmbedSpy}
              zopimOnline={true}
              activeEmbed='ticketSubmissionForm' />
          );

          webWidget.show();
        });

        it('sets the activeEmbed to chat', () => {
          expect(updateActiveEmbedSpy)
            .toHaveBeenCalledWith('zopimChat');
        });
      });

      describe('when the activeEmbed is zopimChat and zopimChat is offline', () => {
        beforeEach(() => {
          webWidget = domRender(
            <WebWidget
              submitTicketAvailable={true}
              updateActiveEmbed={noop}
              zopimOnline={false}
              activeEmbed='zopimChat' />
          );

          webWidget.show();
        });

        it('calls resetActiveEmbed', () => {
          expect(webWidget.resetActiveEmbed)
            .toHaveBeenCalled();
        });
      });

      describe('when the activeEmbed is channelChoice and zopimChat is offline', () => {
        beforeEach(() => {
          webWidget = domRender(
            <WebWidget
              submitTicketAvailable={true}
              updateActiveEmbed={noop}
              zopimOnline={false}
              activeEmbed='channelChoice' />
          );

          webWidget.show();
        });

        it('calls resetActiveEmbed', () => {
          expect(webWidget.resetActiveEmbed)
            .toHaveBeenCalled();
        });
      });
    });

    describe('when there is not an active embed', () => {
      beforeEach(() => {
        webWidget = domRender(
          <WebWidget updateActiveEmbed={updateActiveEmbedSpy} activeEmbed='' />
        );

        spyOn(webWidget, 'resetActiveEmbed');
        webWidget.show();
      });

      it('calls resetActiveEmbed', () => {
        expect(webWidget.resetActiveEmbed)
          .toHaveBeenCalled();
      });
    });
  });

  describe('#resetActiveEmbed', () => {
    let webWidget, updateActiveEmbedSpy, updateBackButtonVisibilitySpy;

    beforeEach(() => {
      updateActiveEmbedSpy = jasmine.createSpy();
      updateBackButtonVisibilitySpy = jasmine.createSpy('updateBackButtonVisibilitySpy');
    });

    describe('when Talk is available', () => {
      describe('when HelpCenter is available', () => {
        beforeEach(() => {
          webWidget = domRender(
            <WebWidget
              talkAvailable={true}
              updateActiveEmbed={updateActiveEmbedSpy}
              activeEmbed='' />
          );

          spyOn(webWidget, 'articleViewActive');

          webWidget.isHelpCenterAvailable = () => true;
          webWidget.resetActiveEmbed();
        });

        it('calls articleViewActive', () => {
          expect(webWidget.articleViewActive)
            .toHaveBeenCalled();
        });

        it('calls updateActiveEmbed with helpCenterForm', () => {
          expect(updateActiveEmbedSpy)
            .toHaveBeenCalledWith('helpCenterForm');
        });
      });

      describe('when ChannelChoice is available', () => {
        beforeEach(() => {
          webWidget = domRender(
            <WebWidget
              talkAvailable={true}
              updateActiveEmbed={updateActiveEmbedSpy}
              activeEmbed='' />
          );

          webWidget.isChannelChoiceAvailable = () => true;
          webWidget.resetActiveEmbed();
        });

        it('calls updateActiveEmbed with channelChoice', () => {
          expect(updateActiveEmbedSpy)
            .toHaveBeenCalledWith('channelChoice');
        });
      });

      describe('when neither HelpCenter or ChannelChoice is available', () => {
        beforeEach(() => {
          webWidget = domRender(
            <WebWidget
              talkAvailable={true}
              updateActiveEmbed={updateActiveEmbedSpy}
              activeEmbed='' />
          );

          webWidget.resetActiveEmbed();
        });

        it('calls updateActiveEmbed with talk', () => {
          expect(updateActiveEmbedSpy)
            .toHaveBeenCalledWith('talk');
        });
      });
    });

    describe('when Talk is not available', () => {
      describe('when Chat is available', () => {
        beforeEach(() => {
          webWidget = domRender(
            <WebWidget
              updateActiveEmbed={updateActiveEmbedSpy}
              activeEmbed='' />
          );

          spyOn(webWidget, 'showChat');

          webWidget.isChatOnline = () => true;
          webWidget.resetActiveEmbed();
        });

        it('calls showChat', () => {
          expect(webWidget.showChat)
            .toHaveBeenCalled();
        });
      });

      describe('when there are no embeds available apart from contactForm', () => {
        beforeEach(() => {
          webWidget = domRender(
            <WebWidget
              updateActiveEmbed={updateActiveEmbedSpy}
              activeEmbed='' />
          );

          spyOn(webWidget, 'shouldShowTicketFormBackButton');

          webWidget.resetActiveEmbed();
        });

        it('calls shouldShowTicketFormBackButton', () => {
          expect(webWidget.shouldShowTicketFormBackButton)
            .toHaveBeenCalled();
        });

        it('calls updateActiveEmbed with ticketSubmissionForm', () => {
          expect(updateActiveEmbedSpy)
            .toHaveBeenCalledWith('ticketSubmissionForm');
        });
      });
    });

    describe('when help center is available', () => {
      beforeEach(() => {
        webWidget = domRender(
          <WebWidget
            updateActiveEmbed={updateActiveEmbedSpy}
            updateBackButtonVisibility={updateBackButtonVisibilitySpy}
            activeEmbed='' />
        );

        spyOn(webWidget, 'isHelpCenterAvailable').and.returnValue(true);
        webWidget.resetActiveEmbed();
      });

      it('calls updateActiveEmbed with help center', () => {
        expect(updateActiveEmbedSpy)
          .toHaveBeenCalledWith('helpCenterForm');
      });

      describe('when the article view is active', () => {
        beforeEach(() => {
          webWidget.getHelpCenterComponent().setState({
            articleViewActive: true
          });
          webWidget.resetActiveEmbed();
        });

        it('calls updateBackButtonVisibility woth true', () => {
          expect(updateBackButtonVisibilitySpy)
            .toHaveBeenCalledWith(true);
        });
      });

      describe('when the article view is active', () => {
        beforeEach(() => {
          webWidget.getHelpCenterComponent().setState({
            articleViewActive: false
          });
          webWidget.resetActiveEmbed();
        });

        it('calls updateBackButtonVisibility with false', () => {
          expect(updateBackButtonVisibilitySpy)
            .toHaveBeenCalledWith(false);
        });
      });
    });

    describe('when help center is not available', () => {
      describe('when channelChoice is available', () => {
        beforeEach(() => {
          webWidget = instanceRender(
            <WebWidget
              activeEmbed=''
              chat={{ account_status: 'online' }} // eslint-disable-line camelcase
              channelChoice={true}
              submitTicketAvailable={true}
              updateActiveEmbed={updateActiveEmbedSpy} />
          );

          spyOn(webWidget, 'isHelpCenterAvailable').and.returnValue(false);
          webWidget.resetActiveEmbed();
        });

        it('calls updateActiveEmbed with channelChoice', () => {
          expect(updateActiveEmbedSpy)
            .toHaveBeenCalledWith('channelChoice');
        });
      });

      describe('when chat is online', () => {
        beforeEach(() => {
          webWidget = instanceRender(
            <WebWidget
              activeEmbed=''
              chat={{ account_status: 'online' }} // eslint-disable-line camelcase
              updateActiveEmbed={updateActiveEmbedSpy}
              channelChoice={false} />
          );

          spyOn(webWidget, 'isHelpCenterAvailable').and.returnValue(false);
          webWidget.resetActiveEmbed();
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
              updateBackButtonVisibility={updateBackButtonVisibilitySpy}
              updateActiveEmbed={updateActiveEmbedSpy} />
          );

          spyOn(webWidget, 'isHelpCenterAvailable').and.returnValue(false);
          webWidget.resetActiveEmbed();
        });

        it('calls updateActiveEmbed with submit ticket', () => {
          expect(updateActiveEmbedSpy)
            .toHaveBeenCalledWith('ticketSubmissionForm');
        });

        describe('when shouldShowTicketFormBackButton is false', () => {
          beforeEach(() => {
            spyOn(webWidget, 'shouldShowTicketFormBackButton').and.returnValue(false);
            webWidget.resetActiveEmbed();
          });

          it('does not show the back button', () => {
            expect(updateBackButtonVisibilitySpy)
              .toHaveBeenCalledWith(false);
          });
        });

        describe('when shouldShowTicketFormBackButton is true', () => {
          beforeEach(() => {
            spyOn(webWidget, 'shouldShowTicketFormBackButton').and.returnValue(true);
            webWidget.resetActiveEmbed();
          });

          it('shows the back button', () => {
            expect(updateBackButtonVisibilitySpy)
              .toHaveBeenCalledWith(true);
          });
        });
      });
    });
  });

  describe('#showChat', () => {
    let webWidget, updateActiveEmbedSpy, zopimOnNextSpy;

    beforeEach(() => {
      updateActiveEmbedSpy = jasmine.createSpy();
      zopimOnNextSpy = jasmine.createSpy();
    });

    describe('when zopimOnline is true', () => {
      beforeEach(() => {
        webWidget = instanceRender(
          <WebWidget
            zopimOnline={true}
            updateActiveEmbed={updateActiveEmbedSpy} />
        );
        webWidget.showChat();
      });

      it('should call updateActiveEmbed with zopimChat', () => {
        expect(updateActiveEmbedSpy)
          .toHaveBeenCalledWith('zopimChat');
      });

      describe('when helpCenter is the active embed', () => {
        beforeEach(() => {
          webWidget = instanceRender(
            <WebWidget
              zopimOnline={true}
              activeEmbed='helpCenterForm'
              zopimOnNext={zopimOnNextSpy}
              updateActiveEmbed={updateActiveEmbedSpy} />
          );
          webWidget.showChat();
        });

        it('should call zopimOnNext', () => {
          expect(zopimOnNextSpy)
            .toHaveBeenCalled();
        });
      });

      describe('when channelChoice is the active embed', () => {
        beforeEach(() => {
          webWidget = instanceRender(
            <WebWidget
              zopimOnline={true}
              activeEmbed='channelChoice'
              zopimOnNext={zopimOnNextSpy}
              updateActiveEmbed={updateActiveEmbedSpy} />
          );
          webWidget.showChat();
        });

        it('should call zopimOnNext', () => {
          expect(zopimOnNextSpy)
            .toHaveBeenCalled();
        });
      });
    });

    describe('when zopimOnline is false', () => {
      beforeEach(() => {
        webWidget = instanceRender(
          <WebWidget
            zopimOnline={false}
            updateActiveEmbed={updateActiveEmbedSpy} />
        );
        webWidget.showChat();
      });

      it('should call updateActiveEmbed with chat', () => {
        expect(updateActiveEmbedSpy)
          .toHaveBeenCalledWith('chat');
      });
    });
  });

  describe('#isHelpCenterAvailable', () => {
    let webWidget;

    describe('when props.helpCenterAvailable is false', () => {
      beforeEach(() => {
        webWidget = instanceRender(<WebWidget helpCenterAvailable={false} />);
      });

      it('returns false', () => {
        expect(webWidget.isHelpCenterAvailable())
          .toBe(false);
      });
    });

    describe('when props.helpCenterAvailable is true', () => {
      describe('when hc is not sign-in required', () => {
        beforeEach(() => {
          webWidget = instanceRender(<WebWidget helpCenterAvailable={true} />);
        });

        it('returns true', () => {
          expect(webWidget.isHelpCenterAvailable())
            .toBe(true);
        });
      });

      describe('when hc is sign-in required', () => {
        const config = { signInRequired: true };

        beforeEach(() => {
          webWidget = instanceRender(
            <WebWidget
              helpCenterAvailable={true}
              authenticated={false}
              helpCenterConfig={config} />
          );
        });

        it('returns false', () => {
          expect(webWidget.isHelpCenterAvailable())
            .toBe(false);
        });

        describe('when hc is authenticated', () => {
          beforeEach(() => {
            webWidget = instanceRender(
              <WebWidget
                helpCenterAvailable={true}
                helpCenterConfig={config}
                authenticated={true} />
            );
          });

          it('returns true', () => {
            expect(webWidget.isHelpCenterAvailable())
              .toBe(true);
          });
        });

        describe('when embedded on a help center', () => {
          beforeEach(() => {
            webWidget = instanceRender(
              <WebWidget
                helpCenterAvailable={true}
                helpCenterConfig={config}
                authenticated={false}
                isOnHelpCenterPage={true} />
            );
          });

          it('returns true', () => {
            expect(webWidget.isHelpCenterAvailable())
              .toBe(true);
          });
        });
      });
    });
  });

  describe('#onContainerClick', () => {
    let webWidget;

    describe('when the activeEmbed is chat', () => {
      beforeEach(() => {
        webWidget = domRender(<WebWidget activeEmbed='chat' />);
        webWidget.onContainerClick();
      });

      it('calls the chat onContainerClick handler', () => {
        expect(chatOnContainerClickSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when the activeEmbed is helpCenter', () => {
      beforeEach(() => {
        webWidget = domRender(<WebWidget activeEmbed='helpCenterForm' />);
        webWidget.onContainerClick();
      });

      it('calls the helpCenter onContainerClick handler', () => {
        expect(helpCenterOnContainerClickSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when the activeEmbed is not chat or helpCenter', () => {
      beforeEach(() => {
        webWidget = domRender(<WebWidget activeEmbed='ticketSubmissionForm' />);
        webWidget.onContainerClick();
      });

      it('does not call the chat onContainerClick handler', () => {
        expect(chatOnContainerClickSpy)
          .not.toHaveBeenCalled();
      });

      it('does not call the helpCenter onContainerClick handler', () => {
        expect(helpCenterOnContainerClickSpy)
          .not.toHaveBeenCalled();
      });
    });
  });

  describe('#onContainerDragEnter', () => {
    let webWidget;

    describe('when the activeEmbed is submitTicket', () => {
      beforeEach(() => {
        webWidget = domRender(<WebWidget activeEmbed='ticketSubmissionForm' />);
        webWidget.onContainerDragEnter();
      });

      it('calls the submitTicket onDragEnter handler', () => {
        expect(submitTicketOnDragEnterSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when the activeEmbed is not submitTicket', () => {
      beforeEach(() => {
        webWidget = domRender(<WebWidget activeEmbed='helpCenter' />);
        webWidget.onContainerDragEnter();
      });

      it('does not call the submitTicket onDragEnter handler', () => {
        expect(submitTicketOnDragEnterSpy)
          .not.toHaveBeenCalled();
      });
    });
  });
});
