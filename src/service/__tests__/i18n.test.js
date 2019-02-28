import { i18n } from '../i18n';
import { createStore } from 'redux';
import reducer from 'src/redux/modules/reducer';
import { getLocale } from 'src/redux/modules/base/base-selectors';
import t from '@zendesk/client-i18n-tools';

jest.mock('../../../config/locales/translations/embeddable_framework.yml', () => {
  return {
    parts: [{
      translation: {
        key: 'string.key.from.yml.file',
        value: 'Hello'
      }
    }]
  };
});

jest.mock('@zendesk/client-i18n-tools');
let store;

describe('i18n', () => {
  beforeEach(() => {
    i18n.reset();
    store = createStore(reducer);
    i18n.init(store);
  });

  describe('isRTL', () => {
    describe('when the language is not rtl', () => {
      beforeEach(() => {
        t.dir = 'ltr';
      });

      it('returns false', () => {
        expect(i18n.isRTL())
          .toBe(false);
      });
    });

    describe('when the language is rtl', () => {
      beforeEach(() => {
        t.dir = 'rtl';
      });

      it('returns true', () => {
        expect(i18n.isRTL())
          .toBe(true);
      });
    });
  });

  describe('setLocale', () => {
    describe('with no previously set locale', () => {
      describe('and no locales are passed in', () => {
        it('defaults setLocale to en-US', () => {
          i18n.setLocale();

          expect(i18n.getLocale())
            .toEqual('en-US');
        });
      });

      describe('and a configLocale is passed in', () => {
        it('uses the configLocale', () => {
          i18n.setLocale(undefined, noop, 'de');

          expect(i18n.getLocale())
            .toEqual('de');
        });
      });

      describe('and an apiLocale is passed in', () => {
        it('uses the apiLocale', () => {
          i18n.setLocale('pt-BR', noop, 'en-US');

          expect(getLocale(store.getState()))
            .toEqual('pt-br');
        });
      });
    });

    describe('with a previously set locale', () => {
      beforeEach(() => {
        i18n.setLocale('en-GB');
      });

      describe('and no locales are passed in', () => {
        it('uses the existing locale', () => {
          i18n.setLocale();

          expect(i18n.getLocale())
            .toEqual('en-gb');
        });
      });

      describe('and a configLocale is passed in', () => {
        it('uses the previous local', () => {
          i18n.setLocale(undefined, noop, 'de');

          expect(i18n.getLocale())
            .toEqual('en-gb');
        });
      });

      describe('and a apiLocale is passed in', () => {
        it('uses the apiLocale', () => {
          i18n.setLocale('pt-BR', noop, 'en-US');

          expect(getLocale(store.getState()))
            .toEqual('pt-br');
        });
      });
    });

    it.each([
      ['de', 'de'],
      ['DE', 'de'],
      ['de-de', 'de'],
      ['fil-PH', 'fil'],
      ['xx', 'en-US'],
      ['zh', 'zh-cn'],
      ['zh_TW', 'zh-tw'],
      ['zh-Hant-TW', 'zh-tw'],
      ['zh-Hans-CN', 'zh-cn'],
      ['zh-Hans-SG', 'zh-sg'],
      ['zh-Hant-MO', 'zh-mo'],
      ['zh-TW', 'zh-tw'],
      ['nb', 'no'],
      ['nb-NO', 'no'],
      ['nn-NO', 'nn'],
      ['tl', 'tl'],
      ['en-AU', 'en-au']
    ])('setLocale(%s) resolves to %s',
      (arg, expected) => {
        i18n.setLocale(arg);
        expect(i18n.getLocale())
          .toEqual(expected);
      },
    );
  });

  describe('getLocaleId', () => {
    it('returns the correct locale_id for en-US', () => {
      i18n.setLocale();
      expect(i18n.getLocaleId())
        .toEqual(1);
    });

    it('returns the correct locale_id for de-de', () => {
      i18n.setLocale('de-de');
      expect(i18n.getLocaleId())
        .toEqual(8);
    });
  });

  describe('translate', () => {
    beforeEach(() => {
      i18n.setLocale();
    });

    describe('when the key is valid', () => {
      describe('when the string does not contain variables', () => {
        it('returns the translated string', () => {
          expect(i18n.t('embeddable_framework.launcher.label.help'))
            .toEqual('Help');
        });
      });

      describe('when the string contains variables', () => {
        describe('when the correct variable args are passed in', () => {
          it('returns the interpolated string', () => {
            expect(i18n.t('embeddable_framework.chat.chatLog.queuePosition', { value: 'First' }))
              .toEqual('Queue position: First');
          });
        });

        describe('when incorrect variable args are passed in', () => {
          it('returns the raw string', () => {
            expect(i18n.t('embeddable_framework.chat.chatLog.queuePosition', { val: 'First' }))
              .toEqual('Queue position: %(value)s');
          });
        });
      });
    });

    describe('when the key is invalid', () => {
      const key = 'embeddable_framework.launcher.label.unknown';

      describe('when there is no fallback param', () => {
        it('returns the missing translation string', () => {
          expect(i18n.t(key, { val: 'adf' }))
            .toBe(`Missing translation (en-US): ${key}`);
        });
      });
    });
  });

  describe('getSettingTranslation', () => {
    const getSettingTranslation = (locale, translations) => {
      i18n.setLocale(locale);
      return i18n.getSettingTranslation(translations);
    };

    describe('when the translations object is empty', () => {
      it('returns undefined', () => {
        expect(getSettingTranslation('en-US', {}))
          .toEqual(undefined);
      });
    });

    describe('when the translations object is not empty', () => {
      const translations = {
        'de': 'Achtung! Schnell!',
        '*': 'Move it!'
      };

      describe('when the translations object contains the locale', () => {
        it('returns the correct translation', () => {
          expect(getSettingTranslation('de', translations))
            .toEqual(translations.de);
        });
      });

      describe('when the translations object does not contain the locale', () => {
        it('returns the default * locale value', () => {
          expect(getSettingTranslation('fr', translations))
            .toEqual(translations['*']);
        });

        describe('when the translations object is missing a default locale', () => {
          it('returns null', () => {
            expect(getSettingTranslation('ar', {
              'de': 'german',
              'fr': 'french'
            })).toBeNull();
          });
        });
      });
    });
  });
});

