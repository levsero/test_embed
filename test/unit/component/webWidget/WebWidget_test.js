describe('WebWidget component', () => {
  let WebWidget;
  const setArticleViewSpy = jasmine.createSpy();
  const clearFormSpy = jasmine.createSpy();
  const webWidgetPath = buildSrcPath('component/webWidget/WebWidget');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    class MockHelpCenter extends Component {
      constructor() {
        super();
        this.state = {
          activateArticleView: false
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

    initMockRegistry({
      'React': React,
      'component/chat/Chat': {
        Chat: noopReactComponent()
      },
      'component/helpCenter/HelpCenter': {
        HelpCenter: MockHelpCenter
      },
      'component/submitTicket/SubmitTicket': {
        SubmitTicket: MockSubmitTicket
      }
    });

    mockery.registerAllowable(webWidgetPath);
    WebWidget = requireUncached(webWidgetPath).WebWidget;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#render', () => {
    let webWidget;

    beforeEach(() => {
      webWidget = domRender(<WebWidget />);
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
        webWidget.setComponent('ticketSubmissionForm');
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
        webWidget.setComponent('chat');
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
      let showBackButtonSpy;

      beforeEach(() => {
        showBackButtonSpy = jasmine.createSpy('showBackButtonSpy');
        webWidget = domRender(
          <WebWidget helpCenterAvailable={true} showBackButton={showBackButtonSpy} />
        );
        webWidget.onCancelClick();
      });

      it('shows help center', () => {
        expect(webWidget.renderHelpCenter().props.className)
          .not.toContain('u-isHidden');
      });

      it('calls showBackButton prop', () => {
        expect(showBackButtonSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when help center is not available', () => {
      let onCancelSpy;

      beforeEach(() => {
        onCancelSpy = jasmine.createSpy('onCancelSpy');
        webWidget = domRender(
          <WebWidget onCancel={onCancelSpy} />
        );
        webWidget.onCancelClick();
      });

      it('should call onCancel prop', () => {
        expect(onCancelSpy)
          .toHaveBeenCalled();
      });
    });
  });

  describe('#onNextClick', () => {
    let webWidget;

    describe('when chat is online', () => {
      beforeEach(() => {
        webWidget = domRender(<WebWidget helpCenterAvailable={true} />);
        // TODO: Replace with whatever function will set chat status
        webWidget.setState({ chatOnline: true });
        webWidget.onNextClick();
      });

      it('shows chat', () => {
        expect(webWidget.renderChat().props.className)
          .not.toContain('u-isHidden');
      });
    });

    describe('when chat is offline', () => {
      let showBackButtonSpy;

      beforeEach(() => {
        showBackButtonSpy = jasmine.createSpy('showBackButtonSpy');
        webWidget = domRender(
          <WebWidget helpCenterAvailable={true} showBackButton={showBackButtonSpy} />
        );
        webWidget.onNextClick();
      });

      it('shows submit ticket', () => {
        expect(webWidget.renderSubmitTicket().props.className)
          .not.toContain('u-isHidden');
      });

      it('should call onCancel prop', () => {
        expect(showBackButtonSpy)
          .toHaveBeenCalled();
      });
    });
  });

  describe('#onBackClick', () => {
    let webWidget,
      showBackButtonSpy;

    beforeEach(() => {
      showBackButtonSpy = jasmine.createSpy('showBackButtonSpy');
      webWidget = domRender(
        <WebWidget helpCenterAvailable={true} showBackButton={showBackButtonSpy} />
      );
    });

    describe('when help center is the active component', () => {
      beforeEach(() => {
        webWidget.onBackClick();
      });

      it('should set the state of article view', () => {
        expect(setArticleViewSpy)
          .toHaveBeenCalled();
      });

      it('should call showBackButton prop', () => {
        expect(showBackButtonSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when submit ticket is the active component', () => {
      beforeEach(() => {
        webWidget.setComponent('ticketSubmissionForm');
      });

      describe('and it has a ticket form selected', () => {
        beforeEach(() => {
          webWidget.getRootComponent().setState({ selectedTicketForm: { id: '1' } });
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

      describe('and it does not have a ticket form selected', () => {
        beforeEach(() => {
          webWidget.onBackClick();
        });

        it('should call showBackButton prop', () => {
          expect(showBackButtonSpy)
            .toHaveBeenCalled();
        });

        it('shows help center', () => {
          expect(webWidget.renderHelpCenter().props.className)
            .not.toContain('u-isHidden');
        });
      });
    });
  });
});
