describe('embed.automaticAnswers', () => {
  let automaticAnswers,
    config,
    mockRegistry,
    mockTransport,
    mockJwtToken,
    mockIsMobileBrowserValue,
    mockArticleIdInUrl,
    mockURLParameter;

  const automaticAnswersPath = buildSrcPath('embed/automaticAnswers/automaticAnswers');
  const mockScreenState = 'IRRELEVANT_SCREEN';
  const renderAutomaticAnswers = () => {
    mockTransport = mockRegistry['service/transport'].transport;
    automaticAnswers.create('automaticAnswers', config);
    automaticAnswers.render();
  };
  const mostRecentApiRequest = () => mockTransport.automaticAnswersApiRequest.calls.mostRecent();

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    class AutomaticAnswers extends Component {
      updateTicket() {}
      ticketClosed() {}
      closedWithUndo() {}
    }

    mockRegistry = initMockRegistry({
      'React': React,
      './automaticAnswers.scss': '',
      'embed/frameFactory': {
        frameFactory: requireUncached(buildTestPath('unit/mocks/mockFrameFactory')).mockFrameFactory,
        frameMethods: requireUncached(buildTestPath('unit/mocks/mockFrameFactory')).mockFrameMethods
      },
      'component/automaticAnswers/AutomaticAnswers': {
        AutomaticAnswersScreen: {
          markAsIrrelevant: mockScreenState
        }
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
        getDocumentHost: () => {
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
        transitionFactory: requireUncached(buildTestPath('unit/mocks/mockTransitionFactory')).mockTransitionFactory
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
        getURLParameterByName: jasmine.createSpy().and.callFake(() => mockURLParameter),
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
    let result;

    beforeEach(() => {
      config = {
        test: 'cool',
        thing: 'bananas'
      };
      renderAutomaticAnswers();
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
        renderAutomaticAnswers();
      });

      it('renders the AutomaticAnswersDesktop component', () => {
        expect(document.querySelectorAll('.mock-frame .mock-automaticAnswersDesktop').length)
           .toEqual(1);
      });
    });

    describe('when isMobileDevice is true', () => {
      beforeEach(() => {
        mockIsMobileBrowserValue = true;
        renderAutomaticAnswers();
      });

      it('renders the AutomaticAnswersMobile component', () => {
        expect(document.querySelectorAll('.mock-frame .mock-automaticAnswersMobile').length)
           .toEqual(1);
      });
    });
  });

  describe('postRender', () => {
    beforeEach(() => {
      renderAutomaticAnswers();
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

  describe('closeFrame', () => {
    let instance;

    beforeEach(() => {
      renderAutomaticAnswers();
      instance = automaticAnswers.get().instance;
      spyOn(instance, 'close');
    });

    it('closes embed iframe', () => {
      automaticAnswers.closeFrame();

      expect(instance.close).toHaveBeenCalled();
    });
  });

  describe('closeFrameAfterDelay', () => {
    let instance;
    const closeFrameDelay = 30000;

    beforeEach(() => {
      jasmine.clock().install();
      renderAutomaticAnswers();
      instance = automaticAnswers.get().instance;
      spyOn(instance, 'close');
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    it('closes embed iframe after certain delay', () => {
      automaticAnswers.closeFrameAfterDelay();
      jasmine.clock().tick(closeFrameDelay);

      expect(instance.close).toHaveBeenCalled();
    });
  });

  describe('fetchTicket', () => {
    let mostRecent;
    const fetchTicket = () => {
      renderAutomaticAnswers();
      automaticAnswers.fetchTicket(mockJwtToken);
      mostRecent = mockTransport.automaticAnswersApiRequest.calls.mostRecent().args[0];
    };

    describe('payload configuration and callbacks', () => {
      beforeEach(() => {
        fetchTicket();
      });

      it('contains the correct URL path', () => {
        expect(mostRecent.path)
          .toContain('/requests/automatic-answers/embed/ticket/fetch');
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
    let instance, mostRecent, callback;

    const fetchTicket = () => {
      renderAutomaticAnswers();
      instance = automaticAnswers.get().instance;

      automaticAnswers.fetchTicket(mockJwtToken);
      mostRecent = mockTransport.automaticAnswersApiRequest.calls.mostRecent();
      callback = mostRecent.args[0].callbacks.done;
      spyOn(instance.getRootComponent(), 'updateTicket');
      spyOn(instance.getRootComponent(), 'ticketClosed');
      spyOn(instance.getRootComponent(), 'closedWithUndo');
    };

    describe('and the request is successful', () => {
      let statusId;
      let isSolvedPending = false;

      const statusOpen = 1;
      const statusSolved = 3;
      const showFrameDelay = 500;
      const showSolvedFrameDelay = 500;
      const resSuccess = (statusId, isSolvedPending) => {
        return {
          'statusCode': 200,
          'body': {
            'ticket': {
              'nice_id': 8765,
              'status_id': statusId,
              'title': 'Dude. What does mine say?',
              'is_solved_pending': isSolvedPending
            }
          }
        };
      };

      beforeEach(() => {
        jasmine.clock().install();
      });

      afterEach(() => {
        jasmine.clock().uninstall();
      });

      describe('and the ticket status is one of solved or closed', () => {
        beforeEach(() => {
          statusId = statusSolved;
          mockURLParameter = '1';
        });

        describe('and query params contains `solved`', () => {
          beforeEach(() => {
            mockURLParameter = '1';
          });

          it('updates the component to show the ticket closed screen', () => {
            fetchTicket();

            callback(resSuccess(statusId));

            expect(instance.getRootComponent().ticketClosed).toHaveBeenCalled();
          });

          it('shows the embed solved screen after a short delay', () => {
            fetchTicket();

            callback(resSuccess(statusId));
            jasmine.clock().tick(showSolvedFrameDelay);

            expect(instance.show.__reactBoundMethod).toHaveBeenCalled();
          });
        });

        describe('and query params does not contain `solved`', () => {
          beforeEach(() => {
            mockURLParameter = null;
          });

          it('does not show embeddable widget', () => {
            fetchTicket();

            callback(resSuccess(statusId));

            expect(instance.getRootComponent().ticketClosed).not.toHaveBeenCalled();
            expect(instance.getRootComponent().updateTicket).not.toHaveBeenCalled();
            expect(instance.getRootComponent().closedWithUndo).not.toHaveBeenCalled();
          });
        });
      });

      describe('and an open ticket in solved pending state', () => {
        beforeEach(() => {
          statusId = statusOpen;
          isSolvedPending = true;
        });

        describe('and query params contains `solved`', () => {
          beforeEach(() => {
            mockURLParameter = '1';
          });

          it('updates the component to show the ticket closed with undo screen', () => {
            fetchTicket();

            callback(resSuccess(statusId, isSolvedPending));

            expect(instance.getRootComponent().closedWithUndo).toHaveBeenCalled();
          });

          it('shows the embed solved screen after a short delay', () => {
            fetchTicket();

            callback(resSuccess(statusId, isSolvedPending));
            jasmine.clock().tick(showSolvedFrameDelay);

            expect(instance.show.__reactBoundMethod).toHaveBeenCalled();
          });
        });

        describe('and query params does not contain `solved`', () => {
          beforeEach(() => {
            mockURLParameter = null;
          });

          it('does not show embeddable widget', () => {
            fetchTicket();

            callback(resSuccess(statusId, isSolvedPending));

            expect(instance.getRootComponent().ticketClosed).not.toHaveBeenCalled();
            expect(instance.getRootComponent().updateTicket).not.toHaveBeenCalled();
            expect(instance.getRootComponent().closedWithUndo).not.toHaveBeenCalled();
          });
        });
      });

      describe('and the ticket is neither solved nor solved pending', () => {
        beforeEach(() => {
          statusId = statusOpen;
          isSolvedPending = false;
        });

        it('updates the component to show the update ticket screen', () => {
          fetchTicket();

          callback(resSuccess(statusId, isSolvedPending));

          expect(instance.getRootComponent().updateTicket).toHaveBeenCalled();
        });

        it('shows the embed update ticket screen after a short delay', () => {
          fetchTicket();

          callback(resSuccess(statusId, isSolvedPending));
          jasmine.clock().tick(showFrameDelay);

          expect(instance.show.__reactBoundMethod).toHaveBeenCalled();
        });
      });
    });

    describe('and the request is unsuccessful', () => {
      const fetchTicket = () => {
        renderAutomaticAnswers();
        instance = automaticAnswers.get().instance;

        automaticAnswers.fetchTicket(mockJwtToken);
        mostRecent = mockTransport.automaticAnswersApiRequest.calls.mostRecent();
        callback = mostRecent.args[0].callbacks.fail;
      };

      it('hides the embed', () => {
        fetchTicket();

        callback();

        expect(instance.hide.__reactBoundMethod).toHaveBeenCalled();
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
      renderAutomaticAnswers();

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

  describe('cancelSolve', () => {
    let cancelSolve,
      payload,
      formData;
    const callbacks = {
      done: () => {},
      fail: () => {}
    };

    const renderAndCancelSolve = () => {
      renderAutomaticAnswers();

      cancelSolve = automaticAnswers.get().instance.getRootComponent().props.cancelSolve;
      cancelSolve(mockJwtToken, callbacks);

      payload = mostRecentApiRequest().args[0];
      formData = mostRecentApiRequest().args[1];
    };

    describe('payload configuration and callbacks', () => {
      beforeEach(() => {
        renderAndCancelSolve();
      });

      it('sends a correctly configured payload to automaticAnswersApiRequest', () => {
        expect(payload.path)
          .toBe('/requests/automatic-answers/embed/ticket/cancel_solve');

        expect(payload.method)
          .toEqual('post');
      });

      it('sends correctly configured form data', () => {
        expect(formData.auth_token)
          .toBe(mockJwtToken);
      });

      it('triggers the supplied callbacks', () => {
        expect(payload.callbacks.done)
          .toEqual(callbacks.done);

        expect(payload.callbacks.fail)
          .toEqual(callbacks.fail);
      });
    });

    describe('query params for device tracking', () => {
      beforeEach(() => {
        renderAndCancelSolve();
      });

      it('includes the source=embed query param', () => {
        expect(payload.queryParams.source)
          .toEqual('embed');
      });

      describe('when the device is a mobile browser', () => {
        beforeEach(() => {
          mockIsMobileBrowserValue = true;
          renderAndCancelSolve();
        });

        it('includes the mobile=true query param', () => {
          expect(payload.queryParams.mobile)
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

  describe('article_feedback URL parameter', () => {
    let instance;

    describe('is not set', () => {
      beforeEach(() => { mockURLParameter = ''; });

      it('getInitialScreen should return undefined', () => {
        expect(automaticAnswers.getInitialScreen())
          .toEqual(undefined);
      });

      describe('component initialScreen props', () => {
        beforeEach(() => {
          renderAutomaticAnswers();
          instance = automaticAnswers.get().instance;
        });

        it('should be undefined', () => {
          expect(instance.getRootComponent().props.initialScreen)
            .toEqual(undefined);
        });
      });
    });

    describe('is set to 1', () => {
      beforeEach(() => { mockURLParameter = '1'; });

      it(`getInitialScreen should return ${mockScreenState}`, () => {
        expect(automaticAnswers.getInitialScreen())
          .toEqual(mockScreenState);
      });

      describe('component initialScreen props', () => {
        beforeEach(() => {
          renderAutomaticAnswers();
          instance = automaticAnswers.get().instance;
        });

        it(`should be ${mockScreenState}`, () => {
          expect(instance.getRootComponent().props.initialScreen)
            .toEqual(mockScreenState);
        });
      });
    });
  });
});
