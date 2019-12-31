import { queries } from 'pptr-testing-library'
import widget from 'e2e/helpers/widget'
import loadWidget from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'
import { mockSearchEndpoint, waitForHelpCenter } from 'e2e/helpers/help-center-embed'

test('use the label from config', async () => {
  await loadWidget()
    .withPresets('contactForm', 'helpCenterWithContextualHelp', {
      embeds: {
        helpCenterForm: {
          props: {
            buttonLabelKey: 'contact'
          }
        }
      }
    })
    .intercept(mockSearchEndpoint())
    .load()
  await launcher.click()
  await waitForHelpCenter()
  const doc = await widget.getDocument()
  const button = await queries.queryByText(doc, 'Contact us')
  expect(button).toBeTruthy()
})
