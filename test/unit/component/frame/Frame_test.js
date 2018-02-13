describe('Frame', () => {
  let Frame,
    mockWindowHeight,
    mockRegistryMocks,
    mockIsMobileBrowserValue,
    mockChild,
    mockSettingsValue,
    mockShowTransition,
    mockHideTransition,
    mockHiddenStateTransition,
    mockClickBusterRegister,
    mockIsRTLValue,
    mockLocaleValue,
    mockZoomSizingRatioValue,
    mockUpdateWidgetShown;

  const FramePath = buildSrcPath('component/frame/Frame');

  class MockEmbedWrapper extends Component {
    constructor(props, context) {
      super(props, context);
      this.embed = null;
      this.nav = {
        forceUpdate: noop
      };
    }
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
      this.updateFrameSize = props.updateFrameSize;
      this.setOffsetHorizontal = props.setOffsetHorizontal;
    }
    componentWillUnmount() {}
    render() {
      return <div className='mock-component' refs='rootComponent' />;
    }
  }

  beforeEach(() => {
    mockery.enable();

    mockIsMobileBrowserValue = false;
    mockIsRTLValue = false;
    mockLocaleValue = 'en-US';
    mockZoomSizingRatioValue = 1;
    mockWindowHeight = 1000;

    mockShowTransition = jasmine.createSpy().and.returnValue({
      start: { transitionDuration: '9999ms' },
      end: { transitionDuration: '9999ms' }
    });

    mockHideTransition = jasmine.createSpy().and.returnValue({
      start: { transitionDuration: '9999ms' },
      end: { transitionDuration: '9999ms' }
    });

    mockHiddenStateTransition = jasmine.createSpy().and.returnValue({
      top: '-9999px',
      bottom: '0px'
    });

    mockSettingsValue = {
      offset: { vertical: 0, horizontal: 0 },
      zIndex: 999999,
      position: { vertical: 'bottom' }
    };
    mockClickBusterRegister = jasmine.createSpy('clickBusterRegister');

    mockUpdateWidgetShown = jasmine.createSpy('updateWidgetShown');

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
        }
      },
      'utility/color/styles': {},
      'utility/devices': {
        getZoomSizingRatio: () => {
          return mockZoomSizingRatioValue;
        },
        isMobileBrowser: () => mockIsMobileBrowserValue,
        isFirefox: () => {
          return false;
        },
        clickBusterRegister: mockClickBusterRegister
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
      'service/transitionFactory': {
        transitionFactory: {
          webWidget: {
            upShow: mockShowTransition,
            downHide: mockHideTransition,
            downShow: mockShowTransition,
            upHide: mockHideTransition
          },
          hiddenState: mockHiddenStateTransition
        }
      },
      'src/redux/modules/base/base-actions': {
        updateWidgetShown: mockUpdateWidgetShown
      },
      'lodash': _,
      'component/Icon': {
        Icon: noop
      }
    };

    initMockRegistry(mockRegistryMocks);

    mockChild = (<MockChildComponent className='mock-component' />);

    Frame = requireUncached(FramePath).Frame;
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('getRootComponent', () => {
    let frame;

    beforeEach(() => {
      frame = domRender(<Frame>{mockChild}</Frame>);
    });

    it('should return the child component when called', () => {
      expect(frame.getRootComponent().props.className)
        .toEqual('mock-component');
    });
  });

  describe('getChild', () => {
    let frame;

    beforeEach(() => {
      frame = domRender(<Frame name='Nick'>{mockChild}</Frame>);
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
        spyOn(frame.getChild(), 'forceUpdate');
        spyOn(frame.getChild().nav, 'forceUpdate');
        frame.updateFrameLocale();
      });

      it('calls forceUpdate on the child', () => {
        expect(frame.getChild().forceUpdate)
          .toHaveBeenCalled();
      });

      it('calls forceUpdate on the child nav', () => {
        expect(frame.getChild().nav.forceUpdate)
          .toHaveBeenCalled();
      });
    });

    describe('when the locale is RTL', () => {
      beforeEach(() => {
        mockIsRTLValue = true;
        mockLocaleValue = 'ar';

        jasmine.clock().install();
        frame = domRender(<Frame>{mockChild}</Frame>);
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

        jasmine.clock().install();
        frame = domRender(<Frame>{mockChild}</Frame>);
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

  describe('updateFrameSize', () => {
    let frame, dimensions;
    const mockObject = {
      clientHeight: 80,
      offsetHeight: 50,
      clientWidth: 90,
      offsetWidth: 100
    };
    const defaultOffset = 15;

    beforeEach(() => {
      frame = domRender(<Frame>{mockChild}</Frame>);

      spyOn(frame, 'getRootComponentElement').and.returnValue(mockObject);

      dimensions = frame.updateFrameSize();
    });

    describe('setting styles', () => {
      it('should set the height value to the higher height value + the default offset', () => {
        expect(dimensions.height)
          .toBe(mockObject.clientHeight + defaultOffset);
      });

      it('should set the width value to the higher width value + the default offset', () => {
        expect(dimensions.width)
          .toBe(mockObject.offsetWidth + defaultOffset);
      });

      describe('when the offsets are different', () => {
        const offsetWidth = 50;
        const offsetHeight = 20;

        beforeEach(() => {
          frame = domRender(
            <Frame frameOffsetWidth={offsetWidth} frameOffsetHeight={offsetHeight}>{mockChild}</Frame>
          );

          dimensions = frame.updateFrameSize();
        });

        it('should change the height value using the offset prop', () => {
          expect(mockObject.clientHeight + offsetHeight)
            .toBe(100);
        });

        it('should set the width value to the higher width value + the offset prop', () => {
          expect(mockObject.offsetWidth + offsetWidth)
            .toBe(150);
        });
      });
    });

    describe('when fullscreen', () => {
      beforeEach(() => {
        mockIsMobileBrowserValue = true;
        window.innerWidth = 100;

        Frame = requireUncached(FramePath).Frame;
        frame = domRender(<Frame fullscreenable={true}>{mockChild}</Frame>);

        dimensions = frame.updateFrameSize();
      });

      describe('setting styles', () => {
        it('should set the width to 100%', () => {
          expect(dimensions.width)
            .toBe('100%');
        });

        it('should set the max-width to the viewport width', () => {
          expect(dimensions.maxWidth)
            .toBe(`${window.innerWidth}px`);
        });

        it('should set the height to 100%', () => {
          expect(dimensions.height)
            .toBe('100%');
        });

        it('should set the zIndex to the default value of 999999', () => {
          expect(dimensions.zIndex)
            .toBe(999999);
        });

        describe('when zIndex is different in settings', () => {
          beforeEach(() => {
            mockSettingsValue.zIndex = 100;

            Frame = requireUncached(FramePath).Frame;

            frame = domRender(<Frame fullscreenable={true}>{mockChild}</Frame>);
            dimensions = frame.updateFrameSize();
          });

          it('uses the value from settings', () => {
            expect(dimensions.zIndex)
              .toBe(100);
          });
        });
      });

      describe('when state.visible is true', () => {
        it('should set left to 0px', () => {
          frame.setState({ visible: true });

          dimensions = frame.updateFrameSize();

          expect(dimensions.left)
            .toBe('0px');
        });
      });

      describe('when state.visible is false', () => {
        it('should set left to -9999px', () => {
          frame.setState({ visible: false });

          dimensions = frame.updateFrameSize();

          expect(dimensions.left)
            .toBe('-9999px');
        });
      });
    });
  });

  describe('show', () => {
    let frame, mockOnShow, frameProps, mockAfterShowAnimate, dispatchSpy;
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

      jasmine.clock().install();

      frame = domRender(<Frame {...frameProps}>{mockChild}</Frame>);

      frame.show();
    });

    it('sets `visible` state to true', () => {
      expect(frame.state.visible)
        .toEqual(true);
    });

    it('triggers onShow callback', () => {
      expect(mockOnShow)
        .toHaveBeenCalled();
    });

    it('uses the default show animation', () => {
      jasmine.clock().tick(animationDuration);

      expect(mockShowTransition)
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

      expect(frameContainerStyle.WebkitOverflowScrolling)
        .toEqual('touch');
    });

    describe('with animation props passed in', () => {
      beforeEach(() => {
        mockOnShow = jasmine.createSpy('onShow');

        frameProps = {
          transitions: {
            upShow: {
              start: { top: '-1337px', transitionDuration: '9999s' },
              end: { top: '466px', transitionDuration: '7777s' }
            }
          },
          store: {
            dispatch: noop
          }
        };

        frame = domRender(<Frame {...frameProps}>{mockChild}</Frame>);
        frame.show({ transition: 'upShow' });
      });

      it('applies animation styles to the frame', () => {
        expect(_.keys(frame.state.frameStyle))
          .toEqual(['marginTop', 'transitionDuration', 'top']);
      });

      it('sets the frames style values', () => {
        expect(frame.state.frameStyle.top)
          .toEqual('-1337px');

        expect(frame.state.frameStyle.transitionDuration)
          .toEqual('9999s');
      });
    });

    describe('with transiton: none option passed in', () => {
      let stateBefore;

      beforeEach(() => {
        stateBefore = frame.state.frameStyle;
        frame.show({ transition: 'none' });
      });

      it('does not set any frames style values', () => {
        expect(frame.state.frameStyle)
          .toEqual(stateBefore);
      });

      it('calls afterShowAnimate right away', () => {
        expect(mockAfterShowAnimate)
          .toHaveBeenCalled();
      });
    });

    describe('when the name is launcher', () => {
      beforeEach(() => {
        dispatchSpy = jasmine.createSpy('dispatch');

        frameProps = {
          name: 'launcher',
          store: {
            dispatch: dispatchSpy
          }
        };

        frame = domRender(<Frame {...frameProps} />);
        frame.show();
      });

      it('calls updateWidgetShown with false', () => {
        expect(mockUpdateWidgetShown)
          .toHaveBeenCalledWith(false);
      });

      it('calls dispatch', () => {
        expect(dispatchSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when the name is not launcher', () => {
      beforeEach(() => {
        dispatchSpy = jasmine.createSpy('dispatch');

        frameProps = {
          name: 'launcher',
          store: {
            dispatch: dispatchSpy
          }
        };

        frame = domRender(<Frame {...frameProps} />);
        frame.show();
      });

      it('calls updateWidgetShown with true', () => {
        expect(mockUpdateWidgetShown)
          .toHaveBeenCalledWith(true);
      });

      it('calls dispatch', () => {
        expect(dispatchSpy)
          .toHaveBeenCalled();
      });
    });
  });

  describe('hide', () => {
    let frame, mockOnHide, frameProps;

    beforeEach(() => {
      mockOnHide = jasmine.createSpy('onHide');

      frame = domRender(<Frame onHide={mockOnHide}>{mockChild}</Frame>);

      jasmine.clock().install();

      frame.setState({ visible: true });
      frame.hide();

      jasmine.clock().tick(300);
    });

    it('sets `visible` state to false', () => {
      expect(frame.state.visible)
        .toEqual(false);
    });

    it('triggers props.callbacks.onHide if set', () => {
      expect(mockOnHide)
        .toHaveBeenCalled();
    });

    it('does not apply the animation if it does not exist', () => {
      expect(mockHideTransition)
        .toHaveBeenCalled();
    });

    describe('without animation', () => {
      beforeEach(() => {
        mockOnHide = jasmine.createSpy('onHide');

        frame = domRender(<Frame onHide={mockOnHide}>{mockChild}</Frame>);

        frame.setState({ visible: true });
        frame.hide({ transition: 'none' });
      });

      it('sets `visible` state to false without a delay', () => {
        expect(frame.state.visible)
          .toEqual(false);
      });

      it('triggers props.onHide without a delay', () => {
        expect(mockOnHide)
          .toHaveBeenCalled();
      });
    });

    describe('with animation', () => {
      beforeEach(() => {
        frameProps = {
          transitions: {
            downHide: {
              start: { top: '566px', transitionDuration: 0 },
              end: { top: '789px', transitionDuration: '7777s' }
            }
          }
        };

        frame = domRender(<Frame {...frameProps}>{mockChild}</Frame>);

        frame.hide({ transition: 'downHide' });
      });

      it('applies animation styles to the frame', () => {
        expect(_.keys(frame.state.frameStyle))
          .toEqual(['marginTop', 'transitionDuration', 'top']);
      });

      it('should set the frames style values', () => {
        expect(frame.state.frameStyle.top)
          .toEqual('789px');

        expect(frame.state.frameStyle.transitionDuration)
          .toEqual('7777s');
      });
    });
  });

  describe('close', () => {
    let frame, mockOnClose;

    beforeEach(() => {
      mockOnClose = jasmine.createSpy('onClose');
    });

    describe('when preventClose option is false', () => {
      describe('when on desktop', () => {
        beforeEach(() => {
          frame = domRender(<Frame onClose={mockOnClose}>{mockChild}</Frame>);

          frame.close();
        });

        it('should call the onClose prop', () => {
          expect(mockOnClose)
            .toHaveBeenCalled();
        });

        describe('when vertical position is bottom', () => {
          beforeEach(() => {
            spyOn(frame, 'hide');

            frame.close();
          });

          it('should call hide with `downHide` transition', () => {
            expect(frame.hide)
              .toHaveBeenCalledWith({ transition: 'downHide' });
          });
        });

        describe('when vertical position is top', () => {
          beforeEach(() => {
            mockSettingsValue.position.vertical = 'top';

            Frame = requireUncached(FramePath).Frame;
            frame = domRender(<Frame onClose={mockOnClose}>{mockChild}</Frame>);

            spyOn(frame, 'hide');

            frame.close();
          });

          it('should call hide with `upHide` transition', () => {
            expect(frame.hide)
              .toHaveBeenCalledWith({ transition: 'upHide' });
          });
        });
      });

      describe('when on mobile', () => {
        let mockEvent;

        beforeEach(() => {
          mockIsMobileBrowserValue = true;

          frame = domRender(<Frame onClose={mockOnClose} fullscreenable={true}>{mockChild}</Frame>);

          spyOn(frame, 'hide');
          frame.close({});
        });

        it('should call hide without the close transition', () => {
          expect(frame.hide)
            .toHaveBeenCalled();
        });

        it('should call the onClose handler', () => {
          expect(mockOnClose)
            .toHaveBeenCalled();
        });

        it('should not call clickBusterRegister', () => {
          expect(mockClickBusterRegister)
            .not.toHaveBeenCalledWith();
        });

        describe('when there is a touch event', () => {
          beforeEach(() => {
            mockEvent = {
              touches: [{ clientX: 1, clientY: 1 }]
            };

            frame.close(mockEvent);
          });

          it('should call clickBusterRegister', () => {
            expect(mockClickBusterRegister)
              .toHaveBeenCalledWith(1, 1);
          });
        });
      });
    });

    describe('when preventClose option is true', () => {
      beforeEach(() => {
        frame = domRender(<Frame onClose={mockOnClose} preventClose={true}>{mockChild}</Frame>);

        spyOn(frame, 'hide');
        frame.close();
      });

      it('should not call hide', () => {
        expect(frame.hide)
          .not.toHaveBeenCalled();
      });

      it('should not call the onClose handler', () => {
        expect(mockOnClose)
          .not.toHaveBeenCalled();
      });
    });
  });

  describe('back', () => {
    let frame, mockOnBack;

    beforeEach(() => {
      mockOnBack = jasmine.createSpy('onBack');

      frame = domRender(<Frame onBack={mockOnBack}>{mockChild}</Frame>);

      frame.back({ preventDefault: noop });
    });

    it('should call props.callbacks.onBack', () => {
      expect(mockOnBack)
        .toHaveBeenCalled();
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
          result = frame.computeIframeStyle();
        });

        it('computeIframeStyle should contain styles from frameStyle', () => {
          expect(result)
            .toEqual(jasmine.objectContaining(frameStyle));
        });
      });
    });

    describe('visibility', () => {
      beforeEach(() => {
        frame = domRender(<Frame>{mockChild}</Frame>);
      });

      it('should have visibile classes if state.visible is true', () => {
        frame.setState({ visible: true });

        expect(frame.computeIframeStyle().top)
          .not.toEqual('-9999px');
      });

      it('should not have visibile classes if state.visible is false', () => {
        frame.setState({ visible: false });

        expect(frame.computeIframeStyle().top)
          .toEqual('-9999px');
      });

      it('should not have visibile classes if state.hiddenByZoom is true', () => {
        frame.setState({ hiddenByZoom: true });

        expect(frame.computeIframeStyle().top)
          .toEqual('-9999px');
      });
    });

    describe('position', () => {
      describe('vertical', () => {
        beforeEach(() => {
          frame = domRender(<Frame>{mockChild}</Frame>);
        });

        it('should have bottom classes by default', () => {
          expect(frame.computeIframeStyle().bottom)
            .toBeDefined();

          expect(frame.computeIframeStyle().top)
            .toBeUndefined();
        });

        describe('when settings sets position to top', () => {
          beforeEach(() => {
            mockSettingsValue = { position: { vertical: 'top'} };
            Frame = requireUncached(FramePath).Frame;

            frame = domRender(<Frame>{mockChild}</Frame>);
          });

          it('should have top classes', () => {
            expect(frame.computeIframeStyle().top)
              .toBeDefined();

            expect(frame.computeIframeStyle().bottom)
              .toBeUndefined();
          });
        });
      });

      describe('horizontal', () => {
        beforeEach(() => {
          frame = domRender(<Frame>{mockChild}</Frame>);
        });

        it('should have right classes by default', () => {
          expect(frame.computeIframeStyle().right)
            .toBeDefined();

          expect(frame.computeIframeStyle().left)
            .toBeUndefined();
        });

        it('can be changed by the position prop', () => {
          frame = domRender(<Frame position='left'>{mockChild}</Frame>);

          expect(frame.computeIframeStyle().left)
            .toBeDefined();

          expect(frame.computeIframeStyle().right)
            .toBeUndefined();
        });

        describe('when settings sets position', () => {
          beforeEach(() => {
            mockSettingsValue = { position: { horizontal: 'left'} };
            Frame = requireUncached(FramePath).Frame;

            frame = domRender(<Frame>{mockChild}</Frame>);
          });

          it('uses that setting over the prop', () => {
            expect(frame.computeIframeStyle().left)
              .toBeDefined();

            expect(frame.computeIframeStyle().right)
              .toBeUndefined();
          });
        });
      });

      describe('when the frame should be hidden', () => {
        beforeEach(() => {
          frame = instanceRender(<Frame>{mockChild}</Frame>);
          frame.setState({
            visible: false,
            hiddenByZoom: true
          });
        });

        it('position should not override the hidden absolute position', () => {
          expect(frame.computeIframeStyle().top)
            .toEqual('-9999px');
        });
      });
    });

    describe('offset', () => {
      let frame;
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
          mockIsMobileBrowserValue = false;
        });

        describe('when on launcher', () => {
          beforeEach(() => {
            Frame = requireUncached(FramePath).Frame;
            frame = domRender(<Frame name='launcher'>{mockChild}</Frame>);
          });

          describe('when there is a desktop offset only', () => {
            beforeEach(() => {
              mockSettingsValue = desktopOnlyOffset;
            });

            it('should apply the customized desktop offsets', () => {
              expect(frame.computeIframeStyle().bottom)
                .toBe(31);

              expect(frame.computeIframeStyle().right)
                .toBe(52);
            });
          });

          describe('when there is a mobile offset only', () => {
            beforeEach(() => {
              mockSettingsValue = mobileOnlyOffset;
            });

            it('should not apply customized mobile offsets', () => {
              expect(frame.computeIframeStyle().bottom)
                .toBe(0);

              expect(frame.computeIframeStyle().right)
                .toBe(0);
            });
          });

          describe('when there are desktop and mobile offsets', () => {
            beforeEach(() => {
              mockSettingsValue = desktopAndMobileOffset;
            });

            it('should apply only customized desktop offsets', () => {
              expect(frame.computeIframeStyle().bottom)
                .toBe(102);

              expect(frame.computeIframeStyle().right)
                .toBe(101);
            });
          });

          describe('when there is no offset', () => {
            beforeEach(() => {
              mockSettingsValue = {};
            });

            it('should not apply any offsets', () => {
              expect(frame.computeIframeStyle().bottom)
                .toBe(0);

              expect(frame.computeIframeStyle().right)
                .toBe(0);
            });
          });
        });

        describe('when on Web Widget', () => {
          beforeEach(() => {
            Frame = requireUncached(FramePath).Frame;
            frame = domRender(<Frame name='webWidget'>{mockChild}</Frame>);
          });

          describe('where there is a desktop offset only', () => {
            beforeEach(() => {
              mockSettingsValue = desktopOnlyOffset;
            });

            it('should apply the customized desktop offsets', () => {
              expect(frame.computeIframeStyle().bottom)
                .toBe(31);

              expect(frame.computeIframeStyle().right)
                .toBe(52);
            });
          });

          describe('when there is a mobile offset only', () => {
            beforeEach(() => {
              mockSettingsValue = mobileOnlyOffset;
            });

            it('should not apply customized mobile offsets', () => {
              expect(frame.computeIframeStyle().bottom)
                .toBe(0);

              expect(frame.computeIframeStyle().right)
                .toBe(0);
            });
          });

          describe('where there are desktop and mobile offsets', () => {
            beforeEach(() => {
              mockSettingsValue = desktopAndMobileOffset;
            });

            it('should apply only customized desktop offsets', () => {
              expect(frame.computeIframeStyle().bottom)
                .toBe(102);

              expect(frame.computeIframeStyle().right)
                .toBe(101);
            });
          });

          describe('when there is no offset', () => {
            beforeEach(() => {
              mockSettingsValue = {};
            });

            it('should not apply any offsets', () => {
              expect(frame.computeIframeStyle().bottom)
                .toBe(0);

              expect(frame.computeIframeStyle().right)
                .toBe(0);
            });
          });
        });
      });

      describe('when on mobile', () => {
        beforeEach(() => {
          mockIsMobileBrowserValue = true;
        });

        describe('when on launcher', () => {
          beforeEach(() => {
            Frame = requireUncached(FramePath).Frame;
            frame = domRender(<Frame name='launcher'>{mockChild}</Frame>);
          });

          describe('when there is a desktop offset only', () => {
            beforeEach(() => {
              mockSettingsValue = desktopOnlyOffset;
            });

            it('should not apply the customized desktop offsets', () => {
              expect(frame.computeIframeStyle().bottom)
                .toBe(0);

              expect(frame.computeIframeStyle().right)
                .toBe(0);
            });
          });

          describe('when there is a mobile offset only', () => {
            beforeEach(() => {
              mockSettingsValue = mobileOnlyOffset;
            });

            it('should apply customized mobile offsets', () => {
              expect(frame.computeIframeStyle().bottom)
                .toBe(200);

              expect(frame.computeIframeStyle().right)
                .toBe(100);
            });
          });

          describe('where there are desktop and mobile offsets', () => {
            beforeEach(() => {
              mockSettingsValue = desktopAndMobileOffset;
            });

            it('should apply only customized mobile offsets', () => {
              expect(frame.computeIframeStyle().bottom)
                .toBe(200);

              expect(frame.computeIframeStyle().right)
                .toBe(100);
            });
          });

          describe('no offset', () => {
            beforeEach(() => {
              mockSettingsValue = {};
            });

            it('should not apply any offsets', () => {
              expect(frame.computeIframeStyle().bottom)
                .toBe(0);

              expect(frame.computeIframeStyle().right)
                .toBe(0);
            });
          });
        });

        describe('when on Web Widget', () => {
          beforeEach(() => {
            Frame = requireUncached(FramePath).Frame;
            frame = domRender(<Frame name='webWidget'>{mockChild}</Frame>);
          });

          describe('when there is a desktop offset only', () => {
            beforeEach(() => {
              mockSettingsValue = desktopOnlyOffset;
            });

            it('should not apply the customized desktop offsets', () => {
              expect(frame.computeIframeStyle().bottom)
                .toBe(undefined);

              expect(frame.computeIframeStyle().right)
                .toBe(undefined);
            });
          });

          describe('where there is a mobile offset only', () => {
            beforeEach(() => {
              mockSettingsValue = mobileOnlyOffset;
            });

            it('should not apply the customized mobile offsets', () => {
              expect(frame.computeIframeStyle().bottom)
                .toBe(undefined);

              expect(frame.computeIframeStyle().right)
                .toBe(undefined);
            });
          });

          describe('when there are desktop and mobile offsets', () => {
            beforeEach(() => {
              mockSettingsValue = desktopAndMobileOffset;
            });

            it('should not apply any customized offsets', () => {
              expect(frame.computeIframeStyle().bottom)
                .toBe(undefined);

              expect(frame.computeIframeStyle().right)
                .toBe(undefined);
            });
          });

          describe('when there is no offset', () => {
            beforeEach(() => {
              mockSettingsValue = {};
            });

            it('should not apply any offsets', () => {
              expect(frame.computeIframeStyle().bottom)
                .toBe(undefined);

              expect(frame.computeIframeStyle().right)
                .toBe(undefined);
            });
          });
        });
      });
    });

    describe('zIndex', () => {
      let frame;

      beforeEach(() => {
        mockSettingsValue = { zIndex: 10001 };
        Frame = requireUncached(FramePath).Frame;

        frame = domRender(<Frame>{mockChild}</Frame>);
      });

      it('uses the value from settings if it exists', () => {
        expect(frame.computeIframeStyle().zIndex)
          .toBe(10001);
      });
    });
  });

  describe('render', () => {
    let frame;

    beforeEach(() => {
      frame = domRender(<Frame name='foo'>{mockChild}</Frame>);
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
    });

    describe('when not visible', () => {
      beforeEach(() => {
        frame.setState({ visible: false });
      });

      it('should not have `--active` in classes', () => {
        expect(frame.iframe.className)
          .not.toContain('--active');
      });

      it('should set the tab index to -1', () => {
        expect(frame.iframe.attributes.tabindex.value)
          .toEqual('-1');
      });
    });
  });

  describe('renderFrameContent', () => {
    let frame,
      doc;

    beforeEach(() => {
      jasmine.clock().install();

      mockLocaleValue = 'fr';
      mockIsRTLValue = true;
      Frame = requireUncached(FramePath).Frame;
      frame = domRender(<Frame css='css-prop'>{mockChild}</Frame>);
      doc = frame.getContentWindow().document;

      spyOn(frame, 'updateFrameLocale');
    });

    describe(`when the iframe's document is ready`, () => {
      beforeEach(() => {
        jasmine.clock().tick(0);

        doc.readyState = 'complete';
        frame.setState({ childRendered: false });
      });

      it('should call updateFrameLocale ', () => {
        expect(frame.updateFrameLocale)
          .toHaveBeenCalled();
      });
    });

    describe(`when the iframe's document is not ready`, () => {
      beforeEach(() => {
        jasmine.clock().tick(0);

        doc.readyState = 'loading';
        frame.setState({ childRendered: false });
      });

      it('should not call updateFrameLocale ', () => {
        expect(frame.updateFrameLocale)
          .not.toHaveBeenCalled();
      });
    });

    it('sets rtl and lang attr on the frame', () => {
      jasmine.clock().tick();

      expect(frame.getContentDocument().documentElement.lang)
        .toBe('fr');

      expect(frame.getContentDocument().documentElement.dir)
        .toBe('rtl');
    });

    it('should sets the state childRendered to true', () => {
      expect(frame.state.childRendered)
        .toEqual(true);
    });

    describe('contructEmbed', () => {
      it('should add updateFrameSize to the child component', () => {
        expect(frame.getRootComponent().updateFrameSize)
          .toBeDefined();
      });

      it('should add css styles to the element', () => {
        expect(frame.getChild().props.baseCSS)
          .toContain('css-prop');
      });
    });
  });
});
