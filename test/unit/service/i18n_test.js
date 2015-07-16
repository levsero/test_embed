describe('i18n', function() {
  var i18n,
      mockRegistry;
  const i18nPath = buildSrcPath('service/i18n');

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
        },
        'fil': {
          'launcher.label.hello': 'Kumusta'
        }
      },
      'translation/localeIdMap.json': {
        'en-US': 1,
        'de': 8,
        'zh-CN': 10
      },
      'lodash': _
    });

    mockery.registerAllowable(i18nPath);
    i18n = require(i18nPath).i18n;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('setLocale', function() {
    it('should default setLocale to en-US', function() {
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

      expect(i18n.getLocale()).toEqual('de');
    });

    it('should convert region code to upper case', function() {
      i18n.setLocale('zh-cn');
      expect(i18n.getLocale()).toEqual('zh-CN');
    });

    it('should try lang code if lang-region code does not exist (2 letters)', function() {
      i18n.setLocale('de-de');
      expect(i18n.getLocale()).toEqual('de');
    });

    it('should try lang code if lang-region code does not exist (3 letters)', function() {
      i18n.setLocale('fil-PH');
      expect(i18n.getLocale()).toEqual('fil');
    });

    it('should use en-US when there are no translations for the specified locale', function() {
      i18n.setLocale('xx');
      expect(i18n.getLocale()).toEqual('en-US');
    });

  });

  describe('getLocaleId', function() {
    var localeIdMap;

    beforeEach(function() {
      localeIdMap = mockRegistry['translation/localeIdMap.json'];
    });

    it('should return the correct locale_id for en-US', function() {
      i18n.setLocale();
      expect(i18n.getLocaleId()).toEqual(localeIdMap['en-US']);
    });

    it('should return the correct locale_id for de-de', function() {
      /* jshint sub: true */
      i18n.setLocale('de-de');
      expect(i18n.getLocaleId()).toEqual(localeIdMap['de']);
    });

  });

});
