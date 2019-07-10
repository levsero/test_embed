import * as selectors from 'src/redux/modules/base/base-selectors'

const mockState = config => ({ base: config })
const mockConfig = (config = {}) =>
  embeddableConfig({
    embeds: {
      talk: config.talk,
      ticketSubmissionForm: config.ticketSubmission
    }
  })
const embeddableConfig = config =>
  mockState({
    embeddableConfig: config
  })

test('getTalkConfig', () => {
  const config = {
    talk: {
      props: {
        color: '#123123',
        serviceUrl: 'https://example.com',
        nickname: 'Support'
      }
    }
  }

  const state = mockConfig(config)

  expect(selectors.getTalkConfig(state)).toEqual(config.talk)
})

describe('getFormTitleKey', () => {
  describe('when config contains a setting', () => {
    const config = {
      ticketSubmission: {
        props: {
          formTitleKey: 'contact'
        }
      }
    }

    it('returns the setting', () => {
      const state = mockConfig(config)

      expect(selectors.getFormTitleKey(state)).toEqual('contact')
    })
  })

  describe('when config does not contain a setting', () => {
    it('returns the default', () => {
      const state = mockConfig()

      expect(selectors.getFormTitleKey(state)).toEqual('message')
    })
  })
})

test('getBrand', () => {
  const config = embeddableConfig({ brand: 'x brand' })

  expect(selectors.getBrand(config)).toEqual('x brand')
})

test('getBrandLogoUrl', () => {
  const config = embeddableConfig({ brandLogoUrl: 'logo url' })

  expect(selectors.getBrandLogoUrl(config)).toEqual('logo url')
})

test('getLauncherVisible', () => {
  const config = mockState({ launcherVisible: true })

  expect(selectors.getLauncherVisible(config)).toEqual(true)
})

test('getWebWidgetVisible', () => {
  const config = mockState({ webWidgetVisible: true })

  expect(selectors.getWebWidgetVisible(config)).toEqual(true)
})

test('getHiddenByActivateAPI', () => {
  const config = mockState({ hidden: { activateApi: true } })

  expect(selectors.getHiddenByActivateAPI(config)).toEqual(true)
})

test('getHiddenByHide', () => {
  const config = mockState({ hidden: { hideApi: true } })

  expect(selectors.getHiddenByHideAPI(config)).toEqual(true)
})

describe('getWidgetAlreadyHidden', () => {
  test.each(
    [
      [true, false, false, true],
      [false, true, false, true],
      [false, true, true, false],
      [false, false, false, false]
    ],
    'fn(%p, %p, %p) = %p',
    (hideApi, activateApi, webWidgetVisible, expected) => {
      const config = mockState({
        webWidgetVisible,
        hidden: { hideApi, activateApi }
      })

      expect(selectors.getWebWidgetVisible(config)).toEqual(expected)
    }
  )
})
