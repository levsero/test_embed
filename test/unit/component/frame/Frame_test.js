fdescribe('Frame', () => {
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

  describe('setOffsetHorizontal', () => {
    describe('when disableSetOffsetHorizontal is false', () => {
      beforeEach(() => {
        frame = domRender(<Frame store={{}}>{mockChild}</Frame>);

        frame.setOffsetHorizontal(72);
      });

      it('should set the margin of the component', () => {
        expect(ReactDOM.findDOMNode(frame).style.marginLeft)
          .toEqual('72px');
        expect(ReactDOM.findDOMNode(frame).style.marginRight)
          .toEqual('72px');
      });
    });

    describe('when disableSetOffsetHorizontal is true', () => {
      beforeEach(() => {
        frame = domRender(<Frame disableSetOffsetHorizontal={true} store={{}}>{mockChild}</Frame>);

        frame.setOffsetHorizontal(72);
      });

      it('should not set the margin of the component', () => {
        expect(ReactDOM.findDOMNode(frame).style.marginLeft)
          .not.toEqual('72px');
        expect(ReactDOM.findDOMNode(frame).style.marginRight)
          .not.toEqual('72px');
      });
    });
  });

  describe('updateFrameSize', () => {
    let frame;

    beforeEach(() => {

    });

    describe('when fullscreen', () => {
      let dimensions;

      beforeEach(() => {
        mockIsMobileBrowserValue = true;
        window.innerWidth = 100;

        Frame = requireUncached(FramePath).Frame;

        frame = domRender(<Frame fullscreenable={true} store={{}}>{mockChild}</Frame>);
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

        it('should set the z-index to a the default value', () => {
          expect(dimensions.zIndex)
            .toBe(999999);
        });

        describe('when zIndex is different in settings', () => {
          beforeEach(() => {
            mockSettingsValue.zIndex = 100;

            Frame = requireUncached(FramePath).Frame;

            frame = domRender(<Frame fullscreenable={true} store={{}}>{mockChild}</Frame>);
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
    beforeEach(() => {

    });

    it('should blah', () => {

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
