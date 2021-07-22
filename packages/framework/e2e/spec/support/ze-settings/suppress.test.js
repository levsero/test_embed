import { waitForHelpCenter, mockSearchEndpoint } from 'e2e/helpers/help-center-embed'
import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'
import loadWidget from 'e2e/helpers/widget-page'
import { queries } from 'pptr-testing-library'

test('suppresses the contact form', async () => {
  await loadWidget()
    .withPresets('helpCenterWithContextualHelp', 'contactForm')
    .intercept(mockSearchEndpoint())
    .evaluateOnNewDocument(() => {
      window.zESettings = {
        webWidget: {
          contactForm: {
            suppress: true,
          },
        },
      }
    })
    .load()
  await launcher.click()
  await waitForHelpCenter()
  const doc = await widget.getDocument()
  const button = await queries.queryByText(doc, 'Leave us a message')
  expect(button).toBeFalsy()
})
