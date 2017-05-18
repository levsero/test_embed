describe('Launcher component', () => {
  let Launcher;
  const launcherPath = buildSrcPath('component/Launcher');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'utility/devices': {
        isMobileBrowser: () => {
          return false;
        }
      },
      'component/Icon': {
        Icon: noopReactComponent()
      },
      './Launcher.sass': {
        locals: ''
      },
      'service/i18n': {
        i18n: {
          t: _.identity
        }
      }
    });

    Launcher = requireUncached(launcherPath).default.WrappedComponent;
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('state', () => {
    let launcher;

    beforeEach(() => {
      launcher = instanceRender(<Launcher label='help' />);
    });

    it('should change the state icon when setIcon is called', () => {
      expect(launcher.state.icon)
        .not.toEqual('newIcon');

      launcher.setIcon('newIcon');

      expect(launcher.state.icon)
        .toEqual('newIcon');
    });

    it('should change the label when setLabel is called', () => {
      expect(launcher.state.label)
        .toEqual('help');

      launcher.setLabel('support');

      expect(launcher.state.label)
        .toEqual('support');
    });

    it('should change the labelOptions when setLabel is called with extra options', () => {
      expect(launcher.state.labelOptions)
        .toEqual({});

      launcher.setLabel('support', { some: 'thing' });

      expect(launcher.state.labelOptions)
        .toEqual({ some: 'thing' });
    });

    describe('when chat web SDK is initialized', () => {
      describe('when chat status goes online', () => {
        beforeEach(() => {
          launcher = domRender(<Launcher label='help' chatStatus='online' />);
        });

        it('should update the label to chat label', () => {
          expect(launcher.state.label)
            .toEqual('help');

          launcher.componentDidUpdate({ chatStatus: 'offline' });

          expect(launcher.state.label)
            .toContain('chat');
        });
      });

      describe('when chat status goes offline', () => {
        beforeEach(() => {
          launcher = domRender(<Launcher label='help' chatStatus='offline' />);

          launcher.setLabel('chat');
        });

        it('should update the label to chat label', () => {
          expect(launcher.state.label)
            .toEqual('chat');

          launcher.componentDidUpdate({ chatStatus: 'online' });

          expect(launcher.state.label)
            .toEqual('help');
        });
      });
    });
  });

  it('should call the updateFrameSize prop on render if it exists', () => {
    const mockUpdateFrameSize = jasmine.createSpy('mockUpdateFrameSize');

    shallowRender(<Launcher updateFrameSize={mockUpdateFrameSize} />);
    jasmine.clock().tick(10);

    expect(mockUpdateFrameSize).toHaveBeenCalled();
  });
});
