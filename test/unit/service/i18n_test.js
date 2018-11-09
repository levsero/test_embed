describe('i18n', () => {
  let i18n,
    mockRegistry,
    mockLocale = '',
    stringKeyFromFile = 'string.key.from.yml.file',
    stringValueFromFile = 'Hello',
    translationFromFile = {
      translation: {
        key: stringKeyFromFile,
        value: stringValueFromFile
      }
    };
  const i18nPath = buildSrcPath('service/i18n');

  beforeEach(() => {
    mockery.enable();
    mockRegistry = initMockRegistry({
      'service/settings': {
        'settings': { getTranslations: noop }
      },
      'translation/ze_translations': {
        'embeddable_framework': {
          'launcher': {
            'label': {
              'help': {
                'en-US': 'Help',
                'en-au': 'Help',
                'de': 'Hilfe',
                'zh-CN': '帮帮我',
                'pt-BR': 'Ajuda',
                'no': 'Hjelp',
                'fil': 'Tulong',
                'he': 'עֶזרָה'
              },
              'hello': {
                'en-US': 'Hello',
                'en-au': 'Hello',
                'de': 'Hallo',
                'zh-CN': '你好',
                'pt-BR': 'Olá',
                'no': 'Hallo',
                'fil': 'Kumsta',
                'he': 'שלום'
              }
            }
          }
        },
        rtl: {
          'en-US': false,
          'en-au': false,
          'de': false,
          'zh-CN': false,
          'pt-BR': false,
          'no': false,
          'fil': false,
          'he': true
        },
        'locales': [
          'en-US',
          'en-au',
          'de',
          'zh-CN',
          'pt-BR',
          'no',
          'fil',
          'he',
          'zh-tw'
        ]
      },
      'translation/ze_localeIdMap': {
        'en-US': 1,
        'en-au': 1277,
        'de': 8,
        'zh-CN': 10,
        'pt-BR': 19,
        'no': 34,
        'fil': 47,
        'he': 30,
        'zh-tw': 9
      },
      'lodash': _,
      'sprintf-js': require('sprintf-js'),
      '../../config/locales/translations/embeddable_framework.yml': {
        parts: [translationFromFile]
      },
      'src/redux/modules/base/base-action-types': {
        LOCALE_SET: 'LOCALE_SET'
      },
      'src/redux/modules/base/base-selectors': {
        getLocale: () => mockLocale
      }
    });

    mockery.registerAllowable(i18nPath);
    i18n = requireUncached(i18nPath).i18n;

    const mockStore = {
      getState: () => {},
      dispatch: (action) => {
        mockLocale = action.payload;
      }
    };

    i18n.init(mockStore);
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#translate', () => {
    let mockTranslations;

    beforeEach(() => {
      i18n.setLocale('en-US');
      mockTranslations = mockRegistry['translation/ze_translations'].embeddable_framework;
    });

    describe('when the key is valid', () => {
      describe('when the string does not contain variables', () => {
        const testLocales = (translationMap, label) => {
          _.forEach(translationMap, (result, locale) => {
            i18n.setLocale(locale);

            expect(i18n.t(`embeddable_framework.launcher.label.${label}`))
              .toBe(result);
          });
        };

        it('returns the translated string', () => {
          testLocales(mockTranslations.launcher.label.help, 'help');
          testLocales(mockTranslations.launcher.label.hello, 'hello');
        });
      });

      describe('when the string contains variables', () => {
        let args;

        beforeEach(() => {
          mockTranslations.launcher.label.help['en-US'] = 'Hello %(name)s';
        });

        describe('when the correct variable args are passed in', () => {
          beforeEach(() => {
            args = { name: 'Anthony' };
          });

          it('returns the interpolated string', () => {
            expect(i18n.t('embeddable_framework.launcher.label.help', args))
              .toBe('Hello Anthony');
          });
        });

        describe('when incorrect variable args are passed in', () => {
          beforeEach(() => {
            args = { foo: 'Anthony' };
          });

          it('returns the raw string', () => {
            expect(i18n.t('embeddable_framework.launcher.label.help', args))
              .toBe('Hello %(name)s');
          });
        });
      });
    });

    describe('when the key is invalid', () => {
      const key = 'embeddable_framework.launcher.label.unknown';
      let params;

      describe('when there is no fallback param', () => {
        it('returns the missing translation string', () => {
          expect(i18n.t(key, params))
            .toBe(`Missing translation (en-US): ${key}`);
        });
      });
    });

    describe('when the translation is an empty string', () => {
      beforeEach(() => {
        mockTranslations.launcher.label.help['en-US'] = '';
      });

      it('returns the empty string', () => {
        expect(i18n.t('embeddable_framework.launcher.label.help'))
          .toBe('');
      });
    });
  });

  describe('#isRTL', () => {
    describe('when the language is not rtl', () => {
      beforeEach(() => {
        i18n.setLocale('de');
      });

      it('returns false', () => {
        expect(i18n.isRTL())
          .toBe(false);
      });
    });

    describe('when the language is rtl', () => {
      beforeEach(() => {
        i18n.setLocale('he');
      });

      it('returns true', () => {
        expect(i18n.isRTL())
          .toBe(true);
      });
    });
  });

  describe('#setFallbackTranslations', () => {
    beforeEach(() => {
      i18n.setLocale('en-US');
    });

    describe('when __DEV__ is false', () => {
      beforeEach(() => {
        global.__DEV__ = false;
        i18n.setFallbackTranslations();
      });

      it('does not set the string to be available as a fallback for translate', () => {
        expect(i18n.t(stringKeyFromFile))
          .toBe(`Missing translation (en-US): ${stringKeyFromFile}`);
      });
    });

    describe('when __DEV__ is true', () => {
      beforeEach(() => {
        global.__DEV__ = true;
      });

      describe('when a yml file contains a translation string', () => {
        beforeEach(() => {
          i18n.setFallbackTranslations();
        });

        it('sets the string to be available as a fallback for translate', () => {
          expect(i18n.t(stringKeyFromFile))
            .toBe(stringValueFromFile);
        });
      });

      describe('when a yml file does not contain a translation string', () => {
        beforeAll(() => {
          translationFromFile = undefined;
        });

        beforeEach(() => {
          i18n.setFallbackTranslations();
        });

        it('does not set the string to be available as a fallback for translate', () => {
          expect(i18n.t(stringKeyFromFile))
            .toBe(`Missing translation (en-US): ${stringKeyFromFile}`);
        });
      });
    });
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

      expect(i18n.t('embeddable_framework.launcher.label.hello'))
        .toEqual('Hello');
    });

    it('should grab the german strings when locale is changed', () => {
      i18n.setLocale('de');

      expect(i18n.t('embeddable_framework.launcher.label.hello'))
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

    describe('when there are custom translations', () => {
      beforeEach(() => {
        mockRegistry['service/settings'].settings.getTranslations = () => {
          return {
            launcherLabel: {
              '*': 'Wat',
              'de': 'Vot'
            }
          };
        };

        i18n.setCustomTranslations();
      });

      it('should use custom strings when some are defined for the locale', () => {
        i18n.setLocale('de');

        expect(i18n.t('embeddable_framework.launcher.label.help'))
          .toEqual('Vot');
      });

      it('should use wildcard strings when no custom strings are defined for the locale', () => {
        i18n.setLocale('fr');

        expect(i18n.t('embeddable_framework.launcher.label.help'))
          .toEqual('Wat');
      });
    });
  });

  describe('getLocaleId', () => {
    let localeIdMap;

    beforeEach(() => {
      localeIdMap = mockRegistry['translation/ze_localeIdMap'];
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

    describe('zh locales', () => {
      it('returns China\'s locale for `zh` key', () => {
        i18n.setLocale('zh');

        expect(i18n.getLocale())
          .toEqual('zh-cn');
      });

      it('parses zh-Hant-TW as zh-tw', () => {
        i18n.setLocale('zh-Hant-TW');

        expect(i18n.getLocale())
          .toEqual('zh-tw');
      });

      it('parses zh-Hans-CN as zh-cn', () => {
        i18n.setLocale('zh-Hans-CN');

        expect(i18n.getLocale())
          .toEqual('zh-cn');
      });

      it('parses zh-Hant-HK as zh-tw', () => {
        i18n.setLocale('zh-Hant-HK');

        expect(i18n.getLocale())
          .toEqual('zh-tw');
      });

      it('parses zh-Hans-SG as zh-cn', () => {
        i18n.setLocale('zh-Hans-SG');

        expect(i18n.getLocale())
          .toEqual('zh-cn');
      });

      it('parses zh-Hant-MO as zh-tw', () => {
        i18n.setLocale('zh-Hant-MO');

        expect(i18n.getLocale())
          .toEqual('zh-tw');
      });

      it('parses zh-sg as zh-cn', () => {
        i18n.setLocale('zh-sg');

        expect(i18n.getLocale())
          .toEqual('zh-cn');
      });

      it('parses zh-mo as zh-tw', () => {
        i18n.setLocale('zh-MO');

        expect(i18n.getLocale())
          .toEqual('zh-tw');
      });

      it('parses zh-TW as zh-tw', () => {
        i18n.setLocale('zh-TW');

        expect(i18n.getLocale())
          .toEqual('zh-tw');
      });

      it('parses zh-hk as zh-tw', () => {
        i18n.setLocale('zh-hk');

        expect(i18n.getLocale())
          .toEqual('zh-tw');
      });
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

  describe('getSettingTranslation', () => {
    let translations, result, locale;

    beforeEach(() => {
      i18n.setLocale(locale, true);
      result = i18n.getSettingTranslation(translations);
    });

    describe('when the translations object is empty', () => {
      it('returns undefined', () => {
        expect(result).toEqual(undefined);
      });
    });

    describe('when the translations object is not empty', () => {
      beforeAll(() => {
        translations = {
          'de': 'Achtung! Schnell!',
          '*': 'Move it!'
        };
      });

      describe('when the translations object contains the locale', () => {
        beforeAll(() => {
          locale = 'de';
        });

        it('returns the correct translation', () => {
          expect(result).toEqual(translations['de']);
        });
      });

      describe('when the translations object does not contain the locale', () => {
        beforeAll(() => {
          locale = 'fr';
        });

        it('returns the default * locale value', () => {
          expect(result).toEqual(translations['*']);
        });

        describe('when the translations object is missing a default locale', () => {
          beforeAll(() => {
            locale = 'ar';
            translations = {
              'de': 'hallo',
              'jp': 'konichiha'
            };
          });

          it('returns null', () => {
            expect(result)
              .toEqual(null);
          });
        });
      });
    });
  });
});
