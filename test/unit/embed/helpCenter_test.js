/** @jsx React.DOM */

describe('embed.helpCenter', function() {
  var helpCenter,
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
            toggleVisibility: function() {
              this.setState({show: !this.state.show});
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
      mockHelpCenter = jasmine.createSpy('mockHelpCenter')
        .andCallFake(
          React.createClass({
            render: function() {
              return (
                /* jshint quotmark:false */
                <div className='mock-helpCenter' />
              );
            }
          })
        ),
      mockConfig = {
        onShow: noop,
        onHide: noop
      },
      mockCss = jasmine.createSpy('mockCss'),
      helpCenterPath = buildPath('embed/helpCenter/helpCenter');

  beforeEach(function() {

    resetDOM();

    mockery.enable();
    mockery.registerMock('component/Frame', {
      Frame: mockFrame
    });
    mockery.registerMock('component/HelpCenter', {
      HelpCenter: mockHelpCenter
    });
    mockery.registerMock('./helpCenter.scss', mockCss);
    mockery.registerMock('util/globals', mockGlobals);
    mockery.registerMock('imports?_=lodash!lodash', _);
    mockery.registerAllowable('react');
    mockery.registerAllowable('./lib/React');
    mockery.registerAllowable('./properties/width');
    mockery.registerAllowable('./parsers');
    mockery.registerAllowable(helpCenterPath);

    helpCenter = require(helpCenterPath).helpCenter;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('create', function() {
    it('show add a new help center embed to the helpCenter array', function() {
      var carlos;

      expect(_.keys(helpCenter.list()).length)
        .toEqual(0);

      helpCenter.create('carlos');
      helpCenter.render('carlos');

      expect(mockHelpCenter)
        .toHaveBeenCalled();

      expect(_.keys(helpCenter.list()).length)
        .toEqual(1);

      carlos = helpCenter.get('carlos');

      expect(carlos)
        .toBeDefined();

      expect(carlos.component)
        .toBeDefined();

      expect(carlos.instance)
        .toBeDefined();
    });
  });

  describe('get', function() {
    it('should return the correct helpCenter form', function() {
      var carlos;

      helpCenter.create('carlos');
      carlos = helpCenter.get('carlos');

      expect(carlos)
        .toBeDefined();
    });
  });

  describe('render', function() {
    it('should throw an exception if HelpCenter does not exist', function() {

      expect(function() {
        helpCenter.render('non_existent_helpCenter');
      }).toThrow();
    });

    it('renders a helpCenter form to the document', function() {
      helpCenter.create('carlos');
      helpCenter.render('carlos');

      expect(document.querySelectorAll( '.mock-frame').length)
        .toEqual(1);

      expect(document.querySelectorAll( '.mock-frame > .mock-helpCenter').length)
        .toEqual(1);
    });

    it('should only be allowed to render an helpCenter form once', function() {
      helpCenter.create('carlos');

      expect(function() {
        helpCenter.render('carlos');
      }).not.toThrow();

      expect(function() {
        helpCenter.render('carlos');
      }).toThrow();
    });

    it('applies helpCenter.scss to the frame', function() {
      var mockFrameCss;

      helpCenter.create('carlos');
      helpCenter.render('carlos');

      mockFrameCss = mockFrame.mostRecentCall.args[0].css;

      expect(mockFrameCss)
        .toBe(mockCss);
    });
  });

  describe('show', function() {
    it('should change the forms state to show it', function() {
      helpCenter.create('carlos', mockConfig);
      helpCenter.render('carlos');
      helpCenter.show('carlos');

      expect(helpCenter.get('carlos').instance.refs.frame.state.show)
        .toEqual(true);
    });
  });

  describe('hide', function() {
    it('should change the forms state to hide it', function() {
      helpCenter.create('carlos', mockConfig);
      helpCenter.render('carlos');
      helpCenter.hide('carlos');

      expect(helpCenter.get('carlos').instance.refs.frame.state.show)
        .toEqual(false);
    });
  });

});
