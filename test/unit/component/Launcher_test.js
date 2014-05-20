/** @jsx React.DOM */
var Launcher;

describe('Launcher component', function() {
  beforeEach(function() {

    mockery.enable({
      warnOnReplace:false
    });

    var launcherPath = buildPath('component/Launcher');

    mockery.registerAllowable(launcherPath);
    mockery.registerAllowable('react');
    mockery.registerAllowable('./lib/React');
    mockery.registerAllowable('./jsdom/selectors/index');
    mockery.registerAllowable('react/addons');
    Launcher = require(launcherPath).Launcher;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should be added to the document when called', function () {
    var launcher = React.renderComponent(<Launcher />, global.document.body);

    expect(launcher.getDOMNode()).toBeDefined();
  });

  it('should have the correct props when defined', function () {
    var launcher1 = <Launcher />;

    expect(launcher1.props.position).toBeUndefined();
    expect(launcher1.props.onClick).toBeUndefined();

    var pos = 'left',
        func = function(){},
        launcher2 = <Launcher position={pos} onClick={func} />;

    expect(launcher2.props.position).toEqual(pos);
    expect(launcher2.props.onClick).toBeDefined();

  });

  it('should active the onClick function when clicked on', function () {
    var func = jasmine.createSpy(function(){}),
        launcher = React.renderComponent(<Launcher onClick={func}/>, global.document.body);

    ReactTestUtils.Simulate.click(launcher.refs.l);

    expect(func).toHaveBeenCalled();
  });

});

