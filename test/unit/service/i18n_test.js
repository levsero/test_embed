describe('i18n', function() {
  var i18n,
      mockRegistry,
      i18nPath = buildSrcPath('service/i18n');

  beforeEach(function() {
    mockery.enable({useCleanCache: true});
    mockRegistry = initMockRegistry({
      'translation/translations.json': {
        'en-US': {
          'launcher.label.hello': 'Hello'
        },
        'de': {
          'launcher.label.hello': 'Hallo'
        }
      }
    });

    mockery.registerAllowable(i18nPath);
    i18n = require(i18nPath).i18n;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });


  it('should default setLocale to en-US on init', function() {
    i18n.init();

    expect(i18n.translate('launcher.label.hello'))
      .toEqual('Hello');
  });

  it('should grab the german strings when locale is changed', function() {
    var locale = 'de';

    i18n.setLocale(locale);

    expect(i18n.translate('launcher.label.hello'))
      .toEqual('Hallo');
  });

});
