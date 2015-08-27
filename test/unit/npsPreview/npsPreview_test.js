describe('npsPreview entry file', function() {
  let mockRegistry;

  const npsPath = buildSrcPath('npsPreview');

  beforeEach(function() {
    resetDOM();

    mockery.enable();

    mockRegistry = initMockRegistry({
      'react/addons': React,
      'embed/frameFactory': {
        frameFactory: require(buildTestPath('unit/mockFrameFactory')).mockFrameFactory,
        frameMethods: require(buildTestPath('unit/mockFrameFactory')).mockFrameMethods
      },
      'component/Nps': {
        Nps: React.createClass({
          getInitialState() {
            return {
              isMobile: false,
              survey: {}
            };
          },
          render() {
            return (this.state.isMobile)
              ? <div className='nps-mobile' />
              : <div className='nps-desktop' />;
          }
        })
      },
      'service/i18n': {
        i18n: jasmine.createSpyObj('i18n', ['setLocale'])
      },
      'embed/nps/nps.scss': ''
    });

    requireUncached(npsPath);
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('window.zE', function() {
    it('exposes zE global', function() {
      expect(window.zE)
        .toBeDefined();
    });

    it('exposes zE.renderNps global', function() {
      expect(window.zE.renderNps)
        .toBeDefined();
    });
  });

  describe('zE.renderNps', function() {
    it('calling zE.renderNps returns object with two methods', function() {
      let nps = window.zE.renderNps('en-US', document.body);

      expect(nps)
        .toEqual(jasmine.any(Object));

      expect(nps.setSurvey)
        .toEqual(jasmine.any(Function));

      expect(nps.setMobile)
        .toEqual(jasmine.any(Function));
    });

    it('calling zE.renderNps writes to DOM', function() {
      let nps = window.zE.renderNps('en-US', document.body);

      expect(document.body.querySelectorAll('.mock-frame').length)
        .toEqual(1);

      expect(document.body.querySelectorAll('.mock-frame .nps-desktop').length)
        .toEqual(1);
    });

    it('calling nps.setMobile(true) switches nps component', function() {
      let nps = window.zE.renderNps('en-US', document.body);

      nps.setMobile(true);

      expect(mockRegistry['embed/frameFactory'].frameMethods.getRootComponent().setState)
        .toHaveBeenCalledWith({isMobile: true});
    });

    it('calling nps.setSurvey({...}) updates nps survey state', function() {
      let nps = window.zE.renderNps('en-US', document.body);
      let survey = {
        question: 'wat',
        commentQuestion: 'wat wat',
        highlightColor: 'papayawhip'
      }

      nps.setSurvey(survey);

      expect(mockRegistry['embed/frameFactory'].frameMethods.getRootComponent().setState)
        .toHaveBeenCalledWith({survey: survey});
    });
  });
});
