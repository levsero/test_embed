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

  describe('state', function() {
  let launcher;

  beforeEach(function() {
    launcher = instanceRender(<Launcher label='help' />);
  });

    it('should change the state icon when setIcon is called', function() {
      expect(launcher.state.icon)
        .not.toEqual('newIcon');

      launcher.setIcon('newIcon');

      expect(launcher.state.icon)
        .toEqual('newIcon');
    });

    it('should change the label when setLabel is called', function() {
      expect(launcher.state.label)
        .toEqual('help');

      launcher.setLabel('support');

      expect(launcher.state.label)
        .toEqual('support');
    });
  });

  it('should call the updateFrameSize prop on render if it exists', function() {
    const mockUpdateFrameSize = jasmine.createSpy('mockUpdateFrameSize');

    jasmine.clock().install();

    shallowRender(<Launcher updateFrameSize={mockUpdateFrameSize} />);
    jasmine.clock().tick(10);

    expect(mockUpdateFrameSize).toHaveBeenCalled();
  });
});
