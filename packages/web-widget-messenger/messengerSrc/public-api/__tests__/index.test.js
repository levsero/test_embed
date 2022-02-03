import { logger } from '@zendesk/widget-shared-services'
import * as suncoApi from 'messengerSrc/api/sunco'
import i18n from 'messengerSrc/features/i18n'
import createStore from 'messengerSrc/store'
import * as authentication from 'messengerSrc/store/authentication'
import * as cookies from 'messengerSrc/store/cookies'
import { getIsWidgetOpen } from 'messengerSrc/store/visibility'
import api from '../'

const isFeatureEnabled = require('@zendesk/widget-shared-services/feature-flags').default
isFeatureEnabled.mockImplementation(() => true) // web_widget_jwt_auth feature switch

jest.mock('@zendesk/widget-shared-services/feature-flags')

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

describe('cookies', () => {
  it('disables cookies when called with a falsy value', async () => {
    jest.spyOn(cookies, 'cookiesDisabled').mockReturnValue({ type: 'cookies disabled' })

    const store = createStore()
    store.dispatch = jest.fn()
    api(store)['messenger:set']['cookies'](false)

    expect(store.dispatch).toHaveBeenCalledWith(cookies.cookiesDisabled())
  })

  it('enables cookies when called with a truthy value', () => {
    const store = createStore()
    store.dispatch = jest.fn()
    api(store)['messenger:set']['cookies'](true)

    expect(store.dispatch).toHaveBeenCalledWith(cookies.cookiesEnabled())
  })
})

describe('loginUser', () => {
  it('logs a user in', () => {
    jest.spyOn(authentication, 'loginUser').mockReturnValue({ type: 'login user' })
    const store = createStore()
    store.dispatch = jest.fn()
    api(store).messenger.loginUser(() => {})

    expect(store.dispatch).toHaveBeenCalledWith(authentication.loginUser())
  })

  it('throws an error for the customer to see when the argument is not a function', () => {
    jest.spyOn(authentication, 'loginUser').mockReturnValue({ type: 'login user' })

    const store = createStore()
    store.dispatch = jest.fn()
    logger.error = jest.fn()
    api(store).messenger.loginUser('Invalid argument')

    expect(logger.error).toHaveBeenCalledWith(
      'Invalid argument provided for loginUser. Needs to be of type function. See https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/web/sdk_api_reference/#login-user'
    )

    expect(store.dispatch).not.toHaveBeenCalledWith(authentication.loginUser())
  })
})

describe('logoutUser', () => {
  it('logs a user out', () => {
    jest.spyOn(authentication, 'logoutUser').mockReturnValue({ type: 'logout user' })

    const store = createStore()
    store.dispatch = jest.fn()
    api(store).messenger.logoutUser()
    expect(store.dispatch).toHaveBeenCalledWith(authentication.logoutUser())
  })
})
