describe('frameFactory', function() {
  let frameFactory,
    mockRegistry,
    mockRegistryMocks,
    mockChildFn,
    mockSettingsValue,
    mockShowTransition,
    mockHideTransition,
    mockHiddenStateTransition,
    mockClickBusterRegister;

  const frameFactoryPath = buildSrcPath('embed/frameFactory');
  const expandSpy = jasmine.createSpy('expand');

  class MockEmbedWrapper extends Component {
    render() {
      return (
        <div id='Embed'>
          {this.props.childFn(this.props.childParams)}
        </div>
      );
    }
  }

  beforeEach(function() {
    global.window = jsdom.jsdom('<html><body></body></html>').defaultView;
    global.document = global.window.document;
    resetDOM();

    mockery.enable();

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
      'utility/utils': {
        bindMethods: mockBindMethods,
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
        isMobileBrowser: function() {
          return false;
        },
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
      'component/frameFactory/EmbedWrapper': {
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

    mockRegistry = initMockRegistry(mockRegistryMocks);

    class MockChildComponent extends React.Component {
      constructor() {
        super();
        this.expand = expandSpy;
      }

      render() {
        return (
          <div className='mock-component' />
        );
      }
    }

    mockChildFn = function() {
      return (
        <MockChildComponent
          className='mock-component'
          ref='rootComponent' />
      );
    };

    frameFactory = requireUncached(frameFactoryPath).frameFactory;
  });

  afterEach(function() {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('input arguments validation', function() {
    it('throws if childFn is not a function', function() {
      expect(function() {
        frameFactory({});
      }).toThrow();

      expect(function() {
        frameFactory('1');
      }).toThrow();
    });

    it('throws if childFn does not return a React component', function() {
      expect(function() {
        frameFactory(noop, {});
      }).toThrow();
    });

    it('should not throw if childFn returns a React component', function() {
      const childFn = function() {
        return <mockComponent ref='rootComponent' />;
      };

      expect(function() {
        frameFactory(childFn);
      }).not.toThrow();
    });

    it('should not throw if childFn returns a React DOM component', function() {
      const childFn = function() {
        return <div ref='rootComponent' />;
      };

      expect(function() {
        frameFactory(childFn);
      }).not.toThrow();
    });
  });

  describe('getChild', function() {
    it('stores and exposes the child component via getChild()', function() {
      const Embed = frameFactory(mockChildFn);
      const instance = domRender(<Embed />);

      expect(function() {
        TestUtils
          .findRenderedDOMComponentWithClass(
            instance.getChild(),
            'mock-component'
          );
      }).not.toThrow();
    });
  });

  describe('getRootComponent', function() {
    it('returns the rootComponent', function() {
      const Embed = frameFactory(mockChildFn);
      const instance = domRender(<Embed />);

      expect(instance.getRootComponent().props.className)
        .toEqual('mock-component');
    });
  });

  describe('updateFrameSize', function() {
    it('reads content dimensions and sets the state', function() {
      const Embed = frameFactory(mockChildFn);
      const instance = domRender(<Embed />);
      const frameContainer = global.document.body.getElementsByTagName('iframe')[0];
      const frameContainerStyle = frameContainer.style;

      jasmine.clock().install();

      // This is the "dirty" state
      instance.setState({ iframeDimensions: { width:999, height: 999 } });

      expect(frameContainerStyle.width)
        .toEqual('999px');

      expect(frameContainerStyle.height)
        .toEqual('999px');

      // jsdom doesn't actually attempt to render a document
      // so client*/offset* will give use NaN which then gets ||'ed with 0.
      const dimensions = instance.updateFrameSize();

      jasmine.clock().tick(10);

      // best we can do is check that that the width and height
      // have been updated from 999 to 0.
      expect(frameContainerStyle.width)
        .toEqual('15px');

      expect(frameContainerStyle.height)
        .toEqual('15px');

      expect(dimensions)
        .toEqual({ width: 15, height: 15 });
    });

    it('respects the fullscreenable parameter', function() {
      let frameContainer,
        frameContainerStyle;

      mockRegistry['utility/devices'].isMobileBrowser = function() {
        return true;
      };
      mockRegistry['utility/globals'].win.innerWidth = 100;

      frameFactory = requireUncached(frameFactoryPath).frameFactory;

      jasmine.clock().install();

      const Embed = frameFactory(mockChildFn, {
        fullscreenable: true
      });

      const instance = domRender(<Embed />);

      frameContainer = global.document.body.getElementsByTagName('iframe')[0];
      frameContainerStyle = frameContainer.style;

      instance.updateFrameSize();

      jasmine.clock().tick(10);

      expect(frameContainerStyle.width)
        .toEqual(`${mockRegistry['utility/globals'].win.innerWidth}px`);

      expect(frameContainerStyle.height)
        .toEqual('100%');

      expect(frameContainerStyle.left)
        .toEqual('0px');

      expect(frameContainerStyle.zIndex > 0)
        .toEqual(true);
    });

    it('grabs the zIndex from settings', () => {
      mockSettingsValue.zIndex = 100;

      const Embed = frameFactory(mockChildFn);
      const instance = domRender(<Embed />);
      const frameContainer = global.document.body.getElementsByTagName('iframe')[0];
      const frameContainerStyle = frameContainer.style;

      jasmine.clock().install();
      instance.updateFrameSize();
      jasmine.clock().tick(10);

      expect(frameContainerStyle.zIndex)
        .toEqual('100');
    });

    it('sets the height to 100% if the widget is expandable and expanded is true', () => {
      const Embed = frameFactory(mockChildFn, {
        expandable: true
      });
      const instance = domRender(<Embed />);
      const frameContainer = global.document.body.getElementsByTagName('iframe')[0];
      const frameContainerStyle = frameContainer.style;

      instance.expand({ preventDefault: noop });

      jasmine.clock().install();
      instance.updateFrameSize();
      jasmine.clock().tick(10);

      expect(frameContainerStyle.height)
        .toEqual('100%');
    });
  });

  describe('updateFrameSize fullWidth behaviour', () => {
    let Embed,
      instance,
      frameContainer,
      frameContainerStyle;

    beforeEach(() => {
      frameFactory = requireUncached(frameFactoryPath).frameFactory;
      jasmine.clock().install();
    });

    describe('when fullWidth prop is true', () => {
      beforeEach(() => {
        Embed = frameFactory(mockChildFn, { fullWidth: true });
        instance = domRender(<Embed />);
        frameContainer = global.document.body.getElementsByTagName('iframe')[0];
        frameContainerStyle = frameContainer.style;
        instance.setState({ iframeDimensions: { width: 999, height: 999 } });

        instance.updateFrameSize();
        jasmine.clock().tick(10);
      });

      it('sets width to 100%', () => {
        expect(frameContainerStyle.width)
          .toEqual('100%');
      });

      it('sets a dynamically calculated height', () => {
        expect(frameContainerStyle.height)
          .toEqual('15px');
      });
    });

    describe('when fullWidth prop is false', () => {
      beforeEach(() => {
        Embed = frameFactory(mockChildFn, { fullWidth: false });
        instance = domRender(<Embed />);
        frameContainer = global.document.body.getElementsByTagName('iframe')[0];
        frameContainerStyle = frameContainer.style;
        instance.setState({ iframeDimensions: { width: 999, height: 999 } });

        instance.updateFrameSize();
        jasmine.clock().tick(10);
      });

      it('sets a dynamically calculated width', () => {
        expect(frameContainerStyle.width)
          .toEqual('15px');
      });
    });
  });

  describe('show', function() {
    let instance,
      mockOnShow,
      mockFrameParams;

    beforeEach(function() {
      mockOnShow = jasmine.createSpy('onShow');

      mockFrameParams = {
        transitions: {
          upShow: {
            start: { transitionDuration: '300ms' },
            end: { transitionDuration: '300ms' }
          }
        },
        onShow: mockOnShow
      };

      const Embed = frameFactory(mockChildFn, mockFrameParams);

      instance = domRender(<Embed />);
    });

    it('sets `visible` state to true', function() {
      instance.setState({ visible: false });

      instance.show();

      expect(instance.state.visible)
        .toEqual(true);
    });

    it('triggers params.onShow if set', function() {
      instance.show();

      expect(mockOnShow)
        .toHaveBeenCalled();
    });

    describe('when expandable is true', () => {
      beforeEach(() => {
        mockFrameParams.expandable = true;

        const Embed = frameFactory(mockChildFn, mockFrameParams);

        instance = domRender(<Embed />);
        instance.show();
      });

      describe('when in a non expanded state', () => {
        it('should call expand with false on the root component', () => {
          expect(expandSpy)
            .toHaveBeenCalledWith(false);
        });
      });

      describe('when in a expanded state', () => {
        it('should call expand with true on the root component', () => {
          instance.expand({ preventDefault: noop });
          instance.show();

          expect(expandSpy)
            .toHaveBeenCalledWith(true);
        });
      });
    });

    describe('without animation', function() {
      let instance;

      beforeEach(function() {
        const Embed = frameFactory(mockChildFn, {});

        jasmine.clock().install();

        instance = domRender(<Embed />);
      });

      it('falls back to the default show animation', function() {
        instance.show();
        jasmine.clock().tick(300);

        expect(mockShowTransition)
          .toHaveBeenCalled();
      });
    });

    describe('with animation', function() {
      let mockFrameParams,
        mockOnShow,
        mockAfterShowAnimate,
        instance;

      beforeEach(function() {
        mockAfterShowAnimate = jasmine.createSpy('afterShowAnimate');
        mockOnShow = jasmine.createSpy('onShow');

        mockFrameParams = {
          transitions: {
            upShow: {
              start: { top: '-1337px', transitionDuration: '9999s' },
              end: { top: '466px', transitionDuration: '7777s' }
            }
          },
          afterShowAnimate: mockAfterShowAnimate,
          onShow: mockOnShow
        };

        const Embed = frameFactory(mockChildFn, mockFrameParams);

        jasmine.clock().install();

        instance = domRender(<Embed />);
      });

      it('applies animation styles to the frame', function() {
        instance.show({ transition: 'upShow' });

        expect(_.keys(instance.state.frameStyle))
          .toEqual(['marginTop', 'top', 'transitionDuration']);
      });

      it('should set the frame\'s style values', function() {
        instance.show({ transition: 'upShow' });

        expect(instance.state.frameStyle.top)
          .toEqual('-1337px');

        expect(instance.state.frameStyle.transitionDuration)
          .toEqual('9999s');
      });

      it('should call onShow and afterShowAnimate if it\'s available', function() {
        instance.show({ transition: 'upShow' });
        jasmine.clock().tick(300);

        expect(mockFrameParams.afterShowAnimate)
          .toHaveBeenCalled();
      });

      it('should call onShow after the animation has finished', function() {
        instance.show({ transition: 'upShow' });
        jasmine.clock().tick(300);

        expect(mockFrameParams.onShow)
          .toHaveBeenCalled();
      });

      it('applies webkitOverflowScrolling when not set', function() {
        const frameContainer = ReactDOM.findDOMNode(instance).contentDocument.body.firstChild.firstChild;

        instance.show();

        jasmine.clock().tick(50);

        // Get the style AFTER the ticks
        const frameContainerStyle = frameContainer.style;

        expect(frameContainerStyle.WebkitOverflowScrolling)
          .toEqual('touch');

        jasmine.clock().uninstall();
      });
    });
  });

  describe('hide', function() {
    let instance,
      mockOnHide,
      mockFrameParams;

    beforeEach(function() {
      mockOnHide = jasmine.createSpy('onHide');

      mockFrameParams = {
        transitions: {
          downHide: {
            start: { top: '566px', transitionDuration: '9999s' },
            end: { top: '789px', transitionDuration: '7777s' }
          }
        },
        onHide: mockOnHide
      };

      const Embed = frameFactory(mockChildFn, mockFrameParams);

      jasmine.clock().install();

      instance = domRender(<Embed />);
    });

    it('sets `visible` state to false', function() {
      instance.setState({ visible: true });

      instance.hide();
      jasmine.clock().tick(300);

      expect(instance.state.visible)
        .toEqual(false);
    });

    it('triggers params.onHide if set', function() {
      instance.hide();
      jasmine.clock().tick(300);

      expect(mockOnHide)
        .toHaveBeenCalled();
    });

    describe('without animation', function() {
      let instance;

      beforeEach(function() {
        const Embed = frameFactory(mockChildFn, {});

        instance = domRender(<Embed />);
      });

      it('does not apply the animation if it does not exist', function() {
        instance.hide();
        jasmine.clock().tick(300);

        expect(mockHideTransition)
          .toHaveBeenCalled();
      });
    });

    describe('with animation', function() {
      let instance,
        mockFrameParams;

      beforeEach(function() {
        mockFrameParams = {
          transitions: {
            downHide: {
              start: { top: '566px', transitionDuration: 0 },
              end: { top: '789px', transitionDuration: '7777s' }
            }
          },
          onHide: mockOnHide
        };

        const Embed = frameFactory(mockChildFn, mockFrameParams);

        instance = domRender(<Embed />);
      });

      it('applies animation styles to the frame', function() {
        instance.hide({ transition: 'downHide' });

        expect(_.keys(instance.state.frameStyle))
          .toEqual(['marginTop', 'top', 'transitionDuration']);
      });

      it('should set the frame\'s style values', function() {
        instance.hide({ transition: 'downHide' });

        expect(instance.state.frameStyle.top)
          .toEqual('789px');

        expect(instance.state.frameStyle.transitionDuration)
          .toEqual('7777s');
      });

      it('should set `visible` to false after the animation has finished', function() {
        instance.setState({ visible: true });

        instance.hide({ transition: 'downHide' });
        jasmine.clock().tick(300);

        expect(instance.state.visible)
          .toEqual(false);
      });

      it('should call onHide after the animation has finished', function() {
        instance.hide({ transition: 'downHide' });
        jasmine.clock().tick(300);

        expect(mockOnHide)
          .toHaveBeenCalled();
      });
    });
  });

  describe('close', () => {
    let mockOnClose;

    beforeEach(() => {
      mockOnClose = jasmine.createSpy('onClose');
    });

    describe('when preventClose option is false', () => {
      describe('when on desktop', () => {
        let instance;

        beforeEach(() => {
          const Embed = frameFactory(mockChildFn, {
            onClose: mockOnClose
          });

          instance = domRender(<Embed />);
          spyOn(instance, 'hide');
        });

        describe('when vertical position is top', () => {
          beforeEach(() => {
            mockSettingsValue.position.vertical = 'top';

            const Embed = frameFactory(mockChildFn, {
              onClose: mockOnClose
            });

            instance = domRender(<Embed />);
            spyOn(instance, 'hide');
          });

          it('should call hide with `upHide` transition', () => {
            instance.close();

            expect(instance.hide)
              .toHaveBeenCalledWith({ transition: 'upHide' });
          });
        });

        describe('when vertical position is bottom', () => {
          it('should call hide with `downHide` transition', () => {
            instance.close();

            expect(instance.hide)
              .toHaveBeenCalledWith({ transition: 'downHide' });
          });
        });

        it('should call the onClose handler', () => {
          instance.close();

          expect(mockOnClose)
            .toHaveBeenCalled();
        });
      });

      describe('when on mobile', () => {
        let instance,
          mockEvent;

        beforeEach(() => {
          const Embed = frameFactory(mockChildFn, {
            isMobile: true,
            onClose: mockOnClose
          });

          mockEvent = {
            touches: [{ clientX: 1, clientY: 1 }]
          };
          instance = domRender(<Embed />);
        });

        describe('when there is a touch event', () => {
          it('should call clickBusterRegister', () => {
            instance.close(mockEvent);

            expect(mockClickBusterRegister)
              .toHaveBeenCalledWith(1, 1);
          });
        });

        describe('when there is no touch event', () => {
          it('should not call clickBusterRegister', () => {
            instance.close({});

            expect(mockClickBusterRegister)
              .not.toHaveBeenCalledWith();
          });
        });

        it('should call hide without the close transition', () => {
          spyOn(instance, 'hide');
          instance.close({});

          expect(instance.hide)
            .toHaveBeenCalled();
        });

        it('should call the onClose handler', () => {
          instance.close({});

          expect(mockOnClose)
            .toHaveBeenCalled();
        });
      });
    });

    describe('when preventClose option is true', () => {
      let instance;

      beforeEach(() => {
        const Embed = frameFactory(mockChildFn, {
          preventClose: true,
          onClose: mockOnClose
        });

        instance = domRender(<Embed />);
      });

      it('should not call hide with', () => {
        spyOn(instance, 'hide');
        instance.close();

        expect(instance.hide)
          .not.toHaveBeenCalled();
      });

      it('should call the onClose handler', () => {
        instance.close();

        expect(mockOnClose)
          .not.toHaveBeenCalled();
      });
    });
  });

  describe('render', function() {
    let instance;

    beforeEach(function() {
      mockSettingsValue = { offset: { vertical: 31, horizontal: 52 } };
      const Embed = frameFactory(mockChildFn, {
        frameStyle: {
          backgroundColor: 'rgb(1, 2, 3)'
        }
      });

      instance = domRender(<Embed visible={false} />);
    });

    it('renders an iframe to the document', function() {
      expect(global.document.body.getElementsByTagName('iframe').length)
        .toEqual(1);
    });

    it('uses `state.visible` to determine its css `display` rule', function() {
      const frameContainer = global.document.body.getElementsByTagName('iframe')[0];
      const frameContainerStyle = frameContainer.style;

      expect(frameContainerStyle.cssText)
        .not.toContain('top:-9999px');

      expect(frameContainerStyle.cssText)
        .not.toContain('bottom:auto');

      instance.setState({ visible: false });

      expect(frameContainerStyle.top)
        .toEqual('-9999px');

      expect(frameContainerStyle.bottom)
        .toEqual('0px');

      instance.setState({ visible: true });

      expect(frameContainerStyle.cssText)
        .not.toContain('top:-9999px');

      expect(frameContainerStyle.cssText)
        .not.toContain('bottom:auto');
    });

    it('has `border` css rule set to none', function() {
      const iframe = global.document.body.getElementsByTagName('iframe')[0];

      expect(iframe.style.border)
        .toEqual('');
    });

    it('merges in css rules from params.style with correct precedence', function() {
      const frameContainer = global.document.body.getElementsByTagName('iframe')[0];
      const frameContainerStyle = frameContainer.style;

      expect(frameContainerStyle.backgroundColor)
        .toEqual('rgb(1, 2, 3)');

      expect(frameContainerStyle.top)
        .toEqual('-9999px');

      expect(frameContainerStyle.bottom)
        .toEqual('0px');
    });

    it('gets the settings values to determine the offset', function() {
      const frameContainer = global.document.body.getElementsByTagName('iframe')[0];
      const frameContainerStyle = frameContainer.style;

      instance.setState({ visible: true });

      expect(frameContainerStyle.bottom)
        .toEqual('31px');

      expect(frameContainerStyle.right)
        .toEqual('52px');
    });
  });

  describe('renderFrameContent', function() {
    it('injects params.extend functions into the child component', function() {
      const mockClickHandler = jasmine.createSpy('mockClickHandler');
      const mockSubmitHandler = jasmine.createSpy('mockSubmitHandler');
      const Embed = frameFactory(
        function(params) {
          return (
            <mockComponent
              ref='rootComponent'
              onClick={params.onClickHandler}
              onSubmit={params.onSubmitHandler} />
          );
        },
        {
          extend: {
            onClickHandler: mockClickHandler,
            onSubmitHandler: mockSubmitHandler
          }
        }
      );
      const instance = domRender(<Embed />);
      const child = instance.getRootComponent();

      child.props.onClick('click param');

      expect(mockClickHandler)
        .toHaveBeenCalledWith('click param');

      child.props.onSubmit('submit param');

      expect(mockSubmitHandler)
        .toHaveBeenCalledWith('submit param');
    });

    it('injects the internal updateFrameSize into the child component', function() {
      const mockUpdateFrameSize = jasmine.createSpy('mockUpdateFrameSize');
      const Embed = frameFactory(
        function(params) {
          return (
            <mockComponent
              ref='rootComponent'
              updateFrameSize={params.updateFrameSize} />
          );
        },
        {
          extend: {
            updateFrameSize: mockUpdateFrameSize
          }
        }
      );
      const instance = domRender(<Embed />);
      const child = instance.getRootComponent();

      jasmine.clock().install();

      // setup "dirty" state
      instance.setState({
        iframeDimensions: { width: -1, height: -1 }
      });

      child.props.updateFrameSize();

      jasmine.clock().tick(10);

      // should have called the internal updateFrameSize
      // which updates the iframeDimensions state
      expect(instance.state.iframeDimensions)
        .toEqual({ width: 15, height: 15 });

      // shouldn't call the injected updateFrameSize prop
      expect(mockUpdateFrameSize)
        .not.toHaveBeenCalled();
    });

    it('setOffsetHorizontal sets the widgets left and right margin', function() {
      const Embed = frameFactory(
        function(params) {
          return (
            <mockComponent
              ref='rootComponent'
              setOffsetHorizontal={params.setOffsetHorizontal} />
          );
        }
      );
      const instance = domRender(<Embed />);
      const child = instance.getRootComponent();

      child.props.setOffsetHorizontal(72);

      expect(ReactDOM.findDOMNode(instance).style.marginLeft)
        .toEqual('72px');
      expect(ReactDOM.findDOMNode(instance).style.marginRight)
        .toEqual('72px');
    });

    it('renders the child component to the document', function() {
      const Embed = frameFactory(mockChildFn);
      const instance = domRender(<Embed />);

      expect(instance.getChild().refs.rootComponent)
        .toBeDefined();
    });

    it('updates `state._rendered` at the end', function() {
      const Embed = frameFactory(mockChildFn);
      const instance = domRender(<Embed />);

      expect(instance.state._rendered)
        .toEqual(true);
    });

    it('adds dir & lang attributes to html element for RTL languages', function() {
      mockRegistry['service/i18n'].i18n.isRTL = function() {
        return true;
      };
      mockRegistry['service/i18n'].i18n.getLocale = function() {
        return 'ar';
      };

      frameFactory = requireUncached(frameFactoryPath).frameFactory;

      const Embed = frameFactory(mockChildFn);

      domRender(<Embed />);

      const iframe = global.document.body.getElementsByTagName('iframe')[0];
      const htmlElem = iframe.contentDocument.documentElement;

      expect(htmlElem.getAttribute('dir'))
        .toEqual('rtl');

      expect(htmlElem.getAttribute('lang'))
        .toEqual('ar');
    });
  });
});
