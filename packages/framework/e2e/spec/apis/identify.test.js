import loadWidget from 'e2e/helpers/widget-page'
import { mockIdentifyEndpoint, assertIdentifyPayload } from 'e2e/helpers/blips'

const user = {
  name: 'Akira Kogane',
  email: 'akira@voltron.com',
  phone: '0430999212',
  organization: 'Voltron, Inc.'
}

const buildWidget = () => {
  const identify = jest.fn()
  const builder = loadWidget()
    .withPresets('helpCenter')
    .intercept(mockIdentifyEndpoint(identify))
  return [builder, identify]
}

test('calls identify endpoint', async () => {
  const [builder, identify] = buildWidget()
  await builder.load()
  await page.evaluate(user => {
    zE('webWidget', 'identify', user)
  }, user)
  assertIdentifyPayload(identify, { ...user, localeId: 1176 })
})

test('calls identify endpoint even on prerender', async () => {
  const [builder, identify] = buildWidget()
  await builder
    .evaluateAfterSnippetLoads(user => {
      zE('webWidget', 'identify', user)
    }, user)
    .load()
  assertIdentifyPayload(identify, { ...user, localeId: 1176 })
})
