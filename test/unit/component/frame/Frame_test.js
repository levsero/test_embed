describe('Frame', () => {
  let Frame,
    mockRegistryMocks,
    mockIsMobileBrowserValue,
    mockChild,
    mockSettingsValue,
    mockShowTransition,
    mockHideTransition,
    mockHiddenStateTransition,
    mockClickBusterRegister;

  const FramePath = buildSrcPath('component/frame/Frame');

  class MockEmbedWrapper extends Component {
    render() {
      const newChild = React.cloneElement(this.props.children, {
        ref: 'rootComponent'
      });

      return (
        <div id='Embed'>
          {newChild}
        </div>
      );
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
      return (
        <div className='mock-component' refs='rootComponent' />
      );
    }
  }

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    mockIsMobileBrowserValue = false;

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

    mockRegistryMocks = {
      'React': React,
      './Frame.sass': {
        locals: {}
      },
      'utility/utils': {
        cssTimeToMs: () => 300
      },
      'utility/globals': {
        win: window
      },
      'utility/color': {},
      'utility/devices': {
        getZoomSizingRatio: function() {
          return 1;
        },
        isMobileBrowser: () => mockIsMobileBrowserValue,
        isFirefox: function() {
          return false;
        },
        clickBusterRegister: mockClickBusterRegister
      },
      'service/i18n': {
        i18n: jasmine.createSpyObj('i18n', ['t', 'isRTL', 'getLocale'])
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
      'lodash': _,
      'component/Icon': {
        Icon: noop
      },
      'baseCSS': '.base-css-file {}',
      'mainCSS': '.main-css-file {}'
    };

    initMockRegistry(mockRegistryMocks);

    mockChild = (<MockChildComponent
          className='mock-component'
          style={{width: '100px', height: '100px'}}
          />);

    Frame = requireUncached(FramePath).Frame;
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  let frame;

  describe('getRootComponent', () => {
    beforeEach(() => {
      frame = domRender(<Frame store={{}}>{mockChild}</Frame>);
    });

    it('should return the child component when called', () => {
      expect(frame.getRootComponent().props.className)
        .toEqual('mock-component');
    });
  });

  describe('getChild', () => {
    beforeEach(() => {
      frame = domRender(<Frame store={{}} name='Nick'>{mockChild}</Frame>);
    });

    it('should return a react component with the name passed in', () => {
      expect(frame.child.props.name)
        .toEqual('Nick');
    });
  });

  describe('updateFrameSize', () => {
    let dimensions;
    const mockObject = {
      clientHeight: 80,
      offsetHeight: 50,
      clientWidth: 90,
      offsetWidth: 100
    };
    const defaultOffset = 15;

    beforeEach(() => {
      frame = domRender(<Frame store={{}}>{mockChild}</Frame>);

      spyOn(frame, 'getRootComponentElement').and.returnValue(mockObject);

      dimensions = frame.updateFrameSize();
    });

    describe('setting styles', () => {
      it('should set the height value to the higher width value + the default offset', () => {
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
            <Frame frameDimensions={{ offsetWidth, offsetHeight }} store={{}}>{mockChild}</Frame>
          );

          dimensions = frame.updateFrameSize();
        });

        it('should change the height value using the offset prop', () => {
          expect(mockObject.clientHeight + offsetHeight)
            .toBe(100);
        });

        it('should set the width value to the higher width value + the default offset', () => {
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
        frame = domRender(
          <Frame options={{ fullscreenable: true }} store={{}}>
            {mockChild}
          </Frame>
        );

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

        it('should set the zIndex to a the default value', () => {
          expect(dimensions.zIndex)
            .toBe(999999);
        });

        describe('when zIndex is different in settings', () => {
          beforeEach(() => {
            mockSettingsValue.zIndex = 100;

            Frame = requireUncached(FramePath).Frame;

            frame = domRender(
              <Frame options={{ fullscreenable: true }} store={{}}>
                {mockChild}
              </Frame>
            );
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
    let mockOnShow, mockFrameParams, mockAfterShowAnimate;

    beforeEach(() => {
      mockOnShow = jasmine.createSpy('onShow');
      mockAfterShowAnimate = jasmine.createSpy('afterShowAnimate');

      mockFrameParams = {
        transitions: {
          upShow: {
            start: { transitionDuration: '300ms' },
            end: { transitionDuration: '300ms' }
          }
        },
        callbacks: {
          onShow: mockOnShow,
          afterShowAnimate: mockAfterShowAnimate
        }
      };

      jasmine.clock().install();

      frame = domRender(<Frame {...mockFrameParams} store={{}}>{mockChild}</Frame>);

      frame.show();
    });

    afterEach(() => {
      jasmine.clock().uninstall();
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
      jasmine.clock().tick(300);

      expect(mockShowTransition)
        .toHaveBeenCalled();
    });

    it('should call afterShowAnimate', function() {
      jasmine.clock().tick(300);

      expect(mockAfterShowAnimate)
        .toHaveBeenCalled();
    });

    describe('with animation props passed in', function() {
      beforeEach(function() {
        mockOnShow = jasmine.createSpy('onShow');

        mockFrameParams = {
          transitions: {
            upShow: {
              start: { top: '-1337px', transitionDuration: '9999s' },
              end: { top: '466px', transitionDuration: '7777s' }
            }
          }
        };

        frame = domRender(<Frame {...mockFrameParams} store={{}}>{mockChild}</Frame>);
        frame.show({ transition: 'upShow' });
      });

      it('applies animation styles to the frame', function() {
        expect(_.keys(frame.state.frameStyle))
          .toEqual(['marginTop', 'transitionDuration', 'top']);
      });

      it('should set the frames style values', function() {
        expect(frame.state.frameStyle.top)
          .toEqual('-1337px');

        expect(frame.state.frameStyle.transitionDuration)
          .toEqual('9999s');
      });
    });

    it('applies webkitOverflowScrolling when not set', function() {
      const frameContainer = frame.getRootComponentElement();

      frame.show();

      jasmine.clock().tick(50);

      // Get the style AFTER the ticks
      const frameContainerStyle = frameContainer.style;

      expect(frameContainerStyle.WebkitOverflowScrolling)
        .toEqual('touch');

      jasmine.clock().uninstall();
    });
  });

  describe('hide', () => {
    beforeEach(() => {

    });

    it('should blah', () => {

    });
  });

  describe('close', () => {
    beforeEach(() => {

    });

    it('should blah', () => {

    });
  });

  describe('back', () => {
    beforeEach(() => {

    });

    it('should blah', () => {

    });
  });

  describe('computeIframeStyle', () => {
    beforeEach(() => {

    });

    it('should blah', () => {

    });
  });

  describe('contructEmbed', () => {
    beforeEach(() => {

    });

    it('should blah', () => {

    });
  });

  describe('renderFrameContent', () => {
    beforeEach(() => {

    });

    it('should blah', () => {

    });
  });

  describe('render', () => {
    beforeEach(() => {

    });

    it('should blah', () => {

    });
  });
});
