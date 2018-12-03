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
    mockIsPopout = false;

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

  beforeEach(() => {
    mockery.enable();

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
        mockSettingsValue = { zIndex: 10001 };

        frame = domRender(<Frame>{mockChild}</Frame>);
        forceFrameReady(frame);
      });

      it('uses the value from settings if it exists', () => {
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
    let frame;

    describe('vertical', () => {
      beforeEach(() => {
        frame = domRender(<Frame>{mockChild}</Frame>);
        forceFrameReady(frame);
      });

      it('should have bottom classes by default', () => {
        expect(frame.getOffsetPosition().bottom)
          .toBeDefined();

        expect(frame.getOffsetPosition().top)
          .toBeUndefined();
      });

      describe('when settings sets position to top', () => {
        beforeEach(() => {
          mockSettingsValue = { position: { vertical: 'top' } };

          frame = domRender(<Frame>{mockChild}</Frame>);
        });

        it('should have top classes', () => {
          expect(frame.getOffsetPosition().top)
            .toBeDefined();

          expect(frame.getOffsetPosition().bottom)
            .toBeUndefined();
        });
      });
    });

    describe('horizontal', () => {
      beforeEach(() => {
        frame = domRender(<Frame>{mockChild}</Frame>);
        forceFrameReady(frame);
      });

      it('should have right classes by default', () => {
        expect(frame.getOffsetPosition().right)
          .toBeDefined();

        expect(frame.getOffsetPosition().left)
          .toBeUndefined();
      });

      it('can be changed by the position prop', () => {
        frame = domRender(<Frame position='left'>{mockChild}</Frame>);

        expect(frame.getOffsetPosition().left)
          .toBeDefined();

        expect(frame.getOffsetPosition().right)
          .toBeUndefined();
      });

      describe('when settings sets position', () => {
        beforeEach(() => {
          mockSettingsValue = { position: { horizontal: 'left' } };

          frame = domRender(<Frame>{mockChild}</Frame>);
        });

        it('uses that setting over the prop', () => {
          expect(frame.getOffsetPosition().left)
            .toBeDefined();

          expect(frame.getOffsetPosition().right)
            .toBeUndefined();
        });
      });
    });
  });

  describe('offset', () => {
    let frame, mockIsMobile;
    const desktopOnlyOffset = {
      offset: {
        vertical: 31,
        horizontal: 52
      }
    };
    const mobileOnlyOffset = {
      offset: {
        mobile: {
          horizontal: 100,
          vertical: 200
        }
      }
    };
    const desktopAndMobileOffset = {
      offset: {
        horizontal: 101,
        vertical: 102,
        mobile: {
          horizontal: 100,
          vertical: 200
        }
      }
    };

    describe('when on desktop', () => {
      beforeEach(() => {
        mockIsMobile = false;
      });

      describe('when on launcher', () => {
        beforeEach(() => {
          frame = domRender(<Frame isMobile={mockIsMobile} name='launcher'>{mockChild}</Frame>);
          forceFrameReady(frame);
        });

        describe('when there is a desktop offset only', () => {
          beforeEach(() => {
            mockSettingsValue = desktopOnlyOffset;
          });

          it('should apply the customized desktop offsets', () => {
            expect(frame.getOffsetPosition().bottom)
              .toBe(31);

            expect(frame.getOffsetPosition().right)
              .toBe(52);
          });
        });

        describe('when there is a mobile offset only', () => {
          beforeEach(() => {
            mockSettingsValue = mobileOnlyOffset;
          });

          it('should not apply customized mobile offsets', () => {
            expect(frame.getOffsetPosition().bottom)
              .toBe(0);

            expect(frame.getOffsetPosition().right)
              .toBe(0);
          });
        });

        describe('when there are desktop and mobile offsets', () => {
          beforeEach(() => {
            mockSettingsValue = desktopAndMobileOffset;
          });

          it('should apply only customized desktop offsets', () => {
            expect(frame.getOffsetPosition().bottom)
              .toBe(102);

            expect(frame.getOffsetPosition().right)
              .toBe(101);
          });
        });

        describe('when there is no offset', () => {
          beforeEach(() => {
            mockSettingsValue = {};
          });

          it('should not apply any offsets', () => {
            expect(frame.getOffsetPosition().bottom)
              .toBe(0);

            expect(frame.getOffsetPosition().right)
              .toBe(0);
          });
        });
      });

      describe('when on Web Widget', () => {
        beforeEach(() => {
          frame = domRender(<Frame name='webWidget' isMobile={mockIsMobile}>{mockChild}</Frame>);
          forceFrameReady(frame);
        });

        describe('where there is a desktop offset only', () => {
          beforeEach(() => {
            mockSettingsValue = desktopOnlyOffset;
          });

          it('should apply the customized desktop offsets', () => {
            expect(frame.getOffsetPosition().bottom)
              .toBe(31);

            expect(frame.getOffsetPosition().right)
              .toBe(52);
          });
        });

        describe('when there is a mobile offset only', () => {
          beforeEach(() => {
            mockSettingsValue = mobileOnlyOffset;
          });

          it('should not apply customized mobile offsets', () => {
            expect(frame.getOffsetPosition().bottom)
              .toBe(0);

            expect(frame.getOffsetPosition().right)
              .toBe(0);
          });
        });

        describe('where there are desktop and mobile offsets', () => {
          beforeEach(() => {
            mockSettingsValue = desktopAndMobileOffset;
          });

          it('should apply only customized desktop offsets', () => {
            expect(frame.getOffsetPosition().bottom)
              .toBe(102);

            expect(frame.getOffsetPosition().right)
              .toBe(101);
          });
        });

        describe('when there is no offset', () => {
          beforeEach(() => {
            mockSettingsValue = {};
          });

          it('should not apply any offsets', () => {
            expect(frame.getOffsetPosition().bottom)
              .toBe(0);

            expect(frame.getOffsetPosition().right)
              .toBe(0);
          });
        });
      });
    });

    describe('when on mobile', () => {
      beforeEach(() => {
        mockIsMobile = true;
      });

      describe('when on launcher', () => {
        beforeEach(() => {
          frame = domRender(<Frame isMobile={mockIsMobile} name='launcher'>{mockChild}</Frame>);
          forceFrameReady(frame);
        });

        describe('when there is a desktop offset only', () => {
          beforeEach(() => {
            mockSettingsValue = desktopOnlyOffset;
          });

          it('should not apply the customized desktop offsets', () => {
            expect(frame.getOffsetPosition().bottom)
              .toBe(0);

            expect(frame.getOffsetPosition().right)
              .toBe(0);
          });
        });

        describe('when there is a mobile offset only', () => {
          beforeEach(() => {
            mockSettingsValue = mobileOnlyOffset;
          });

          it('should apply customized mobile offsets', () => {
            expect(frame.getOffsetPosition().bottom)
              .toBe(200);

            expect(frame.getOffsetPosition().right)
              .toBe(100);
          });
        });

        describe('where there are desktop and mobile offsets', () => {
          beforeEach(() => {
            mockSettingsValue = desktopAndMobileOffset;
          });

          it('should apply only customized mobile offsets', () => {
            expect(frame.getOffsetPosition().bottom)
              .toBe(200);

            expect(frame.getOffsetPosition().right)
              .toBe(100);
          });
        });

        describe('no offset', () => {
          beforeEach(() => {
            mockSettingsValue = {};
          });

          it('should not apply any offsets', () => {
            expect(frame.getOffsetPosition().bottom)
              .toBe(0);

            expect(frame.getOffsetPosition().right)
              .toBe(0);
          });
        });
      });

      describe('when on Web Widget', () => {
        beforeEach(() => {
          frame = domRender(<Frame name='webWidget' isMobile={mockIsMobile}>{mockChild}</Frame>);
          forceFrameReady(frame);
        });

        describe('when there is a desktop offset only', () => {
          beforeEach(() => {
            mockSettingsValue = desktopOnlyOffset;
          });

          it('should not apply the customized desktop offsets', () => {
            expect(frame.getOffsetPosition().bottom)
              .toBe(undefined);

            expect(frame.getOffsetPosition().right)
              .toBe(undefined);
          });
        });

        describe('where there is a mobile offset only', () => {
          beforeEach(() => {
            mockSettingsValue = mobileOnlyOffset;
          });

          it('should not apply the customized mobile offsets', () => {
            expect(frame.getOffsetPosition().bottom)
              .toBe(undefined);

            expect(frame.getOffsetPosition().right)
              .toBe(undefined);
          });
        });

        describe('when there are desktop and mobile offsets', () => {
          beforeEach(() => {
            mockSettingsValue = desktopAndMobileOffset;
          });

          it('should not apply any customized offsets', () => {
            expect(frame.getOffsetPosition().bottom)
              .toBe(undefined);

            expect(frame.getOffsetPosition().right)
              .toBe(undefined);
          });
        });

        describe('when there is no offset', () => {
          beforeEach(() => {
            mockSettingsValue = {};
          });

          it('should not apply any offsets', () => {
            expect(frame.getOffsetPosition().bottom)
              .toBe(undefined);

            expect(frame.getOffsetPosition().right)
              .toBe(undefined);
          });
        });
      });
    });

    describe('when an animationOffset is passed in', () => {
      beforeEach(() => {
        mockSettingsValue = desktopOnlyOffset;
        frame = domRender(<Frame name='webWidget'>{mockChild}</Frame>);
        forceFrameReady(frame);
      });

      it('adds it to the vertical property', () => {
        expect(frame.getOffsetPosition(20).bottom)
          .toBe(51);
      });
    });
  });

  describe('render', () => {
    let frame, visibleValue = true;

    beforeEach(() => {
      frame = domRender(<Frame visible={visibleValue} name='foo'>{mockChild}</Frame>);
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
        spyOnProperty(doc, 'readyState').and.returnValue('loading');
        jasmine.clock().tick(0);
        frame.setState({ childRendered: false });
      });

      it('should not call updateFrameLocale ', () => {
        expect(frame.updateFrameLocale)
          .not.toHaveBeenCalled();
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
    let frame, mockFullscreenable, mockIsMobile;

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
      left: '50%',
      transform: 'translate(-50%)',
      background: '#EEE'
    };

    beforeEach(() => {
      frame = domRender(<Frame isMobile={mockIsMobile}
        fullscreen={mockIsPopout} fullscreenable={mockFullscreenable}>{mockChild}</Frame>);
      forceFrameReady(frame);
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
          expect(frame.getDefaultDimensions())
            .toEqual(expectedMobileDimensions);
        });
      });

      describe('when fullscreenable is false', () => {
        beforeAll(() => {
          mockFullscreenable = false;
        });

        it('returns the expected desktop dimensions', () => {
          expect(frame.getDefaultDimensions())
            .toEqual(expectedDesktopDimensions);
        });
      });
    });

    describe('on desktop', () => {
      beforeAll(() => {
        mockIsMobile = false;
      });

      it('returns the expected mobile dimensions', () => {
        expect(frame.getDefaultDimensions())
          .toEqual(expectedDesktopDimensions);
      });

      describe('when Popout', () => {
        beforeAll(() => {
          mockIsPopout = true;
          mockFullscreenable = true;
        });

        it('returns the expected popout dimensions', () => {
          expect(frame.getDefaultDimensions())
            .toEqual(expectedDesktopPopoutDimensions);
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
