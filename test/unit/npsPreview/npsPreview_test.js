describe('npsPreview entry file', function() {
  const npsPath = buildSrcPath('npsPreview');

  beforeEach(function() {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'react/addons': React,
      'embed/frameFactory': {
        frameFactory: require(buildTestPath('unit/mockFrameFactory')).mockFrameFactory,
        frameMethods: require(buildTestPath('unit/mockFrameFactory')).mockFrameMethods
      },
      'component/nps/Nps': {
        Nps: class Nps extends Component {
          constructor() {
            this.state = {
              isMobile: false,
              survey: {}
            };
          }
          render() {
            return (this.state.isMobile)
              ? <div className='nps-mobile'>{this.state.survey.question}</div>
              : <div className='nps-desktop'>{this.state.survey.question}</div>;
          }
        }
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
      const elem = document.body.appendChild(document.createElement('div'));
      const nps = window.zE.renderNps('en-US', elem);

      expect(nps)
        .toEqual(jasmine.any(Object));

      expect(nps.setSurvey)
        .toEqual(jasmine.any(Function));

      expect(nps.setMobile)
        .toEqual(jasmine.any(Function));
    });

    it('calling zE.renderNps writes to DOM', function() {
      const elem = document.body.appendChild(document.createElement('div'));

      window.zE.renderNps('en-US', elem);

      expect(document.body.querySelectorAll('.nps-desktop').length)
        .toEqual(1);
    });

    it('calling nps.setMobile(true) switches nps component', function() {
      const elem = document.body.appendChild(document.createElement('div'));
      const nps = window.zE.renderNps('en-US', elem);

      nps.setMobile(true);

      expect(document.body.querySelectorAll('.nps-mobile').length)
        .toEqual(1);
    });

    it('calling nps.setSurvey({...}) updates nps survey state', function() {
      const elem = document.body.appendChild(document.createElement('div'));
      const nps = window.zE.renderNps('en-US', elem);
      const survey = {
        question: 'wat',
        commentQuestion: 'wat wat',
        highlightColor: 'papayawhip'
      };

      nps.setSurvey(survey);

      expect(document.body.querySelector('.nps-desktop').textContent)
        .toEqual(survey.question);
    });
  });
});
