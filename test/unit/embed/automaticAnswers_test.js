describe('embed.automaticAnswers', () => {
  let automaticAnswers,
    mockRegistry,
    mockTransport,
    mockPages,
    mockWrongURLParameter;

  const automaticAnswersPath = buildSrcPath('embed/automaticAnswers/automaticAnswers');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    mockRegistry = initMockRegistry({
      'React': React,
      'embed/frameFactory': {
        frameFactory: requireUncached(buildTestPath('unit/mockFrameFactory')).mockFrameFactory,
        frameMethods: requireUncached(buildTestPath('unit/mockFrameFactory')).mockFrameMethods
      },
      'component/automaticAnswers/AutomaticAnswers': {
        AutomaticAnswers: React.createClass({
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
      'service/transport': {
        transport: jasmine.createSpyObj('transport', ['automaticAnswersApiRequest'])
      },
      'utility/pages': {
        getURLParameterByName: jasmine.createSpy().and.callFake((arg) => {
          if (mockWrongURLParameter) return null;
          if (arg === 'ticket_id') {
            return '123456';
          } else if (arg === 'token') {
            return 'abcdef';
          }
        })
      }
    });

    mockery.registerAllowable(automaticAnswersPath);
    automaticAnswers = requireUncached(automaticAnswersPath).automaticAnswers;

    mockWrongURLParameter = false;
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
      mockPages = mockRegistry['utility/pages'];
      automaticAnswers.create('automaticAnswers');
      automaticAnswers.render();
    });

    describe('searches the current URL string for', () => {
      beforeEach(() => {
        automaticAnswers.postRender('automaticAnswers');
      });

      it('the ticket_id parameter', () => {
        expect(mockPages.getURLParameterByName)
          .toHaveBeenCalledWith('ticket_id');
      });

      it('the token parameter', () => {
        expect(mockPages.getURLParameterByName)
          .toHaveBeenCalledWith('token');
      });
    });

    describe('when the URL contains ticket_id and token parameters', () => {
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

    describe('when the URL does not contain ticket_id and token parameters', () => {
      beforeEach(() => {
        mockWrongURLParameter = true;
        automaticAnswers.postRender('automaticAnswers');
      });

      it('does nothing', () => {
        expect(mockTransport.automaticAnswersApiRequest)
          .not.toHaveBeenCalled();
      });
    });
  });

  describe('when a request to fetch ticket data is received', () => {
    let instance,
      mostRecent;
    const statusNotSolved = 2;
    const statusSolved = 3;

    beforeEach(() => {
      mockTransport = mockRegistry['service/transport'].transport;
      mockPages = mockRegistry['utility/pages'];

      automaticAnswers.create('automaticAnswers');
      automaticAnswers.render();
      instance = automaticAnswers.get().instance;
    });

    describe('when the request is successful', () => {
      let callback,
        resSuccess = (statusId) => {
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
        automaticAnswers.postRender();
        mostRecent = mockTransport.automaticAnswersApiRequest.calls.mostRecent();
        callback = mostRecent.args[0].callbacks.done;
      });

      describe('and the ticket status is less than solved', () => {
        it('shows the embed', () => {
          callback(resSuccess(statusNotSolved));

          expect(instance.show.__reactBoundMethod)
            .toHaveBeenCalled();
        });
      });

      describe('and the ticket status is greater than or equal to solved', () => {
        it('does nothing', () => {
          callback(resSuccess(statusSolved));

          expect(instance.show.__reactBoundMethod)
            .not.toHaveBeenCalled();
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
});
