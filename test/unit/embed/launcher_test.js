describe('embed.launcher', function() {
  let launcher,
    mockRegistry;
  const launcherPath = buildSrcPath('embed/launcher/launcher');

  beforeEach(function() {
    resetDOM();

    mockery.enable();

    mockRegistry = initMockRegistry({
      'React': React,
      'utility/globals': {
        document: global.document,
        getDocumentHost: function() {
          return document.body;
        }
      },
      'utility/color': {
        generateUserCSS: jasmine.createSpy().and.returnValue('')
      },
      'component/Launcher': {
        Launcher: class extends Component {
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
      'component/Launcher.sass': '',
      'embed/frameFactory': {
        frameFactory: requireUncached(buildTestPath('unit/mockFrameFactory')).mockFrameFactory,
        frameMethods: requireUncached(buildTestPath('unit/mockFrameFactory')).mockFrameMethods
      },
      'utility/devices': {
        isMobileBrowser: function() {
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

  afterEach(function() {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('create', function() {
    it('should add a new launcher to the internal list', function() {
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

    it('changes config.labelKey if labelKey is set', function() {
      launcher.create('alice', { labelKey: 'test_label' });

      const alice = launcher.get('alice');

      expect(alice.config.labelKey)
        .toEqual('test_label');
    });

    describe('frameFactory', function() {
      let mockFrameFactory,
        mockFrameFactoryCall,
        frameConfig,
        childFn,
        params;

      beforeEach(function() {
        mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory;
        frameConfig = {
          onClick: jasmine.createSpy(),
          position: 'test_position',
          icon: '',
          visible: true
        };
        launcher.create('alice', frameConfig);
        mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
        childFn = mockFrameFactoryCall[0];
        params = mockFrameFactoryCall[1];
      });

      it('should apply the configs', function() {
        const eventObj = jasmine.createSpyObj('e', ['preventDefault']);
        const mockMediator = mockRegistry['service/mediator'].mediator;
        const alice = launcher.get('alice');
        const payload = childFn({});
        const onClickHandler = params.extend.onClickHandler;

        expect(payload.props.position)
          .toEqual(frameConfig.position);

        expect(payload.props.icon)
          .toEqual(frameConfig.icon);

        expect(payload.props.label)
          .toEqual(`embeddable_framework.launcher.label.${alice.config.labelKey}`);

        expect(params.fullscreenable)
          .toEqual(false);

        jasmine.clock().install();

        onClickHandler(eventObj);
        jasmine.clock().tick(0);

        expect(mockMediator.channel.broadcast)
          .toHaveBeenCalledWith('alice.onClick');
        jasmine.clock().uninstall();
      });

      it('passes Launcher correctly into frameFactory', function() {
        const mockClickHandler = noop;
        const payload = childFn({
          onClickHandler: mockClickHandler
        });
        const alice = launcher.get('alice');

        expect(payload.props.onClick)
          .toBe(mockClickHandler);

        expect(payload.props.onTouchEnd)
          .toBe(mockClickHandler);

        launcher.render('alice');

        expect(alice.instance.onClickHandler)
          .toBeDefined();
      });
    });
  });

  describe('get', function() {
    it('should return the correct launcher', function() {
      const config = {
        position: 'test_alice_position',
        onClick: function() { return 'alice'; },
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

  describe('render', function() {
    it('should throw an exception if launcher does not exist', function() {
      expect(function() {
        launcher.render('non_existent_launcher');
      }).toThrow();
    });

    it('renders a launcher to the document', function() {
      launcher.create('alice');
      launcher.render('alice');

      expect(document.querySelectorAll('body > div > .mock-frame').length)
        .toBe(1);

      expect(document.querySelectorAll('body > div > .mock-frame > .mock-launcher').length)
        .toBe(1);

      expect(launcher.get('alice').instance)
        .toBeDefined();
    });

    it('should only be allowed to render an launcher once', function() {
      launcher.create('alice');

      expect(function() {
        launcher.render('alice');
      }).not.toThrow();

      expect(function() {
        launcher.render('alice');
      }).toThrow();
    });

    it('applies launcher.scss to the frame', function() {
      const mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory;
      const mockCss = mockRegistry['./launcher.scss'];

      launcher.create('alice');
      launcher.render('alice');

      const mockFrameCss = mockFrameFactory.calls.mostRecent().args[1].css;

      expect(mockFrameCss)
        .toEqual(mockCss);
    });

    describe('mediator subscriptions', function() {
      let mockMediator,
        alice,
        aliceLauncher;

      beforeEach(function() {
        mockMediator = mockRegistry['service/mediator'].mediator;
        launcher.create('alice', { labelKey: 'test_label' });
        launcher.render('alice');
        alice = launcher.get('alice');
        aliceLauncher = alice.instance.getChild().refs.rootComponent;
      });

      it('should subscribe to <name>.hide', function() {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('alice.hide', jasmine.any(Function));

        pluckSubscribeCall(mockMediator, 'alice.hide')();

        expect(alice.instance.hide.__reactBoundMethod)
          .toHaveBeenCalled();
      });

      it('should subscribe to <name>.show', function() {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('alice.show', jasmine.any(Function));

        pluckSubscribeCall(mockMediator, 'alice.show')();

        expect(alice.instance.show.__reactBoundMethod)
          .toHaveBeenCalled();
      });

      it('subscribes to <name>.refreshLocale', () => {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('alice.refreshLocale', jasmine.any(Function));
      });

      it('should subscribe to <name>.setLabelHelp', function() {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('alice.setLabelHelp', jasmine.any(Function));

        pluckSubscribeCall(mockMediator, 'alice.setLabelHelp')();

        expect(aliceLauncher.setIcon)
          .toHaveBeenCalledWith('Icon');

        expect(aliceLauncher.setLabel)
          .toHaveBeenCalledWith('embeddable_framework.launcher.label.test_label', {});
      });

      it('should subscribe to <name>.setLabelChat', function() {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('alice.setLabelChat', jasmine.any(Function));

        pluckSubscribeCall(mockMediator, 'alice.setLabelChat')();

        expect(aliceLauncher.setIcon)
          .toHaveBeenCalledWith('Icon--chat');

        expect(aliceLauncher.setLabel)
          .toHaveBeenCalled();
      });

      it('should subscribe to <name>.setLabelChatHelp', function() {
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
