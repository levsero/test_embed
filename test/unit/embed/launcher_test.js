describe('embed.launcher', function() {
  let launcher,
      mockRegistry;
  const launcherPath = buildSrcPath('embed/launcher/launcher');

  beforeEach(function() {
    resetDOM();

    mockery.enable({
      useCleanCache: true
    });

    mockRegistry = initMockRegistry({
      'react/addons': React,
      'utility/globals': {
        document: global.document,
        getDocumentHost: function() {
          return document.body;
        }
      },
      'utility/utils': {
        generateUserCSS: jasmine.createSpy().and.returnValue('')
      },
      'component/Launcher': {
        Launcher: React.createClass({
          changeIcon: jasmine.createSpy('mockChangeIcon'),
          setActive: jasmine.createSpy('setActive'),
          setIcon: jasmine.createSpy('setIcon'),
          setLabel: jasmine.createSpy('setLabel'),
          render: function() {
            return (
              <div className='mock-launcher' />
            );
          }
        })
      },
      'service/beacon': {
        beacon: jasmine.createSpyObj('mockBeacon', ['track'])
      },
      'service/mediator': {
        mediator: {
          channel: jasmine.createSpyObj('channel', ['broadcast', 'subscribe'])
        }
      },
      './launcher.scss': '',
      'embed/frameFactory': {
        frameFactory: require(buildTestPath('unit/mockFrameFactory')).mockFrameFactory,
        frameMethods: require(buildTestPath('unit/mockFrameFactory')).mockFrameMethods
      },
      'utility/devices': {
        isMobileBrowser: function() {
          return false;
        }
      },
      'lodash': _,
      'service/i18n': {
        i18n: jasmine.createSpyObj('i18n', ['init', 'setLocale', 't'])
      }
    });

    mockery.registerAllowable(launcherPath);
    launcher = require(launcherPath).launcher;
  });

  afterEach(function() {
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
          label: 'Help',
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

        expect(alice.config)
          .toEqual(frameConfig);

        expect(payload.props.position)
          .toEqual(frameConfig.position);

        expect(payload.props.icon)
          .toEqual(frameConfig.icon);

        expect(payload.props.label)
          .toEqual(frameConfig.label);

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
        label: 'Help',
        icon: '',
        visible: true
      };

      launcher.create('alice', config);
      const alice = launcher.get('alice');

      expect(alice)
        .not.toBeUndefined();

      expect(alice.config)
        .toEqual(config);
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

    it('is positioned "right" if no position value is set', function() {
      const mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory;

      launcher.create('alice');
      launcher.render('alice');

      const mockFrameStyle = mockFrameFactory.calls.mostRecent().args[1].style;

      expect(mockFrameStyle.left)
        .toBeUndefined();

      expect(mockFrameStyle.right)
        .toBeDefined();

    });

    it('can be positioned "left"', function() {
      const mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory;

      launcher.create('alice', {position: 'left'});
      launcher.render('alice');

      const mockFrameStyle = mockFrameFactory.calls.mostRecent().args[1].style;

      expect(mockFrameStyle.left)
        .toBeDefined();

      expect(mockFrameStyle.right)
        .toBeUndefined();

    });

    describe('mediator subscriptions', function() {
      let mockMediator,
          aliceLauncher;

      beforeEach(function() {
        mockMediator = mockRegistry['service/mediator'].mediator;
        launcher.create('alice');
        launcher.render('alice');
        aliceLauncher = launcher.get('alice').instance.getChild().refs.launcher;
      });

      it('should subscribe to <name>.activate', function() {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('alice.activate', jasmine.any(Function));

        pluckSubscribeCall(mockMediator, 'alice.activate')();

        expect(aliceLauncher.setActive.__reactBoundMethod)
          .toHaveBeenCalledWith(true);
      });

      it('should subscribe to <name>.deactivate', function() {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('alice.deactivate', jasmine.any(Function));

        pluckSubscribeCall(mockMediator, 'alice.deactivate')();

        expect(aliceLauncher.setActive.__reactBoundMethod)
          .toHaveBeenCalledWith(false);
      });

      it('should subscribe to <name>.setLabelHelp', function() {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('alice.setLabelHelp', jasmine.any(Function));

        pluckSubscribeCall(mockMediator, 'alice.setLabelHelp')();

        expect(aliceLauncher.setIcon.__reactBoundMethod)
          .toHaveBeenCalledWith('Icon');

        expect(aliceLauncher.setLabel.__reactBoundMethod)
          .toHaveBeenCalled();
      });

      it('should subscribe to <name>.setLabelChat', function() {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('alice.setLabelChat', jasmine.any(Function));

        pluckSubscribeCall(mockMediator, 'alice.setLabelChat')();

        expect(aliceLauncher.setIcon.__reactBoundMethod)
          .toHaveBeenCalledWith('Icon--chat');

        expect(aliceLauncher.setLabel.__reactBoundMethod)
          .toHaveBeenCalled();
      });

      it('should subscribe to <name>.setLabelChatHelp', function() {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('alice.setLabelChatHelp', jasmine.any(Function));

        pluckSubscribeCall(mockMediator, 'alice.setLabelChatHelp')();

        expect(aliceLauncher.setIcon.__reactBoundMethod)
          .toHaveBeenCalledWith('Icon--chat');

        expect(aliceLauncher.setLabel.__reactBoundMethod)
          .toHaveBeenCalled();
      });

      it('should subscribe to <name>.setLabelUnreadMsgs', function() {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('alice.setLabelUnreadMsgs', jasmine.any(Function));

        pluckSubscribeCall(mockMediator, 'alice.setLabelUnreadMsgs')();

        expect(aliceLauncher.setLabel.__reactBoundMethod)
          .toHaveBeenCalled();
      });

    });

  });

});
