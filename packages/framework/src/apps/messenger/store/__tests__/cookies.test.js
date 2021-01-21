import createStore from 'src/apps/messenger/store'
import { forgetUserAndDisconnect } from 'src/apps/messenger/api/sunco'
import { cookiesEnabled, cookiesDisabled, getAreCookiesEnabled } from '../cookies'

jest.mock('src/apps/messenger/api/sunco')

describe('cookies store', () => {
  it('defaults to enabled', () => {
    const store = createStore()

    expect(getAreCookiesEnabled(store.getState())).toBe(true)
  })

  it('forgets user and disconnects from sunco when disabled', async () => {
    const store = createStore()

    await store.dispatch(cookiesDisabled())

    expect(getAreCookiesEnabled(store.getState())).toBe(false)
    expect(forgetUserAndDisconnect).toHaveBeenCalled()
  })

  it('can be enabled after being disabled', async () => {
    const store = createStore()

    await store.dispatch(cookiesDisabled())

    expect(getAreCookiesEnabled(store.getState())).toBe(false)

    store.dispatch(cookiesEnabled())

    expect(getAreCookiesEnabled(store.getState())).toBe(true)
  })
})
