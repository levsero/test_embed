import _ from 'lodash'
import * as validate from '../validate'
import { settings } from 'service/settings'

let mockSettingsValue

settings.get = name => _.get(mockSettingsValue, name, null)

describe('themeColor', () => {
  describe('without settings', () => {
    describe('with a base colour', () => {
      describe('with a valid base colour', () => {
        it('prefers the base colour and returns it', () => {
          mockSettingsValue = null

          expect(validate.themeColor('#eb67a2')).toEqual('#eb67a2')
        })
      })

      describe('with an invalid base colour', () => {
        it("returns the widget's default colour", () => {
          mockSettingsValue = null

          expect(validate.themeColor('#OMGWFTBBQ')).toEqual('#78A300')
        })
      })
    })

    describe('without a base colour', () => {
      it("returns the widget's default colour", () => {
        mockSettingsValue = null

        expect(validate.themeColor()).toEqual('#78A300')
      })
    })
  })
})

describe('colorFor', () => {
  describe('with valid color', () => {
    expect(validate.colorFor('#6abc28')).toEqual('#6abc28')
  })

  describe('with un-normalised color', () => {
    it('normalises the settings value and returns it', () => {
      expect(validate.colorFor('7cbda2')).toEqual('#7cbda2')
    })
  })

  describe('with invalid color', () => {
    describe('and a fallback', () => {
      it('uses the fallback', () => {
        expect(validate.colorFor('setting', '#41dcb1')).toEqual('#41dcb1')
      })
    })

    describe('and multiple fallbacks', () => {
      it('uses the first valid fallback', () => {
        expect(validate.colorFor('setting', '#DAN', '#ON', '#87b195', '#PTO', '#FFFFFF')).toEqual(
          '#87b195'
        )
      })
    })

    describe('and multiple fallbacks that are all invalid', () => {
      it('returns undefined', () => {
        mockSettingsValue = { color: { theme: '#llanllwni' } }

        expect(validate.colorFor('setting', '#DAN', '#CHILLIN', '#SOMEWHERE')).toBeUndefined()
      })
    })
  })

  describe('without settings', () => {
    describe('and a fallback', () => {
      it('uses the fallback', () => {
        mockSettingsValue = null

        expect(validate.colorFor('setting', '#31acb6')).toEqual('#31acb6')
      })
    })

    describe('and without a fallback', () => {
      it('returns undefined', () => {
        mockSettingsValue = null

        expect(validate.colorFor('anotherSetting')).toBeUndefined()
      })
    })
  })
})
