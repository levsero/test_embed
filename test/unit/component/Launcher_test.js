/** @jsx React.DOM */
var Launcher;

describe('Launcher component', function() {
  beforeEach(function() {
    resetDOM();

    var launcherPath = buildPath('component/Launcher');

    Launcher = require(launcherPath).Launcher;
  });

  it('should activate the onClick function when clicked on', function () {
    var onClick = jasmine.createSpy(),
        launcher = React.renderComponent(<Launcher onClick={onClick} />, global.document.body);

    ReactTestUtils.Simulate.click(launcher.getDOMNode());

    expect(onClick).toHaveBeenCalled();
  });

  it('should use the correct className based on its position prop', function () {
    var leftpos = 'left',
        rightpos = 'right';

    React.renderComponent(<Launcher position={rightpos} />, global.document.body);
    expect(global.document.body.querySelectorAll('.Button--launcherAlt').length).toBe(0);

    resetDOM();

    React.renderComponent(<Launcher position={leftpos} />, global.document.body);
    expect(global.document.body.querySelectorAll('.Button--launcherAlt').length).toBe(1);
  });
});
