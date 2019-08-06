import { CONTACT_OPTIONS } from 'src/embeds/talk/constants'

import { getTitle, getOfflineTitle } from '../selectors'

describe('talk selectors', () => {
  describe('getTitle', () => {
    const createState = title => ({ settings: { talk: { title } } })

    it('returns the settings talk title if it exists', () => {
      const state = createState({
        '*': 'Custom title'
      })

      expect(getTitle(state, 'embeddable_framework.talk.form.title')).toBe('Custom title')
    })

    it('returns the fallback translation if no settings talk title', () => {
      const state = createState()

      expect(getTitle(state, 'embeddable_framework.talk.form.title')).toBe('Request a callback')
    })
  })

  describe('getOfflineTitle', () => {
    const createState = (title, capability) => ({
      settings: { talk: { title } },
      talk: { embeddableConfig: { capability } }
    })

    it('returns the settings talk title if it exists', () => {
      const state = createState({
        '*': 'Custom title'
      })

      expect(getTitle(state, 'embeddable_framework.talk.form.title')).toBe('Custom title')
    })

    describe('when no custom talk title set', () => {
      it('returns phone only title when capability is phone only', () => {
        const state = createState(undefined, CONTACT_OPTIONS.PHONE_ONLY)

        expect(getOfflineTitle(state)).toBe('Call us')
      })

      it('returns callback title when capability is callback only', () => {
        const state = createState(undefined, CONTACT_OPTIONS.CALLBACK_ONLY)

        expect(getOfflineTitle(state)).toBe('Request a callback')
      })

      it('returns callback title when capability is callback and phone', () => {
        const state = createState(undefined, CONTACT_OPTIONS.CALLBACK_AND_PHONE)

        expect(getOfflineTitle(state)).toBe('Request a callback')
      })

      it('returns callback title when capability is an unknown value', () => {
        const state = createState(undefined, 'something random')

        expect(getOfflineTitle(state)).toBe('Request a callback')
      })
    })
  })
})
