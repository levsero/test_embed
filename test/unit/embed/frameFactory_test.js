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

  it('stores and exposes the child component via getChild()', function() {
    var Embed = React.createClass(frameFactory(mockChildFn)),
        instance = React.renderComponent(
            <Embed visible={false} />, 
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

  it('returns an object', function() {
    var payload;
    payload = frameFactory(mockChildFn);
    expect(typeof payload).toEqual('object');
  });
});
