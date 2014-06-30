/** @jsx React.DOM */

describe('frameFactory', function() {

  var frameFactory,
      mockComponent = React.createClass({
        render: function() {
          return <div className='mock-component' />;
        }
      }),
      mockChildFn = function() {
        return <mockComponent />;
      },
      frameFactoryPath = buildSrcPath('embed/frameFactory');

  beforeEach(function() {
    resetDOM();

    mockery.enable();

    mockery.registerMock('baseCSS', '');
    mockery.registerMock('mainCSS', '');
    mockery.registerMock('imports?_=lodash!lodash', _);

    frameFactory = require(frameFactoryPath).frameFactory;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('throws if childFn is not a function', function() {
    expect(function() {
      frameFactory({});
    }).toThrow();

    expect(function() {
      frameFactory('1');
    }).toThrow();

    expect(function() {
      frameFactory(noop);
    }).toThrow();
  });

  it('throws if childFn does not return a React component', function() {
    expect(function() {
      frameFactory(noop, {});
    }).toThrow();
  });

  describe('getDefaultProps', function() {
    it('has default prop value for `visible` set to true', function() {
      var payload = frameFactory(mockChildFn),
      defaultProps = payload.getDefaultProps();

      expect(defaultProps.visible).toEqual(true);
    });
  });

  describe('getInitialState', function() {
    it('picks up initial state for `visible` from the `visible` prop', function() {
      var Embed = React.createClass(frameFactory(mockChildFn)),
      instance = React.renderComponent(
          <Embed visible={false} />, 
        global.document.body
      );
      expect(instance.state.visible).toEqual(false);
    });
  });

  describe('getChild', function() {
    it('stores and exposes the child component via getChild()', function() {
      var Embed = React.createClass(frameFactory(mockChildFn)),
          instance = React.renderComponent(
            <Embed />, 
            global.document.body
          ),
          children = instance
            .getChild()
            ._renderedComponent
            .props
            .children,
          mockComponentIsPresent;
     
      // Epic traversal to verify that
      // mockComponent shows up as one
      // of the children inside `instance`
      mockComponentIsPresent = _.some(children, function(child) {
        if (child && child._renderedComponent) {
          return child
            .__realComponentInstance
            ._renderedComponent
            .props
            .className == 'mock-component';
        }
        return false;
      });
     
      expect(mockComponentIsPresent).toEqual(true);
    });
  });

  describe('updateFrameSize', function() {
    it('reads content dimensions and sets the state', function() {

      var payload = frameFactory(mockChildFn),
          Embed = React.createClass(payload),
          instance = React.renderComponent(
            <Embed />, 
            global.document.body
          ),
          iframe = global.document.body.getElementsByTagName('iframe')[0];

      jasmine.Clock.useMock();

      // This is the "dirty" state
      instance.setState({iframeDimensions: {width:999, height: 999}});

      expect(iframe.style.width)
        .toEqual('999px');

      expect(iframe.style.height)
        .toEqual('999px');

      // jsdom doesn't actually attempt to render a document
      // so client*/offset* will give use NaN which then gets ||'ed with 0.
      instance.updateFrameSize();

      jasmine.Clock.tick(10);

      // best we can do is check that that the width and height 
      // have been updated from 999 to 0.
      expect(iframe.style.width)
        .toEqual('0px');

      expect(iframe.style.height)
        .toEqual('0px');

      // TODO: real browser tests that work off client*/offset* values.
    });
  });

  describe('show', function() {
    it('sets `visible` state to true', function() {
      var payload = frameFactory(mockChildFn),
          Embed = React.createClass(payload),
          instance = React.renderComponent(
            <Embed />, 
            global.document.body
          );
      
      instance.setState({visible: false});

      instance.show();
      
      expect(instance.state.visible)
        .toEqual(true);

    });

    it('triggers params.onShow if set', function() {
      var mockOnShow = jasmine.createSpy('onShow'),
          payload = frameFactory(mockChildFn, {
            onShow: mockOnShow
          }),
          Embed = React.createClass(payload),
          instance = React.renderComponent(
            <Embed />, 
            global.document.body
          );
      
      instance.show();
      
      expect(mockOnShow).toHaveBeenCalled();
    });
  });

  describe('hide', function() {
    it('sets `visible` state to false', function() {
      var payload = frameFactory(mockChildFn),
          Embed = React.createClass(payload),
          instance = React.renderComponent(
            <Embed />, 
            global.document.body
          );
      
      instance.setState({visible: true});

      instance.hide();
      
      expect(instance.state.visible)
        .toEqual(false);

    });

    it('triggers params.onHide if set', function() {
      var mockOnHide = jasmine.createSpy('onHide'),
          payload = frameFactory(mockChildFn, {
            onHide: mockOnHide
          }),
          Embed = React.createClass(payload),
          instance = React.renderComponent(
            <Embed />, 
            global.document.body
          );
      
      instance.hide();
      
      expect(mockOnHide).toHaveBeenCalled();
    });
  });

  it('returns an object', function() {
    var payload;
    payload = frameFactory(mockChildFn);
    expect(typeof payload).toEqual('object');
  });
});
