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

    class AutomaticAnswers extends Component {
      updateTicket() {}
      solveTicketDone() {}
    }

    mockRegistry = initMockRegistry({
      'React': React,
      './automaticAnswers.scss': '',
      'embed/frameFactory': {
        frameFactory: requireUncached(buildTestPath('unit/mockFrameFactory')).mockFrameFactory,
        frameMethods: requireUncached(buildTestPath('unit/mockFrameFactory')).mockFrameMethods
      },
      'component/automaticAnswers/AutomaticAnswersDesktop': {
        AutomaticAnswersDesktop: class extends AutomaticAnswers {
          render() {
            return (
              <div className='mock-automaticAnswersDesktop' />
            );
          }
        }
      },
      'component/automaticAnswers/AutomaticAnswersMobile': {
        AutomaticAnswersMobile: class extends AutomaticAnswers {
          render() {
            return (
              <div className='mock-automaticAnswersMobile' />
            );
          }
        }
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

    mockJwtToken = 'abcdef';
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
    describe('when isMobileDevice is false', () => {
      beforeEach(() => {
        automaticAnswers.create('zomg');
        automaticAnswers.render('zomg');
      });

      it('renders the AutomaticAnswersDesktop component', function() {
        expect(document.querySelectorAll('.mock-frame .mock-automaticAnswersDesktop').length)
           .toEqual(1);
      });
    });

    describe('when isMobileDevice is true', () => {
      beforeEach(() => {
        mockIsMobileBrowserValue = true;
        automaticAnswers.create('zomg');
        automaticAnswers.render('zomg');
      });

      it('renders the AutomaticAnswersMobile component', function() {
        expect(document.querySelectorAll('.mock-frame .mock-automaticAnswersMobile').length)
           .toEqual(1);
      });
    });
  });

  describe('postRender', () => {
    beforeEach(() => {
      mockTransport = mockRegistry['service/transport'].transport;
      automaticAnswers.create('automaticAnswers');
      automaticAnswers.render();
    });

    describe('when the JWT is available', () => {
      let mostRecent;

      beforeEach(() => {
        automaticAnswers.postRender('automaticAnswers');
        mostRecent = mockTransport.automaticAnswersApiRequest.calls.mostRecent().args[0];
      });

      it('passes auth_token to fetchTicket', () => {
        expect(mostRecent.queryParams.auth_token)
          .toEqual('abcdef');
      });
    });

    describe('when the JWT is unavailable', () => {
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

  describe('fetchTicket', () => {
    let mostRecent;
    const fetchTicket = () => {
      mockTransport = mockRegistry['service/transport'].transport;
      automaticAnswers.create('automaticAnswers');
      automaticAnswers.render();
      automaticAnswers.fetchTicket(mockJwtToken);
      mostRecent = mockTransport.automaticAnswersApiRequest.calls.mostRecent().args[0];
    };

    describe('payload configuration and callbacks', () => {
      beforeEach(() => {
        fetchTicket();
      });

      it('contains the correct URL path', () => {
        expect(mostRecent.path)
          .toContain(`/requests/automatic-answers/embed/ticket/fetch`);
      });

      it('uses a GET method', () => {
        expect(mostRecent.method)
          .toEqual('get');
      });
    });

    describe('query params for device tracking', () => {
      beforeEach(() => {
        fetchTicket();
      });

      it('includes the source=embed query param', () => {
        expect(mostRecent.queryParams.source)
          .toEqual('embed');
      });

      describe('when the device is a mobile browser', () => {
        beforeEach(() => {
          mockIsMobileBrowserValue = true;
          fetchTicket();
        });

        it('includes the mobile=true query param', () => {
          expect(mostRecent.queryParams.mobile)
            .toBe(true);
        });
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
      const showFrameDelay = 500;
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

          it('updates the component to show the ticket closed screen', () => {
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
      mostRecent,
      formData;
    const mockArticleIdInUrl = 23425454;
    const callbacks = {
      done: () => {},
      fail: () => {}
    };

    const renderAndSolveTicket = () => {
      mockTransport = mockRegistry['service/transport'].transport;
      automaticAnswers.create('automaticAnswers');
      automaticAnswers.render();

      solveTicket = automaticAnswers.get().instance.getRootComponent().props.solveTicket;
      solveTicket(mockJwtToken, mockArticleIdInUrl, callbacks);

      mostRecent = mockTransport.automaticAnswersApiRequest.calls.mostRecent().args[0];
      formData = mockTransport.automaticAnswersApiRequest.calls.mostRecent().args[1];
    };

    describe('payload configuration and callbacks', () => {
      beforeEach(() => {
        renderAndSolveTicket();
      });

      it('sends a correctly configured payload to automaticAnswersApiRequest', () => {
        expect(mostRecent.path)
          .toBe('/requests/automatic-answers/embed/ticket/solve');

        expect(mostRecent.method)
          .toEqual('post');
      });

      it('sends correctly configured form data', () => {
        expect(formData.auth_token)
          .toBe(mockJwtToken);

        expect(formData.article_id)
          .toBe(mockArticleIdInUrl);
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
        expect(mostRecent.queryParams.source)
          .toEqual('embed');
      });

      describe('when the device is a mobile browser', () => {
        beforeEach(() => {
          mockIsMobileBrowserValue = true;
          renderAndSolveTicket();
        });

        it('includes the mobile=true query param', () => {
          expect(mostRecent.queryParams.mobile)
            .toBe(true);
        });
      });
    });
  });

  describe('markArticleIrrelevant', () => {
    let mostRecent,
      formData;
    const mockArticleIdInUrl = 23425454;
    const mockReason = 2;
    const callbacks = {
      done: () => {},
      fail: () => {}
    };

    const markArticleIrrelevant = () => {
      mockTransport = mockRegistry['service/transport'].transport;
      automaticAnswers.markArticleIrrelevant(mockJwtToken, mockArticleIdInUrl, mockReason, callbacks);
      mostRecent = mockTransport.automaticAnswersApiRequest.calls.mostRecent().args[0];
      formData = mockTransport.automaticAnswersApiRequest.calls.mostRecent().args[1];
    };

    beforeEach(() => {
      markArticleIrrelevant();
    });

    describe('payload configuration and callbacks', () => {
      it('sends a correctly configured payload to automaticAnswersApiRequest', () => {
        expect(mostRecent.path)
          .toEqual('/requests/automatic-answers/embed/article/irrelevant');

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

    describe('formData', () => {
      it('includes the auth_token', () => {
        expect(formData.auth_token)
          .toBe(mockJwtToken);
      });

      it('includes the article_id', () => {
        expect(formData.article_id)
          .toBe(mockArticleIdInUrl);
      });

      it('includes the reason', () => {
        expect(formData.reason)
          .toBe(mockReason);
      });
    });

    describe('query params for device tracking', () => {
      it('includes the source=embed query param', () => {
        expect(mostRecent.queryParams.source)
          .toEqual('embed');
      });

      describe('when the device is a mobile browser', () => {
        beforeEach(() => {
          mockIsMobileBrowserValue = true;
          markArticleIrrelevant();
        });

        it('includes the mobile=true query param', () => {
          expect(mostRecent.queryParams.mobile)
            .toBe(true);
        });
      });
    });
  });
});
