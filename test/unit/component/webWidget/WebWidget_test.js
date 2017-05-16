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

    class MockChat extends Component {
      constructor() {
        super();
        this.state = {};
      };
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
      webWidget = domRender(
        <WebWidget
          helpCenterAvailable={true}
          showBackButton={showBackButtonSpy} />
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
        webWidget.setState({ activeEmbed: 'ticketSubmissionForm' });
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
    });

    describe('when chat is the active component', () => {
      beforeEach(() => {
        spyOn(webWidget, 'showHelpCenter');
        webWidget.setState({ activeEmbed: 'chat' });
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

  describe('#activate', () => {
    let webWidget;

    describe('when help center is available', () => {
      beforeEach(() => {
        webWidget = domRender(<WebWidget helpCenterAvailable={true} />);
        spyOn(webWidget, 'showHelpCenter');
        webWidget.activate();
      });

      it('invokes showHelpCenter', () => {
        expect(webWidget.showHelpCenter)
          .toHaveBeenCalled();
      });
    });

    describe('when help center is not available', () => {
      beforeEach(() => {
        webWidget = domRender(
          <WebWidget
            updateActiveEmbed={mockUpdateActiveEmbed}
            helpCenterAvailable={false} />
        );
        webWidget.activate();
      });

      it('invokes updateActiveEmbed with expected param', () => {
        const expectedParam = 'ticketSubmissionForm';

        expect(mockUpdateActiveEmbed)
          .toHaveBeenCalledWith(expectedParam);
      });
    });
  });
});
