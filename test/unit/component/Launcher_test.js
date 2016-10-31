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
      },
      'service/i18n': {
        i18n: {
          t: _.identity
        }
      }
    });

    Launcher = requireUncached(launcherPath).Launcher;
    jasmine.clock().install();
  });

  afterEach(function() {
    jasmine.clock().uninstall();
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

    it('should change the labelOptions when setLabel is called with extra options', function() {
      expect(launcher.state.labelOptions)
        .toEqual({});

      launcher.setLabel('support', { some: 'thing' });

      expect(launcher.state.labelOptions)
        .toEqual({ some: 'thing' });
    });
  });

  it('should call the updateFrameSize prop on render if it exists', function() {
    const mockUpdateFrameSize = jasmine.createSpy('mockUpdateFrameSize');

    shallowRender(<Launcher updateFrameSize={mockUpdateFrameSize} />);
    jasmine.clock().tick(10);

    expect(mockUpdateFrameSize).toHaveBeenCalled();
  });
});
