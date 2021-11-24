import { persistence } from '@zendesk/widget-shared-services'
import { forgetUserAndDisconnect } from 'messengerSrc/api/sunco'
import createStore from 'messengerSrc/store'
import { cookiesEnabled, cookiesDisabled, getAreCookiesEnabled } from '../cookies'

jest.mock('messengerSrc/api/sunco')

jest.mock('@zendesk/widget-shared-services', () => {
  const originalModule = jest.requireActual('@zendesk/widget-shared-services')

  return {
    __esModule: true,
    ...originalModule,
    persistence: {
      ...originalModule.persistence,
      disable: jest.fn(),
    },
  }
})

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

  it('clears all values in storage when disabled', async () => {
    jest.spyOn(persistence, 'disable')
    const store = createStore()

    await store.dispatch(cookiesDisabled())

    expect(getAreCookiesEnabled(store.getState())).toBe(false)
    expect(persistence.disable).toHaveBeenCalled()
  })

  it('can be enabled after being disabled', async () => {
    const store = createStore()

    await store.dispatch(cookiesDisabled())

    expect(getAreCookiesEnabled(store.getState())).toBe(false)

    store.dispatch(cookiesEnabled())

    expect(getAreCookiesEnabled(store.getState())).toBe(true)
  })
})
