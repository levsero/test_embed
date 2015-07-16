describe('Launcher component', function() {
  var Launcher,
      mockRegistry;
  const launcherPath = buildSrcPath('component/Launcher');

  beforeEach(function() {
    resetDOM();

    mockery.enable();

    mockRegistry = initMockRegistry({
      'utility/devices': {
        isMobileBrowser: function() {
          return false;
        }
      }
    });

    Launcher = require(launcherPath).Launcher;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should activate the onClick function when clicked on', function() {
    const onClick = jasmine.createSpy();
    const launcher = React.render(
      <Launcher onClick={onClick} />,
      global.document.body
    );

    ReactTestUtils.Simulate.click(launcher.getDOMNode());

    expect(onClick)
      .toHaveBeenCalled();
  });

  it('should correctly set the initial state when created', function() {
    /* jshint quotmark: false */
    const launcher = React.render(
      <Launcher icon='testIcon' />,
      global.document.body
    );

    expect(launcher.state.icon)
      .toEqual('testIcon');
  });

  it('should change the icon when set icon is called', function() {
    /* jshint quotmark: false */
    const launcher = React.render(
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

    const mockUpdateFrameSize = jasmine.createSpy('mockUpdateFrameSize');

    jasmine.clock().install();

    React.render(
      <Launcher updateFrameSize = {mockUpdateFrameSize} />,
      global.document.body
    );

    jasmine.clock().tick(10);

    expect(mockUpdateFrameSize).toHaveBeenCalled();
  });

  it('should change the label when setLabel is called', function() {
    /* jshint quotmark: false */
    const launcher = React.render(
          <Launcher label='help'/>,
          global.document.body
        );

    expect(launcher.state.label)
      .toEqual('help');

    launcher.setLabel('support');

    expect(launcher.state.label)
      .toEqual('support');
  });

  it('should change the icon when setActive is changed', function() {
    /* jshint quotmark: false */
    var launcher = React.render(
          <Launcher icon='testIcon'/>,
          global.document.body
        );

    expect(global.document.body.querySelectorAll('.Icon--cross').length)
      .toEqual(0);

    launcher.setActive(true);

    expect(global.document.body.querySelectorAll('.Icon--cross').length)
      .toEqual(1);

    launcher.setActive(false);

    expect(global.document.body.querySelectorAll('.Icon--cross').length)
      .toEqual(0);
  });
});
