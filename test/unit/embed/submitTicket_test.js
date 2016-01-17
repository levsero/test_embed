describe('embed.submitTicket', function() {
  let submitTicket,
    mockRegistry,
    frameConfig;
  const resetTicketFormVisibility = jasmine.createSpy();
  const hideVirtualKeyboard = jasmine.createSpy();
  const focusField = jasmine.createSpy();
  const defaultValue = 'abc123';
  const submitTicketPath = buildSrcPath('embed/submitTicket/submitTicket');

  beforeEach(function() {
    resetDOM();

    mockery.enable();

    mockRegistry = initMockRegistry({
      'React': React,
      'service/beacon': {
        beacon: jasmine.createSpyObj('beacon', ['track'])
      },
      'service/mediator': {
        mediator: {
          channel: jasmine.createSpyObj('channel', ['broadcast', 'subscribe'])
        }
      },
      'component/SubmitTicketForm': {
        SubmitTicketForm: React.createClass({
          resetTicketFormVisibility: resetTicketFormVisibility,
          hideVirtualKeyboard: hideVirtualKeyboard,
          focusField: focusField,
          render: function() {
            return (
              <div />
            );
          }
        })
      },
      'component/SubmitTicket': {
        SubmitTicket: React.createClass({
          getInitialState: function() {
            return {
              showNotification: false,
              message: '',
              uid: defaultValue
            };
          },
          show: jasmine.createSpy('show'),
          hide: jasmine.createSpy('hide'),
          clearNotification: jasmine.createSpy('clearNotification'),

          render: function() {
            const SubmitTicketForm = mockRegistry['component/SubmitTicketForm'].SubmitTicketForm;

            return (
              <div className='mock-submitTicket'>
                <SubmitTicketForm ref='submitTicketForm' />
              </div>
            );
          }
        })
      },

      './submitTicket.scss': '',
      './submitTicketFrame.scss': '',
      'embed/frameFactory': {
        frameFactory: requireUncached(buildTestPath('unit/mockFrameFactory')).mockFrameFactory,
        frameMethods: requireUncached(buildTestPath('unit/mockFrameFactory')).mockFrameMethods
      },
      'utility/utils': {
        setScaleLock: jasmine.createSpy('setScaleLock'),
        generateUserCSS: jasmine.createSpy().and.returnValue(''),
        setScrollKiller: jasmine.createSpy(),
        setWindowScroll: jasmine.createSpy(),
        revertWindowScroll: jasmine.createSpy()
      },
      'utility/devices': {
        isMobileBrowser: function() {
          return false;
        },
        isIE: function() {
          return false;
        }
      },
      'utility/globals': {
        document: global.document,
        getDocumentHost: function() {
          return document.body;
        }
      },
      'service/transitionFactory' : {
        transitionFactory: requireUncached(buildTestPath('unit/mockTransitionFactory')).mockTransitionFactory
      },
      'service/transport': {
        transport: jasmine.createSpyObj('transport', ['send'])
      }
    });

    mockery.registerAllowable(submitTicketPath);

    submitTicket = requireUncached(submitTicketPath).submitTicket;

    frameConfig = {
      onShow: jasmine.createSpy('onShow'),
      onHide: jasmine.createSpy('onHide'),
      afterShowAnimate: jasmine.createSpy('afterShowAnimate')
    };
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('create', function() {

    it('show add a new submit ticket form to the submitTicket array', function() {
      expect(_.keys(submitTicket.list()).length)
        .toEqual(0);

      submitTicket.create('bob');

      expect(_.keys(submitTicket.list()).length)
        .toEqual(1);

      const bob = submitTicket.get('bob');

      expect(bob)
        .toBeDefined();

      expect(bob.component)
        .toBeDefined();
    });

    it('changes config.formTitleKey if formTitleKey is set', function() {
      submitTicket.create('bob', { formTitleKey: 'test_title' } );

      const bob = submitTicket.get('bob');

      expect(bob.config.formTitleKey)
        .toEqual('test_title');
    });

    describe('frameFactory', function() {
      let mockFrameFactory,
        mockFrameFactoryCall,
        childFn,
        params;

      beforeEach(function() {
        mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory;
        submitTicket.create('bob', frameConfig);
        mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
        childFn = mockFrameFactoryCall[0];
        params = mockFrameFactoryCall[1];
      });

      it('should apply the configs', function() {
        const bob = submitTicket.get('bob');
        const payload = childFn({});

        expect(payload.props.formTitleKey)
          .toEqual(bob.config.formTitleKey);
      });

      it('should not call focusField in afterShowAnimate for non-IE browser', function() {
        submitTicket.create('bob', frameConfig);
        submitTicket.render('bob');

        const submitTicketFrame = submitTicket.get('bob').instance;

        mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
        params = mockFrameFactoryCall[1];

        params.afterShowAnimate(submitTicketFrame);

        expect(focusField)
          .not.toHaveBeenCalled();
      });

      it('should call focusField in afterShowAnimate for IE browser', function() {
        mockery.registerMock('utility/devices', {
          isMobileBrowser: function() {
            return false;
          },
          isIE: function() {
            return true;
          }
        });

        submitTicket = requireUncached(submitTicketPath).submitTicket;
        submitTicket.create('bob', frameConfig);
        submitTicket.render('bob');

        const submitTicketFrame = submitTicket.get('bob').instance;

        mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
        params = mockFrameFactoryCall[1];

        params.afterShowAnimate(submitTicketFrame);

        expect(focusField)
          .toHaveBeenCalled();
      });

      it('should toggle setScaleLock with onShow/onHide', function() {
        const mockSetScaleLock = mockRegistry['utility/utils'].setScaleLock;

        mockery.registerMock('utility/devices', {
          isMobileBrowser: function() {
            return true;
          }
        });

        submitTicket = requireUncached(submitTicketPath).submitTicket;
        submitTicket.create('bob', frameConfig);
        submitTicket.render('bob');

        const submitTicketFrame = submitTicket.get('bob').instance;

        mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
        params = mockFrameFactoryCall[1];

        params.onShow(submitTicketFrame);

        expect(mockSetScaleLock)
          .toHaveBeenCalledWith(true);

        mockSetScaleLock.calls.reset();

        params.onHide(submitTicketFrame);

        expect(mockSetScaleLock)
          .toHaveBeenCalledWith(false);
      });

      it('should reset form state onShow', function() {
        submitTicket.create('bob', frameConfig);
        submitTicket.render('bob');

        const submitTicketFrame = submitTicket.get('bob').instance;

        mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
        params = mockFrameFactoryCall[1];

        params.onShow(submitTicketFrame);

        expect(resetTicketFormVisibility)
          .toHaveBeenCalled();
      });

      it('should hide virtual keyboard onHide', function() {
        mockery.registerMock('utility/devices', {
          isMobileBrowser: function() {
            return true;
          }
        });

        submitTicket = requireUncached(submitTicketPath).submitTicket;
        submitTicket.create('bob', frameConfig);
        submitTicket.render('bob');

        const submitTicketFrame = submitTicket.get('bob').instance;

        mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
        params = mockFrameFactoryCall[1];

        params.onHide(submitTicketFrame);

        expect(hideVirtualKeyboard)
          .toHaveBeenCalled();
      });

      it('should broadcast <name>.onClose with onClose', function() {
        const mockMediator = mockRegistry['service/mediator'].mediator;

        params.onClose();

        expect(mockMediator.channel.broadcast)
          .toHaveBeenCalledWith('bob.onClose');
      });

      it('should switch iframe styles based on isMobileBrowser()', function() {
        const mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory;

        mockery.registerMock('utility/devices', {
          isMobileBrowser: function() {
            return true;
          }
        });

        submitTicket = requireUncached(submitTicketPath).submitTicket;
        submitTicket.create('bob');

        const mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
        const iframeStyle = mockFrameFactoryCall[1].frameStyle;

        expect(iframeStyle.left)
          .toBeUndefined();

        expect(iframeStyle.right)
          .toBeUndefined();
      });

      it('should switch container styles based on isMobileBrowser()', function() {
        const mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory;
        const childFnParams = {
          updateFrameSize: noop
        };

        mockery.registerMock('utility/devices', {
          isMobileBrowser: function() {
            return true;
          }
        });

        submitTicket = requireUncached(submitTicketPath).submitTicket;
        submitTicket.create('bob');

        const  mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
        const payload = mockFrameFactoryCall[0](childFnParams);

        expect(payload.props.style)
        .toEqual({height: '100%', width: '100%'});
      });

      it('should broadcast <name>.onSubmitted with onSubmitted', function() {
        const mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory;
        const mockMediator = mockRegistry['service/mediator'].mediator;
        const mockBeacon = mockRegistry['service/beacon'].beacon;

        const childFnParams = {
          updateFrameSize: noop
        };
        const params = {
          res: {
            body: {
              message: 'Request #149 "bla bla" created'
            }
          },
          searchString: 'a search',
          searchLocale: 'en-US'
        };

        mockery.registerMock(
          'utility/devices', {
            isMobileBrowser: function() {
              return true;
            }
          });

        submitTicket.create('bob');

        const mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;

        const payload = mockFrameFactoryCall[0](childFnParams);

        payload.props.onSubmitted(params);

        expect(mockBeacon.track)
          .toHaveBeenCalledWith(
            'submitTicket',
            'send',
            'bob',
          {
            query: params.searchString,
            locale: params.searchLocale,
            ticketId: 149
          }
          );

        expect(mockMediator.channel.broadcast)
          .toHaveBeenCalledWith('bob.onFormSubmitted');
      });
    });
  });

  describe('get', function() {

    it('should return the correct submitTicket form', function() {
      submitTicket.create('bob');

      expect(submitTicket.get('bob'))
        .toBeDefined();
    });

  });

  describe('submitTicketSender', () => {
    it('should call transport.send when invoked', () => {
      const mockTransport = mockRegistry['service/transport'].transport;
      const formParams = {
        'set_tags': 'web_widget',
        'via_id': 48,
        'submitted_from': global.window.location.href,
        'email': 'mock@email.com',
        'description': 'Mock Description'
      };

      submitTicket.create('bob');
      submitTicket.render('bob');

      const embed = submitTicket.get('bob').instance.getRootComponent();

      embed.props.submitTicketSender(formParams, null, null);
      expect(mockTransport.send)
        .toHaveBeenCalled();
    });
  });

  describe('render', function() {

    it('should throw an exception if SubmitTicket does not exist', function() {
      expect(function() {
        submitTicket.render('non_existent_submitTicket');
      }).toThrow();
    });

    it('renders a submitTicket form to the document', function() {
      submitTicket.create('bob');
      submitTicket.render('bob');

      expect(document.querySelectorAll( '.mock-frame').length)
        .toEqual(1);

      expect(document.querySelectorAll( '.mock-frame .mock-submitTicket').length)
        .toEqual(1);

      expect(TestUtils.isCompositeComponent(submitTicket.get('bob').instance))
        .toEqual(true);
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
      const mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory;
      const mockCss = mockRegistry['./submitTicket.scss'];

      submitTicket.create('bob');
      submitTicket.render('bob');

      const mockFrameFactoryCss = mockFrameFactory.calls.mostRecent().args[1].css;

      expect(mockFrameFactoryCss)
        .toEqual(mockCss);
    });

    describe('mediator subscription', function() {
      let mockMediator,
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
        bobSubmitTicket = bobFrame.refs.rootComponent;
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

        bobSubmitTicket.setState({
          showNotification: true
        });

        pluckSubscribeCall(mockMediator, 'bob.hide')();

        expect(bobSubmitTicket.clearNotification.__reactBoundMethod)
          .toHaveBeenCalled();
      });

      it('should subscribe to <name>.showBackButton', function() {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('bob.showBackButton', jasmine.any(Function));

        bobSubmitTicket.setState({
          showBackButton: false
        });

        pluckSubscribeCall(mockMediator, 'bob.showBackButton')();

        expect(bobFrame.state.showBackButton)
          .toEqual(true);
      });

      it('should subscribe to <name>.setLastSearch', function() {
        const params = {
          searchString: 'a search',
          searchLocale: 'en-US'
        };

        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('bob.setLastSearch', jasmine.any(Function));

        bobSubmitTicket.setState({
          searchString: null,
          searchLocale: null
        });

        pluckSubscribeCall(mockMediator, 'bob.setLastSearch')(params);

        expect(bobSubmitTicket.state.searchString)
          .toEqual(params.searchString);
        expect(bobSubmitTicket.state.searchLocale)
          .toEqual(params.searchLocale);
      });

      it('should subscribe to <name>.prefill', function() {
        const params = {
          name: 'James Dean',
          email: 'james@dean.com'
        };

        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('bob.prefill', jasmine.any(Function));

        pluckSubscribeCall(mockMediator, 'bob.prefill')(params);

        expect(bobSubmitTicketForm.state.formState.name)
          .toEqual(params.name);

        expect(bobSubmitTicketForm.state.formState.email)
          .toEqual(params.email);
      });
    });

  });

});
