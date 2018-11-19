describe('embed.launcher', () => {
  let launcher,
    mockFrame,
    mockRegistry,
    mockIsMobileBrowser,
    mockZoomSizingRatioValue;
  const mockToken = 'someMockedToken';
  const launcherPath = buildSrcPath('embed/launcher/launcher');

  beforeEach(() => {
    mockIsMobileBrowser = false;
    mockZoomSizingRatioValue = 1;

    mockery.enable();

    mockFrame = requireUncached(buildTestPath('unit/mocks/mockFrame')).MockFrame;

    mockRegistry = initMockRegistry({
      'React': React,
      'utility/globals': {
        document: global.document,
        getDocumentHost: () => {
          return document.body;
        }
      },
      'utility/color/styles': {
        generateUserLauncherCSS: jasmine.createSpy().and.returnValue('')
      },
      'component/launcher/Launcher': class extends Component {
        constructor() {
          super();
          this.setUnreadMessages = jasmine.createSpy('setUnreadMessages');
        }
        render() {
          return (
            <div className='mock-launcher' />
          );
        }
      },
      'service/beacon': {
        beacon: jasmine.createSpyObj('mockBeacon', ['trackUserAction'])
      },
      'service/i18n': {
        i18n: {
          t: _.identity
        }
      },
      'service/mediator': {
        mediator: {
          channel: jasmine.createSpyObj('channel', ['broadcast', 'subscribe'])
        }
      },
      'globalCSS': '',
      './launcherStyles.js': {
        launcherStyles: 'mockCss'
      },
      'component/frame/Frame': mockFrame,
      'utility/devices': {
        isMobileBrowser: () => mockIsMobileBrowser,
        getZoomSizingRatio: () => mockZoomSizingRatioValue
      },
      'lodash': _,
      'src/redux/modules/base': {
        renewToken: () => mockToken
      },
      'constants/launcher': {
        FRAME_OFFSET_WIDTH: 5,
        FRAME_OFFSET_HEIGHT: 1
      }
    });

    mockery.registerAllowable(launcherPath);
    launcher = requireUncached(launcherPath).launcher;
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('create', () => {
    it('should add a new launcher to the internal list', () => {
      launcher.create('launcher');
      launcher.render();
      const alice = launcher.get();

      expect(alice)
        .toBeDefined();

      expect(alice.instance)
        .toBeDefined();

      expect(alice.config)
        .toBeDefined();
    });

    it('changes config.labelKey if labelKey is set', () => {
      launcher.create('launcher', { labelKey: 'test_label' });

      const alice = launcher.get();

      expect(alice.config.labelKey)
        .toEqual('test_label');
    });

    describe('config', () => {
      let config,
        frame,
        child,
        alice;

      beforeEach(() => {
        config = {
          onClick: jasmine.createSpy(),
          visible: true
        };
        launcher.create('launcher', config);
        launcher.render();
        alice = launcher.get();
        frame = alice.instance;
        child = frame.props.children;
      });

      it('applies the position from config to frame', () => {
        expect(frame.props.position)
          .toEqual(alice.config.position);
      });

      it('applies the label from config', () => {
        expect(child.props.labelKey)
          .toEqual(`embeddable_framework.launcher.label.${alice.config.labelKey}`);
      });

      it('sets fullscreenable to false', () => {
        expect(frame.props.fullscreenable)
          .toEqual(false);
      });
    });

    describe('launcher onClick', () => {
      let config,
        reduxStore,
        dispatchSpy,
        bob,
        frame,
        child;

      beforeEach(() => {
        dispatchSpy = jasmine.createSpy('dispatch');
        reduxStore = {
          dispatch: dispatchSpy
        };
        launcher.create('bob', config, reduxStore);
        bob = launcher.get();
        frame = bob.component.props.children;
        child = frame.props.children;
        child.props.onClickHandler({
          preventDefault: () => {}
        });
      });

      it('calls dispatch', () => {
        expect(dispatchSpy)
          .toHaveBeenCalledWith(mockToken);
      });
    });
  });

  describe('get', () => {
    it('should return the correct launcher', () => {
      const config = {
        position: 'test_alice_position',
        onClick: () => 'launcher',
        icon: '',
        visible: true
      };

      launcher.create('launcher', config);
      const alice = launcher.get();

      expect(alice)
        .not.toBeUndefined();

      expect(alice.config.position)
        .toEqual(config.position);

      expect(alice.config.icon)
        .toEqual(config.icon);

      expect(alice.config.visible)
        .toEqual(config.visible);
    });
  });

  describe('render', () => {
    it('should throw an exception if launcher does not exist', () => {
      expect(() => {
        launcher.render();
      }).toThrow();
    });

    it('renders a launcher', () => {
      launcher.create('launcher');
      launcher.render();

      expect(launcher.get().instance)
        .toBeDefined();
    });

    it('should only be allowed to render an launcher once', () => {
      launcher.create('launcher');

      expect(() => {
        launcher.render();
      }).not.toThrow();

      expect(() => {
        launcher.render();
      }).toThrow();
    });

    it('applies launcher styles to the frame', () => {
      launcher.create('launcher');
      launcher.render();

      expect(launcher.get().component.props.children.props.css)
        .toContain('mockCss');
    });

    describe('mediator subscriptions', () => {
      let mockMediator,
        alice,
        aliceLauncher;

      beforeEach(() => {
        mockMediator = mockRegistry['service/mediator'].mediator;
        launcher.create('launcher', { labelKey: 'test_label' });
        launcher.render();
        alice = launcher.get();
        aliceLauncher = alice.instance.getRootComponent();
      });

      describe('when webWidget.updateSettings is broadcast', () => {
        beforeEach(() => {
          spyOn(alice.instance, 'forceUpdateWorld');

          pluckSubscribeCall(mockMediator, 'launcher.updateSettings')();
        });

        it('subscribes to <name>.updateSettings', () => {
          expect(mockMediator.channel.subscribe)
            .toHaveBeenCalledWith('launcher.updateSettings', jasmine.any(Function));
        });
      });

      describe('<name>.refreshLocale', () => {
        beforeEach(() => {
          spyOn(alice.instance, 'updateFrameLocale');
          spyOn(aliceLauncher, 'forceUpdate');

          pluckSubscribeCall(mockMediator, 'launcher.refreshLocale')();
        });

        it('subscribes to <name>.refreshLocale', () => {
          expect(mockMediator.channel.subscribe)
            .toHaveBeenCalledWith('launcher.refreshLocale', jasmine.any(Function));
        });

        it('should call setLabel', () => {
          expect(alice.instance.updateFrameLocale)
            .toHaveBeenCalled();
        });

        it('should call forceUpdate', () => {
          expect(aliceLauncher.forceUpdate)
            .toHaveBeenCalled();
        });
      });

      describe('<name>.setUnreadMsgs', () => {
        it('should subscribe to setUnreadMsgs', () => {
          expect(mockMediator.channel.subscribe)
            .toHaveBeenCalledWith('launcher.setUnreadMsgs', jasmine.any(Function));
        });

        it('should call setLabel', () => {
          pluckSubscribeCall(mockMediator, 'launcher.setUnreadMsgs')();

          expect(aliceLauncher.setUnreadMessages)
            .toHaveBeenCalled();
        });
      });
    });

    describe('frameStyleModifier prop', () => {
      const element = {
        offsetWidth: 50,
        clientWidth: 20
      };

      describe('adjustStylesForZoom', () => {
        let result;
        const frameStyleProperties = ['width', 'height', 'marginBottom', 'marginRight', 'zIndex'];
        const frameStyle = {
          width: '10px',
          height: '10px',
          marginBottom: '15px',
          marginRight: '25px',
          zIndex: '999999'
        };

        beforeEach(() => {
          mockIsMobileBrowser = true;
          mockZoomSizingRatioValue = Math.random();
          launcher.create('launcher');
          launcher.render();

          const alice = launcher.get().instance;
          const frameStyleModifier = alice.props.frameStyleModifier;

          result = frameStyleModifier(frameStyle, element);
        });

        afterEach(() => {
          mockIsMobileBrowser = false;
          mockZoomSizingRatioValue = 1;
        });

        it('does not omit properties from frameStyle', () => {
          frameStyleProperties.forEach((subject) => {
            expect(_.has(result, subject))
              .toEqual(true);
          });
        });

        it('adjusts margin properties accordingly', () => {
          const getMargin = (value) => {
            return Math.round(value * mockZoomSizingRatioValue) + 'px';
          };
          const expected = {
            marginBottom: getMargin(15),
            marginRight: getMargin(25)
          };

          expect(result)
            .toEqual(jasmine.objectContaining(expected));
        });

        it('adjusts height property accordingly', () => {
          const expected = {
            height: `${50*mockZoomSizingRatioValue}px`
          };

          expect(result)
            .toEqual(jasmine.objectContaining(expected));
        });
      });

      describe('adjustWidth', () => {
        let result;
        const frameStyle = {
          width: '10px',
          height: '10px'
        };

        beforeEach(() => {
          launcher.create('launcher');
          launcher.render();

          const alice = launcher.get().instance;
          const frameStyleModifier = alice.props.frameStyleModifier;

          result = frameStyleModifier(frameStyle, element);
        });

        it('adjust the width using the element', () => {
          const expected = {
            width: 55,
            height: '10px'
          };

          expect(result)
            .toEqual(jasmine.objectContaining(expected));
        });
      });
    });
  });
});
