/** @jsx React.DOM */
describe('embed.launcher', function() {
  var launcher,
      mockGlobals = {
        document: global.document
      },
      mockReact =  {
        renderComponent: jasmine.createSpy()
      },
      mockFrame = jasmine.createSpy('mockFrame')
        .andCallFake(
          React.createClass({
            render: function() { return (<div className='mock-frame'>{this.props.children}</div>); }
          })),
      mockLauncher = jasmine.createSpy('mockLauncher')
        .andCallFake(
          React.createClass({
            render: function() { return (<div className='mock-launcher' />); }
          })),
      launcherPath = buildPath('embed/launcher/launcher');

  beforeEach(function() {

    mockery.enable();
    mockery.registerMock('util/globals', mockGlobals);
    mockery.registerMock('component/Frame', {
      Frame: mockFrame
    });
    mockery.registerMock('component/Launcher', {
      Launcher: mockLauncher
    });
    mockery.registerMock('./launcher.scss', {});
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

      expect(mockLauncher)
        .toHaveBeenCalled();
    
      expect(alice)
        .not.toBeUndefined();

      expect(alice.component)
        .not.toBeUndefined();

      expect(alice.config)
        .not.toBeUndefined();
    });

    it('should apply the configs', function() {
      var alice,
          config = {
            onClick: function() {},
            position: 'test_position'
          };
      
      launcher.create('alice', config);

      alice = launcher.get('alice');

      expect(alice.config).toEqual(config);

      expect(mockLauncher).toHaveBeenCalled();

      expect(alice.component.props.position)
        .toBe(config.position);

      expect(alice.component.props.onClick)
        .toBe(config.onClick);
    });

  });

  describe('get', function() {

    it('should return the correct launcher', function() {
      var alice,
          config = {
            position: 'test_alice_position',
            onClick: function() { return 'alice'; }
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

      launcher.create('alice');
      launcher.render('alice');

      expect(document.querySelectorAll('div > .mock-frame').length)
        .toBe(1);

      expect(document.querySelectorAll('div > .mock-frame > .mock-launcher').length)
        .toBe(1);
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
  });
});
