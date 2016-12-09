describe('embed.automaticAnswers', () => {
  let automaticAnswers,
    mockRegistry,
    mockTransport,
    mockJwtToken,
    mockIsMobileBrowserValue,
    mockArticleIdInUrl,
    mockSolvedURLParameter;

  const automaticAnswersPath = buildSrcPath('embed/automaticAnswers/automaticAnswers');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    mockRegistry = initMockRegistry({
      'React': React,
      './automaticAnswers.scss': '',
      'embed/frameFactory': {
        frameFactory: requireUncached(buildTestPath('unit/mockFrameFactory')).mockFrameFactory,
        frameMethods: requireUncached(buildTestPath('unit/mockFrameFactory')).mockFrameMethods
      },
      'component/automaticAnswers/AutomaticAnswers': {
        AutomaticAnswers: React.createClass({
          updateTicket() {},
          solveTicketDone() {},
          render() {
            return (
              <div className='mock-automaticAnswers' />
            );
          }
        })
      },
      'utility/globals': {
        document: global.document,
        getDocumentHost: function() {
          return document.body;
        }
      },
      'utility/color': {
        generateUserCSS: jasmine.createSpy().and.returnValue('')
      },
      'utility/devices': {
        isMobileBrowser: () => mockIsMobileBrowserValue
      },
      'service/transitionFactory' : {
        transitionFactory: requireUncached(buildTestPath('unit/mockTransitionFactory')).mockTransitionFactory
      },
      'service/automaticAnswersPersistence' : {
        automaticAnswersPersistence: {
          getContext: jasmine.createSpy().and.callFake(() => mockJwtToken)
        }
      },
      'service/transport': {
        transport: jasmine.createSpyObj('transport', ['automaticAnswersApiRequest'])
      },
      'utility/pages': {
        getURLParameterByName: jasmine.createSpy().and.callFake(() => mockSolvedURLParameter),
        getHelpCenterArticleId: jasmine.createSpy().and.callFake(() => mockArticleIdInUrl)
      }
    });

    mockery.registerAllowable(automaticAnswersPath);
    automaticAnswers = requireUncached(automaticAnswersPath).automaticAnswers;

    mockJwtToken = {
      'ticket_id': 123456,
      'token': 'abcdef'
    };
    mockIsMobileBrowserValue = false;
    mockArticleIdInUrl = 1234;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('create', () => {
    let result, config;

    beforeEach(() => {
      config = {
        test: 'cool',
        thing: 'bananas'
      };
      automaticAnswers.create('derp', config);

      result = automaticAnswers.get('derp');
    });

    it('creates an object with "component" and "config" properties', () => {
      expect(result.component)
        .toBeDefined();

      expect(result.config)
        .toBeDefined();
    });

    it('passes through supplied config', () => {
      expect(result.config)
        .toEqual(config);
    });
  });

  describe('render', () => {
    it('renders an automaticAnswers embed in the document', () => {
      automaticAnswers.create('zomg');
      automaticAnswers.render('zomg');

      expect(document.querySelectorAll('.mock-frame').length)
       .toEqual(1);

      expect(document.querySelectorAll('.mock-frame .mock-automaticAnswers').length)
       .toEqual(1);
    });
  });

  describe('postRender', () => {
    beforeEach(() => {
      mockTransport = mockRegistry['service/transport'].transport;
      automaticAnswers.create('automaticAnswers');
      automaticAnswers.render();
    });

    describe('when the JWT body contains ticket_id and token parameters', () => {
      let mostRecent;

      beforeEach(() => {
        automaticAnswers.postRender('automaticAnswers');
        mostRecent = mockTransport.automaticAnswersApiRequest.calls.mostRecent().args[0];
      });

      it('passes ticket_id and token to fetchTicketFn', () => {
        expect(mostRecent.path)
          .toEqual('/requests/automatic-answers/ticket/123456/fetch/token/abcdef');
        expect(mostRecent.method)
          .toEqual('get');
        expect(mockTransport.automaticAnswersApiRequest)
          .toHaveBeenCalled();
      });
    });

    describe('when the JWT body does not contain ticket_id and token parameters', () => {
      beforeEach(() => {
        mockJwtToken = null;
        automaticAnswers.postRender('automaticAnswers');
      });

      it('does nothing', () => {
        expect(mockTransport.automaticAnswersApiRequest)
          .not.toHaveBeenCalled();
      });
    });

    describe('when the window.location does not have article id', () => {
      beforeEach(() => {
        mockArticleIdInUrl = NaN;
      });

      it('does nothing', () => {
        const instance = automaticAnswers.get().instance;

        expect(instance.show.__reactBoundMethod)
          .not.toHaveBeenCalled();
      });
    });
  });

  describe('when a request to fetch ticket data is received', () => {
    let instance,
      mostRecent;
    const statusPending = 2;
    const statusSolved = 3;

    beforeEach(() => {
      mockTransport = mockRegistry['service/transport'].transport;

      automaticAnswers.create('automaticAnswers');
      automaticAnswers.render();
      instance = automaticAnswers.get().instance;
    });

    describe('when the request is successful', () => {
      let callback;
      const showFrameDelay = 2000;
      const showSolvedFrameDelay = 500;
      const resSuccess = (statusId) => {
        return {
          'statusCode': 200,
          'body': {
            'ticket': {
              'nice_id': 8765,
              'status_id': statusId,
              'title': 'Dude. What does mine say?'
            }
          }
        };
      };

      beforeEach(() => {
        jasmine.clock().install();
        automaticAnswers.postRender();
        mostRecent = mockTransport.automaticAnswersApiRequest.calls.mostRecent();
        callback = mostRecent.args[0].callbacks.done;
        spyOn(instance.getRootComponent(), 'updateTicket');
        spyOn(instance.getRootComponent(), 'solveTicketDone');
      });

      afterEach(() => {
        jasmine.clock().uninstall();
      });

      describe('given the ticket status is one of open, new, pending or hold', () => {
        it('passes ticket data to the AutomaticAnswers component', () => {
          callback(resSuccess(statusPending));

          expect(instance.getRootComponent().updateTicket)
            .toHaveBeenCalledWith(resSuccess(statusPending).body.ticket);
        });

        it('shows the embed after a short delay', () => {
          callback(resSuccess(statusPending));
          jasmine.clock().tick(showFrameDelay);

          expect(instance.show.__reactBoundMethod)
            .toHaveBeenCalled();
        });
      });

      describe('given the ticket status is one of solved or closed', () => {
        describe('and a solve parameter equal to "1" exists in the url', () => {
          beforeEach(() => {
            mockSolvedURLParameter = '1';
          });

          it('updates the component solveSuccess state', () => {
            callback(resSuccess(statusSolved));

            expect(instance.getRootComponent().solveTicketDone)
              .toHaveBeenCalled();
          });

          it('shows the embed solved screen after a short delay', () => {
            callback(resSuccess(statusSolved));
            jasmine.clock().tick(showSolvedFrameDelay);

            expect(instance.show.__reactBoundMethod)
              .toHaveBeenCalled();
          });
        });

        describe('and a solve parameter other than "1" exists in the url', () => {
          beforeEach(() => {
            mockSolvedURLParameter = '0';
          });

          it('does nothing', () => {
            callback(resSuccess(statusSolved));

            expect(instance.getRootComponent().solveTicketDone)
              .not.toHaveBeenCalled();

            expect(instance.show.__reactBoundMethod)
              .not.toHaveBeenCalled();
          });
        });

        describe('and no solve parameter exists in the url', () => {
          beforeEach(() => {
            mockSolvedURLParameter = null;
          });

          it('does nothing', () => {
            callback(resSuccess(statusSolved));

            expect(instance.getRootComponent().solveTicketDone)
              .not.toHaveBeenCalled();

            expect(instance.show.__reactBoundMethod)
              .not.toHaveBeenCalled();
          });
        });
      });
    });

    describe('when the request is unsuccessful', () => {
      let callback;

      beforeEach(() => {
        automaticAnswers.postRender();
        mostRecent = mockTransport.automaticAnswersApiRequest.calls.mostRecent();
        callback = mostRecent.args[0].callbacks.fail;
      });

      it('hides the embed', () => {
        callback();

        expect(instance.hide.__reactBoundMethod)
          .toHaveBeenCalled();
      });
    });
  });

  describe('solveTicket', () => {
    let solveTicket,
      mostRecent;
    const mockTicketId = '123456';
    const mockToken = 'abcdef';
    const mockArticleId = 23425454;
    const callbacks = {
      done: () => {},
      fail: () => {}
    };

    const renderAndSolveTicket = () => {
      mockTransport = mockRegistry['service/transport'].transport;
      automaticAnswers.create('automaticAnswers');
      automaticAnswers.render();

      solveTicket = automaticAnswers.get().instance.getRootComponent().props.solveTicket;
      solveTicket(mockTicketId, mockToken, mockArticleId, callbacks);

      mostRecent = mockTransport.automaticAnswersApiRequest.calls.mostRecent().args[0];
    };

    describe('payload configuration and callbacks', () => {
      beforeEach(() => {
        renderAndSolveTicket();
      });

      it('sends a correctly configured payload to automaticAnswersApiRequest', () => {
        expect(mostRecent.path)
          .toBe(`/requests/automatic-answers/ticket/${mockTicketId}/solve/token/${mockToken}/article/${mockArticleId}?source=embed&mobile=false`);

        expect(mostRecent.method)
          .toEqual('post');
      });

      it('triggers the supplied callbacks', () => {
        expect(mostRecent.callbacks.done)
          .toEqual(callbacks.done);

        expect(mostRecent.callbacks.fail)
          .toEqual(callbacks.fail);
      });
    });

    describe('query params for device tracking', () => {
      beforeEach(() => {
        renderAndSolveTicket();
      });

      it('includes the source=embed query param', () => {
        expect(mostRecent.path)
          .toContain(`source=embed`);
      });

      describe('when the device is a mobile browser', () => {
        beforeEach(() => {
          mockIsMobileBrowserValue = true;
          renderAndSolveTicket();
        });

        it('includes the mobile=true query param', () => {
          expect(mostRecent.path)
            .toContain(`mobile=true`);
        });
      });
    });
  });
});
