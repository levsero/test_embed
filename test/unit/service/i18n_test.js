describe('i18n', () => {
  let i18n,
    mockRegistry;
  const i18nPath = buildSrcPath('service/i18n');

  beforeEach(() => {
    mockery.enable();
    mockRegistry = initMockRegistry({
      'service/settings': {
        'settings': { getTranslations: noop }
      },
      'translation/translations.json': {
        'en-US': {
          'launcher.label.hello': 'Hello',
          'embeddable_framework.launcher.label.help': 'Help'
        },
        'en-au': {
          'launcher.label.hello': 'Hello',
          'embeddable_framework.launcher.label.help': 'Help'
        },
        'de': {
          'launcher.label.hello': 'Hallo',
          'embeddable_framework.launcher.label.help': 'Hilfe'
        },
        'zh-CN': {
          'launcher.label.hello': '你好',
          'embeddable_framework.launcher.label.help': '%E5%B8%AE%E5%8A%A9'
        },
        'pt-BR': {
          'launcher.label.hello': 'Olá',
          'embeddable_framework.launcher.label.help': 'Ajuda'
        },
        'no': {
          'launcher.label.hello': 'Hallo',
          'embeddable_framework.launcher.label.help': 'Hjelp'
        },
        'fil': {
          'launcher.label.hello': 'Kumusta',
          'embeddable_framework.launcher.label.help': 'Tulong'
        }
      },
      'translation/localeIdMap.json': {
        'en-US': 1,
        'de': 8,
        'zh-CN': 10,
        'pt-BR': 19,
        'no': 34,
        'fil': 47
      },
      'lodash': _
    });

    mockery.registerAllowable(i18nPath);
    i18n = requireUncached(i18nPath).i18n;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#setCustomTranslations', () => {
    describe('with a specific translation override', () => {
      beforeEach(() => {
        mockRegistry['service/settings'].settings.getTranslations = () => {
          return {
            launcherLabel: { 'en-US': 'Wat' }
          };
        };

        i18n.setCustomTranslations();
      });

      it('should override the key for the specified locale', () => {
        i18n.setLocale('en-US');

        expect(i18n.t('embeddable_framework.launcher.label.help'))
          .toEqual('Wat');
      });
    });

    describe('with a wildcard translation override', () => {
      beforeEach(() => {
        mockRegistry['service/settings'].settings.getTranslations = () => {
          return {
            launcherLabel: { '*': 'Wat' }
          };
        };

        i18n.setCustomTranslations();
      });

      it('should override the key for the all locales', () => {
        i18n.setLocale();

        expect(i18n.t('embeddable_framework.launcher.label.help'))
          .toEqual('Wat');

        i18n.setLocale('de');

        expect(i18n.t('embeddable_framework.launcher.label.help'))
          .toEqual('Wat');

        i18n.setLocale('zh-CN');

        expect(i18n.t('embeddable_framework.launcher.label.help'))
          .toEqual('Wat');

        i18n.setLocale('pt-BR');

        expect(i18n.t('embeddable_framework.launcher.label.help'))
          .toEqual('Wat');

        i18n.setLocale('no');

        expect(i18n.t('embeddable_framework.launcher.label.help'))
          .toEqual('Wat');

        i18n.setLocale('fil');

        expect(i18n.t('embeddable_framework.launcher.label.help'))
          .toEqual('Wat');
      });
    });
  });

  describe('setLocale', () => {
    it('should default setLocale to en-US', () => {
      i18n.setLocale();

      expect(i18n.t('launcher.label.hello'))
        .toEqual('Hello');
    });

    it('should grab the german strings when locale is changed', () => {
      i18n.setLocale('de');

      expect(i18n.t('launcher.label.hello'))
        .toEqual('Hallo');
    });

    it('should convert lang code to lower case', () => {
      i18n.setLocale('DE');

      expect(i18n.getLocale()).toEqual('de');
    });

    it('should convert region code to upper case', () => {
      i18n.setLocale('zh-cn');
      expect(i18n.getLocale()).toEqual('zh-CN');
    });

    it('should try lang code if lang-region code does not exist (2 letters)', () => {
      i18n.setLocale('de-de');
      expect(i18n.getLocale()).toEqual('de');
    });

    it('should try lang code if lang-region code does not exist (3 letters)', () => {
      i18n.setLocale('fil-PH');
      expect(i18n.getLocale()).toEqual('fil');
    });

    it('should use en-US when there are no translations for the specified locale', () => {
      i18n.setLocale('xx');
      expect(i18n.getLocale()).toEqual('en-US');
    });
  });

  describe('getLocaleId', () => {
    let localeIdMap;

    beforeEach(() => {
      localeIdMap = mockRegistry['translation/localeIdMap.json'];
    });

    it('should return the correct locale_id for en-US', () => {
      i18n.setLocale();
      expect(i18n.getLocaleId()).toEqual(localeIdMap['en-US']);
    });

    it('should return the correct locale_id for de-de', () => {
      /* eslint dot-notation:0 */
      i18n.setLocale('de-de');
      expect(i18n.getLocaleId()).toEqual(localeIdMap['de']);
    });
  });

  describe('parseLocale', () => {
    it('should return locale when locale key is found', () => {
      i18n.setLocale('de');

      expect(i18n.getLocale())
        .toEqual('de');
    });

    it('should return locale when locale with country key is found', () => {
      i18n.setLocale('pt-BR');

      expect(i18n.getLocale())
        .toEqual('pt-BR');
    });

    it('should return China\'s locale for `zh` key', () => {
      i18n.setLocale('zh');

      expect(i18n.getLocale())
        .toEqual('zh-CN');
    });

    it('should return Norwegian locale for `nb` and `nn` key', () => {
      i18n.setLocale('nb');

      expect(i18n.getLocale())
        .toEqual('no');

      i18n.setLocale('nn');

      expect(i18n.getLocale())
        .toEqual('no');
    });

    it('should return Filipino locale for `tl` key', () => {
      i18n.setLocale('tl');

      expect(i18n.getLocale())
        .toEqual('fil');
    });

    it('should return `en-US` if locale key is not found', () => {
      i18n.setLocale('Carlos');

      expect(i18n.getLocale())
        .toEqual('en-US');
    });

    it('should return `en-US` by default if locale key is not passed', () => {
      i18n.setLocale();

      expect(i18n.getLocale())
        .toEqual('en-US');
    });

    describe('when translation is all lower-case', () => {
      beforeEach(() => {
        i18n.setLocale('en-AU');
      });

      it('should return locale when locale with country key is found', () => {
        expect(i18n.getLocale())
          .toEqual('en-au');
      });
    });
  });
});
