/** @jsx React.DOM */

describe('Launcher component', function() {
  var Launcher;
  beforeEach(function() {
    resetDOM();

    var launcherPath = buildPath('component/Launcher');

    Launcher = require(launcherPath).Launcher;
  });

  it('should activate the onClick function when clicked on', function() {
    var onClick = jasmine.createSpy(),
        launcher = React.renderComponent(
          <Launcher onClick={onClick} />,
          global.document.body
        );

    ReactTestUtils.Simulate.click(launcher.getDOMNode());

    expect(onClick)
      .toHaveBeenCalled();
  });

  it('should correctly set the initial state when created', function() {
    /* jshint quotmark: false */
    var launcher = React.renderComponent(
      <Launcher icon='testIcon' />,
      global.document.body
    );

    expect(launcher.state.icon)
      .toEqual('testIcon');
  });

  it('should change the icon when change icon is called', function() {
    var launcher = React.renderComponent(
          <Launcher />,
          global.document.body
        );

    expect(global.document.body.querySelectorAll('.newIcon').length)
      .toEqual(0);

    launcher.changeIcon('newIcon');

    expect(global.document.body.querySelectorAll('.newIcon').length)
      .toEqual(1);
  });

  it('should call the updateFrameSize prop on render if it exists', function() {

    var mockUpdateFrameSize = jasmine.createSpy('mockUpdateFrameSize');

    jasmine.Clock.useMock();

    React.renderComponent(
      <Launcher updateFrameSize = {mockUpdateFrameSize} />,
      global.document.body
    );

    jasmine.Clock.tick(10);

    expect(mockUpdateFrameSize).toHaveBeenCalled();
  });
});
