/** @jsx React.DOM */

describe('frameFactory', function() {

  var frameFactory,
      mockComponent = React.createClass({
        render: function() {
          return <div />;
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
      frameFactory({}, {});
    }).toThrow();

    expect(function() {
      frameFactory('1', {});
    }).toThrow();

    expect(function() {
      frameFactory(noop, {});
    }).toThrow();
  });

  it('throws if childFn does not return a React component', function() {
    expect(function() {
      frameFactory(noop, {});
    }).toThrow();
  });

  it('has default prop value for `visible` set to true', function() {
    var payload = frameFactory(mockChildFn),
        defaultProps = payload.getDefaultProps();

    expect(defaultProps.visible).toEqual(true);
  });

  it('returns an object', function() {
    var payload;
    payload = frameFactory(mockChildFn);
    expect(typeof payload).toEqual('object');
  });
});
