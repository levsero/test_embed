import { queries } from 'pptr-testing-library'
import loadWidget from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'
import { mockSearchEndpoint } from 'e2e/helpers/help-center-embed'

test('can suppress help center by api', async () => {
  await loadWidget()
    .withPresets('helpCenter', 'contactForm')
    .intercept(mockSearchEndpoint())
    .load()
  await page.evaluate(() => {
    zE('webWidget', 'updateSettings', {
      webWidget: {
        helpCenter: {
          suppress: true
        }
      }
    })
  })
  await launcher.click()

  const doc = await widget.getDocument()
  expect(await queries.queryByLabelText(doc, 'Your name (optional)')).toBeTruthy()
})
