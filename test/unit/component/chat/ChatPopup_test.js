describe('ChatPopup component', () => {
  let ChatPopup;
  const chatPopupPath = buildSrcPath('component/chat/ChatPopup');

  beforeEach(() => {
    resetDOM();
    mockery.enable();

    initMockRegistry({
      './ChatPopup.sass': {
        locals: {
          'leftCtaBtn': 'leftCtaBtnClasses',
          'rightCtaBtn': 'rightCtaBtnClasses',
          'container': 'containerClasses'
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

  describe('props', () => {
    let componentNode,
      leftCtaFnSpy,
      rightCtaFnSpy;

    describe('leftCtaFn', () => {
      describe('when cta is shown', () => {
        beforeEach(() => {
          leftCtaFnSpy = jasmine.createSpy('leftCtaFn');

          const component = domRender(<ChatPopup showCta={true} leftCtaFn={leftCtaFnSpy} />);

          componentNode = ReactDOM.findDOMNode(component);
        });

        it('calls leftCtaFn when ctaBtn is clicked', () => {
          componentNode.querySelector('.leftCtaBtnClasses').click();

          expect(leftCtaFnSpy)
            .toHaveBeenCalled();
        });
      });

      describe('when cta is not shown', () => {
        beforeEach(() => {
          leftCtaFnSpy = jasmine.createSpy('leftCtaFn');

          const component = domRender(<ChatPopup showCta={false} leftCtaFn={leftCtaFnSpy} />);

          componentNode = ReactDOM.findDOMNode(component);
        });

        it('does not render the cta element', () => {
          expect(componentNode.querySelector('.leftCtaBtnClasses'))
            .toBeNull();
        });
      });
    });

    describe('rightCtaFn', () => {
      describe('when cta is shown', () => {
        beforeEach(() => {
          rightCtaFnSpy = jasmine.createSpy('rightCtaFnSpy');

          const component = domRender(<ChatPopup showCta={true} rightCtaFn={rightCtaFnSpy} />);

          componentNode = ReactDOM.findDOMNode(component);
        });

        it('calls rightCtaFn when ctaBtn is clicked', () => {
          componentNode.querySelector('.rightCtaBtnClasses').click();

          expect(rightCtaFnSpy)
            .toHaveBeenCalled();
        });
      });

      describe('when cta is not shown', () => {
        beforeEach(() => {
          rightCtaFnSpy = jasmine.createSpy('rightCtaFnSpy');

          const component = domRender(<ChatPopup showCta={false} rightCtaFn={rightCtaFnSpy} />);

          componentNode = ReactDOM.findDOMNode(component);
        });

        it('does not render the cta element', () => {
          expect(componentNode.querySelector('.rightCtaBtnClasses'))
            .toBeNull();
        });
      });
    });

    describe('childrenOnClick', () => {
      let childrenOnClickSpy;

      describe('when the container of child content has been clicked', () => {
        beforeEach(() => {
          childrenOnClickSpy = jasmine.createSpy();

          const component = domRender(<ChatPopup childrenOnClick={childrenOnClickSpy} />);

          componentNode = ReactDOM.findDOMNode(component);
        });

        it('calls childrenOnClick', () => {
          const childrenContainer = componentNode.querySelector('.containerClasses').firstChild;

          childrenContainer.click();

          expect(childrenOnClickSpy)
            .toHaveBeenCalled();
        });
      });

      describe('when the container of child content has not been clicked', () => {
        beforeEach(() => {
          childrenOnClickSpy = jasmine.createSpy();

          const component = domRender(<ChatPopup childrenOnClick={childrenOnClickSpy} />);

          componentNode = ReactDOM.findDOMNode(component);
        });

        it('does not call childrenOnClick', () => {
          expect(childrenOnClickSpy)
            .not.toHaveBeenCalled();
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
});
