describe('Launcher component', function() {
  let Launcher;
  const launcherPath = buildSrcPath('component/Launcher');

  beforeEach(function() {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'utility/devices': {
        isMobileBrowser: function() {
          return false;
        }
      },
      'component/Icon': {
        Icon: noopReactComponent()
      }
    });

    Launcher = requireUncached(launcherPath).Launcher;
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
    const launcher = React.render(
      <Launcher icon='testIcon' />,
      global.document.body
    );

    expect(launcher.state.icon)
      .toEqual('testIcon');
  });

  it('should change the state icon when setIcon is called', function() {
    const launcher = React.render(
      <Launcher label='help' />,
      global.document.body
    );

    expect(launcher.state.icon)
      .not.toEqual('newIcon');

    launcher.setIcon('newIcon');

    expect(launcher.state.icon)
      .toEqual('newIcon');
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
});
