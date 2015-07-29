describe('frameFactory', function() {

  let frameFactory,
      mockRegistry,
      mockRegistryMocks,
      mockChildFn;
  const frameFactoryPath = buildSrcPath('embed/frameFactory');

  beforeEach(function() {
    resetDOM();

    mockery.enable({
      useCleanCache: true
    });

    mockRegistryMocks = {
      'react/addons': React,
      'utility/utils': {
        clickBusterRegister: noop
      },
      'utility/globals': {
        win: window
      },
      'utility/devices': {
        getSizingRatio: function() {
          return 1;
        },
        isMobileBrowser: function() {
          return false;
        }
      },
      'service/i18n': {
        i18n: jasmine.createSpyObj('i18n', ['t', 'isRTL', 'getLocale'])
      },
      'component/Button': {
        ButtonNav: noopReactComponent()
      },
      'lodash': _,
      'component/Icon': {
        Icon: noop
      },
      'baseCSS': '.base-css-file {} ',
      'mainCSS': '.main-css-file {} ',
      'snabbt.js': {
        snabbt: jasmine.createSpy('snabbt.js')
      }
    };

    mockRegistry = initMockRegistry(mockRegistryMocks);

    mockChildFn = function() {
      return (
        /* jshint quotmark:false */
        <div
          className='mock-component'
          ref='aliceComponent' />
      );
    };

    frameFactory = require(frameFactoryPath).frameFactory;
  });

  afterEach(function() {
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
        return <mockComponent />;
      };
      expect(function() {
        frameFactory(childFn);
      }).not.toThrow();
    });

    it('should not throw if childFn returns a React DOM component', function() {
      const childFn = function() {
        return <div />;
      };
      expect(function() {
        frameFactory(childFn);
      }).not.toThrow();
    });
  });

  describe('getDefaultProps', function() {
    it('has default prop value for `visible` set to true', function() {
      const payload = frameFactory(mockChildFn);
      const defaultProps = payload.getDefaultProps();

      expect(defaultProps.visible)
        .toEqual(true);
    });
  });

  describe('getInitialState', function() {
    it('picks up initial state for `visible` from the `visible` prop', function() {
      const Embed = React.createClass(frameFactory(mockChildFn));
      const instance = React.render(
        <Embed visible={false} />,
        global.document.body
      );

      expect(instance.state.visible)
        .toEqual(false);
    });
  });

  describe('getChild', function() {
    it('stores and exposes the child component via getChild()', function() {
      const Embed = React.createClass(frameFactory(mockChildFn));
      const instance = React.render(
        <Embed />,
        global.document.body
      );

      expect(function() {
        ReactTestUtils
          .findRenderedDOMComponentWithClass(
            instance.getChild(),
            'mock-component'
          );
      }).not.toThrow();

    });
  });

  describe('updateFrameSize', function() {
    it('reads content dimensions and sets the state', function() {
      const payload = frameFactory(mockChildFn);
      const Embed = React.createClass(payload);
      const instance = React.render(
        <Embed />,
        global.document.body
      );
      const frameContainer = global.document.body.getElementsByTagName('iframe')[0];
      const frameContainerStyle = frameContainer.style;

      jasmine.clock().install();

      // This is the "dirty" state
      instance.setState({iframeDimensions: {width:999, height: 999}});

      expect(frameContainerStyle.width)
        .toEqual('999px');

      expect(frameContainerStyle.height)
        .toEqual('999px');

      // jsdom doesn't actually attempt to render a document
      // so client*/offset* will give use NaN which then gets ||'ed with 0.
      instance.updateFrameSize();

      jasmine.clock().tick(10);

      // best we can do is check that that the width and height
      // have been updated from 999 to 0.
      expect(frameContainerStyle.width)
        .toEqual('0px');

      expect(frameContainerStyle.height)
        .toEqual('0px');

      // TODO: real browser tests that work off client*/offset* values.
    });

    it('respects the fullscreenable parameter', function() {
      let payload,
          Embed,
          instance,
          frameContainer,
          frameContainerStyle;

      mockRegistry['utility/devices'].isMobileBrowser = function() {
        return true;
      };
      mockRegistry['utility/globals'].win.innerWidth = 100;

      jasmine.clock().install();

      mockery.resetCache();

      frameFactory = require(frameFactoryPath).frameFactory;

      payload = frameFactory(mockChildFn, {
        fullscreenable: true
      });

      Embed = React.createClass(payload);
      instance = React.render(
          <Embed />,
        global.document.body
      );

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
        mockOnShow,
        snabbt;

    beforeEach(function() {
      let payload,
          Embed;

      snabbt = mockRegistry['snabbt.js'].snabbt;

      mockOnShow = jasmine.createSpy('onShow');

      payload = frameFactory(mockChildFn, {
        onShow: mockOnShow
      }),

      Embed = React.createClass(payload);

      instance = React.render(
          <Embed />,
        global.document.body
      );
    });

    it('sets `visible` state to true', function() {
      instance.setState({visible: false});

      instance.show();

      expect(instance.state.visible)
        .toEqual(true);
    });

    it('triggers params.onShow if set', function() {
      instance.show();

      expect(mockOnShow)
        .toHaveBeenCalled();
    });

    it('applies animation on show', function() {
      instance.show(true);

      expect(snabbt)
        .toHaveBeenCalled();
    });

    it('don\'t apply animation when argument isn\'t passed', function() {
      instance.show();

      expect(snabbt)
        .not.toHaveBeenCalled();
    });

    it('apply webkitOverflowScrolling when not set', function() {
      const frameContainer = instance.getDOMNode().contentDocument.body.firstChild;

      jasmine.clock().install();

      instance.show(true);

      jasmine.clock().tick(50);

      // Get the style AFTER the ticks
      const frameContainerStyle = frameContainer.style;

      expect(frameContainerStyle.webkitOverflowScrolling)
        .toEqual('touch');

      jasmine.clock().uninstall();
    });

  });

  describe('hide', function() {
    let instance,
        mockOnHide;

    beforeEach(function() {
      mockOnHide = jasmine.createSpy('onHide');

      const payload = frameFactory(mockChildFn, {
        onHide: mockOnHide
      });

      const Embed = React.createClass(payload);

      instance = React.render(
          <Embed />,
        global.document.body
      );
    });

    it('sets `visible` state to false', function() {
      instance.setState({visible: true});

      instance.hide();

      expect(instance.state.visible)
        .toEqual(false);
    });

    it('triggers params.onHide if set', function() {
      instance.hide();

      expect(mockOnHide)
        .toHaveBeenCalled();
    });
  });

  describe('render', function() {
    let instance;

    beforeEach(function() {
      const payload = frameFactory(mockChildFn, {
        style: {
          backgroundColor: '#abc'
        }
      });
      const Embed = React.createClass(payload);

      instance = React.render(
        <Embed visible={false} />,
        global.document.body
      );
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

      instance.setState({visible: false});

      expect(frameContainerStyle.top)
        .toEqual('-9999px');

      expect(frameContainerStyle.bottom)
        .toEqual('auto');

      instance.setState({visible: true});

      expect(frameContainerStyle.cssText)
        .not.toContain('top:-9999px');

      expect(frameContainerStyle.cssText)
        .not.toContain('bottom:auto');
    });

    it('has `border` css rule set to none', function() {
      const iframe = global.document.body.getElementsByTagName('iframe')[0];

      expect(iframe.style.border)
        .toEqual('none');
    });

    it('merges in css rules from params.style with correct precedence', function() {
      const frameContainer = global.document.body.getElementsByTagName('iframe')[0];
      const frameContainerStyle = frameContainer.style;

      expect(frameContainerStyle.backgroundColor)
        .toEqual('#abc');

      expect(frameContainerStyle.top)
        .toEqual('-9999px');

      expect(frameContainerStyle.bottom)
        .toEqual('auto');

    });

  });

  describe('renderFrameContent', function() {

    it('adds a <style> block with relevant rules to the iframe document', function() {
      const payload = frameFactory(mockChildFn, {
        css: '.params-css {} '
      });
      const Embed = React.createClass(payload);
      const instance = React.render(
        <Embed />,
        global.document.body
      );
      const child = instance.getChild();
      const styleBlock = child.getDOMNode().getElementsByTagName('style')[0];

      expect(styleBlock.innerHTML.indexOf('.base-css-file {}') >= 0)
        .toBeTruthy();

      expect(styleBlock.innerHTML.indexOf('.main-css-file {}') >= 0)
        .toBeTruthy();

      expect(styleBlock.innerHTML.indexOf('.params-css {}') >= 0)
        .toBeTruthy();
    });

    it('injects params.extend functions into the child component', function() {
      const mockClickHandler = jasmine.createSpy('mockClickHandler');
      const mockSubmitHandler = jasmine.createSpy('mockSubmitHandler');
      const payload = frameFactory(
        function(params) {
          return (
            /* jshint quotmark:false */
            <mockComponent
              ref='aliceComponent'
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
      const Embed = React.createClass(payload);
      const instance = React.render(
        <Embed />,
        global.document.body
      );
      const child = instance.getChild().refs.aliceComponent;

      child.props.onClick('click param');

      expect(mockClickHandler)
        .toHaveBeenCalledWith('click param');

      child.props.onSubmit('submit param');

      expect(mockSubmitHandler)
        .toHaveBeenCalledWith('submit param');
    });

    it('injects the internal updateFrameSize into the child component', function() {
      const mockUpdateFrameSize = jasmine.createSpy('mockUpdateFrameSize');
      const payload = frameFactory(
        function(params) {
          return (
            /* jshint quotmark:false */
            <mockComponent
              ref='aliceComponent'
              updateFrameSize={params.updateFrameSize} />
          );
        },
        {
          extend: {
            updateFrameSize: mockUpdateFrameSize
          }
        }
      );
      const Embed = React.createClass(payload);
      const instance = React.render(
        <Embed />,
        global.document.body
      );
      const child = instance.getChild().refs.aliceComponent;

      jasmine.clock().install();

      // setup "dirty" state
      instance.setState({
        iframeDimensions: {width: -1, height: -1}
      });

      child.props.updateFrameSize();

      jasmine.clock().tick(10);

      // should have called the internal updateFrameSize
      // which updates the iframeDimensions state
      expect(instance.state.iframeDimensions)
        .toEqual({width: 0, height: 0});

      // shouldn't call the injected updateFrameSize prop
      expect(mockUpdateFrameSize)
        .not.toHaveBeenCalled();
    });

    it('renders the child component to the document', function() {
      const payload = frameFactory(mockChildFn);
      const Embed = React.createClass(payload);
      const instance = React.render(
        <Embed />,
        global.document.body
      );

      expect(instance.getChild().refs.aliceComponent)
        .toBeDefined();
    });

    it('updates `state._rendered` at the end', function() {
      const payload = frameFactory(mockChildFn);
      const Embed = React.createClass(payload);
      const instance = React.render(
        <Embed />,
        global.document.body
      );

      expect(instance.getInitialState()._rendered)
        .toEqual(false);

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

      const payload = frameFactory(mockChildFn);
      const Embed = React.createClass(payload);

      React.render(
        <Embed />,
        global.document.body
      );

      const iframe = global.document.body.getElementsByTagName('iframe')[0];
      const htmlElem = iframe.contentDocument.documentElement;

      expect(htmlElem.getAttribute('dir'))
        .toEqual('rtl');

      expect(htmlElem.getAttribute('lang'))
        .toEqual('ar');
    });

  });

});
