import createStore from 'src/apps/messenger/store'
import i18n from 'src/framework/services/i18n'
import * as globals from 'utility/globals'

jest.unmock('@zendesk/client-i18n-tools')

import { getLocale, subscribeToI18n } from '../store'

globals.navigator = { languages: ['ko'] }

describe('i18n store', () => {
  describe('subscribeToI18n', () => {
    it('listens to i18n service for changes', async () => {
      const store = createStore()

      await store.dispatch(subscribeToI18n())

      await i18n.setLocale('fr')

      expect(getLocale(store.getState())).toBe('fr')
    })

    it('sets the initial locale to the browser locale', async () => {
      const store = createStore()

      await store.dispatch(subscribeToI18n())

      expect(i18n.getLocale()).toBe('ko')
    })

    it('returns the result object of setting the locale', async () => {
      const store = createStore()

      const result = await store.dispatch(subscribeToI18n())

      expect(result).toEqual({ success: true })
    })
  })
})
