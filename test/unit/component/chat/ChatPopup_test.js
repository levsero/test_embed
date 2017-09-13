describe('ChatPopup component', () => {
  let ChatPopup;
  const chatPopupPath = buildSrcPath('component/chat/ChatPopup');

  beforeEach(() => {
    resetDOM();
    mockery.enable();

    initMockRegistry({
      './ChatPopup.sass': {
        locals: {
          'agentMessage': 'agentMessage',
          'topContainer': 'topContainer',
          'dismissBtn': 'dismissBtn',
          'viewBtn': 'viewBtn'
        }
      },
      'component/Avatar': {
        Avatar: noopReactComponent()
      },
      'component/button/Button': {
        Button: class extends Component {
          render() {
            return (
              <div className={this.props.className} onClick={this.props.onClick} />
            );
          }
        }
      },
      'service/i18n': {
        i18n: {
          t: noop
        }
      }
    });

    mockery.registerAllowable(chatPopupPath);
    ChatPopup = requireUncached(chatPopupPath).ChatPopup;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('render', () => {
    let componentNode,
      agentName,
      message;

    beforeEach(() => {
      agentName = 'Granny Smith';
      message = 'I use weaponized apples';

      const component = domRender(<ChatPopup showCta={true} agentName={agentName} message={message} />);

      componentNode = ReactDOM.findDOMNode(component);
    });

    it(`renders the agent's name`, () => {
      expect(componentNode.getElementsByTagName('strong')[0].textContent)
        .toEqual(agentName);
    });

    it(`renders the agent's message`, () => {
      expect(componentNode.querySelector('.agentMessage').textContent)
        .toEqual(message);
    });
  });

  describe('props', () => {
    let componentNode,
      dismissFnSpy,
      respondFnSpy;

    describe('dismissFn', () => {
      describe('when cta is shown', () => {
        beforeEach(() => {
          dismissFnSpy = jasmine.createSpy('dismissFn');

          const component = domRender(<ChatPopup showCta={true} dismissFn={dismissFnSpy} />);

          componentNode = ReactDOM.findDOMNode(component);
        });

        it('calls dismissFn when ctaBtn is clicked', () => {
          componentNode.querySelector('.dismissBtn').click();

          expect(dismissFnSpy)
            .toHaveBeenCalled();
        });
      });

      describe('when cta is not shown', () => {
        beforeEach(() => {
          dismissFnSpy = jasmine.createSpy('dismissFn');

          const component = domRender(<ChatPopup showCta={false} dismissFn={dismissFnSpy} />);

          componentNode = ReactDOM.findDOMNode(component);
        });

        it('does not render the cta element', () => {
          expect(componentNode.querySelector('.dismissBtn'))
            .toBeNull();
        });
      });
    });

    describe('respondFnSpy', () => {
      describe('when cta is shown', () => {
        beforeEach(() => {
          respondFnSpy = jasmine.createSpy('respondFnSpy');

          const component = domRender(<ChatPopup showCta={true} respondFn={respondFnSpy} />);

          componentNode = ReactDOM.findDOMNode(component);
        });

        it('calls dismissFn when ctaBtn is clicked', () => {
          componentNode.querySelector('.viewBtn').click();

          expect(respondFnSpy)
            .toHaveBeenCalled();
        });
      });

      describe('when cta is not shown', () => {
        beforeEach(() => {
          respondFnSpy = jasmine.createSpy('respondFnSpy');

          const component = domRender(<ChatPopup showCta={false} respondFn={respondFnSpy} />);

          componentNode = ReactDOM.findDOMNode(component);
        });

        it('does not render the cta element', () => {
          expect(componentNode.querySelector('.viewBtn'))
            .toBeNull();
        });

        it('calls respondFn when topContainer is clicked', () => {
          componentNode.querySelector('.topContainer').click();

          expect(respondFnSpy)
            .toHaveBeenCalled();
        });
      });
    });
  });

  describe('renderCta', () => {
    let component;

    describe('when showCta is true', () => {
      beforeEach(() => {
        component = instanceRender(<ChatPopup showCta={true} />);
      });

      it('renders the cta element', () => {
        expect(component.renderCta())
          .not.toBeNull();
      });
    });

    describe('when showCta is false', () => {
      beforeEach(() => {
        component = instanceRender(<ChatPopup showCta={false} />);
      });

      it('does not render the cta element', () => {
        expect(component.renderCta())
          .toBeNull();
      });
    });
  });

  describe('renderAgentName', () => {
    let component;

    describe('when showCta is true and agent name is not empty', () => {
      beforeEach(() => {
        component = instanceRender(<ChatPopup showCta={true} agentName='bobby' />);
      });

      it(`renders the element containing the agent's name`, () => {
        expect(component.renderAgentName())
          .not.toBeNull();
      });
    });

    describe('when showCta is false or agent name is empty', () => {
      beforeEach(() => {
        component = instanceRender(<ChatPopup showCta={false} agentName='' />);
      });

      it(`does not render the element containing the agent's name`, () => {
        expect(component.renderAgentName())
          .toBeNull();
      });
    });
  });
});
