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

describe('getCustomFieldsAvailable', () => {
  describe('when config contains the setting', () => {
    describe('when ids are present', () => {
      const config = {
        ticketSubmission: {
          props: {
            customFields: {
              ids: [10, 20]
            }
          }
        }
      }

      it('returns true', () => {
        const state = mockConfig(config)

        expect(selectors.getCustomFieldsAvailable(state)).toEqual(true)
      })
    })

    describe('when "all" is present', () => {
      const config = {
        ticketSubmission: {
          props: {
            customFields: {
              all: true
            }
          }
        }
      }

      it('returns true', () => {
        const state = mockConfig(config)

        expect(selectors.getCustomFieldsAvailable(state)).toEqual(true)
      })
    })
  })

  describe('when config does not contain the setting', () => {
    const config = {
      ticketSubmission: {
        props: {}
      }
    }

    it('returns the setting', () => {
      const state = mockConfig(config)

      expect(selectors.getCustomFieldsAvailable(state)).toEqual(false)
    })
  })
})

describe('getCustomFieldIds', () => {
  describe('when config contains the setting', () => {
    const config = {
      ticketSubmission: {
        props: {
          customFields: {
            ids: [10, 20]
          }
        }
      }
    }

    it('returns the setting', () => {
      const state = mockConfig(config)

      expect(selectors.getCustomFieldIds(state)).toEqual({ ids: [10, 20] })
    })
  })

  describe('when config does not contain the setting', () => {
    const config = {
      ticketSubmission: {
        props: {}
      }
    }

    it('returns the setting', () => {
      const state = mockConfig(config)

      expect(selectors.getCustomFieldIds(state)).toEqual({})
    })
  })
})

describe('getTicketFormIds', () => {
  describe('when config contains the setting', () => {
    const config = {
      ticketSubmission: {
        props: {
          ticketForms: [10, 20, 30]
        }
      }
    }

    it('returns the setting', () => {
      const state = mockConfig(config)

      expect(selectors.getTicketFormIds(state)).toEqual([10, 20, 30])
    })
  })

  describe('when config does not contain the setting', () => {
    const config = {
      ticketSubmission: {
        props: {}
      }
    }

    it('returns undefined', () => {
      const state = mockConfig(config)

      expect(selectors.getTicketFormIds(state)).toBeUndefined()
    })
  })
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

test('getWebWidgetOpen', () => {
  const config = mockState({ webWidgetOpen: true })

  expect(selectors.getWebWidgetOpen(config)).toEqual(true)
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
    (hideApi, activateApi, webWidgetOpen, expected) => {
      const config = mockState({
        webWidgetOpen,
        hidden: { hideApi, activateApi }
      })

      expect(selectors.getWebWidgetOpen(config)).toEqual(expected)
    }
  )
})
