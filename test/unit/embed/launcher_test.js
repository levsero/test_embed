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
      'component/Launcher': class extends Component {
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
      'service/settings': {
        settings: {
          get: () => {}
        }
      },
      'globalCSS': '',
      './launcherStyles.js': {
        launcherStyles: 'mockCss'
      },
      'component/frame/Frame': {
        Frame: mockFrame
      },
      'utility/devices': {
        isMobileBrowser: () => mockIsMobileBrowser,
        getZoomSizingRatio: () => mockZoomSizingRatioValue
      },
      'lodash': _,
      'src/redux/modules/base': {
        renewToken: () => mockToken
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
      expect(_.keys(launcher.list()).length)
        .toBe(0);

      launcher.create('alice');

      expect(_.keys(launcher.list()).length)
        .toBe(1);

      const alice = launcher.get('alice');

      expect(alice)
        .toBeDefined();

      expect(alice.component)
        .toBeDefined();

      expect(alice.config)
        .toBeDefined();
    });

    it('changes config.labelKey if labelKey is set', () => {
      launcher.create('alice', { labelKey: 'test_label' });

      const alice = launcher.get('alice');

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
          position: 'test_position',
          visible: true
        };
        launcher.create('alice', config);
        alice = launcher.get('alice');
        frame = alice.component;
        child = frame.props.children;
      });

      it('applies the position from config to frame', () => {
        expect(frame.props.position)
          .toEqual(config.position);
      });

      it('applies the label from config', () => {
        expect(child.props.label)
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
        bob = launcher.get('bob');
        frame = bob.component;
        child = frame.props.children;
        child.props.onClick({
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
        onClick: () => 'alice',
        icon: '',
        visible: true
      };

      launcher.create('alice', config);
      const alice = launcher.get('alice');

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
        launcher.render('non_existent_launcher');
      }).toThrow();
    });

    it('renders a launcher', () => {
      launcher.create('alice');
      launcher.render('alice');

      expect(launcher.get('alice').instance)
        .toBeDefined();
    });

    it('should only be allowed to render an launcher once', () => {
      launcher.create('alice');

      expect(() => {
        launcher.render('alice');
      }).not.toThrow();

      expect(() => {
        launcher.render('alice');
      }).toThrow();
    });

    it('applies launcher styles to the frame', () => {
      launcher.create('alice');
      launcher.render('alice');

      expect(launcher.get('alice').component.props.css)
        .toContain('mockCss');
    });

    describe('mediator subscriptions', () => {
      let mockMediator,
        alice,
        aliceLauncher;

      beforeEach(() => {
        mockMediator = mockRegistry['service/mediator'].mediator;
        launcher.create('alice', { labelKey: 'test_label' });
        launcher.render('alice');
        alice = launcher.get('alice');
        aliceLauncher = alice.instance.getChild().refs.rootComponent;
      });

      it('should subscribe to <name>.hide', () => {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('alice.hide', jasmine.any(Function));

        spyOn(alice.instance, 'hide');

        pluckSubscribeCall(mockMediator, 'alice.hide')();

        expect(alice.instance.hide)
          .toHaveBeenCalled();
      });

      it('should subscribe to <name>.show', () => {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('alice.show', jasmine.any(Function));

        spyOn(alice.instance, 'show');

        pluckSubscribeCall(mockMediator, 'alice.show')();

        expect(alice.instance.show)
          .toHaveBeenCalled();
      });

      describe('<name>.refreshLocale', () => {
        beforeEach(() => {
          spyOn(alice.instance, 'updateFrameLocale');
          spyOn(aliceLauncher, 'forceUpdate');

          pluckSubscribeCall(mockMediator, 'alice.refreshLocale')();
        });

        it('subscribes to <name>.refreshLocale', () => {
          expect(mockMediator.channel.subscribe)
            .toHaveBeenCalledWith('alice.refreshLocale', jasmine.any(Function));
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
            .toHaveBeenCalledWith('alice.setUnreadMsgs', jasmine.any(Function));
        });

        it('should call setLabel', () => {
          pluckSubscribeCall(mockMediator, 'alice.setUnreadMsgs')();

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
          launcher.create('alice');
          launcher.render('alice');

          const alice = launcher.get('alice').instance;
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
          launcher.create('alice');
          launcher.render('alice');

          const alice = launcher.get('alice').instance;
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
