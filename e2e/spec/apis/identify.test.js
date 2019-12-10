import widgetPage from 'e2e/helpers/widget-page'
import { mockIdentifyEndpoint, assertIdentifyPayload } from 'e2e/helpers/blips'
import { mockEmbeddableConfigEndpoint } from 'e2e/helpers/widget-page/embeddable-config'

const user = {
  name: 'Akira Kogane',
  email: 'akira@voltron.com',
  organization: 'Voltron, Inc.'
}

test('calls identify endpoint', async () => {
  const identify = jest.fn()
  await widgetPage.loadWithConfig('helpCenter', mockIdentifyEndpoint(identify))
  await page.evaluate(user => {
    zE('webWidget', 'identify', user)
  }, user)
  assertIdentifyPayload(identify, { ...user, localeId: 1176 })
})

test('calls identify endpoint even on prerender', async () => {
  const identify = jest.fn()
  await widgetPage.load({
    mockRequests: [mockEmbeddableConfigEndpoint('helpCenter'), mockIdentifyEndpoint(identify)],
    preload: user => {
      zE('webWidget', 'identify', user)
    },
    preloadArgs: [user]
  })
  assertIdentifyPayload(identify, { ...user, localeId: 1176 })
})
