describe('embed.launcher', () => {
  let launcher,
    mockFrame,
    mockRegistry;
  const launcherPath = buildSrcPath('embed/launcher/launcher');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    mockFrame = requireUncached(buildTestPath('unit/mockFrame')).MockFrame;

    mockRegistry = initMockRegistry({
      'React': React,
      'utility/globals': {
        document: global.document,
        getDocumentHost: () => {
          return document.body;
        }
      },
      'utility/color': {
        generateUserCSS: jasmine.createSpy().and.returnValue('')
      },
      'component/Launcher': class extends Component {
        constructor() {
          super();
          this.changeIcon = jasmine.createSpy('changeIcon');
          this.setActive = jasmine.createSpy('setActive');
          this.setIcon = jasmine.createSpy('setIcon');
          this.setLabel = jasmine.createSpy('setLabel');
          this.setLabelOptions = jasmine.createSpy('setLabelOptions');
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
      './launcher.scss': '',
      './launcherStyles.js': {
        launcherStyles: 'mockCss'
      },
      'component/frame/Frame': {
        Frame: mockFrame
      },
      'utility/devices': {
        isMobileBrowser: () => {
          return false;
        }
      },
      'lodash': _,
      'service/transitionFactory' : {
        transitionFactory: requireUncached(buildTestPath('unit/mockTransitionFactory')).mockTransitionFactory
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
          icon: 'tick',
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

      it('applies the icon from config to child', () => {
        expect(child.props.icon)
          .toEqual(config.icon);
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

      it('subscribes to <name>.refreshLocale', () => {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('alice.refreshLocale', jasmine.any(Function));
      });

      it('should subscribe to <name>.setLabelHelp', () => {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('alice.setLabelHelp', jasmine.any(Function));

        pluckSubscribeCall(mockMediator, 'alice.setLabelHelp')();

        expect(aliceLauncher.setIcon)
          .toHaveBeenCalledWith('Icon');

        expect(aliceLauncher.setLabel)
          .toHaveBeenCalledWith('embeddable_framework.launcher.label.test_label', {});
      });

      it('should subscribe to <name>.setLabelChat', () => {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('alice.setLabelChat', jasmine.any(Function));

        pluckSubscribeCall(mockMediator, 'alice.setLabelChat')();

        expect(aliceLauncher.setIcon)
          .toHaveBeenCalledWith('Icon--chat');

        expect(aliceLauncher.setLabel)
          .toHaveBeenCalled();
      });

      it('should subscribe to <name>.setLabelChatHelp', () => {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('alice.setLabelChatHelp', jasmine.any(Function));

        pluckSubscribeCall(mockMediator, 'alice.setLabelChatHelp')();

        expect(aliceLauncher.setIcon)
          .toHaveBeenCalledWith('Icon--chat');

        expect(aliceLauncher.setLabel)
          .toHaveBeenCalledWith('embeddable_framework.launcher.label.test_label', {});
      });

      describe('<name>.setLabelUnreadMsgs', () => {
        it('should subscribe to setLabelUnreadMsgs', () => {
          expect(mockMediator.channel.subscribe)
            .toHaveBeenCalledWith('alice.setLabelUnreadMsgs', jasmine.any(Function));
        });

        it('should call setLabel', () => {
          pluckSubscribeCall(mockMediator, 'alice.setLabelUnreadMsgs')();

          expect(aliceLauncher.setLabel)
            .toHaveBeenCalled();
        });

        describe('when there is one unread message', () => {
          it('should call setLabel with the singular notification translation', () => {
            pluckSubscribeCall(mockMediator, 'alice.setLabelUnreadMsgs')(1);

            expect(aliceLauncher.setLabel)
              .toHaveBeenCalledWith('embeddable_framework.chat.notification', {});
          });
        });

        describe('when there is more than one unread message', () => {
          it('should call setLabel with the multiple notification translation', () => {
            pluckSubscribeCall(mockMediator, 'alice.setLabelUnreadMsgs')(2);

            expect(aliceLauncher.setLabel)
              .toHaveBeenCalledWith('embeddable_framework.chat.notification_multiple', { count: 2 });
          });
        });
      });
    });
  });
});
