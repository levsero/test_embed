describe('embed.submitTicket', () => {
  let submitTicket,
    mockRegistry,
    mockSettingsValue,
    mockIsMobileBrowserValue,
    mockIsIEValue,
    frameConfig;
  const resetTicketFormVisibility = jasmine.createSpy();
  const hideVirtualKeyboard = jasmine.createSpy();
  const focusField = jasmine.createSpy();
  const clearForm = jasmine.createSpy();
  const defaultValue = 'abc123';
  const submitTicketPath = buildSrcPath('embed/submitTicket/submitTicket');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    mockSettingsValue = null;
    mockIsMobileBrowserValue = false;
    mockIsIEValue = false;

    mockRegistry = initMockRegistry({
      'React': React,
      'service/beacon': {
        beacon: {
          trackUserAction: jasmine.createSpy('trackUserAction')
        }
      },
      'service/mediator': {
        mediator: {
          channel: jasmine.createSpyObj('channel', ['broadcast', 'subscribe'])
        }
      },
      'service/i18n': {
        i18n: {
          getLocale: noop
        }
      },
      'component/submitTicket/SubmitTicketForm': {
        SubmitTicketForm: React.createClass({
          resetTicketFormVisibility: resetTicketFormVisibility,
          hideVirtualKeyboard: hideVirtualKeyboard,
          focusField: focusField,
          render: () => {
            return (
              <div />
            );
          }
        })
      },
      'component/submitTicket/SubmitTicket': {
        SubmitTicket: React.createClass({
          getInitialState: () => {
            return {
              showNotification: false,
              message: '',
              uid: defaultValue
            };
          },
          show: jasmine.createSpy('show'),
          hide: jasmine.createSpy('hide'),
          clearNotification: jasmine.createSpy('clearNotification'),
          clearForm: clearForm,

          render: () => {
            const SubmitTicketForm = mockRegistry['component/submitTicket/SubmitTicketForm'].SubmitTicketForm;

            return (
              <div className='mock-submitTicket'>
                <SubmitTicketForm ref='submitTicketForm' />
              </div>
            );
          }
        })
      },
      './submitTicket.scss': 'mockCSS',
      './submitTicketFrame.scss': '',
      'component/loading/LoadingSpinner.sass': '',
      'component/submitTicket/SubmitTicket.sass': '',
      'component/submitTicket/SubmitTicketForm.sass': '',
      'embed/frameFactory': {
        frameFactory: requireUncached(buildTestPath('unit/mockFrameFactory')).mockFrameFactory,
        frameMethods: requireUncached(buildTestPath('unit/mockFrameFactory')).mockFrameMethods
      },
      'utility/utils': {
        setScrollKiller: jasmine.createSpy(),
        setWindowScroll: jasmine.createSpy(),
        revertWindowScroll: jasmine.createSpy()
      },
      'utility/color': {
        generateUserCSS: jasmine.createSpy().and.returnValue('')
      },
      'utility/devices': {
        isMobileBrowser: () => mockIsMobileBrowserValue,
        isIE: () => mockIsIEValue,
        setScaleLock: jasmine.createSpy('setScaleLock'),
        getZoomSizingRatio: noop
      },
      'utility/globals': {
        document: global.document,
        getDocumentHost: () => {
          return document.body;
        }
      },
      'service/settings': {
        settings: {
          get: () => mockSettingsValue
        }
      },
      'service/transitionFactory' : {
        transitionFactory: requireUncached(buildTestPath('unit/mockTransitionFactory')).mockTransitionFactory
      },
      'service/transport': {
        transport: jasmine.createSpyObj('transport', ['get', 'send', 'sendFile'])
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

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('create', () => {
    it('show add a new submit ticket form to the submitTicket array', () => {
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

    it('changes config.formTitleKey if formTitleKey is set', () => {
      submitTicket.create('bob', { formTitleKey: 'test_title' } );

      const bob = submitTicket.get('bob');

      expect(bob.config.formTitleKey)
        .toEqual('test_title');
    });

    it('changes config.attachmentsEnabled if zESettings.contactForm.attachments is false', () => {
      mockSettingsValue = false; // emulate settings.get('contactForm.attachments')
      submitTicket.create('bob', { attachmentsEnabled: true } );

      const bob = submitTicket.get('bob');

      expect(bob.config.attachmentsEnabled)
        .toEqual(false);
    });

    describe('when ticket forms are available', () => {
      let mockTransport;

      beforeEach(() => {
        mockTransport = mockRegistry['service/transport'].transport;
      });

      it('should call show_many', () => {
        submitTicket.create('bob', { ticketForms: [1] } );

        expect(mockTransport.get.calls.mostRecent().args[0].path)
          .toEqual('/api/v2/ticket_forms/show_many.json?ids=1&include=ticket_fields');
      });

      it('should use the settings value over the config value', () => {
        mockSettingsValue = [212]; // emulate settings.get('contactForm.ticketForms')
        submitTicket.create('bob', { ticketForms: [121] } );

        expect(mockTransport.get.calls.mostRecent().args[0].path)
          .toContain('212');
      });
    });

    describe('frameFactory', () => {
      let mockFrameFactory,
        mockFrameFactoryCall,
        mockMediator,
        childFn,
        embed,
        submitTicketFrame,
        params;

      beforeEach(() => {
        mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory;
        mockMediator = mockRegistry['service/mediator'].mediator;

        submitTicket.create('bob', frameConfig);
        submitTicket.render('bob');

        mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
        childFn = mockFrameFactoryCall[0];
        params = mockFrameFactoryCall[1];
        embed = submitTicket.get('bob').instance.getRootComponent();
        submitTicketFrame = submitTicket.get('bob').instance;
      });

      it('should apply the configs', () => {
        const bob = submitTicket.get('bob');
        const payload = childFn({});

        expect(payload.props.formTitleKey)
          .toEqual(bob.config.formTitleKey);
      });

      it('should not call focusField in afterShowAnimate for non-IE browser', () => {
        mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
        params = mockFrameFactoryCall[1];

        params.afterShowAnimate(submitTicketFrame);

        expect(focusField)
          .not.toHaveBeenCalled();
      });

      it('should call focusField in afterShowAnimate for IE browser', () => {
        mockIsIEValue = true;

        submitTicket = requireUncached(submitTicketPath).submitTicket;
        submitTicket.create('bob', frameConfig);
        submitTicket.render('bob');

        submitTicketFrame = submitTicket.get('bob').instance;

        mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
        params = mockFrameFactoryCall[1];

        params.afterShowAnimate(submitTicketFrame);

        expect(focusField)
          .toHaveBeenCalled();
      });

      it('should toggle setScaleLock with onShow/onHide', () => {
        const mockSetScaleLock = mockRegistry['utility/devices'].setScaleLock;

        mockIsMobileBrowserValue = true;

        submitTicket = requireUncached(submitTicketPath).submitTicket;
        submitTicket.create('bob', frameConfig);
        submitTicket.render('bob');

        submitTicketFrame = submitTicket.get('bob').instance;

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

      it('should reset form state onShow', () => {
        mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
        params = mockFrameFactoryCall[1];

        params.onShow(submitTicketFrame);

        expect(resetTicketFormVisibility)
          .toHaveBeenCalled();
      });

      it('should hide virtual keyboard onHide', () => {
        mockIsMobileBrowserValue = true;

        submitTicket = requireUncached(submitTicketPath).submitTicket;
        submitTicket.create('bob', frameConfig);
        submitTicket.render('bob');

        submitTicketFrame = submitTicket.get('bob').instance;

        mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
        params = mockFrameFactoryCall[1];

        params.onHide(submitTicketFrame);

        expect(hideVirtualKeyboard)
          .toHaveBeenCalled();
      });

      it('should broadcast <name>.onClose with onClose', () => {
        params.onClose();

        expect(mockMediator.channel.broadcast)
          .toHaveBeenCalledWith('bob.onClose');
      });

      describe('onBack', () => {
        describe('when there is no ticket form selected', () => {
          it('should broadcast <name>.onBackClick', () => {
            params.onBack();

            expect(mockMediator.channel.broadcast)
              .toHaveBeenCalledWith('bob.onBackClick');
          });
        });

        describe('when there is a ticket form selected', () => {
          let child;

          beforeEach(() => {
            child = submitTicketFrame.getChild();
            embed.setState({ selectedTicketForm: 1 });
            params.onBack();
          });

          it('should hide the back button', () => {
            expect(child.state.showBackButton)
              .toEqual(true);
          });

          it('should clear the form', () => {
            expect(clearForm)
              .toHaveBeenCalled();
          });
        });
      });

      it('should switch iframe styles based on isMobileBrowser()', () => {
        const mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory;

        mockIsMobileBrowserValue = true;

        submitTicket = requireUncached(submitTicketPath).submitTicket;
        submitTicket.create('bob');

        const mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
        const iframeStyle = mockFrameFactoryCall[1].frameStyle;

        expect(iframeStyle.left)
          .toBeUndefined();

        expect(iframeStyle.right)
          .toBeUndefined();
      });

      it('should switch container styles based on isMobileBrowser()', () => {
        const mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory;
        const childFnParams = {
          updateFrameSize: noop
        };

        mockIsMobileBrowserValue = true;

        submitTicket = requireUncached(submitTicketPath).submitTicket;
        submitTicket.create('bob');

        const mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
        const payload = mockFrameFactoryCall[0](childFnParams);

        expect(payload.props.style)
        .toEqual({height: '100%', width: '100%'});
      });

      describe('when onSubmitted is called', () => {
        let mockFrameFactory,
          mockMediator,
          mockBeacon;
        const childFnParams = {
          updateFrameSize: noop
        };

        beforeEach(() => {
          mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory;
          mockMediator = mockRegistry['service/mediator'].mediator;
          mockBeacon = mockRegistry['service/beacon'].beacon;
        });

        describe('when attachments are enabled', () => {
          let params,
            value,
            mockFrameFactoryCall,
            payload;

          beforeEach(() => {
            params = {
              res: {
                body: {
                  request: { id: 149 }
                }
              },
              email: 'mock@email.com',
              searchTerm: 'a search',
              searchLocale: 'en-US',
              attachmentsCount: 2,
              attachmentTypes: ['image/gif', 'image/png']
            };
            value = {
              query: params.searchTerm,
              locale: params.searchLocale,
              email: params.email,
              ticketId: 149,
              attachmentsCount: 2,
              attachmentTypes: ['image/gif', 'image/png']
            };

            mockSettingsValue = true;
            submitTicket.create('bob', { attachmentsEnabled: true });

            mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
            payload = mockFrameFactoryCall[0](childFnParams);
          });

          describe('when ticket is suspended', () => {
            it('should also broadcast <name>.onsubmitted using correct params for new request endpoint', () => {
              params.res.body = {
                suspended_ticket: { id: 149 } // eslint-disable-line camelcase
              };

              payload.props.onSubmitted(params);

              expect(mockBeacon.trackUserAction)
                .toHaveBeenCalledWith('submitTicket', 'send', 'bob', value);

              expect(mockMediator.channel.broadcast)
                .toHaveBeenCalledWith('bob.onFormSubmitted');
            });
          });

          describe('when ticket is not suspended', () => {
            it('should also broadcast <name>.onsubmitted using correct params for new request endpoint', () => {
              payload.props.onSubmitted(params);

              expect(mockBeacon.trackUserAction)
                .toHaveBeenCalledWith('submitTicket', 'send', 'bob', value);

              expect(mockMediator.channel.broadcast)
                .toHaveBeenCalledWith('bob.onFormSubmitted');
            });
          });
        });
      });
    });
  });

  describe('get', () => {
    it('should return the correct submitTicket form', () => {
      submitTicket.create('bob');

      expect(submitTicket.get('bob'))
        .toBeDefined();
    });
  });

  describe('submitTicketSender', () => {
    let formParams,
      mockTransport,
      embed;

    beforeEach(() => {
      mockTransport = mockRegistry['service/transport'].transport;
      formParams = {
        'set_tags': 'web_widget',
        'via_id': 48,
        'submitted_from': global.window.location.href,
        'email': 'mock@email.com',
        'description': 'Mock Description'
      };
      submitTicket.create('bob');
      submitTicket.render('bob');

      embed = submitTicket.get('bob').instance.getRootComponent();
      embed.props.submitTicketSender(formParams, null, null);
    });

    it('should call transport.send when invoked', () => {
      expect(mockTransport.send)
        .toHaveBeenCalled();
    });

    it('should send with the correct path', () => {
      expect(mockTransport.send.calls.mostRecent().args[0].path)
        .toEqual('/api/v2/requests');
    });
  });

  describe('attachmentSender', () => {
    let file,
      mockTransport,
      embed;

    beforeEach(() => {
      mockTransport = mockRegistry['service/transport'].transport;
      file = {
        name: 'foo.bar'
      };

      submitTicket.create('bob');
      submitTicket.render('bob');

      embed = submitTicket.get('bob').instance.getRootComponent();
      embed.props.attachmentSender(file, null, null, null);
    });

    it('calls transport.sendFile when invoked', () => {
      expect(mockTransport.sendFile)
        .toHaveBeenCalled();
    });

    it('sends to the correct endpoint', () => {
      expect(mockTransport.sendFile.calls.mostRecent().args[0].path)
        .toEqual('/api/v2/uploads');
    });
  });

  describe('render', () => {
    it('should throw an exception if SubmitTicket does not exist', () => {
      expect(() => submitTicket.render('non_existent_submitTicket'))
        .toThrow();
    });

    it('renders a submitTicket form to the document', () => {
      submitTicket.create('bob');
      submitTicket.render('bob');

      expect(document.querySelectorAll( '.mock-frame').length)
        .toEqual(1);

      expect(document.querySelectorAll( '.mock-frame .mock-submitTicket').length)
        .toEqual(1);

      expect(TestUtils.isCompositeComponent(submitTicket.get('bob').instance))
        .toEqual(true);
    });

    it('should only be allowed to render an submitTicket form once', () => {
      submitTicket.create('bob');

      expect(() => submitTicket.render('bob'))
        .not.toThrow();

      expect(() => submitTicket.render('bob'))
        .toThrow();
    });

    it('applies css to the frame', () => {
      const mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory;
      const mockCss = mockRegistry['./submitTicket.scss'];

      submitTicket.create('bob');
      submitTicket.render('bob');

      const mockFrameFactoryCss = mockFrameFactory.calls.mostRecent().args[1].css;

      expect(mockFrameFactoryCss)
        .toContain(mockCss);
    });

    describe('mediator subscription', () => {
      let mockMediator,
        bob,
        bobFrame,
        bobSubmitTicket,
        bobSubmitTicketForm;

      beforeEach(() => {
        mockMediator = mockRegistry['service/mediator'].mediator;
        submitTicket.create('bob');
        submitTicket.render('bob');
        bob = submitTicket.get('bob');
        bobFrame = bob.instance.getChild();
        bobSubmitTicket = bobFrame.refs.rootComponent;
        bobSubmitTicketForm = bobSubmitTicket.refs.submitTicketForm;
      });

      it('should subscribe to <name>.show', () => {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('bob.show', jasmine.any(Function));

        pluckSubscribeCall(mockMediator, 'bob.show')();

        expect(bob.instance.show.__reactBoundMethod)
          .toHaveBeenCalled();
      });

      it('should subscribe to <name>.deactivate', () => {
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

      it('subscribes to <name>.refreshLocale', () => {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('bob.refreshLocale', jasmine.any(Function));
      });

      it('should subscribe to <name>.showBackButton', () => {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('bob.showBackButton', jasmine.any(Function));
      });

      describe('when <name>.showBackButton is broadcast', () => {
        beforeEach(() => {
          bobFrame.setState({
            showBackButton: false
          });
        });

        describe('when not on mobile and without ticketforms', () => {
          it('should not show the button', () => {
            pluckSubscribeCall(mockMediator, 'bob.showBackButton')();

            expect(bobFrame.state.showBackButton)
              .toEqual(false);
          });
        });

        describe('when on mobile', () => {
          beforeEach(() => {
            mockIsMobileBrowserValue = true;
          });

          it('should show the button', () => {
            pluckSubscribeCall(mockMediator, 'bob.showBackButton')();

            expect(bobFrame.state.showBackButton)
              .toEqual(true);
          });
        });

        describe('when there are ticket forms', () => {
          beforeEach(() => {
            bobSubmitTicket.setState({
              ticketForms: [1]
            });
          });

          it('should show the button', () => {
            pluckSubscribeCall(mockMediator, 'bob.showBackButton')();

            expect(bobFrame.state.showBackButton)
              .toEqual(true);
          });
        });
      });

      it('should subscribe to <name>.setLastSearch', () => {
        const params = {
          searchTerm: 'a search',
          searchLocale: 'en-US'
        };

        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('bob.setLastSearch', jasmine.any(Function));

        bobSubmitTicket.setState({
          searchTerm: null,
          searchLocale: null
        });

        pluckSubscribeCall(mockMediator, 'bob.setLastSearch')(params);

        expect(bobSubmitTicket.state.searchTerm)
          .toEqual(params.searchTerm);
        expect(bobSubmitTicket.state.searchLocale)
          .toEqual(params.searchLocale);
      });

      it('should subscribe to <name>.prefill', () => {
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
