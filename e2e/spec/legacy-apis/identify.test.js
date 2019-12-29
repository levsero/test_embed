import loadWidget from 'e2e/helpers/widget-page/fluent'
import launcher from 'e2e/helpers/launcher'
import { mockIdentifyEndpoint, assertIdentifyPayload } from 'e2e/helpers/blips'
import { assertInputValue } from 'e2e/helpers/utils'
import { waitForContactForm } from 'e2e/helpers/support-embed'

const user = {
  name: 'Akira Kogane',
  email: 'akira@voltron.com',
  organization: 'Voltron, Inc.'
}

const buildWidget = preset => {
  const identify = jest.fn()
  const builder = loadWidget()
    .withPresets(preset)
    .intercept(mockIdentifyEndpoint(identify))
  return [identify, builder]
}

test('calls identify endpoint', async () => {
  const [identify, builder] = buildWidget('helpCenter')
  await builder.load()
  await page.evaluate(user => {
    zE.identify(user)
  }, user)
  assertIdentifyPayload(identify, { ...user, localeId: 1176 })
})

test('calls identify endpoint even on prerender', async () => {
  const [identify, builder] = buildWidget('helpCenter')
  await builder
    .evaluateOnNewDocument(user => {
      zE(() => {
        zE.identify(user)
      })
    }, user)
    .load()
  assertIdentifyPayload(identify, { ...user, localeId: 1176 })
})

test('prefills contact form', async () => {
  const builder = buildWidget('contactForm')[1]
  await builder
    .evaluateOnNewDocument(user => {
      zE(() => {
        zE.identify(user)
      })
    }, user)
    .load()
  await launcher.click()
  await waitForContactForm()
  await assertInputValue('Your name (optional)', 'Akira Kogane')
  await assertInputValue('Email address', 'akira@voltron.com')
})
