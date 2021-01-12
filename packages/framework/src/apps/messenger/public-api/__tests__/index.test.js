import createStore from 'src/apps/messenger/store'
import { getIsWidgetOpen } from 'src/apps/messenger/store/visibility'
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
