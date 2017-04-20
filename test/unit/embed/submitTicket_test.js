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
          getLocale: () => 'fr'
        }
      },
      'component/submitTicket/SubmitTicketForm': {
        SubmitTicketForm: class extends Component {
          constructor() {
            super();
            this.resetTicketFormVisibility = resetTicketFormVisibility;
            this.hideVirtualKeyboard = hideVirtualKeyboard;
            this.focusField = focusField;
          }
          render() {
            return (
              <div />
            );
          }
        }
      },
      'component/submitTicket/SubmitTicket': {
        SubmitTicket: class extends Component {
          constructor() {
            super();
            this.clearForm = clearForm;
            this.clearNotification = jasmine.createSpy('clearNotification');
            this.hide = jasmine.createSpy('hide');
            this.show = jasmine.createSpy('show');
            this.updateContactForm = jasmine.createSpy('updateContactForm');
            this.state = {
              showNotification: false,
              message: '',
              uid: defaultValue
            };
          }
          setLoading() {}
          render() {
            const SubmitTicketForm = mockRegistry['component/submitTicket/SubmitTicketForm'].SubmitTicketForm;

            return (
              <div className='mock-submitTicket'>
                <SubmitTicketForm ref='submitTicketForm' />
              </div>
            );
          }
        }
      },
      './submitTicket.scss': '',
      './submitTicketFrame.scss': '',
      './submitTicketStyles.js': {
        submitTicketStyles: 'mockCss'
      },
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
    const componentName = 'bob';

    it('show add a new submit ticket form to the submitTicket array', () => {
      expect(_.keys(submitTicket.list()).length)
        .toEqual(0);

      submitTicket.create(componentName);

      expect(_.keys(submitTicket.list()).length)
        .toEqual(1);

      const bob = submitTicket.get(componentName);

      expect(bob)
        .toBeDefined();

      expect(bob.component)
        .toBeDefined();
    });

    it('changes config.formTitleKey if formTitleKey is set', () => {
      submitTicket.create(componentName, { formTitleKey: 'test_title' } );

      const bob = submitTicket.get(componentName);

      expect(bob.config.formTitleKey)
        .toEqual('test_title');
    });

    it('changes config.attachmentsEnabled if zESettings.contactForm.attachments is false', () => {
      mockSettingsValue = false; // emulate settings.get('contactForm.attachments')
      submitTicket.create(componentName, { attachmentsEnabled: true } );

      const bob = submitTicket.get(componentName);

      expect(bob.config.attachmentsEnabled)
        .toEqual(false);
    });

    describe('when ticket forms are available', () => {
      let mockTransport;

      beforeEach(() => {
        mockTransport = mockRegistry['service/transport'].transport;
      });

      it('should call show_many', () => {
        const expectFn = () => {
          expect(mockTransport.get.calls.mostRecent().args[0].path)
            .toEqual('/api/v2/ticket_forms/show_many.json?ids=1&include=ticket_fields');
        };

        submitTicket.create(componentName, { ticketForms: [{ id: 1 }] } );
        submitTicket.waitForRootComponent(componentName, expectFn);
      });

      it('should use the settings value over the config value', () => {
        const expectFn = () => {
          expect(mockTransport.get.calls.mostRecent().args[0].path)
            .toContain('212');
        };

        mockSettingsValue = [{ id: 212 }]; // emulate settings.get('contactForm.ticketForms')
        submitTicket.create(componentName, { ticketForms: [{ id: 1 }] } );
        submitTicket.waitForRootComponent(componentName, expectFn);
      });
    });

    describe('when ticket fields are an array of numbers', () => {
      let mockTransport;

      beforeEach(() => {
        mockTransport = mockRegistry['service/transport'].transport;
      });

      it('should call embeddable/ticket_fields with the ids', () => {
        const expectFn = () => {
          expect(mockTransport.get.calls.mostRecent().args[0].path)
            .toEqual('/embeddable/ticket_fields?field_ids=1,2,3&locale=fr');
        };

        submitTicket.create(componentName, { customFields: { ids: [1, 2, 3] } } );
        submitTicket.waitForRootComponent(componentName, expectFn);
      });
    });

    describe('when ticket fields specify all', () => {
      let mockTransport;

      beforeEach(() => {
        mockTransport = mockRegistry['service/transport'].transport;
      });

      it('should call embeddable/ticket_fields without the ids', () => {
        const expectFn = () => {
          expect(mockTransport.get.calls.mostRecent().args[0].path)
            .toEqual('/embeddable/ticket_fields?locale=fr');
        };

        submitTicket.create(componentName, { customFields: { all: true } } );
        submitTicket.waitForRootComponent(componentName, expectFn);
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

        submitTicket.create(componentName, frameConfig);
        submitTicket.render(componentName);

        mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
        childFn = mockFrameFactoryCall[0];
        params = mockFrameFactoryCall[1];
        embed = submitTicket.get(componentName).instance.getRootComponent();
        submitTicketFrame = submitTicket.get(componentName).instance;
      });

      it('should apply the configs', () => {
        const bob = submitTicket.get(componentName);
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
        submitTicket.create(componentName, frameConfig);
        submitTicket.render(componentName);

        submitTicketFrame = submitTicket.get(componentName).instance;

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
        submitTicket.create(componentName, frameConfig);
        submitTicket.render(componentName);

        submitTicketFrame = submitTicket.get(componentName).instance;

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
        submitTicket.create(componentName, frameConfig);
        submitTicket.render(componentName);

        submitTicketFrame = submitTicket.get(componentName).instance;

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
        submitTicket.create(componentName);

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
        submitTicket.create(componentName);

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
            submitTicket.create(componentName, { attachmentsEnabled: true });

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
                .toHaveBeenCalledWith('submitTicket', 'send', componentName, value);

              expect(mockMediator.channel.broadcast)
                .toHaveBeenCalledWith('bob.onFormSubmitted');
            });
          });

          describe('when ticket is not suspended', () => {
            it('should also broadcast <name>.onsubmitted using correct params for new request endpoint', () => {
              payload.props.onSubmitted(params);

              expect(mockBeacon.trackUserAction)
                .toHaveBeenCalledWith('submitTicket', 'send', componentName, value);

              expect(mockMediator.channel.broadcast)
                .toHaveBeenCalledWith('bob.onFormSubmitted');
            });
          });
        });
      });
    });
  });

  describe('get', () => {
    const componentName = 'bob';

    it('should return the correct submitTicket form', () => {
      submitTicket.create(componentName);

      expect(submitTicket.get(componentName))
        .toBeDefined();
    });
  });

  describe('submitTicketSender', () => {
    let formParams,
      mockTransport,
      embed;
    const componentName = 'bob';

    beforeEach(() => {
      mockTransport = mockRegistry['service/transport'].transport;
      formParams = {
        'set_tags': 'web_widget',
        'via_id': 48,
        'submitted_from': global.window.location.href,
        'email': 'mock@email.com',
        'description': 'Mock Description'
      };
      submitTicket.create(componentName);
      submitTicket.render(componentName);

      embed = submitTicket.get(componentName).instance.getRootComponent();
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
    const componentName = 'bob';

    beforeEach(() => {
      mockTransport = mockRegistry['service/transport'].transport;
      file = {
        name: 'foo.bar'
      };

      submitTicket.create(componentName);
      submitTicket.render(componentName);

      embed = submitTicket.get(componentName).instance.getRootComponent();
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
    const componentName = 'bob';

    it('should throw an exception if SubmitTicket does not exist', () => {
      expect(() => submitTicket.render('non_existent_submitTicket'))
        .toThrow();
    });

    it('renders a submitTicket form to the document', () => {
      submitTicket.create(componentName);
      submitTicket.render(componentName);

      expect(document.querySelectorAll( '.mock-frame').length)
        .toEqual(1);

      expect(document.querySelectorAll( '.mock-frame .mock-submitTicket').length)
        .toEqual(1);

      expect(TestUtils.isCompositeComponent(submitTicket.get(componentName).instance))
        .toEqual(true);
    });

    it('should only be allowed to render an submitTicket form once', () => {
      submitTicket.create(componentName);

      expect(() => submitTicket.render(componentName))
        .not.toThrow();

      expect(() => submitTicket.render(componentName))
        .toThrow();
    });

    it('applies css to the frame', () => {
      const mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory;
      const mockCss = mockRegistry['./submitTicket.scss'];

      submitTicket.create(componentName);
      submitTicket.render(componentName);

      const mockFrameFactoryCss = mockFrameFactory.calls.mostRecent().args[1].css;

      expect(mockFrameFactoryCss)
        .toContain(mockCss);
    });

    describe('mediator subscription', () => {
      let mockMediator,
        bob,
        bobFrame,
        bobSubmitTicket;

      beforeEach(() => {
        mockMediator = mockRegistry['service/mediator'].mediator;
        submitTicket.create(componentName);
        submitTicket.render(componentName);
        bob = submitTicket.get(componentName);
        bobFrame = bob.instance.getChild();
        bobSubmitTicket = bobFrame.refs.rootComponent;
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

        expect(bobSubmitTicket.clearNotification)
          .not.toHaveBeenCalled();

        bobSubmitTicket.setState({
          showNotification: true
        });

        pluckSubscribeCall(mockMediator, 'bob.hide')();

        expect(bobSubmitTicket.clearNotification)
          .toHaveBeenCalled();
      });

      it('subscribes to <name>.refreshLocale', () => {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('bob.refreshLocale', jasmine.any(Function));
      });

      describe('when <name>.refreshLocale is broadcast', () => {
        let embed;

        describe('when there are ticket forms', () => {
          const ticketForms = [10000, 10001];

          beforeEach(() => {
            submitTicket.create(componentName, { ticketForms });
            submitTicket.render(componentName);
            embed = submitTicket.get(componentName);

            spyOn(submitTicket, 'loadTicketForms');
            spyOn(submitTicket, 'loadTicketFields');
            spyOn(embed.instance.getChild(), 'forceUpdate');
            pluckSubscribeCall(mockMediator, 'bob.refreshLocale')();
          });

          it('should call loadTicketForms', () => {
            expect(submitTicket.loadTicketForms)
              .toHaveBeenCalledWith(componentName, ticketForms, 'fr');
          });

          it('should call SubmitTicket.forceUpdate', () => {
            expect(embed.instance.getChild().forceUpdate)
              .toHaveBeenCalled();
          });

          it('should not call loadTicketFields', () => {
            expect(submitTicket.loadTicketFields)
              .not.toHaveBeenCalled();
          });
        });

        describe('when there are custom ticket fields', () => {
          const customFields = { ids: [10000, 10001] };

          beforeEach(() => {
            submitTicket.create(componentName, { customFields });
            submitTicket.render(componentName);
            embed = submitTicket.get(componentName);

            spyOn(submitTicket, 'loadTicketForms');
            spyOn(submitTicket, 'loadTicketFields');
            spyOn(embed.instance.getChild(), 'forceUpdate');
            pluckSubscribeCall(mockMediator, 'bob.refreshLocale')();
          });

          it('should call loadTicketFields', () => {
            expect(submitTicket.loadTicketFields)
              .toHaveBeenCalledWith(componentName, customFields, 'fr');
          });

          it('should call SubmitTicket.forceUpdate', () => {
            expect(embed.instance.getChild().forceUpdate)
              .toHaveBeenCalled();
          });

          it('should not call loadTicketForms', () => {
            expect(submitTicket.loadTicketForms)
              .not.toHaveBeenCalled();
          });
        });
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

        expect(bobSubmitTicket.state.formState.name)
          .toEqual(params.name);

        expect(bobSubmitTicket.state.formState.email)
          .toEqual(params.email);
      });
    });
  });
});
