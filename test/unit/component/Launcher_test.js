/** @jsx React.DOM */

describe('Launcher component', function() {
  var Launcher,
      launcherPath = buildSrcPath('component/Launcher');

  beforeEach(function() {
    resetDOM();

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

  it('should change the icon when set icon is called', function() {
    /* jshint quotmark: false */
    var launcher = React.renderComponent(
          <Launcher label='help' />,
          global.document.body
        );

    expect(global.document.body.querySelectorAll('.newIcon').length)
      .toEqual(0);

    launcher.setIcon('newIcon');

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

  it('should change the message when setMessage is called', function() {
    /* jshint quotmark: false */
    var launcher = React.renderComponent(
          <Launcher label='help'/>,
          global.document.body
        );

    expect(launcher.state.label)
      .toEqual('help');

    launcher.setLabel('support');

    expect(launcher.state.label)
      .toEqual('support');
  });
});
