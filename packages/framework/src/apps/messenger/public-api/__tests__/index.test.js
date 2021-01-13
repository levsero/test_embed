import createStore from 'src/apps/messenger/store'
import { getIsWidgetOpen } from 'src/apps/messenger/store/visibility'
import i18n from 'src/framework/services/i18n'
import * as suncoApi from 'src/apps/messenger/api/sunco'
import api from '../'

describe('open', () => {
  it('opens the widget', () => {
    const store = createStore()
    api(store).messenger.open()
    expect(getIsWidgetOpen(store.getState())).toBe(true)
  })
})

describe('close', () => {
  it('closes the widget', () => {
    const store = createStore()
    api(store).messenger.open()
    api(store).messenger.close()
    expect(getIsWidgetOpen(store.getState())).toBe(false)
  })
})

describe('messenger:set locale', () => {
  it('sets the locale', async () => {
    i18n.setLocale = jest.fn(() => Promise.resolve())
    suncoApi.setLocale = jest.fn()
    const store = createStore()

    await api(store)['messenger:set'].locale('fr')
    expect(i18n.setLocale).toHaveBeenCalledWith('fr')
    expect(suncoApi.setLocale).toHaveBeenCalledWith('fr')
  })
})
