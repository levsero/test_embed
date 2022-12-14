import { mockSearchEndpoint } from 'e2e/helpers/help-center-embed'
import launcher from 'e2e/helpers/launcher'
import { waitForContactForm } from 'e2e/helpers/support-embed'
import widget from 'e2e/helpers/widget'
import loadWidget from 'e2e/helpers/widget-page'
import { queries } from 'pptr-testing-library'

test('can suppress help center by api', async () => {
  await loadWidget().withPresets('helpCenter', 'contactForm').intercept(mockSearchEndpoint()).load()
  await page.evaluate(() => {
    zE('webWidget', 'updateSettings', {
      webWidget: {
        helpCenter: {
          suppress: true,
        },
      },
    })
  })
  await launcher.click()

  const doc = await widget.getDocument()
  await waitForContactForm()
  expect(await queries.queryByLabelText(doc, 'Your name (optional)')).toBeTruthy()
})
