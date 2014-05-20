/** @jsx React.DOM */
var Launcher, baseLauncher, propsLauncher, pos, div;

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

    var onClick = function(){};
    pos = 'left';
    div = document.body.appendChild(document.createElement('div'));
    baseLauncher = <Launcher />;
    propsLauncher = <Launcher position={pos} onClick={onClick} />;

  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();

    if(div) {
      div.parentNode.removeChild(div);
    }
  });

  it('should be added to the document when called', function () {
    var launcher = React.renderComponent(baseLauncher, div);
    expect(launcher.getDOMNode()).toBeDefined();
  });

  it('should have the correct props when defined', function () {
    expect(baseLauncher.props.position).toBeUndefined();
    expect(baseLauncher.props.onClick).toBeUndefined();

    expect(propsLauncher.props.position).toEqual(pos);
    expect(propsLauncher.props.onClick).toBeDefined();
  });

  it('should active the onClick function when clicked on', function () {
    var onClick = jasmine.createSpy(function(){}),
        launcher = React.renderComponent(<Launcher onClick={onClick}/>, div);

    ReactTestUtils.Simulate.click(launcher.refs.l);

    expect(onClick).toHaveBeenCalled();
  });

});

