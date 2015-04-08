/** @jsx React.DOM */

describe('embed.submitTicket', function() {
  var submitTicket,
      mockRegistry,
      frameConfig,
      defaultValue = 'abc123',
      submitTicketPath = buildSrcPath('embed/submitTicket/submitTicket'),
      resetTicketFormVisibility = jasmine.createSpy(),
      hideVirtualKeyboard = jasmine.createSpy();

  beforeEach(function() {
    resetDOM();

    mockery.enable({
      useCleanCache: true
    });

    mockRegistry = initMockRegistry({
      'react/addons': React,
      'service/beacon': noop,
      'service/mediator': {
        mediator: {
          channel: jasmine.createSpyObj('channel', ['broadcast', 'subscribe'])
        }
      },
      'component/SubmitTicketForm': {
        SubmitTicketForm: jasmine.createSpy('mockSubmitTicketForm')
          .and.callFake(
            React.createClass({
              resetTicketFormVisibility: resetTicketFormVisibility,
              hideVirtualKeyboard: hideVirtualKeyboard,
              render: function() {
                return (
                  /* jshint quotmark:false */
                  <div refs='mock-submitTicketForm'></div>
                );
              }
            })
          )
      },
      'component/SubmitTicket': {
        SubmitTicket: jasmine.createSpy('mockSubmitTicket')
          .and.callFake(
            React.createClass({
              show: jasmine.createSpy('show'),
              hide: jasmine.createSpy('hide'),
              clearNotification: jasmine.createSpy('clearNotification'),
              getInitialState: function() {
                return {
                  showNotification: false,
                  message: '',
                  uid: defaultValue
                };
              },
              focusField: jasmine.createSpy(),
              render: function() {
                return (
                  /* jshint quotmark:false */
                  <div className='mock-submitTicket'>
                    {mockRegistry['component/SubmitTicketForm'].SubmitTicketForm({
                      ref: 'submitTicketForm'
                    })}
                  </div>
                );
              }
            })
          )
      },

      './submitTicket.scss': '',
      './submitTicketFrame.scss': '',
      'embed/frameFactory': {
        frameFactory: require(buildTestPath('unit/mockFrameFactory')).mockFrameFactory,
        frameMethods: require(buildTestPath('unit/mockFrameFactory')).mockFrameMethods
      },
      'utility/utils': {
        setScaleLock: jasmine.createSpy('setScaleLock'),
        generateUserCSS: jasmine.createSpy().and.returnValue('')
      },
      'utility/devices': {
        isMobileBrowser: function() {
          return false;
        }
      },
      'utility/globals': {
        document: global.document,
        getDocumentHost: function() {
          return document.body;
        }
      },
      'imports?_=lodash!lodash': _
    });

    mockery.registerAllowable(submitTicketPath);

    submitTicket = require(submitTicketPath).submitTicket;

    frameConfig = {
      onShow: jasmine.createSpy('onShow'),
      onHide: jasmine.createSpy('onHide')
    };
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('create', function() {

    it('show add a new submit ticket form to the submitTicket array', function() {
      var bob;

      expect(_.keys(submitTicket.list()).length)
        .toEqual(0);

      submitTicket.create('bob');

      expect(_.keys(submitTicket.list()).length)
        .toEqual(1);

      bob = submitTicket.get('bob');

      expect(bob)
        .toBeDefined();

      expect(bob.component)
        .toBeDefined();
    });

    describe('frameFactory', function() {
      var mockFrameFactory,
          mockFrameFactoryCall,
          submitTicketChild,
          params;

      beforeEach(function() {
        mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory;
        submitTicket.create('bob', frameConfig);
        mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
        params = mockFrameFactoryCall[1];
      });

      it('should toggle setScaleLock with onShow/onHide', function() {
        var mockSetScaleLock = mockRegistry['utility/utils'].setScaleLock;

        mockery.registerMock('utility/devices', {
          isMobileBrowser: function() {
            return true;
          }
        });
        mockery.resetCache();
        submitTicket = require(submitTicketPath).submitTicket;
        submitTicket.create('bob', frameConfig);
        submitTicket.render('bob');
        submitTicketChild = submitTicket.get('bob').instance.getChild();
        mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
        params = mockFrameFactoryCall[1];

        params.onShow(submitTicketChild);

        expect(mockSetScaleLock)
          .toHaveBeenCalledWith(true);

        mockSetScaleLock.calls.reset();

        params.onHide(submitTicketChild);

        expect(mockSetScaleLock)
          .toHaveBeenCalledWith(false);
      });

      it('should reset form state onShow', function() {
        submitTicket = require(submitTicketPath).submitTicket;
        submitTicket.create('bob', frameConfig);
        submitTicket.render('bob');
        submitTicketChild = submitTicket.get('bob').instance.getChild();
        mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
        params = mockFrameFactoryCall[1];

        params.onShow(submitTicket.get('bob').instance.getChild());

        expect(resetTicketFormVisibility)
          .toHaveBeenCalled();
      });

      it('should hide virtual keyboard onHide', function() {
        submitTicket = require(submitTicketPath).submitTicket;
        submitTicket.create('bob', frameConfig);
        submitTicket.render('bob');
        submitTicketChild = submitTicket.get('bob').instance.getChild();
        mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
        params = mockFrameFactoryCall[1];

        params.onHide(submitTicketChild);

        expect(hideVirtualKeyboard)
          .toHaveBeenCalled();
      });

      it('should broadcast <name>.onClose with onClose', function() {
        var mockMediator = mockRegistry['service/mediator'].mediator;

        params.onClose();

        expect(mockMediator.channel.broadcast)
          .toHaveBeenCalledWith('bob.onClose');
      });

    });

    it('should switch iframe styles based on isMobileBrowser()', function() {
     var mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory,
         mockFrameFactoryCall,
         iframeStyle;

      mockery.registerMock('utility/devices', {
        isMobileBrowser: function() {
          return true;
        }
      });
      mockery.resetCache();
      submitTicket = require(submitTicketPath).submitTicket;
      submitTicket.create('bob');

      mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;

      iframeStyle = mockFrameFactoryCall[1].style;

      expect(iframeStyle.left)
        .toBeUndefined();

      expect(iframeStyle.right)
        .toBeUndefined();
    });

    it('should switch container styles based on isMobileBrowser()', function() {
      var mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory,
          mockFrameFactoryCall,
          childFnParams = {
            updateFrameSize: function() {}
          },
          payload;

      mockery.registerMock('utility/devices', {
        isMobileBrowser: function() {
          return true;
        }
      });

      mockery.resetCache();

      submitTicket = require(submitTicketPath).submitTicket;

      submitTicket.create('bob');

      mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;

      payload = mockFrameFactoryCall[0](childFnParams);

      expect(payload.props.style)
        .toEqual({height: '100%', width: '100%'});
    });

  });

  describe('get', function() {

    it('should return the correct submitTicket form', function() {
      submitTicket.create('bob');

      expect(submitTicket.get('bob'))
        .toBeDefined();
    });

  });

  describe('render', function() {

    it('should throw an exception if SubmitTicket does not exist', function() {
      expect(function() {
        submitTicket.render('non_existent_submitTicket');
      }).toThrow();
    });

    it('renders a submitTicket form to the document', function() {
      var mockSubmitTicket = mockRegistry['component/SubmitTicket'].SubmitTicket;

      submitTicket.create('bob');
      submitTicket.render('bob');

      expect(document.querySelectorAll( '.mock-frame').length)
        .toEqual(1);

      expect(document.querySelectorAll( '.mock-frame .mock-submitTicket').length)
        .toEqual(1);

      expect(ReactTestUtils.isCompositeComponent(submitTicket.get('bob').instance))
        .toEqual(true);

      expect(mockSubmitTicket)
        .toHaveBeenCalled();
    });

    it('should only be allowed to render an submitTicket form once', function() {
      submitTicket.create('bob');

      expect(function() {
        submitTicket.render('bob');
      }).not.toThrow();

      expect(function() {
        submitTicket.render('bob');
      }).toThrow();
    });

    it('applies submitTicket.scss to the frame', function() {
      var mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory,
          mockCss = mockRegistry['./submitTicket.scss'],
          mockFrameFactoryCss;

      submitTicket.create('bob');
      submitTicket.render('bob');

      mockFrameFactoryCss = mockFrameFactory.calls.mostRecent().args[1].css;

      expect(mockFrameFactoryCss)
        .toEqual(mockCss);
    });

    describe('mediator subscription', function() {
      var mockMediator,
          bob,
          bobFrame,
          bobSubmitTicket,
          bobSubmitTicketForm;

      beforeEach(function() {
        mockMediator = mockRegistry['service/mediator'].mediator;
        submitTicket.create('bob');
        submitTicket.render('bob');
        bob = submitTicket.get('bob');
        bobFrame = bob.instance.getChild();
        bobSubmitTicket = bobFrame.refs.submitTicket;
        bobSubmitTicketForm = bobSubmitTicket.refs.submitTicketForm;
      });

      it('should subscribe to <name>.show', function() {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('bob.show', jasmine.any(Function));

        pluckSubscribeCall(mockMediator, 'bob.show')();

        expect(bob.instance.show.__reactBoundMethod)
          .toHaveBeenCalled();
      });

      it('should subscribe to <name>.deactivate', function() {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('bob.hide', jasmine.any(Function));

        pluckSubscribeCall(mockMediator, 'bob.hide')();

        expect(bob.instance.hide.__reactBoundMethod)
          .toHaveBeenCalled();

        expect(bobSubmitTicket.clearNotification.__reactBoundMethod)
          .not.toHaveBeenCalled();

        bobSubmitTicket.state.showNotification = true;

        pluckSubscribeCall(mockMediator, 'bob.hide')();

        expect(bobSubmitTicket.clearNotification.__reactBoundMethod)
          .toHaveBeenCalled();
      });

      it('should subscribe to <name>.showBackButton', function() {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('bob.showBackButton', jasmine.any(Function));

        bobSubmitTicket.state.showBackButton = false;

        pluckSubscribeCall(mockMediator, 'bob.showBackButton')();

        expect(bobFrame.state.showBackButton)
          .toEqual(true);
      });

    });

  });

});
