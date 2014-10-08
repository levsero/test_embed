/** @jsx React.DOM */

describe('embed.helpCenter', function() {
  var helpCenter,
      mockRegistry,
      frameConfig,
      helpCenterPath = buildSrcPath('embed/helpCenter/helpCenter');

  beforeEach(function() {
    var mockHelpCenterForm = React.createClass({
      render: function() {
        return (<div />);
      }
    });

    resetDOM();

    mockery.enable({
      useCleanCache: true
    });

    mockRegistry = initMockRegistry({
      'react/addons': React,
      'service/beacon': noop,
      'service/i18n': {
        i18n: jasmine.createSpyObj('i18n', ['t'])
      },
      'service/transport': {
        transport: {
          getZendeskHost: function() {
            return 'zendesk.host';
          }
        }
      },
      'service/mediator': {
        mediator: {
          channel: jasmine.createSpyObj('channel', ['broadcast', 'subscribe'])
        }
      },
      'component/HelpCenter': {
        HelpCenter: jasmine.createSpy('mockHelpCenter')
          .and.callFake(
            React.createClass({
              getInitialState: function() {
                return {
                  topics: [],
                  searchTitle: 'abc123',
                  searchCount: 0,
                  searchTerm: ''
                };
              },
              render: function() {
                return (
                  /* jshint quotmark:false */
                  <div className='mock-helpCenter'>
                    <mockHelpCenterForm ref='helpCenterForm' />
                  </div>
                );
              }
            })
          )
      },
      './helpCenter.scss': jasmine.createSpy('mockCss'),
      './helpCenterFrame.scss': jasmine.createSpy('mockFrameCss'),
      'embed/frameFactory': {
        frameFactory: require(buildTestPath('unit/mockFrameFactory')).mockFrameFactory,
        frameMethods: require(buildTestPath('unit/mockFrameFactory')).mockFrameMethods
      },
      'utility/devices': {
        isMobileBrowser: function() {
          return false;
        }
      },
      'utility/utils': {
        setScaleLock: noop
      },
      'utility/globals': {
        document: global.document
      },
      'imports?_=lodash!lodash': _
    });


    mockery.registerAllowable(helpCenterPath);

    helpCenter = require(helpCenterPath).helpCenter;

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
    it('should add a new help center component to the helpCenter array', function() {
      var carlos;

      expect(_.keys(helpCenter.list()).length)
        .toEqual(0);

      helpCenter.create('carlos');

      expect(_.keys(helpCenter.list()).length)
        .toEqual(1);

      carlos = helpCenter.get('carlos');

      expect(carlos)
        .toBeDefined();

      expect(carlos.component)
        .toBeDefined();

    });

    describe('mockFrameFactoryRecentCall', function() {
      var mockFrameFactory,
          mockFrameFactoryRecentCall;

      beforeEach(function() {
        mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory;
        helpCenter.create('carlos', frameConfig);
        mockFrameFactoryRecentCall = mockFrameFactory.calls.mostRecent().args;
      });

      it('should pass in zendeskHost from transport.getZendeskHost', function() {
        var childFn,
            payload;

        childFn = mockFrameFactoryRecentCall[0];

        payload = childFn({});

        expect(payload.props.children.props.zendeskHost)
          .toEqual('zendesk.host');
      });

      describe('mediator broadcasts', function() {
        it('should broadcast <name>.onClose with onClose', function() {
          var params = mockFrameFactoryRecentCall[1],
          mockMediator = mockRegistry['service/mediator'].mediator;

          params.onClose();

          expect(mockMediator.channel.broadcast)
            .toHaveBeenCalledWith('carlos.onClose');
        });

        it('should broadcast <name>.onNextClick with onButtonClick', function() {
          var childFn = mockFrameFactoryRecentCall[0],
              mockMediator = mockRegistry['service/mediator'].mediator,
              payload = childFn({});

          payload.props.children.props.onButtonClick();

          expect(mockMediator.channel.broadcast)
            .toHaveBeenCalledWith('carlos.onNextClick');
        });
      });

    });

    it('should switch iframe styles based on isMobileBrowser()', function() {
     var mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory,
         mockFrameFactoryRecentCall,
         iframeStyle;

      mockery.registerMock('utility/devices', {
        isMobileBrowser: function() {
          return true;
        }
      });
      mockery.resetCache();
      helpCenter = require(helpCenterPath).helpCenter;
      helpCenter.create('carlos');

      mockFrameFactoryRecentCall = mockFrameFactory.calls.mostRecent().args;

      iframeStyle = mockFrameFactoryRecentCall[1].style;

      expect(iframeStyle.left)
        .toBeUndefined();

      expect(iframeStyle.right)
        .toBeUndefined();
    });

    it('should switch container styles based on isMobileBrowser()', function() {
      var mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory,
          mockFrameFactoryRecentCall,
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

      helpCenter = require(helpCenterPath).helpCenter;

      helpCenter.create('carlos');

      mockFrameFactoryRecentCall = mockFrameFactory.calls.mostRecent().args;

      payload = mockFrameFactoryRecentCall[0](childFnParams);

      expect(payload.props.style)
        .toEqual({height: '100%', width: '100%'});
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
      var mockHelpCenter = mockRegistry['component/HelpCenter'].HelpCenter;

      helpCenter.create('carlos');
      helpCenter.render('carlos');

      expect(document.querySelectorAll( '.mock-frame').length)
        .toEqual(1);

      expect(document.querySelectorAll( '.mock-frame .mock-helpCenter').length)
        .toEqual(1);

      expect(ReactTestUtils.isCompositeComponent(helpCenter.get('carlos').instance))
        .toEqual(true);

      expect(mockHelpCenter)
        .toHaveBeenCalled();
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

    it('applies helpCenter.scss to the frame factory', function() {
      var mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory,
          mockCss = mockRegistry['./helpCenter.scss'],
          mockFrameFactoryCss;

      helpCenter.create('carlos');
      helpCenter.render('carlos');

      mockFrameFactoryCss = mockFrameFactory.calls.mostRecent().args[1].css;

      expect(mockFrameFactoryCss)
        .toBe(mockCss);
    });

    describe('mediator subscriptions', function() {
      var mockMediator,
          mockI18n,
          carlosHelpCenter,
          carlosHelpCenterForm,
          pluckSubscribeCall = function(calls, key) {
            return _.find(calls, function(call) {
              return call[0] === key;
            })[1];
          },
          subscribeCalls;

      beforeEach(function() {
        mockMediator = mockRegistry['service/mediator'].mediator;
        mockI18n = mockRegistry['service/i18n'].i18n;
        helpCenter.create('carlos');
        helpCenter.render('carlos');
        carlosHelpCenter = helpCenter.get('carlos').instance.getChild().refs.helpCenter;
        carlosHelpCenterForm = carlosHelpCenter.refs.helpCenterForm;
        subscribeCalls = mockMediator.channel.subscribe.calls.allArgs();
      });

      it('should subscribe to <name>.show', function() {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('carlos.show', jasmine.any(Function));

        pluckSubscribeCall(subscribeCalls, 'carlos.show')();

        expect(helpCenter.get('carlos').instance.show.__reactBoundMethod)
          .toHaveBeenCalled();
      });

      it('should subscribe to <name>.hide', function() {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('carlos.hide', jasmine.any(Function));

        pluckSubscribeCall(subscribeCalls, 'carlos.hide')();

        expect(helpCenter.get('carlos').instance.hide.__reactBoundMethod)
          .toHaveBeenCalled();
      });

      it('should subscribe to <name>.setNextToChat', function() {
        mockI18n.t.and.returnValue('chat label');

        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('carlos.setNextToChat', jasmine.any(Function));

        pluckSubscribeCall(subscribeCalls, 'carlos.setNextToChat')();

        expect(mockI18n.t)
          .toHaveBeenCalledWith('embeddable_framework.helpCenter.submitButton.label.chat');

        expect(carlosHelpCenterForm.state.buttonLabel)
          .toEqual('chat label');
      });

      it('should subscribe to <name>.setNextToSubmitTicket', function() {
        mockI18n.t.and.returnValue('submitTicket label');

        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('carlos.setNextToSubmitTicket', jasmine.any(Function));

        pluckSubscribeCall(subscribeCalls, 'carlos.setNextToSubmitTicket')();

        expect(mockI18n.t)
          .toHaveBeenCalledWith('embeddable_framework.helpCenter.submitButton.label.submitTicket');

        expect(carlosHelpCenterForm.state.buttonLabel)
          .toEqual('submitTicket label');
      });
    });

  });
});
