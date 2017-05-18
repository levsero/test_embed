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
        Icon: class extends Component {
          render() {
            return <div className={this.props.className}>{this.props.type}</div>;
          }
        }
      },
      './Launcher.sass': {
        locals: {
          label: 'labelClasses',
          icon: 'iconClasses'
        }
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
  });

  describe('render', () => {
    const mockUpdateFrameSize = jasmine.createSpy('mockUpdateFrameSize');
    let launcher;

    beforeEach(() => {
      launcher = domRender(<Launcher updateFrameSize={mockUpdateFrameSize} />);
    });

    it('should call the updateFrameSize prop on render if it exists', () => {
      jasmine.clock().tick(10);

      expect(mockUpdateFrameSize).toHaveBeenCalled();
    });

    it('should set the label to based on the state', () => {
      launcher.setState({ label: 'foo' });

      expect(ReactDOM.findDOMNode(launcher).querySelector('.labelClasses').innerHTML)
        .toEqual('foo');
    });

    it('should set the icon to based on the state', () => {
      launcher.setState({ icon: 'bar' });

      expect(ReactDOM.findDOMNode(launcher).querySelector('.iconClasses').innerHTML)
        .toEqual('bar');
    });

    describe('when props.chatStatus is online', () => {
      beforeEach(() => {
        launcher = domRender(<Launcher chatStatus='online' />);
      });

      it('should ignore state and set label to online', () => {
        launcher.setState({ label: 'foo' });

        expect(ReactDOM.findDOMNode(launcher).querySelector('.labelClasses').innerHTML)
          .toContain('chat');
      });

      it('should ignore state and set label to Icon--chat', () => {
        launcher.setState({ icon: 'bar' });

        expect(ReactDOM.findDOMNode(launcher).querySelector('.iconClasses').innerHTML)
          .toEqual('Icon--chat');
      });
    });
  });
});
