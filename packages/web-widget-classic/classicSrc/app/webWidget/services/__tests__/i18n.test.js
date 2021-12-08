import { getLocale } from 'classicSrc/redux/modules/base/base-selectors'
import reducer from 'classicSrc/redux/modules/reducer'
import { createStore } from 'redux'
import { globals } from '@zendesk/widget-shared-services'
import { i18n } from '../i18n'

jest.mock('../../../../../../../config/locales/translations/web_widget_classic.yml', () => {
  return {
    parts: [
      {
        translation: {
          key: 'string.key.from.yml.file',
          value: 'Hello',
        },
      },
    ],
  }
})

let store

describe('i18n', () => {
  beforeEach((done) => {
    i18n.reset()
    store = createStore(reducer)
    i18n.init(store)
    i18n.setLocale('en-us', done)
  })
  describe('getClientLocale', () => {
    describe('languages array', () => {
      it('returns the first language element', () => {
        globals.navigator = {
          languages: ['ar', 'fr'],
          browserLanguage: 'en-GB',
          language: 'yolodunno',
        }
        expect(i18n.getClientLocale()).toEqual('ar')
      })
    })
    describe('browserLanguage', () => {
      it('returns the browser language', () => {
        globals.navigator = {
          languages: [],
          browserLanguage: 'en-GB',
          language: 'yolodunno',
        }
        expect(i18n.getClientLocale()).toEqual('en-GB')
      })
    })
    describe('language', () => {
      it('returns the navigator language', () => {
        globals.navigator = {
          languages: [],
          browserLanguage: undefined,
          language: 'en-GB',
        }
        expect(i18n.getClientLocale()).toEqual('en-GB')
      })
    })
    describe('no language', () => {
      it('returns en-us default', () => {
        globals.navigator = {
          languages: [],
          browserLanguage: undefined,
          language: undefined,
        }
        expect(i18n.getClientLocale()).toEqual('en-us')
      })
    })
  })
  describe('isRTL', () => {
    describe('when the language is not rtl', () => {
      it('returns false', () => {
        expect(i18n.isRTL()).toBe(false)
      })
    })
  })
  describe('setLocale', () => {
    describe('with no previously set locale', () => {
      describe('and no locales are passed in', () => {
        it('defaults setLocale to en-us', (done) => {
          i18n.setLocale(undefined, () => {
            expect(i18n.getLocale()).toEqual('en-us')
            done()
          })
        })
      })
      describe('and a configLocale is passed in', () => {
        it('uses the configLocale', (done) => {
          i18n.reset()
          i18n.init(store)
          i18n.setLocale(
            undefined,
            () => {
              expect(i18n.getLocale()).toEqual('de')
              done()
            },
            'de'
          )
        })
      })
      describe('and an apiLocale is passed in', () => {
        it('uses the apiLocale', (done) => {
          i18n.setLocale(
            'pt-BR',
            () => {
              expect(getLocale(store.getState())).toEqual('pt-br')
              done()
            },
            'en-us'
          )
        })
      })
    })
    describe('with a previously set locale', () => {
      beforeEach(() => {
        i18n.setLocale('en-GB')
      })
      describe('and no locales are passed in', () => {
        it('uses the existing locale', () => {
          i18n.setLocale()
          expect(i18n.getLocale()).toEqual('en-gb')
        })
      })
      describe('and a configLocale is passed in', () => {
        it('uses the previous local', () => {
          i18n.setLocale(undefined, noop, 'de')
          expect(i18n.getLocale()).toEqual('en-gb')
        })
      })
      describe('and a apiLocale is passed in', () => {
        it('uses the apiLocale', (done) => {
          i18n.setLocale(
            'pt-BR',
            () => {
              expect(getLocale(store.getState())).toEqual('pt-br')
              done()
            },
            'en-us'
          )
        })
      })
      it.each([
        ['de', 'de'],
        ['DE', 'de'],
        ['de-de', 'de-de'],
        ['fil-PH', 'fil-ph'],
        ['xx', 'en-us'],
        ['zh', 'zh-cn'],
        ['zh_TW', 'zh-tw'],
        ['zh-Hant-TW', 'zh-tw'],
        ['zh-Hans-CN', 'zh-cn'],
        ['zh-Hans-SG', 'zh-sg'],
        ['zh-Hant-MO', 'zh-mo'],
        ['zh-TW', 'zh-tw'],
        ['nb', 'nb'],
        ['nb-NO', 'nb-no'],
        ['nn-NO', 'nn-no'],
        ['no', 'no'],
        ['tl', 'tl'],
        ['en-AU', 'en-au'],
      ])('setLocale(%s) resolves to %s', (arg, expected, done) => {
        i18n.setLocale(arg, () => {
          expect(i18n.getLocale()).toEqual(expected)
          done()
        })
      })
    })
  })
  describe('getLocaleId', () => {
    it('returns the correct locale_id for en-us', (done) => {
      i18n.setLocale(undefined, () => {
        expect(i18n.getLocaleId()).toEqual(1)
        done()
      })
    })
    it('returns the correct locale_id for de-de', (done) => {
      i18n.setLocale('de-de')
      i18n.setLocale('de-de', async () => {
        expect(i18n.getLocaleId()).toEqual(1541)

        done()
      })
    })
  })
  describe('translate', () => {
    beforeEach(() => {
      i18n.setLocale()
    })
    describe('when the key is valid', () => {
      describe('when the string does not contain variables', () => {
        it('returns the translated string', () => {
          expect(i18n.t('embeddable_framework.launcher.label.help')).toEqual('Help')
        })
      })
      describe('when the string contains variables', () => {
        describe('when the correct variable args are passed in', () => {
          it('returns the interpolated string', () => {
            expect(
              i18n.t('embeddable_framework.chat.chatLog.queuePosition', {
                value: 'First',
              })
            ).toEqual('Queue position: First')
          })
        })
        describe('when incorrect variable args are passed in', () => {
          it('returns the raw string', () => {
            expect(
              i18n.t('embeddable_framework.chat.chatLog.queuePosition', {
                val: 'First',
              })
            ).toEqual('Queue position: %(value)s')
          })
        })
      })
    })
    describe('when the key is invalid', () => {
      const key = 'embeddable_framework.launcher.label.unknown'
      describe('when there is no fallback param', () => {
        it('returns the missing translation string', () => {
          expect(i18n.t(key, { val: 'adf' })).toBe(`embeddable_framework.launcher.label.unknown`)
        })
      })
    })
  })
  describe('getSettingTranslation', () => {
    describe('when the translations object is empty', () => {
      it('returns undefined', (done) => {
        i18n.setLocale('en-us', () => {
          expect(i18n.getSettingTranslation({})).toEqual(undefined)
          done()
        })
      })
    })
    describe('when the translations object is not empty', () => {
      const translations = {
        de: 'Achtung! Schnell!',
        '*': 'Move it!',
      }
      describe('when the translations object contains the locale', () => {
        it('returns the correct translation', (done) => {
          i18n.setLocale('de', () => {
            expect(i18n.getSettingTranslation(translations)).toEqual(translations.de)
            done()
          })
        })
      })
      describe('when the translations object does not contain the locale', () => {
        it('returns the default * locale value', (done) => {
          i18n.setLocale('fr', () => {
            expect(i18n.getSettingTranslation(translations)).toEqual(translations['*'])
            done()
          })
        })
        describe('when the translations object is missing a default locale', () => {
          it('returns null', (done) => {
            i18n.setLocale('ar', () => {
              expect(
                i18n.getSettingTranslation({
                  de: 'german',
                  fr: 'french',
                })
              ).toBeNull()
              done()
            })
          })
        })
      })
    })
  })
})
