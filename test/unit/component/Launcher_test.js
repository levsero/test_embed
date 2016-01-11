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

  it('should correctly set the initial state when created', function() {
    const launcher = instanceRender(<Launcher icon='testIcon' />);

    expect(launcher.state.icon)
      .toEqual('testIcon');
  });

  it('should change the state icon when setIcon is called', function() {
    const launcher = instanceRender(<Launcher label='help' />);

    expect(launcher.state.icon)
      .not.toEqual('newIcon');

    launcher.setIcon('newIcon');

    expect(launcher.state.icon)
      .toEqual('newIcon');
  });

  it('should call the updateFrameSize prop on render if it exists', function() {
    const mockUpdateFrameSize = jasmine.createSpy('mockUpdateFrameSize');

    jasmine.clock().install();

    shallowRender(<Launcher updateFrameSize = {mockUpdateFrameSize} />);
    jasmine.clock().tick(10);

    expect(mockUpdateFrameSize).toHaveBeenCalled();
  });

  it('should change the label when setLabel is called', function() {
    const launcher = instanceRender(<Launcher label='help' />);

    expect(launcher.state.label)
      .toEqual('help');

    launcher.setLabel('support');

    expect(launcher.state.label)
      .toEqual('support');
  });
});
