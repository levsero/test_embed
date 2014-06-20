/** @jsx React.DOM */
describe('embed.launcher', function() {
  var launcher,
      mockGlobals = {
        document: global.document
      },
      mockFrame = jasmine.createSpy('mockFrame')
        .andCallFake(
          React.createClass({
            hide: function() {
              this.setState({show: false});
            },
            show: function() {
              this.setState({show: true});
            },
            getInitialState: function() {
              return {
                show: true
              };
            },
            render: function() {
              return (
                /* jshint quotmark:false */
                <div className='mock-frame'>
                  {this.props.children}
                </div>
              );
            }
          })
        ),
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
      mockFrameMethods = {
        show: jasmine.createSpy('mockFrameShow'),
        hide: jasmine.createSpy('mockFrameHide')
      },
      mockFrameFactory = jasmine.createSpy('mockFrameFactory').andCallFake(
          function(child, params) {
            return _.extend({
              show: mockFrameMethods.show,
              hide: mockFrameMethods.hide,
              render: function() {
                var root = this;
                var childParams = _.reduce(params.extend, function(res, val, key) {
                  res[key] = val.bind(root);
                  return res;
                }, {});
                return (
                  /* jshint quotmark:false */
                  <div ref='frame' className='mock-frame'>
                    {child(childParams)}
                  </div>);
              }
            }, params.extend);
          }
      ),
      mockLauncherCss = jasmine.createSpy('mockLauncherCss'),
      mockBeacon = jasmine.createSpyObj('mockBeacon', ['track']),
      launcherPath = buildPath('embed/launcher/launcher');

  beforeEach(function() {

    resetDOM();

    mockery.enable();
    mockery.registerMock('util/globals', mockGlobals);
    mockery.registerMock('component/Frame', {
      Frame: mockFrame
    });
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
      launcher.render('alice');

      expect(mockLauncher)
        .toHaveBeenCalled();

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
            message: 'Help',
            icon: ''
          };

      launcher.create('alice', config);
      launcher.render('alice', config);

      alice = launcher.get('alice');

      expect(alice.config).toEqual(config);

      expect(mockLauncher).toHaveBeenCalled();

      expect(alice.instance.refs.launcher.props.position)
        .toEqual(config.position);

      alice.instance.refs.launcher.props.onClick();

      expect(config.onClick)
        .toHaveBeenCalled();

      expect(mockBeacon.track)
        .toHaveBeenCalledWith('launcher', 'click', 'alice');
    });

    it('passes Launcher correctly into frameFactory', function() {

      var child, 
          mockClickHandler = function() {},
          payload,
          launcherInstance,
          alice;

      launcher.create('alice');

      child = mockFrameFactory.mostRecentCall.args[0];

      mockClickHandler = function() {};

      payload = child({
        onClickHandler: mockClickHandler
      });

      expect(payload.props.onClick)
        .toBe(mockClickHandler);
      expect(payload.props.onTouchEnd)
        .toBe(mockClickHandler);

      launcher.render('alice');

      alice = launcher.get('alice');
      launcherInstance = alice.instance.refs.launcher;

      expect(alice.instance.onClickHandler).toBeDefined();
      expect(alice.instance.changeIcon).toBeDefined();

      alice.instance.changeIcon();

      expect(launcherInstance.changeIcon.__reactBoundMethod).toHaveBeenCalled();
    });
  });

  describe('get', function() {

    it('should return the correct launcher', function() {
      var alice,
          config = {
            position: 'test_alice_position',
            onClick: function() { return 'alice'; },
            message: 'Help',
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

      expect(mockFrameMethods.show).toHaveBeenCalled();
    });
  });

  describe('hide', function() {

    it('should hide the launcher', function() {

      launcher.create('alice');
      launcher.render('alice');
      launcher.hide('alice');

      expect(mockFrameMethods.hide).toHaveBeenCalled();
    });

  });
});
