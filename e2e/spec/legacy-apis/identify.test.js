import widgetPage from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'
import { mockIdentifyEndpoint, assertIdentifyPayload } from 'e2e/helpers/blips'
import { mockEmbeddableConfigEndpoint } from 'e2e/helpers/widget-page/embeddable-config'
import { assertInputValue } from 'e2e/helpers/utils'
import { waitForContactForm } from 'e2e/helpers/support-embed'

const user = {
  name: 'Akira Kogane',
  email: 'akira@voltron.com',
  organization: 'Voltron, Inc.'
}

test('calls identify endpoint', async () => {
  const identify = jest.fn()
  await widgetPage.loadWithConfig('helpCenter', mockIdentifyEndpoint(identify))
  await page.evaluate(user => {
    zE.identify(user)
  }, user)
  assertIdentifyPayload(identify, { ...user, localeId: 1176 })
})

test('calls identify endpoint even on prerender', async () => {
  const identify = jest.fn()
  await widgetPage.load({
    mockRequests: [mockEmbeddableConfigEndpoint('helpCenter'), mockIdentifyEndpoint(identify)],
    preload: user => {
      zE(() => {
        zE.identify(user)
      })
    },
    preloadArgs: [user]
  })
  assertIdentifyPayload(identify, { ...user, localeId: 1176 })
})

test('prefills contact form', async () => {
  await widgetPage.load({
    mockRequests: [mockEmbeddableConfigEndpoint('contactForm')],
    preload: user => {
      zE(() => {
        zE.identify(user)
      })
    },
    preloadArgs: [user]
  })
  await launcher.click()
  await waitForContactForm()
  await assertInputValue('Your name (optional)', 'Akira Kogane')
  await assertInputValue('Email address', 'akira@voltron.com')
})
