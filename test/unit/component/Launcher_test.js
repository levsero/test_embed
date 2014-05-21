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

    ReactTestUtils.Simulate.click(launcher.refs.l);

    expect(onClick).toHaveBeenCalled();
  });
});
