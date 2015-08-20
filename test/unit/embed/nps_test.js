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
          render() {
            return (
              <div className='mock-nps' />
            );
          }
        })
      },
      'service/transport': {
        transport: jasmine.createSpyObj('transport', ['sendWithMeta'])
      },
      'utility/globals': {
        document: global.document,
        getDocumentHost: function() {
          return document.body;
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

      const activateParams = {
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

      it('should subscribe to nps.activate', () => {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('nps.activate', jasmine.any(Function));

        pluckSubscribeCall(mockMediator, 'nps.setSurvey')(activateParams);
        pluckSubscribeCall(mockMediator, 'nps.activate')();

        expect(dan.instance.show.__reactBoundMethod)
          .toHaveBeenCalledWith(true);
      });

      it('should subscribe to nps.setSurvey', () => {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('nps.setSurvey', jasmine.any(Function));

        pluckSubscribeCall(mockMediator, 'nps.setSurvey')(activateParams);

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
              .toEqual(activateParams.npsSurvey[key[1]]);
          } else {
            expect(danNps.state.survey[key])
              .toEqual(activateParams.npsSurvey[key]);
          }
        });

        expect(dan.instance.show.__reactBoundMethod)
          .not.toHaveBeenCalled();
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

});
