describe('Frame', () => {
  let Frame,
    mockWindowHeight,
    mockRegistryMocks,
    mockChild,
    mockSettingsValue,
    mockIsRTLValue,
    mockLocaleValue,
    mockZoomSizingRatioValue,
    mockUpdateWidgetShown,
    mockWidgetHideAnimationComplete,
    mockIsPopout = false,
    renderedFrame,
    mockHorizontalPosition;

  const FramePath = buildSrcPath('component/frame/Frame');
  const MAX_WIDGET_HEIGHT = 550;
  const MIN_WIDGET_HEIGHT = 150;
  const WIDGET_WIDTH = 342;

  class MockEmbedWrapper extends Component {
    constructor(props, context) {
      super(props, context);
      this.embed = null;
      this.nav = {
        forceUpdate: noop
      };
    }

    setCustomCSS() {}

    render() {
      const newChild = React.cloneElement(this.props.children, {
        ref: 'rootComponent'
      });

      return <div id='Embed' ref={(el) => {this.embed = el;}}>{newChild}</div>;
    }
  }

  class MockChildComponent extends Component {
    constructor(props) {
      super(props);
      this.onClick = props.onClickHandler;
      this.onSubmit = props.onSubmitHandler;
      this.setOffsetHorizontal = props.setOffsetHorizontal;
      this.getActiveComponent = () => this.refs.activeComponent;
    }
    componentWillUnmount() {}
    render() {
      return <div className='mock-component' refs='activeComponent' />;
    }
  }
  mockHorizontalPosition = 'right';

  beforeEach(() => {
    mockery.enable();
    renderedFrame = null;
    mockIsRTLValue = false;
    mockLocaleValue = 'en-US';
    mockZoomSizingRatioValue = 1;
    mockWindowHeight = 1000;

    mockSettingsValue = {
      offset: { vertical: 0, horizontal: 0 },
      zIndex: 999999,
      position: { vertical: 'bottom' }
    };

    mockUpdateWidgetShown = jasmine.createSpy('updateWidgetShown');
    mockWidgetHideAnimationComplete = jasmine.createSpy('widgetHideAnimationComplete');

    mockRegistryMocks = {
      'React': React,
      './Frame.scss': {
        locals: {}
      },
      'utility/utils': {
        cssTimeToMs: () => 300
      },
      'utility/globals': {
        win: {
          innerWidth: 100,
          innerHeight: mockWindowHeight
        },
        isPopout: () => mockIsPopout
      },
      'utility/color/styles': {},
      'utility/devices': {
        getZoomSizingRatio: () => {
          return mockZoomSizingRatioValue;
        },
        isFirefox: () => {
          return false;
        }
      },
      'service/i18n': {
        i18n: {
          t: noop,
          isRTL: () => mockIsRTLValue,
          getLocale: () => mockLocaleValue
        }
      },
      'service/settings': {
        settings: {
          get: (name) => _.get(mockSettingsValue, name, null)
        }
      },
      'component/frame/EmbedWrapper': {
        EmbedWrapper: MockEmbedWrapper
      },
      'src/redux/modules/settings/settings-selectors': {},
      'src/redux/modules/base/base-actions': {
        updateWidgetShown: mockUpdateWidgetShown,
        widgetHideAnimationComplete: mockWidgetHideAnimationComplete
      },
      'constants/shared': {
        FONT_SIZE: 14,
        MAX_WIDGET_HEIGHT,
        MIN_WIDGET_HEIGHT,
        WIDGET_WIDTH
      },
      'lodash': _,
      'component/Icon': {
        Icon: noop
      },
      'src/redux/modules/selectors': {
        getFixedStyles: () => {}
      },
      'src/redux/modules/base/base-selectors': {
        getFrameVisible: () => {}
      }
    };

    jasmine.clock().install();
    initMockRegistry(mockRegistryMocks);

    mockChild = (<MockChildComponent className='mock-component' />);

    Frame = requireUncached(FramePath).default.WrappedComponent;
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  // force frame document readyState to complete
  const forceFrameReady = (frame) => {
    const doc = frame.getContentWindow().document;

    spyOnProperty(doc, 'readyState').and.returnValue('complete');
    jasmine.clock().tick();
  };

  const renderFrame = (props = {}) => {
    const defaultProps = {
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      isMobile: false
    };
    const mergedProps = { ...defaultProps, ...props };

    renderedFrame = domRender(<Frame {...mergedProps}>{mockChild}</Frame>);
    forceFrameReady(renderedFrame);
  };

  describe('getRootComponent', () => {
    let frame;

    beforeEach(() => {
      frame = domRender(<Frame>{mockChild}</Frame>);
      forceFrameReady(frame);
    });

    it('should return the child component when called', () => {
      expect(frame.getRootComponent().props.className)
        .toEqual('mock-component');
    });
  });

  describe('componentDidUpdate', () => {
    let frame;

    beforeEach(() => {
      frame = domRender(<Frame color='#ffffff'>{mockChild}</Frame>);
      forceFrameReady(frame);
      spyOn(frame, 'setCustomCSS');
      spyOn(frame, 'generateUserCSSWithColor');
      frame.componentDidUpdate();
    });

    it('calls setCustomCSS', () => {
      expect(frame.setCustomCSS)
        .toHaveBeenCalled();
    });

    it('calls generateUserCSSWithColor with correct colour', () => {
      expect(frame.generateUserCSSWithColor)
        .toHaveBeenCalledWith('#ffffff');
    });
  });

  describe('getChild', () => {
    let frame;

    beforeEach(() => {
      frame = domRender(<Frame name='Nick'>{mockChild}</Frame>);
      forceFrameReady(frame);
    });

    it('should return a react component with the name passed in', () => {
      expect(frame.child.props.name)
        .toEqual('Nick');
    });
  });

  describe('updateFrameLocale', () => {
    let frame,
      documentElem;

    describe('when frame child exists', () => {
      beforeEach(() => {
        frame = domRender(<Frame>{mockChild}</Frame>);
        forceFrameReady(frame);
        spyOn(frame, 'forceUpdateWorld');
        frame.updateFrameLocale();
      });

      it('calls forceUpdateWorld', () => {
        expect(frame.forceUpdateWorld)
          .toHaveBeenCalled();
      });
    });

    describe('when the locale is RTL', () => {
      beforeEach(() => {
        mockIsRTLValue = true;
        mockLocaleValue = 'ar';

        frame = domRender(<Frame>{mockChild}</Frame>);
        spyOn(frame, 'forceUpdateWorld');
        frame.updateFrameLocale();
        documentElem = frame.getContentDocument().documentElement;

        jasmine.clock().tick();
      });

      it('should update html lang attribute', () => {
        expect(documentElem.lang)
          .toEqual(mockLocaleValue);
      });

      it('should update html dir attribute to rtl', () => {
        expect(documentElem.dir)
          .toEqual('rtl');
      });
    });

    describe('when the locale is LTR', () => {
      beforeEach(() => {
        mockIsRTLValue = false;
        mockLocaleValue = 'en-GB';

        frame = domRender(<Frame>{mockChild}</Frame>);
        spyOn(frame, 'forceUpdateWorld');
        frame.updateFrameLocale();
        documentElem = frame.getContentDocument().documentElement;

        jasmine.clock().tick();
      });

      it('should update html lang attribute', () => {
        expect(documentElem.lang)
          .toEqual(mockLocaleValue);
      });

      it('should update html dir attribute to ltr', () => {
        expect(documentElem.dir)
          .toEqual('ltr');
      });
    });
  });

  describe('show', () => {
    let frame, mockOnShow, frameProps, mockAfterShowAnimate;
    const animationDuration = 300;

    beforeEach(() => {
      mockOnShow = jasmine.createSpy('onShow');
      mockAfterShowAnimate = jasmine.createSpy('afterShowAnimate');

      frameProps = {
        transitions: {
          upShow: {
            start: { transitionDuration: `${animationDuration}ms` },
            end: { transitionDuration: `${animationDuration}ms` }
          }
        },
        onShow: mockOnShow,
        afterShowAnimate: mockAfterShowAnimate,
        store: {
          dispatch: noop
        }
      };

      frame = domRender(<Frame {...frameProps}>{mockChild}</Frame>);
      forceFrameReady(frame);

      frame.show();
    });

    it('triggers onShow callback', () => {
      expect(mockOnShow)
        .toHaveBeenCalled();
    });

    it('calls afterShowAnimate', () => {
      jasmine.clock().tick(animationDuration);

      expect(mockAfterShowAnimate)
        .toHaveBeenCalled();
    });

    it('applies webkitOverflowScrolling when not set', () => {
      jasmine.clock().tick(50);

      const frameContainerStyle = frame.getRootComponentElement().style;

      expect(frameContainerStyle.webkitOverflowScrolling)
        .toEqual('touch');
    });

    describe('when the name is not launcher', () => {
      beforeEach(() => {
        mockUpdateWidgetShown.calls.reset();

        frame = domRender(<Frame name='webWidget' updateWidgetShown={mockUpdateWidgetShown} />);
        frame.show();
      });

      it('calls updateWidgetShown with true', () => {
        expect(mockUpdateWidgetShown)
          .toHaveBeenCalledWith(true);
      });
    });

    describe('when the name is launcher', () => {
      beforeEach(() => {
        mockUpdateWidgetShown.calls.reset();

        frame = domRender(<Frame name='launcher' updateWidgetShown={mockUpdateWidgetShown} />);
        frame.show();
      });

      it('does not call updateWidgetShown', () => {
        expect(mockUpdateWidgetShown)
          .not.toHaveBeenCalled();
      });
    });
  });

  describe('forceUpdateWorld', () => {
    let frame, rootComponent, activeComponentForceUpdateSpy;

    beforeEach(() => {
      frame = domRender(<Frame>{mockChild}</Frame>);
      forceFrameReady(frame);

      rootComponent = frame.getRootComponent();
      activeComponentForceUpdateSpy = jasmine.createSpy('activeComponent.forceUpdate');

      spyOn(rootComponent, 'getActiveComponent').and.returnValue({ forceUpdate: activeComponentForceUpdateSpy });

      spyOn(frame.child, 'forceUpdate');
      spyOn(frame.child.nav, 'forceUpdate');

      frame.forceUpdateWorld();
    });

    it('calls forceUpdate on the child', () => {
      expect(frame.child.forceUpdate)
        .toHaveBeenCalled();
    });

    it('calls forceUpdate on the child nav', () => {
      expect(frame.child.nav.forceUpdate)
        .toHaveBeenCalled();
    });

    it('calls forceUpdate on the active component', () => {
      expect(activeComponentForceUpdateSpy)
        .toHaveBeenCalled();
    });
  });

  describe('hide', () => {
    let frame, mockOnHide, frameProps;

    beforeEach(() => {
      mockOnHide = jasmine.createSpy('onHide');
      frameProps = {
        onHide: mockOnHide,
        widgetHideAnimationComplete: mockWidgetHideAnimationComplete
      };

      frame = domRender(<Frame {...frameProps}>{mockChild}</Frame>);
      forceFrameReady(frame);

      frame.hide();

      jasmine.clock().tick(300);
    });

    it('triggers props.callbacks.onHide if set', () => {
      expect(mockOnHide)
        .toHaveBeenCalled();
    });

    it('calls widgetHideAnimationComplete', () => {
      expect(mockWidgetHideAnimationComplete)
        .toHaveBeenCalled();
    });

    describe('when options.onHide is defined', () => {
      let onHideSpy;

      beforeEach(() => {
        onHideSpy = jasmine.createSpy('onHide');

        frame.hide({ transition: 'none', onHide: onHideSpy });
      });

      it('calls options.onHide', () => {
        expect(onHideSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when the name is not launcher', () => {
      beforeEach(() => {
        frameProps = {
          name: 'webWidget',
          updateWidgetShown: mockUpdateWidgetShown
        };

        frame = domRender(<Frame {...frameProps} />);
        frame.hide();
      });

      it('calls updateWidgetShown with false', () => {
        expect(mockUpdateWidgetShown)
          .toHaveBeenCalledWith(false);
      });
    });

    describe('when the name is launcher', () => {
      beforeEach(() => {
        frameProps = {
          name: 'launcher',
          updateWidgetShown: mockUpdateWidgetShown
        };

        mockUpdateWidgetShown.calls.reset();

        frame = domRender(<Frame {...frameProps} />);
        frame.hide();
      });

      it('does not call updateWidgetShown', () => {
        expect(mockUpdateWidgetShown)
          .not.toHaveBeenCalled();
      });
    });
  });

  describe('back', () => {
    let frame, mockOnBack;

    beforeEach(() => {
      mockOnBack = jasmine.createSpy('onBack');

      frame = domRender(<Frame onBack={mockOnBack}>{mockChild}</Frame>);
      forceFrameReady(frame);

      frame.back({ preventDefault: noop });
    });

    it('should call props.callbacks.onBack', () => {
      expect(mockOnBack)
        .toHaveBeenCalled();
    });
  });

  describe('onShowAnimationComplete', () => {
    let frame, widgetShowAnimationCompleteSpy, frameName;

    beforeEach(() => {
      widgetShowAnimationCompleteSpy = jasmine.createSpy('widgetShowAnimationComplete');

      frame = domRender(
        <Frame widgetShowAnimationComplete={widgetShowAnimationCompleteSpy}
          name={frameName}>{mockChild}</Frame>
      );
      forceFrameReady(frame);

      frame.onShowAnimationComplete({ preventDefault: noop });
    });

    describe('when frame name is webWidget', () => {
      beforeAll(() => {
        frameName = 'webWidget';
      });

      it('calls props.widgetShowAnimationComplete', () => {
        expect(widgetShowAnimationCompleteSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when frame name is not webWidget', () => {
      beforeAll(() => {
        frameName = 'launcher';
      });

      it('does not call props.widgetShowAnimationComplete', () => {
        expect(widgetShowAnimationCompleteSpy)
          .not.toHaveBeenCalled();
      });
    });
  });

  describe('computeIframeStyle', () => {
    let frame;

    describe('props.frameStyleModifier', () => {
      let frameStyleModifierSpy,
        result;

      describe('when frameStyleModifier exists', () => {
        const modifiedFrameStyle = { marginTop: '10px', marginLeft: '55px' };

        beforeEach(() => {
          frameStyleModifierSpy = jasmine.createSpy('frameStyleModifier').and.returnValue(modifiedFrameStyle);
          frame = domRender(<Frame frameStyleModifier={frameStyleModifierSpy}>{mockChild}</Frame>);
          forceFrameReady(frame);
          result = frame.computeIframeStyle();
        });

        it('modified frameStyle should contain at least 1 property', () => {
          expect(_.keys(modifiedFrameStyle).length)
            .toBeGreaterThan(0);
        });

        it('computeIframeStyle should contain styles from the modification', () => {
          expect(result)
            .toEqual(jasmine.objectContaining(modifiedFrameStyle));
        });
      });

      describe('when frameStyleModifier does not exist', () => {
        const frameStyle = { marginRight: '22px', marginLeft: '10px', marginTop: '66px' };

        beforeEach(() => {
          frameStyleModifierSpy = jasmine.createSpy('frameStyleModifier').and.returnValue(undefined);
          frame = domRender(<Frame frameStyle={frameStyle}>{mockChild}</Frame>);
          forceFrameReady(frame);
          result = frame.computeIframeStyle();
        });

        it('computeIframeStyle should contain styles from frameStyle', () => {
          expect(result)
            .toEqual(jasmine.objectContaining(frameStyle));
        });
      });
    });

    describe('zIndex', () => {
      let frame;

      beforeEach(() => {
        frame = domRender(<Frame zIndex={10001}>{mockChild}</Frame>);
        forceFrameReady(frame);
      });

      it('uses the value from props if it exists', () => {
        expect(frame.computeIframeStyle().zIndex)
          .toBe(10001);
      });
    });

    describe('fixedStyles prop', () => {
      let result;
      const frameStyle = { width: 0, height: 0, background: 'rgb(255, 255, 255)' };

      describe('when fixedStyles has properties', () => {
        const fixedStyles = { width: '10px', height: 'auto', background: 'transparent' };

        beforeEach(() => {
          frame = domRender(<Frame frameStyle={frameStyle} fixedStyles={fixedStyles}>{mockChild}</Frame>);
          forceFrameReady(frame);
          result = frame.computeIframeStyle();
        });

        it('computeIframeStyle should contain styles from the modification', () => {
          expect(result)
            .toEqual(jasmine.objectContaining(fixedStyles));
        });
      });

      describe('when frameStyleModifier does not exist', () => {
        beforeEach(() => {
          frame = domRender(<Frame frameStyle={frameStyle}>{mockChild}</Frame>);
          forceFrameReady(frame);
          result = frame.computeIframeStyle();
        });

        it('computeIframeStyle should contain styles from frameStyle', () => {
          expect(result)
            .toEqual(jasmine.objectContaining(frameStyle));
        });
      });
    });
  });

  describe('getOffsetPosition', () => {
    describe('vertical', () => {
      describe('when settings sets position to top', () => {
        beforeEach(() => {
          renderFrame({ verticalPosition: 'top', horizontalPosition: 'right' });
        });

        it('should have top classes', () => {
          expect(renderedFrame.getOffsetPosition().top)
            .toBeDefined();
          expect(renderedFrame.getOffsetPosition().bottom)
            .toBeUndefined();
        });
      });
    });

    describe('horizontal', () => {
      describe('when set to right', () => {
        beforeEach(() => {
          renderFrame({ verticalPosition: 'top', horizontalPosition: 'right' });
        });

        it('has right offset', () => {
          expect(renderedFrame.getOffsetPosition().right)
            .toBeDefined();

          expect(renderedFrame.getOffsetPosition().left)
            .toBeUndefined();
        });
      });

      describe('when set to left', () => {
        beforeEach(() => {
          renderFrame({ verticalPosition: 'top', horizontalPosition: 'left' });
        });
        it('has left offsett', () => {
          expect(renderedFrame.getOffsetPosition().left)
            .toBeDefined();

          expect(renderedFrame.getOffsetPosition().right)
            .toBeUndefined();
        });
      });
    });
  });

  describe('offset', () => {
    const desktopOnlyOffset = {
      vertical: 31,
      horizontal: 52
    };
    const mobileOnlyOffset = {
      mobile: {
        horizontal: 100,
        vertical: 200
      }
    };
    const desktopAndMobileOffset = {
      horizontal: 101,
      vertical: 102,
      mobile: {
        horizontal: 100,
        vertical: 200
      }
    };

    describe('when not on webWidget', () => {
      describe('when on desktop', () => {
        describe('when there is a desktop offset only', () => {
          beforeEach(() => {
            renderFrame({ offset: desktopOnlyOffset });
          });

          it('should apply the customized desktop offsets', () => {
            expect(renderedFrame.getOffsetPosition().bottom)
              .toBe(31);

            expect(renderedFrame.getOffsetPosition().right)
              .toBe(52);
          });
        });

        describe('when there is a mobile offset only', () => {
          beforeEach(() => {
            renderFrame({ offset: mobileOnlyOffset });
          });

          it('should not apply customized mobile offsets', () => {
            expect(renderedFrame.getOffsetPosition().bottom)
              .toBe(0);

            expect(renderedFrame.getOffsetPosition().right)
              .toBe(0);
          });
        });

        describe('when there are desktop and mobile offsets', () => {
          beforeEach(() => {
            renderFrame({ offset: desktopAndMobileOffset });
          });

          it('should apply only customized desktop offsets', () => {
            expect(renderedFrame.getOffsetPosition().bottom)
              .toBe(102);

            expect(renderedFrame.getOffsetPosition().right)
              .toBe(101);
          });
        });

        describe('when there is no offset', () => {
          beforeEach(() => {
            renderFrame({ offset: {} });
          });

          it('should default to 0', () => {
            expect(renderedFrame.getOffsetPosition().bottom)
              .toBe(0);

            expect(renderedFrame.getOffsetPosition().right)
              .toBe(0);
          });
        });

        describe('when an animationOffset is passed in', () => {
          beforeEach(() => {
            renderFrame({ offset: desktopOnlyOffset });
          });

          it('adds it to the vertical property', () => {
            expect(renderedFrame.getOffsetPosition(20).bottom)
              .toBe(51);
          });
        });

        describe('when on mobile', () => {
          describe('when there is a desktop offset only', () => {
            beforeEach(() => {
              renderFrame({ isMobile: true, offset: desktopOnlyOffset });
            });

            it('should not apply the customized desktop offsets', () => {
              expect(renderedFrame.getOffsetPosition().bottom)
                .toBe(0);

              expect(renderedFrame.getOffsetPosition().right)
                .toBe(0);
            });
          });

          describe('when there is a mobile offset only', () => {
            beforeEach(() => {
              renderFrame({ isMobile: true, offset: mobileOnlyOffset });
            });

            it('should apply customized mobile offsets', () => {
              expect(renderedFrame.getOffsetPosition().bottom)
                .toBe(200);

              expect(renderedFrame.getOffsetPosition().right)
                .toBe(100);
            });
          });

          describe('when there are desktop and mobile offsets', () => {
            beforeEach(() => {
              renderFrame({ isMobile: true, offset: desktopAndMobileOffset });
            });

            it('should apply only customized mobile offsets', () => {
              expect(renderedFrame.getOffsetPosition().bottom)
                .toBe(200);

              expect(renderedFrame.getOffsetPosition().right)
                .toBe(100);
            });
          });

          describe('when there is no offset', () => {
            beforeEach(() => {
              renderFrame({ isMobile: true, offset: {} });
            });

            it('should default to 0', () => {
              expect(renderedFrame.getOffsetPosition().bottom)
                .toBe(0);

              expect(renderedFrame.getOffsetPosition().right)
                .toBe(0);
            });
          });

          describe('when an animationOffset is passed in', () => {
            beforeEach(() => {
              renderFrame({ isMobile: true, offset: mobileOnlyOffset });
            });

            it('adds it to the vertical property', () => {
              expect(renderedFrame.getOffsetPosition(20).bottom)
                .toBe(220);
            });
          });
        });
      });

      describe('when on Web Widget', () => {
        describe('when on mobile', () => {
          beforeEach(() => {
            renderFrame({ name: 'webWidget', offset: desktopAndMobileOffset });
          });

          it('should apply the customized desktop offsets', () => {
            expect(renderedFrame.getOffsetPosition().bottom)
              .toBe(102);

            expect(renderedFrame.getOffsetPosition().right)
              .toBe(101);
          });
        });

        describe('and on mobile', () => {
          beforeEach(() => {
            renderFrame({ isMobile: true, name: 'webWidget', offset: desktopAndMobileOffset });
          });

          it('should not apply customized offsets', () => {
            expect(renderedFrame.getOffsetPosition()).toEqual({});
          });
        });
      });
    });
  });

  describe('render', () => {
    let frame, visibleValue = true;

    beforeEach(() => {
      frame = domRender(<Frame visible={visibleValue} name='foo' verticalPosition='bottom'>{mockChild}</Frame>);
      forceFrameReady(frame);
    });

    it('should render an iframe', () => {
      expect(frame.iframe)
        .toBeDefined();
    });

    it('should assign the correct classes', () => {
      expect(frame.iframe.className)
        .toContain('foo');
    });

    describe('when visible', () => {
      it('should have `--active` in classes', () => {
        expect(frame.iframe.className)
          .toContain('--active');
      });

      it('should set the tab index to 0', () => {
        expect(frame.iframe.attributes.tabindex.value)
          .toEqual('0');
      });

      it('has the correct animation styles applied to it', () => {
        expect(frame.iframe.style.getPropertyValue('opacity'))
          .toEqual('1');

        expect(frame.iframe.style.getPropertyValue('bottom'))
          .toEqual('0px');
      });
    });

    describe('when not visible', () => {
      beforeAll(() => {
        visibleValue = false;
      });

      it('should not have `--active` in classes', () => {
        expect(frame.iframe.className)
          .not.toContain('--active');
      });

      it('should set the tab index to -1', () => {
        expect(frame.iframe.attributes.tabindex.value)
          .toEqual('-1');
      });

      it('has the correct animation styles applied to it', () => {
        expect(frame.iframe.style.getPropertyValue('opacity'))
          .toEqual('0');
      });
    });
  });

  describe('renderFrameContent', () => {
    let frame,
      doc;

    beforeEach(() => {
      mockLocaleValue = 'fr';
      mockIsRTLValue = true;
    });

    describe('when the iframe\'s document is ready', () => {
      beforeEach(() => {
        frame = domRender(<Frame css='css-prop'>{mockChild}</Frame>);
        doc = frame.getContentWindow().document;

        spyOn(frame, 'updateFrameLocale');
        spyOnProperty(doc, 'readyState').and.returnValue('complete');
        jasmine.clock().tick(0);

        frame.setState({ childRendered: false });
      });

      it('should call updateFrameLocale ', () => {
        expect(frame.updateFrameLocale)
          .toHaveBeenCalled();
      });
    });

    describe('when the iframe\'s document is not ready', () => {
      beforeEach(() => {
        frame = domRender(<Frame css='css-prop'>{mockChild}</Frame>);
        doc = frame.getContentWindow().document;

        spyOn(frame, 'updateFrameLocale');
        spyOn(frame, 'renderFrameContent');
        spyOnProperty(doc, 'readyState').and.returnValue('loading');
        jasmine.clock().tick(0);
        frame.setState({ childRendered: false });
      });

      it('does not call updateFrameLocale ', () => {
        expect(frame.updateFrameLocale)
          .not.toHaveBeenCalled();
      });

      it('queues renderFrameContent at most once', () => {
        jasmine.clock().tick(0);
        expect(frame.renderFrameContent)
          .toHaveBeenCalledTimes(1);
      });
    });

    describe('on document complete', () => {
      beforeEach(() => {
        frame = domRender(<Frame css='css-prop'>{mockChild}</Frame>);
        forceFrameReady(frame);
        jasmine.clock().tick();

        frame.setState({ childRendered: false });
      });

      it('sets rtl and lang attr on the frame', () => {
        expect(frame.getContentDocument().documentElement.lang)
          .toBe('fr');

        expect(frame.getContentDocument().documentElement.dir)
          .toBe('rtl');
      });

      it('should sets the state childRendered to true', () => {
        expect(frame.state.childRendered)
          .toEqual(true);
      });

      describe('constructEmbed', () => {
        it('adds getFrameContentDocument to the child component', () => {
          expect(frame.getRootComponent().props.getFrameContentDocument)
            .toBeDefined();
        });

        it('adds onBackButtonClick to the child component', () => {
          expect(frame.getRootComponent().props.onBackButtonClick)
            .toBeDefined();
        });

        it('adds forceUpdateWorld to the child component', () => {
          expect(frame.getRootComponent().props.forceUpdateWorld)
            .toBeDefined();
        });

        it('adds css styles to the element', () => {
          expect(frame.getChild().props.baseCSS)
            .toContain('css-prop');
        });
      });
    });
  });

  describe('getDefaultDimensions', () => {
    let mockFullscreenable, mockIsMobile;

    const expectedMobileDimensions = {
      width: '100%',
      maxWidth: '100%',
      height: '100%'
    };
    const expectedDesktopDimensions = {
      width: `${WIDGET_WIDTH + 15}px`,
      height: '100%',
      maxHeight: `${MAX_WIDGET_HEIGHT + 15}px`,
      minHeight: `${MIN_WIDGET_HEIGHT}px`
    };
    const expectedDesktopPopoutDimensions = {
      ...expectedMobileDimensions,
      right: '50%',
      background: '#EEE'
    };
    const expectedDesktopPopoutLeftDimensions = {
      ...expectedMobileDimensions,
      left: undefined,
      background: '#EEE'
    };

    beforeEach(() => {
      renderFrame({
        isMobile: mockIsMobile,
        horizontalPosition: mockHorizontalPosition,
        fullscreen: mockIsPopout,
        fullscreenable: mockFullscreenable
      });
    });

    describe('when mobile', () => {
      beforeAll(() => {
        mockIsMobile = true;
      });

      describe('when fullscreenable is true', () => {
        beforeAll(() => {
          mockFullscreenable = true;
        });

        it('returns the expected mobile dimensions', () => {
          expect(renderedFrame.getDefaultDimensions())
            .toEqual(expectedMobileDimensions);
        });
      });

      describe('when fullscreenable is false', () => {
        beforeAll(() => {
          mockFullscreenable = false;
        });

        it('returns the expected desktop dimensions', () => {
          expect(renderedFrame.getDefaultDimensions())
            .toEqual(expectedDesktopDimensions);
        });
      });
    });

    describe('on desktop', () => {
      beforeAll(() => {
        mockIsMobile = false;
      });

      it('returns the expected mobile dimensions', () => {
        expect(renderedFrame.getDefaultDimensions())
          .toEqual(expectedDesktopDimensions);
      });

      describe('when Popout', () => {
        beforeAll(() => {
          mockIsPopout = true;
          mockFullscreenable = true;
        });

        it('returns the expected popout dimensions', () => {
          expect(renderedFrame.getDefaultDimensions())
            .toEqual(expectedDesktopPopoutDimensions);
        });

        describe('when position left is true', () => {
          beforeAll(() => {
            mockHorizontalPosition = 'left';
          });

          it('returns the expected popout dimensions', () => {
            expect(renderedFrame.getDefaultDimensions())
              .toEqual(expectedDesktopPopoutLeftDimensions);
          });
        });
      });
    });
  });

  describe('setCustomCSS', () => {
    let frame;

    beforeEach(() => {
      frame = domRender(<Frame generateUserCSS={_.identity} color='black'>{mockChild}</Frame>);
      spyOn(frame, 'setCustomCSS');
    });

    it('calls setCustomCSS if the colors change', () => {
      frame.componentWillReceiveProps({ color: 'white' });
      expect(frame.setCustomCSS)
        .toHaveBeenCalledWith('white');
    });

    it('does not call setCustomCSS if the colors do not change', () => {
      frame.componentWillReceiveProps({ color: 'black' });
      expect(frame.setCustomCSS)
        .not.toHaveBeenCalled();
    });
  });
});
