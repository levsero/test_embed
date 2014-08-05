/** @jsx React.DOM */
describe('embed.launcher', function() {
  var launcher,
      mockGlobals = {
        document: global.document
      },
      mockLauncher = jasmine.createSpy('mockLauncher')
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
        ),
      mockFrameMethods = require(buildTestPath('unit/mockFrameFactory')).mockFrameMethods,
      mockFrameFactory = require(buildTestPath('unit/mockFrameFactory')).mockFrameFactory,
      mockLauncherCss = jasmine.createSpy('mockLauncherCss'),
      mockBeacon = jasmine.createSpyObj('mockBeacon', ['track']),
      launcherPath = buildSrcPath('embed/launcher/launcher');

  beforeEach(function() {

    resetDOM();

    mockery.enable();
    mockery.registerMock('util/globals', mockGlobals);
    mockery.registerMock('component/Launcher', {
      Launcher: mockLauncher
    });
    mockery.registerMock('service/beacon', {
      beacon: mockBeacon
    });
    mockery.registerMock('./launcher.scss', mockLauncherCss);
    mockery.registerMock('embed/frameFactory', {
      frameFactory: mockFrameFactory
    });
    mockery.registerMock('util/devices', {
      isMobileBrowser: function() {
        return false;
      }
    });
    mockery.registerMock('imports?_=lodash!lodash', _);
    mockery.registerAllowable('react');
    mockery.registerAllowable('./lib/React');
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

    it('should apply the configs', function() {
      var alice,
          config = {
            onClick: jasmine.createSpy(),
            position: 'test_position',
            label: 'Help',
            icon: ''
          },
          mockFrameFactoryScope = {
            getChild: function() {
              return {
                refs: {
                  launcher: {
                    state: {
                      label: ''
                    }
                  }
                }
              };
            },
            onClickHandler: jasmine.createSpy()
          },
          eventObj = jasmine.createSpyObj('e', ['preventDefault']),
          mockFrameFactoryRecentCall,
          childFn,
          payload,
          childParams;

      launcher.create('alice', config);

      mockFrameFactoryRecentCall = mockFrameFactory.mostRecentCall.args;

      childFn = mockFrameFactoryRecentCall[0];

      alice = launcher.get('alice');

      expect(alice.config)
        .toEqual(config);

      payload = childFn({});

      expect(payload.props.position)
        .toEqual(config.position);

      expect(payload.props.icon)
        .toEqual(config.icon);

      expect(payload.props.label)
        .toEqual(config.label);

      childParams = mockFrameFactoryRecentCall[1];

      expect(childParams.fullscreenable)
        .toEqual(false);

      childParams.extend.onClickHandler.bind(mockFrameFactoryScope, eventObj)();

      expect(config.onClick.callCount)
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

      childFn = mockFrameFactory.mostRecentCall.args[0];

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
      var alice;

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
      var mockFrameCss;

      launcher.create('alice');
      launcher.render('alice');

      mockFrameCss = mockFrameFactory.mostRecentCall.args[1].css;

      expect(mockFrameCss)
        .toBe(mockLauncherCss);

    });

    it('is positioned "right" if no position value is set', function() {

      var mockFrameStyle;

      launcher.create('alice');
      launcher.render('alice');

      mockFrameStyle = mockFrameFactory.mostRecentCall.args[1].style;

      expect(mockFrameStyle.left)
        .toBeUndefined();

      expect(mockFrameStyle.right)
        .toBeDefined();

    });

    it('can be positioned "left"', function() {

      var mockFrameStyle;

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

      launcher.create('alice');
      launcher.render('alice');
      launcher.show('alice');

      expect(mockFrameMethods.show)
        .toHaveBeenCalled();
    });

  });

  describe('hide', function() {

    it('should hide the launcher', function() {

      launcher.create('alice');
      launcher.render('alice');
      launcher.hide('alice');

      expect(mockFrameMethods.hide)
        .toHaveBeenCalled();
    });

  });
});
