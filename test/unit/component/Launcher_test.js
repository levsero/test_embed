/** @jsx React.DOM */

describe('Launcher component', function() {
  var Launcher;
  beforeEach(function() {
    resetDOM();

    var launcherPath = buildPath('component/Launcher');

    Launcher = require(launcherPath).Launcher;
  });

  it('should activate the onClick function when clicked on', function () {
    var onClick = jasmine.createSpy(),
        launcher = React.renderComponent(
          <Launcher onClick={onClick} />,
          global.document.body
        );

    ReactTestUtils.Simulate.click(launcher.getDOMNode());

    expect(onClick)
      .toHaveBeenCalled();
  });

  it('should use the correct className when position prop is "left"', function () {
    var leftpos = 'left',
        result;

    React.renderComponent(
      <Launcher position={leftpos} />,
      global.document.body
    );
    result = global.document.body.querySelectorAll('.Button--launcherAlt');
    expect(result.length)
      .toBe(1);
  });

  it('should use the correct className when position prop is "right"', function () {
    var rightpos = 'right',
        result;

    React.renderComponent(
      <Launcher position={rightpos} />,
      global.document.body
    );

    result = global.document.body.querySelectorAll('.Button--launcherAlt');
    expect(result.length)
      .toBe(0);
  });
});
