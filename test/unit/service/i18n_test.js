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
        locale_map: {
          'en-US': 'en-US',
          'en-au': 'en-au',
          'de': 'de',
          'zh-CN': 'zh-CN',
          'pt-BR': 'pt-BR',
          'no': 'no',
          'fil': 'fil',
          'he': 'he'
        }
      },
      'translation/localeIdMap.json': {
        'en-US': 1,
        'en-au': 1277,
        'de': 8,
        'zh-CN': 10,
        'pt-BR': 19,
        'no': 34,
        'fil': 47,
        'he': 30
      },
      'lodash': _,
      'sprintf-js': require('sprintf-js')
    });

    mockery.registerAllowable(i18nPath);
    i18n = requireUncached(i18nPath).i18n;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#translate', () => {
    let mockTranslations;

    beforeEach(() => {
      i18n.setLocale('en-US');
      mockTranslations = mockRegistry['translation/translations.json'].embeddable_framework;
    });

    describe('when the key is valid', () => {
      describe('when the string does not contain variables', () => {
        const testLocales = (translationMap, label) => {
          _.forEach(translationMap, (result, locale) => {
            i18n.setLocale(locale, true);

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

      describe('when there is a fallback param', () => {
        beforeEach(() => {
          params = { fallback: 'emacs 4lyf' };
        });

        it('returns the fallback string', () => {
          expect(i18n.t(key, params))
            .toBe('emacs 4lyf');
        });
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
