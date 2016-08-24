describe('embed.automaticAnswers', () => {
  let automaticAnswers;

  const automaticAnswersPath = buildSrcPath('embed/automaticAnswers/automaticAnswers');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    initMockRegistry({
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
        },
        location: global.location
      }
    });

    mockery.registerAllowable(automaticAnswersPath);

    automaticAnswers = requireUncached(automaticAnswersPath).automaticAnswers;
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
});
