describe('frameFactory', function() {
  let frameFactory,
    mockRegistry,
    mockRegistryMocks,
    mockChildFn,
    mockSnabbt,
    mockSettingsValue,
    mockSnabbtThen,
    mockClickBusterRegister;

  const frameFactoryPath = buildSrcPath('embed/frameFactory');

  class MockEmbedWrapper extends React.Component {
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

    mockSnabbtThen = jasmine.createSpy();
    mockSnabbt = jasmine.createSpy('snabbt.js').and.returnValue({
      then: mockSnabbtThen
    });

    mockSettingsValue = { offset: { vertical: 0, horizontal: 0 } };
    mockClickBusterRegister = jasmine.createSpy('clickBusterRegister');

    mockRegistryMocks = {
      'React': React,
      'utility/utils': {
        bindMethods: mockBindMethods
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
          get: (name) => mockSettingsValue[name]
        }
      },
      'component/frameFactory/EmbedWrapper': {
        EmbedWrapper: MockEmbedWrapper
      },
      'lodash': _,
      'component/Icon': {
        Icon: noop
      },
      'baseCSS': '.base-css-file {} ',
      'mainCSS': '.main-css-file {} ',
      'snabbt.js': mockSnabbt
    };

    mockRegistry = initMockRegistry(mockRegistryMocks);

    mockChildFn = function() {
      return (
        <div
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

      expect(frameContainerStyle.top)
        .toEqual('0px');

      expect(frameContainerStyle.left)
        .toEqual('0px');

      expect(frameContainerStyle.zIndex > 0)
        .toEqual(true);
    });
  });

  describe('show', function() {
    let instance,
      mockOnShow;

    beforeEach(function() {
      mockSnabbt.calls.reset();

      mockOnShow = jasmine.createSpy('onShow');

      const Embed = frameFactory(mockChildFn, {
        onShow: mockOnShow
      });

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

    describe('without animation', function() {
      let instance;

      beforeEach(function() {
        const Embed = frameFactory(mockChildFn, {});

        instance = domRender(<Embed />);
      });

      it('does not apply the animation if it does not exist', function() {
        instance.show();

        expect(mockSnabbt)
          .not.toHaveBeenCalled();
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
              position: [1, 2, 3]
            }
          },
          afterShowAnimate: mockAfterShowAnimate,
          onShow: mockOnShow
        };

        const Embed = frameFactory(mockChildFn, mockFrameParams);

        instance = domRender(<Embed />);
      });

      it('applies snabbt animation', function() {
        instance.show({ transition: 'upShow' });

        expect(mockSnabbt)
          .toHaveBeenCalled();
      });

      it('should call snabbt with the provided config', function() {
        instance.show({ transition: 'upShow' });

        const config = mockSnabbt.calls.mostRecent().args[1];

        expect(config.position)
          .toEqual([1, 2, 3]);
      });

      it('should call onShow and afterShowAnimate if it\'s available', function() {
        instance.show({ transition: 'upShow' });

        mockSnabbtThen.calls.mostRecent().args[0].callback();

        expect(mockFrameParams.afterShowAnimate)
          .toHaveBeenCalled();
      });

      it('should call the onShow callback', function() {
        instance.show({ transition: 'upShow' });

        mockSnabbtThen.calls.mostRecent().args[0].callback();

        expect(mockFrameParams.onShow)
          .toHaveBeenCalled();
      });

      it('apply webkitOverflowScrolling when not set', function() {
        const frameContainer = ReactDOM.findDOMNode(instance).contentDocument.body.firstChild.firstChild;

        jasmine.clock().install();

        instance.show();

        jasmine.clock().tick(50);

        // Get the style AFTER the ticks
        const frameContainerStyle = frameContainer.style;

        expect(frameContainerStyle.WebkitOverflowScrolling)
          .toEqual('touch');

        jasmine.clock().uninstall();
      });

      describe('and no afterShowAnimate', function() {
        let mockFrameParams,
          instance;

        beforeEach(function() {
          mockSnabbt.calls.reset();

          mockFrameParams = {
            transitions: {
              upShow: {
                position: [1, 2, 3]
              }
            }
          };

          const Embed = frameFactory(mockChildFn, mockFrameParams);

          instance = domRender(<Embed />);
        });

        it('should not call afterShowAnimate if it\'s not available', function() {
          instance.show({ transition: 'upShow' });

          expect(mockSnabbtThen.calls.mostRecent().args[0].callback)
            .not.toThrow();
        });
      });

      describe('and no callback', function() {
        let mockFrameParams,
          instance;

        beforeEach(function() {
          mockSnabbt.calls.reset();

          mockFrameParams = {
            transitions: {
              upShow: {
                position: [1, 2, 3]
              }
            }
          };

          const Embed = frameFactory(mockChildFn, mockFrameParams);

          instance = domRender(<Embed />);
        });

        it('should not try to call the provided callback if it\'s not available', function() {
          instance.show({ transition: 'upShow' });

          expect(mockSnabbtThen.calls.mostRecent().args[0].callback)
            .not.toThrow();
        });
      });
    });
  });

  describe('hide', function() {
    let instance,
      mockOnHide;

    beforeEach(function() {
      mockSnabbt.calls.reset();

      mockOnHide = jasmine.createSpy('onHide');

      const Embed = frameFactory(mockChildFn, {
        onHide: mockOnHide
      });

      instance = domRender(<Embed />);
    });

    it('sets `visible` state to false', function() {
      instance.setState({ visible: true });

      instance.hide();

      expect(instance.state.visible)
        .toEqual(false);
    });

    it('triggers params.onHide if set', function() {
      instance.hide();

      expect(mockOnHide)
        .toHaveBeenCalled();
    });

    describe('without animation', function() {
      let instance;

      beforeEach(function() {
        mockSnabbt.calls.reset();

        const Embed = frameFactory(mockChildFn, {});

        instance = domRender(<Embed />);
      });

      it('does not apply the animation if it does not exist', function() {
        instance.hide();

        expect(mockSnabbt)
          .not.toHaveBeenCalled();
      });
    });

    describe('with animation', function() {
      let instance,
        mockFrameParams;

      beforeEach(function() {
        mockFrameParams = {
          transitions: {
            downHide: {
              position: [1, 2, 3]
            }
          },
          onHide: mockOnHide
        };

        const Embed = frameFactory(mockChildFn, mockFrameParams);

        instance = domRender(<Embed />);
      });

      it('should call snabbt', function() {
        instance.hide({ transition: 'downHide' });

        expect(mockSnabbt)
          .toHaveBeenCalled();
      });

      it('should call snabbt with the provided config', function() {
        instance.hide({ transition: 'downHide' });

        const config = mockSnabbt.calls.mostRecent().args[1];

        expect(config.position)
          .toEqual([1, 2, 3]);
      });

      it('should provide a callback to snabbt that sets `visible` to false', function() {
        instance.setState({ visible: true });

        instance.hide({ transition: 'downHide' });

        mockSnabbtThen.calls.mostRecent().args[0].callback();

        expect(instance.state.visible)
          .toEqual(false);
      });

      it('should call the onHide callback', function() {
        instance.hide({ transition: 'downHide' });

        mockSnabbtThen.calls.mostRecent().args[0].callback();

        expect(mockOnHide)
          .toHaveBeenCalled();
      });

      describe('and no callback', function() {
        beforeEach(function() {
          mockSnabbt.calls.reset();

          mockFrameParams = {
            transitions: {
              downHide: {
                position: [1, 2, 3]
              }
            }
          };

          const Embed = frameFactory(mockChildFn, mockFrameParams);

          instance = domRender(<Embed />);
        });

        it('should not try to call the provided callback if it\'s not available', function() {
          instance.hide({ transition: 'downHide' });

          expect(mockSnabbtThen.calls.mostRecent().args[0].callback)
            .not.toThrow();
        });
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
        });

        it('should call hide with close transition', () => {
          spyOn(instance, 'hide');
          instance.close();

          expect(instance.hide)
            .toHaveBeenCalledWith({ transition: 'close' });
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
        .toEqual('');

      instance.setState({ visible: true });

      expect(frameContainerStyle.cssText)
        .not.toContain('top:-9999px');

      expect(frameContainerStyle.cssText)
        .not.toContain('bottom:auto');
    });

    it('has horizontal style set to `right` when isRTL() evaluates to true', function() {
      const frameContainer = global.document.body.getElementsByTagName('iframe')[0];
      const frameContainerStyle = frameContainer.style;

      mockRegistry['service/i18n'].i18n.isRTL = function() {
        return true;
      };

      frameFactory = requireUncached(frameFactoryPath).frameFactory;

      instance.setState({ visible: false });

      expect(frameContainerStyle.top)
        .toEqual('-9999px');

      expect(frameContainerStyle.right)
        .toEqual('-9999px');

      expect(frameContainerStyle.bottom)
        .toEqual('');
    });

    it('has horizontal style set to `left` when isRTL() evaluates to false', function() {
      const frameContainer = global.document.body.getElementsByTagName('iframe')[0];
      const frameContainerStyle = frameContainer.style;

      mockRegistry['service/i18n'].i18n.isRTL = function() {
        return false;
      };

      frameFactory = requireUncached(frameFactoryPath).frameFactory;

      instance.setState({ visible: false });

      expect(frameContainerStyle.top)
        .toEqual('-9999px');

      expect(frameContainerStyle.left)
        .toEqual('-9999px');

      expect(frameContainerStyle.bottom)
        .toEqual('');
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
        .toEqual('');
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
