describe('embed.nps', () => {
  let nps,
      mockRegistry;

  const npsPath = buildSrcPath('embed/nps/nps');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    mockRegistry = initMockRegistry({
      'react/addons': React,
      'service/mediator': {
        mediator: {
          channel: jasmine.createSpyObj('channel', ['broadcast', 'subscribe'])
        }
      },
      './nps.scss': '',
      'embed/frameFactory': {
        frameFactory: requireUncached(buildTestPath('unit/mockFrameFactory')).mockFrameFactory,
        frameMethods: requireUncached(buildTestPath('unit/mockFrameFactory')).mockFrameMethods
      },
      'component/Nps': {
        Nps: React.createClass({
          reset: jasmine.createSpy('reset'),
          getInitialState() {
            return {
              survey: {}
            };
          },
          render() {
            return (
              <div className='mock-nps' />
            );
          }
        })
      },
      'service/persistence': {
        store: jasmine.createSpyObj('store', ['set', 'get'])
      },
      'service/transport': {
        transport: {
          sendWithMeta: jasmine.createSpy(),
          getZendeskHost: () => 'test.zd-dev.com'
        }
      },
      'utility/globals': {
        document: global.document,
        getDocumentHost: function() {
          return document.body;
        }
      },
      'utility/devices': {
        isMobileBrowser: function() {
          return false;
        }
      }
    });

    mockery.registerAllowable(npsPath);

    nps = requireUncached(npsPath).nps;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('render', () => {

    it('renders an nps embed the document', () => {
      nps.create('dan');
      nps.render('dan');

      expect(document.querySelectorAll('.mock-frame').length)
       .toEqual(1);

      expect(document.querySelectorAll('.mock-frame .mock-nps').length)
       .toEqual(1);
    });

    describe('mediator subscriptions', () => {
      let mockMediator,
          dan,
          danNps;

      const surveyParams = {
        npsSurvey: {
          id: 1,
          commentsQuestion: 'comments question',
          highlightColor: '#ffffff',
          logoUrl: 'http://logo.url/',
          question: 'question',
          recepientId: 2
        }
      };

      beforeEach(() => {
        mockMediator = mockRegistry['service/mediator'].mediator;
        nps.create('dan');
        nps.render('dan');
        dan = nps.get('dan');
        danNps = dan.instance.getChild().refs.rootComponent;
      });

      describe('subscriptions to nps.activate', () => {
        it('should be subscribed', () => {
          expect(mockMediator.channel.subscribe)
            .toHaveBeenCalledWith('nps.activate', jasmine.any(Function));
        });

        it('should show if a survey is available', () => {
          pluckSubscribeCall(mockMediator, 'nps.setSurvey')(surveyParams);
          pluckSubscribeCall(mockMediator, 'nps.activate')();

          expect(dan.instance.show.__reactBoundMethod)
            .toHaveBeenCalledWith(true);
        });

        it('should not show if a survey is not available', () => {
          pluckSubscribeCall(mockMediator, 'nps.setSurvey')({});
          pluckSubscribeCall(mockMediator, 'nps.activate')();

          expect(dan.instance.show.__reactBoundMethod)
            .not.toHaveBeenCalledWith();
        });
      });

      describe('subscription to nps.setSurvey', () => {
        it('should be subscribed', () => {
          expect(mockMediator.channel.subscribe)
            .toHaveBeenCalledWith('nps.setSurvey', jasmine.any(Function));
        });

        it('should set state.surveyAvailable to false if none is available', () => {
          expect(danNps.reset.__reactBoundMethod)
            .not.toHaveBeenCalled();

          pluckSubscribeCall(mockMediator, 'nps.setSurvey')({});

          expect(danNps.state.surveyAvailable)
            .toEqual(false);
        });

        it('should set the survey correctly if one is available', () => {
          pluckSubscribeCall(mockMediator, 'nps.setSurvey')(surveyParams);

          expect(danNps.reset.__reactBoundMethod)
            .toHaveBeenCalled();

          const surveyKeys = [
            ['surveyId', 'id'],
            'commentsQuestion',
            'highlightColor',
            'logoUrl',
            'question',
            'recipientId'
          ];

          surveyKeys.forEach((key) => {
            if (key[1]) {
              expect(danNps.state.survey[key[0]])
                .toEqual(surveyParams.npsSurvey[key[1]]);
            } else {
              expect(danNps.state.survey[key])
                .toEqual(surveyParams.npsSurvey[key]);
            }
          });

          expect(danNps.state.surveyAvailable)
            .toEqual(true);
        });
      });

      it('should subscribe to nps.hide', function() {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('nps.hide', jasmine.any(Function));

        pluckSubscribeCall(mockMediator, 'nps.hide')();

        expect(dan.instance.hide.__reactBoundMethod)
          .toHaveBeenCalled();
      });

      it('should subscribe to nps.show', function() {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('nps.show', jasmine.any(Function));

        pluckSubscribeCall(mockMediator, 'nps.show')();

        expect(dan.instance.show.__reactBoundMethod)
          .toHaveBeenCalled();
      });
    });
  });

  describe('dismissal functionality', () => {
    const survey = {
      surveyId: 1234,
      recipientId: 2345
    };

    let store,
        transport,
        expectedKey,
        currentDate;

    beforeEach(() => {
      store = mockRegistry['service/persistence'].store;
      transport = mockRegistry['service/transport'].transport;
      expectedKey = [
          transport.getZendeskHost(),
          survey.surveyId,
          survey.recipientId,
          'dismiss-timestamp'
        ].join('-');
      currentDate = new Date();
      currentDate.setMilliseconds(0);
    });

    describe('setDismissTimestamp', () => {
      it('should set the current timestamp correctly', () => {

        spyOn(window, 'Date').and.callFake(function() {
          return currentDate;
        });

        nps.setDismissTimestamp(survey);

        expect(store.set)
          .toHaveBeenCalledWith(
            expectedKey,
            currentDate.getTime()
          );
      });
    });

    describe('shouldShow', () => {
      it('should return true if dismissTimestamp is not set', () => {
        store.get = jasmine.createSpy().and.returnValue(null);

        expect(nps.shouldShow(survey))
          .toEqual(true);
      });

      it('should return true if dismissTimestamp is more than 3 days ago', () => {
        const dismissDate = new Date(currentDate.getTime() - (3 * 24 * 60 * 60 * 1000));

        spyOn(window, 'Date').and.callFake(() => currentDate);

        store.get = jasmine.createSpy().and.returnValue(dismissDate.getTime());

        expect(nps.shouldShow(survey))
          .toEqual(true);
      });

      it('should return false if dismissTimestamp is 1 minute ago', () => {
        const dismissDate = new Date(currentDate.getTime() - (60 * 1000));

        spyOn(window, 'Date').and.callFake(() => currentDate);

        store.get = jasmine.createSpy().and.returnValue(dismissDate.getTime());

        expect(nps.shouldShow(survey))
          .toEqual(false);
      });

      it('should return false if dismissTimestamp is 2.9 days ago', () => {
        const dismissDate = new Date(currentDate.getTime() - (2.9 * 24 * 60 * 60 * 1000));

        spyOn(window, 'Date').and.callFake(() => currentDate);

        store.get = jasmine.createSpy().and.returnValue(dismissDate.getTime());

        expect(nps.shouldShow(survey))
          .toEqual(false);
      });
    });
  });
});
