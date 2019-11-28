import { queries } from 'pptr-testing-library'
import widgetPage from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'
import { mockSearchEndpoint } from 'e2e/helpers/help-center-embed'

test('can suppress help center by api', async () => {
  await widgetPage.loadWithConfig('helpCenter', 'contactForm', mockSearchEndpoint())
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
