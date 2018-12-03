import { i18n } from '../i18n';
import { createStore } from 'redux';
import reducer from 'src/redux/modules/reducer';
import { settings } from 'service/settings';
import { getLocale } from 'src/redux/modules/base/base-selectors';

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

let store;

beforeEach(() => {
  i18n.reset();
  store = createStore(reducer);
  i18n.init(store);
});

describe('isRTL', () => {
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

describe('setLocale', () => {
  it('defaults setLocale to en-US', () => {
    i18n.setLocale();

    expect(i18n.getLocale())
      .toEqual('en-US');
  });

  it('stores it in redux', () => {
    i18n.setLocale('pt-BR');

    expect(getLocale(store.getState()))
      .toEqual('pt-br');
  });

  it.each([
    ['de', 'de'],
    ['DE', 'de'],
    ['de-de', 'de'],
    ['fil-PH', 'fil'],
    ['xx', 'en-US'],
    ['zh', 'zh-cn'],
    ['zh-Hant-TW', 'zh-tw'],
    ['zh-Hans-CN', 'zh-cn'],
    ['zh-Hans-SG', 'zh-cn'],
    ['zh-Hant-MO', 'zh-tw'],
    ['zh-sg', 'zh-cn'],
    ['zh-mo', 'zh-tw'],
    ['zh-TW', 'zh-tw'],
    ['zh-hk', 'zh-tw'],
    ['nb', 'no'],
    ['tl', 'fil'],
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

      it('returns the translated string for fr', () => {
        i18n.setLocale('fr');
        expect(i18n.t('embeddable_framework.launcher.label.help'))
          .toEqual('Aide');
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

describe('setCustomTranslations', () => {
  let getTranslations;

  beforeEach(() => {
    getTranslations = jest.spyOn(settings, 'getTranslations');
  });

  afterEach(() => {
    getTranslations.mockRestore();
  });

  describe('with a specific translation override', () => {
    beforeEach(() => {
      getTranslations.mockImplementation(() => {
        return {
          launcherLabel: { 'en-US': 'Wat' }
        };
      });
      i18n.setCustomTranslations();
    });

    it('overrides the key for the specified locale', () => {
      i18n.setLocale('en-US');

      expect(i18n.t('embeddable_framework.launcher.label.help'))
        .toEqual('Wat');
    });
  });

  describe('with a wildcard translation override', () => {
    beforeEach(() => {
      getTranslations.mockImplementation(() => {
        return {
          launcherLabel: { '*': 'Wat' }
        };
      });
      i18n.setCustomTranslations();
    });

    it('overrides the key for the all locales', () => {
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

describe('setFallbackTranslations', () => {
  beforeEach(() => {
    i18n.setLocale('en-US');
  });

  describe('when __DEV__ is false', () => {
    beforeEach(() => {
      global.__DEV__ = false;
      i18n.setFallbackTranslations();
    });

    it('does not set the string to be available as a fallback for translate', () => {
      expect(i18n.t('string.key.from.yml.file'))
        .toBe('Missing translation (en-US): string.key.from.yml.file');
    });
  });

  describe('when __DEV__ is true', () => {
    beforeEach(() => {
      global.__DEV__ = true;
    });

    afterEach(() => {
      global.__DEV__ = false;
    });

    describe('when a yml file contains a translation string', () => {
      beforeEach(() => {
        i18n.setFallbackTranslations();
      });

      it('sets the string to be available as a fallback for translate', () => {
        expect(i18n.t('string.key.from.yml.file'))
          .toBe('Hello');
      });
    });

    describe('provide custom fallback translations', () => {
      const fallback = {
        parts: [{
          translation: {
            key: 'string.key.from.yml.file',
            value: 'Hello World'
          }
        }]
      };

      it('uses the provided fallback if provided', () => {
        i18n.setFallbackTranslations(fallback);
        expect(i18n.t('string.key.from.yml.file'))
          .toBe('Hello World');
      });
    });
  });
});
