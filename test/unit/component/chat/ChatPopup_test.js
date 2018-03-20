describe('ChatPopup component', () => {
  let ChatPopup;
  const chatPopupPath = buildSrcPath('component/chat/ChatPopup');

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      './ChatPopup.scss': {
        locals: {
          'leftCtaBtn': 'leftCtaBtnClasses',
          'rightCtaBtn': 'rightCtaBtnClasses',
          'container': 'containerClasses',
          'closeIcon': 'closeIconClasses'
        }
      },
      'component/Avatar': {
        Avatar: noopReactComponent()
      },
      'component/Icon': {
        Icon: class extends Component {
          render() {
            const { className, onClick } = this.props;

            return (
              <div onClick={onClick} className={className} />
            );
          }
        }
      },
      'component/button/Button': {
        Button: class extends Component {
          render() {
            const { className, disabled, onClick } = this.props;

            return (
              <input className={className} disabled={disabled} onClick={onClick} />
            );
          }
        }
      },
      'component/transition/SlideUpAppear': {
        SlideUpAppear: noopReactComponent()
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

  describe('dismiss', () => {
    let componentNode,
      closeSpy;

    describe('when isDismissible is true', () => {
      beforeEach(() => {
        closeSpy = jasmine.createSpy();

        const component = domRender(<ChatPopup isDismissible={true} onCloseIconClick={closeSpy} />);

        componentNode = ReactDOM.findDOMNode(component);
      });

      it('renders close icon', () => {
        expect(componentNode.querySelector('.closeIconClasses'))
          .not.toBeNull();
      });

      it('calls onCloseIconClick when close icon is clicked', () => {
        componentNode.querySelector('.closeIconClasses').click();

        expect(closeSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when isDismissible is false', () => {
      beforeEach(() => {
        const component = domRender(<ChatPopup isDismissible={false} />);

        componentNode = ReactDOM.findDOMNode(component);
      });

      it('does not render close icon', () => {
        expect(componentNode.querySelector('.closeIconClasses'))
          .toBeNull();
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

  describe('cta disable', () => {
    let component,
      componentNode;

    describe('when rightCtaDisabled is true', () => {
      beforeEach(() => {
        component = domRender(<ChatPopup rightCtaDisabled={true} />);
        componentNode = ReactDOM.findDOMNode(component);
      });

      it('renders the right cta button with disabled true', () => {
        expect(componentNode.querySelector('.rightCtaBtnClasses').disabled)
          .toBe(true);
      });
    });

    describe('when rightCtaDisabled is false', () => {
      beforeEach(() => {
        component = domRender(<ChatPopup rightCtaDisabled={false} />);
        componentNode = ReactDOM.findDOMNode(component);
      });

      it('renders the right cta button with disabled false', () => {
        expect(componentNode.querySelector('.rightCtaBtnClasses').disabled)
          .toBe(false);
      });
    });
  });
});
