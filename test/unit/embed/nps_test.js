describe('embed.nps', () => {
  let nps,
    mockRegistry;

  const npsPath = buildSrcPath('embed/nps/nps');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    mockRegistry = initMockRegistry({
      'React': React,
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
      'component/nps/Nps': {
        Nps: React.createClass({
          getInitialState() {
            return {
              survey: {}
            };
          },
          resetState: jasmine.createSpy('resetState'),
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
          sendWithMeta: jasmine.createSpy('transport.sendWithMeta'),
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
      },
      'utility/scrollHacks': {
        setScrollKiller: noop,
        setWindowScroll: noop,
        revertWindowScroll: noop
      },
      'service/transitionFactory' : {
        transitionFactory: requireUncached(buildTestPath('unit/mockTransitionFactory')).mockTransitionFactory
      }
    });

    mockery.registerAllowable(npsPath);

    nps = requireUncached(npsPath).nps;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('create', () => {
    describe('desktop', () => {
      it('should provide the desktop transition in configs', () => {
        const upShow = mockRegistry['service/transitionFactory'].transitionFactory.npsDesktop.upShow;
        const downHide = mockRegistry['service/transitionFactory'].transitionFactory.npsDesktop.downHide;

        nps.create('dan');

        expect(upShow)
          .toHaveBeenCalled();
        expect(downHide)
          .toHaveBeenCalled();
      });
    });

    describe('mobile', () => {
      it('should provide the mobile transitions in config', () => {
        mockRegistry['utility/devices'].isMobileBrowser = () => true;

        nps = requireUncached(npsPath).nps;

        const upShow = mockRegistry['service/transitionFactory'].transitionFactory.npsMobile.upShow;
        const downHide = mockRegistry['service/transitionFactory'].transitionFactory.npsMobile.downHide;

        nps.create('dan');

        expect(upShow)
          .toHaveBeenCalled();
        expect(downHide)
          .toHaveBeenCalled();
      });
    });
  });

  describe('npsSender', () => {
    it('calls transport.sendWithMeta when called', () => {
      const mockTransport = mockRegistry['service/transport'].transport;

      nps.create('dan');
      nps.render('dan');

      const embed = nps.get('dan').instance.getRootComponent();

      embed.props.npsSender();

      expect(mockTransport.sendWithMeta)
        .toHaveBeenCalled();
    });
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
            .toHaveBeenCalled();
        });

        it('should not show if a survey is not available', () => {
          pluckSubscribeCall(mockMediator, 'nps.setSurvey')({ npsSurvey: {} });
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
          expect(danNps.resetState.__reactBoundMethod)
            .not.toHaveBeenCalled();

          pluckSubscribeCall(mockMediator, 'nps.setSurvey')({ npsSurvey: {} });

          expect(danNps.state.surveyAvailable)
            .toEqual(false);
        });

        it('should set the survey correctly if one is available', () => {
          pluckSubscribeCall(mockMediator, 'nps.setSurvey')(surveyParams);

          expect(danNps.resetState.__reactBoundMethod)
            .toHaveBeenCalled();

          const surveyKeys = [
            'id',
            'commentsQuestion',
            'highlightColor',
            'logoUrl',
            'question',
            'recipientId'
          ];

          surveyKeys.forEach((key) => {
            expect(danNps.state.survey[key])
              .toEqual(surveyParams.npsSurvey[key]);
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
      id: 1234,
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
        survey.id,
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

      it('should return true if dismissTimestamp is more than 21 days ago', () => {
        const dismissDate = new Date(currentDate.getTime() - (21 * 24 * 60 * 60 * 1000));

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

      it('should return false if dismissTimestamp is 20.9 days ago', () => {
        const dismissDate = new Date(currentDate.getTime() - (20.9 * 24 * 60 * 60 * 1000));

        spyOn(window, 'Date').and.callFake(() => currentDate);

        store.get = jasmine.createSpy().and.returnValue(dismissDate.getTime());

        expect(nps.shouldShow(survey))
          .toEqual(false);
      });
    });
  });
});
