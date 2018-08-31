describe('ChatPopup component', () => {
  let ChatPopup;
  const chatPopupPath = buildSrcPath('component/chat/ChatPopup');
  const Button = (
    class extends Component {
      render() {
        const { className, disabled, onClick } = this.props;

        return (
          <input className={className} disabled={disabled} onClick={onClick} />
        );
      }
    }
  );

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      './ChatPopup.scss': {
        locals: {
          'leftCtaBtn': 'leftCtaBtnClasses',
          'rightCtaBtn': 'rightCtaBtnClasses',
          'container': 'containerClasses',
          'closeIcon': 'closeIconClasses',
          'popupContainerMobile': 'popupContainerMobileClasses',
          'hidden': 'hiddenClasses',
          'overlayMobile': 'overlayMobileClasses',
          'wrapperMobile': 'wrapperMobileClasses',
          'ctaContainer': 'ctaContainer',
          'ctaContainerNoCenter': 'ctaContainerNoCenter',
          'fullWidthButton': 'fullWidthButton',
          'ctaBtnMobile': 'ctaBtnMobile'
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
      '@zendeskgarden/react-buttons': {
        Button
      },
      'component/transition/SlideAppear': {
        SlideAppear: noopReactComponent()
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
      let mockShowOnlyLeftCta,
        result;

      beforeEach(() => {
        component = instanceRender(<ChatPopup showCta={true} showOnlyLeftCta={mockShowOnlyLeftCta}/>);
        result = component.renderCta();
      });

      it('renders the cta element', () => {
        expect(component.renderCta())
          .not.toBeNull();
      });

      describe('when showOnlyLeftCta is false', () => {
        beforeAll(() => {
          mockShowOnlyLeftCta = false;
        });

        it('renders both the left and right buttons', () => {
          expect(TestUtils.isElementOfType(result.props.children[0], Button))
            .toEqual(true);

          expect(TestUtils.isElementOfType(result.props.children[1], Button))
            .toEqual(true);

          expect(result.props.children.length)
            .toEqual(2);
        });

        it('renders ctaContainer class', () => {
          expect(result.props.className)
            .toContain('ctaContainer');
          expect(result.props.className)
            .not
            .toContain('ctaContainerNoCenter');
        });

        it('does not render fullWidthButton', () => {
          expect(result.props.children[0].props.className)
            .not
            .toContain('fullWidthButton');
        });

        it('renders leftCtaButton class', () => {
          expect(result.props.children[0].props.className)
            .toContain('leftCtaBtnClasses');
        });
      });

      describe('when showOnlyLeftCta is true', () => {
        beforeAll(() => {
          mockShowOnlyLeftCta = true;
        });

        it('renders only left button', () => {
          expect(TestUtils.isElementOfType(result.props.children[0], Button))
            .toEqual(true);

          expect(result.props.children[1])
            .toEqual(null);
        });

        it('renders ctaContainerNoCenter class', () => {
          expect(result.props.className)
            .not
            .toEqual('ctaContainer');
          expect(result.props.className)
            .toContain('ctaContainerNoCenter');
        });

        it('renders fullWidthButton', () => {
          expect(result.props.children[0].props.className)
            .toContain('fullWidthButton');
        });

        it('does not render leftCtaButton class', () => {
          expect(result.props.children[0].props.className)
            .not
            .toContain('leftCtaBtnClasses');
        });
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

  describe('mobile overlay', () => {
    let component,
      result;

    const render = ({ isMobile = true, useOverlay = true, show }) => {
      component = instanceRender(
        <ChatPopup
          isMobile={isMobile}
          useOverlay={useOverlay}
          show={show} />
      );
      result = component.render();
    };

    beforeEach(() => {
      render({ isMobile: true, useOverlay: true });
    });

    describe('container', () => {
      it('has correct classnames when it should be hidden', () => {
        expect(result.props.className)
          .toContain('popupContainerMobileClasses');
        expect(result.props.className)
          .toContain('hiddenClasses');
      });

      it('has correct classnames when it should be visible', () => {
        render({ show: true });

        expect(result.props.className)
          .toContain('popupContainerMobileClasses');
        expect(result.props.className)
          .not.toContain('hiddenClasses');
      });
    });

    describe('overlay', () => {
      it('has correct classnames', () => {
        const overlay = result.props.children[0];

        expect(overlay.props.className)
          .toContain('overlayMobileClasses');
      });
    });

    describe('SlideAppear', () => {
      let slideAppear;

      beforeEach(() => {
        slideAppear = result.props.children[1];
      });

      it('has correct direction', () => {
        expect(slideAppear.props.direction)
          .toEqual('down');
      });

      it('has correct start/end positions', () => {
        expect(slideAppear.props.startPosHeight)
          .toEqual('-10px');
        expect(slideAppear.props.endPosHeight)
          .toEqual('0px');
      });

      it('has correct classnames', () => {
        expect(slideAppear.props.className)
          .toContain('wrapperMobileClasses');
      });
    });
  });

  describe('onEntered', () => {
    let component, focusSpy;

    beforeEach(() => {
      component = domRender(<ChatPopup />);

      focusSpy = jasmine.createSpy('focus');
      component.firstButton = {
        focus: focusSpy
      };

      component.onEntered();
    });

    it('calls focus on the firstButton', () => {
      expect(focusSpy)
        .toHaveBeenCalled();
    });
  });
});
