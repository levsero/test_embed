/** @jsx React.DOM */
describe('embed.launcher', function() {
  var launcher,
      mockRegistry,
      launcherPath = buildSrcPath('embed/launcher/launcher');

  beforeEach(function() {

    resetDOM();

    mockery.enable({
      useCleanCache: true
    });

    mockRegistry = initMockRegistry({
      'react/addons': React,
      'utility/globals': {
        document: global.document
      },
      'component/Launcher': {
        Launcher: jasmine.createSpy('mockLauncher')
          .andCallFake(
            React.createClass({
              changeIcon: jasmine.createSpy('mockChangeIcon'),
              render: function() {
                return (
                  /* jshint quotmark:false */
                  <div className='mock-launcher' />
                );
              }
            })
          )
      },
      'service/beacon': {
        beacon: jasmine.createSpyObj('mockBeacon', ['track'])
      },
      './launcher.scss': jasmine.createSpy('mockLauncherCss'),
      'embed/frameFactory': {
        frameFactory: require(buildTestPath('unit/mockFrameFactory')).mockFrameFactory,
        frameMethods: require(buildTestPath('unit/mockFrameFactory')).mockFrameMethods
      },
      'utility/devices': {
        isMobileBrowser: function() {
          return false;
        }
      },
      'imports?_=lodash!lodash': _,
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
      var alice;

      expect(_.keys(launcher.list()).length)
        .toBe(0);

      launcher.create('alice');

      expect(_.keys(launcher.list()).length)
        .toBe(1);

      alice = launcher.get('alice');

      expect(alice)
        .toBeDefined();

      expect(alice.component)
        .toBeDefined();

      expect(alice.config)
        .toBeDefined();
    });

    describe('mockFrameFactoryRecentCall', function() {
      var mockFrameFactory,
          mockFrameFactoryRecentCall,
          frameConfig;

      beforeEach(function() {
        mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory;
        frameConfig = {
          onClick: jasmine.createSpy(),
          position: 'test_position',
          label: 'Help',
          icon: ''
        };
        launcher.create('alice', frameConfig);
        mockFrameFactoryRecentCall = mockFrameFactory.mostRecentCall.args;
      });

      it('should apply the configs', function() {
        var alice,
            mockFrameFactoryScope = {
              getChild: function() {
                return { refs: { launcher: { state: { label: '' }}}};
              },
              onClickHandler: jasmine.createSpy()
            },
            eventObj = jasmine.createSpyObj('e', ['preventDefault']),
            mockBeacon = mockRegistry['service/beacon'].beacon,
            childFn,
            payload,
            childParams;


        childFn = mockFrameFactoryRecentCall[0];

        alice = launcher.get('alice');

        expect(alice.config)
          .toEqual(frameConfig);

        payload = childFn({});

        expect(payload.props.position)
          .toEqual(frameConfig.position);

        expect(payload.props.icon)
          .toEqual(frameConfig.icon);

        expect(payload.props.label)
          .toEqual(frameConfig.label);

        childParams = mockFrameFactoryRecentCall[1];

        expect(childParams.fullscreenable)
          .toEqual(false);

        childParams.extend.onClickHandler.bind(mockFrameFactoryScope, eventObj)();

        expect(frameConfig.onClick.callCount)
          .toEqual(1);

        expect(mockBeacon.track)
          .toHaveBeenCalledWith('launcher', 'click', 'alice');

      });

      it('passes Launcher correctly into frameFactory', function() {

        var childFn,
            mockClickHandler = noop,
            payload,
            launcherInstance,
            alice;

        launcher.create('alice');

        childFn = mockFrameFactoryRecentCall[0];

        payload = childFn({
          onClickHandler: mockClickHandler
        });

        expect(payload.props.onClick)
          .toBe(mockClickHandler);

        expect(payload.props.onTouchEnd)
          .toBe(mockClickHandler);

        launcher.render('alice');

        alice = launcher.get('alice');
        launcherInstance = alice.instance.refs.launcher;

        expect(alice.instance.onClickHandler)
          .toBeDefined();
      });
    });

  });

  describe('get', function() {

    it('should return the correct launcher', function() {
      var alice,
          config = {
            position: 'test_alice_position',
            onClick: function() { return 'alice'; },
            label: 'Help',
            icon: ''
          };

      launcher.create('alice', config);
      alice = launcher.get('alice');

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
      var alice,
          mockLauncher = mockRegistry['component/Launcher'].Launcher;

      launcher.create('alice');
      launcher.render('alice');

      expect(mockLauncher)
        .toHaveBeenCalled();

      expect(document.querySelectorAll('body > div > .mock-frame').length)
        .toBe(1);

      expect(document.querySelectorAll('body > div > .mock-frame > .mock-launcher').length)
        .toBe(1);

      alice = launcher.get('alice');

      expect(alice.instance)
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
      var mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory,
          mockCss = mockRegistry['./launcher.scss'],
          mockFrameCss;

      launcher.create('alice');
      launcher.render('alice');

      mockFrameCss = mockFrameFactory.mostRecentCall.args[1].css;

      expect(mockFrameCss)
        .toBe(mockCss);

    });

    it('is positioned "right" if no position value is set', function() {

      var mockFrameStyle,
          mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory;

      launcher.create('alice');
      launcher.render('alice');

      mockFrameStyle = mockFrameFactory.mostRecentCall.args[1].style;

      expect(mockFrameStyle.left)
        .toBeUndefined();

      expect(mockFrameStyle.right)
        .toBeDefined();

    });

    it('can be positioned "left"', function() {

      var mockFrameStyle,
          mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory;

      launcher.create('alice', {position: 'left'});
      launcher.render('alice');

      mockFrameStyle = mockFrameFactory.mostRecentCall.args[1].style;

      expect(mockFrameStyle.left)
        .toBeDefined();

      expect(mockFrameStyle.right)
        .toBeUndefined();

    });

  });

  describe('show', function() {

    it('should show the launcher', function() {
      var mockFrameMethods = mockRegistry['embed/frameFactory'].frameMethods;

      launcher.create('alice');
      launcher.render('alice');
      launcher.show('alice');

      expect(mockFrameMethods.show)
        .toHaveBeenCalled();
    });

  });

  describe('hide', function() {

    it('should hide the launcher', function() {
      var mockFrameMethods = mockRegistry['embed/frameFactory'].frameMethods;

      launcher.create('alice');
      launcher.render('alice');
      launcher.hide('alice');

      expect(mockFrameMethods.hide)
        .toHaveBeenCalled();
    });

  });
});
