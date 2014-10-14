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
        },
        'zh-CN': {
          'launcher.label.hello': '你好'
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
    i18n.setLocale();
    expect(i18n.t('launcher.label.hello'))
      .toEqual('Hello');
  });

  it('should grab the german strings when locale is changed', function() {
    i18n.setLocale('de');

    expect(i18n.t('launcher.label.hello'))
      .toEqual('Hallo');
  });

  it('should convert lang code to lower case', function() {
    i18n.setLocale('DE');
    expect(i18n.t.getLocale()).toEqual('de');
  });

  it('should convert region code to upper case', function() {
    i18n.setLocale('zh-cn');
    expect(i18n.t.getLocale()).toEqual('zh-CN');
  });

  it('should use en-US when there are no translations for the specified locale', function() {
    i18n.setLocale('xx');
    expect(i18n.t.getLocale()).toEqual('en-US');
  });
});
