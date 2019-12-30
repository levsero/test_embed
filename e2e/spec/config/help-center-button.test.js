import loadWidget from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'
import { waitForHelpCenter, mockSearchEndpoint } from 'e2e/helpers/help-center-embed'
import { queries, wait } from 'pptr-testing-library'

test('sets the help center button text and ticket form title based on config', async () => {
  await loadWidget()
    .withPresets('contactForm', 'helpCenterWithContextualHelp', {
      embeds: {
        helpCenterForm: {
          props: {
            buttonLabelKey: 'contact'
          }
        },
        ticketSubmissionForm: {
          props: {
            formTitleKey: 'contact'
          }
        }
      }
    })
    .intercept(mockSearchEndpoint())
    .load()
  await launcher.click()
  await waitForHelpCenter()
  const doc = await widget.getDocument()
  const button = await queries.getByText(doc, 'Contact us')
  await button.click()
  await wait(() => queries.getByLabelText(doc, 'Email address'))
  expect(await queries.queryByText(doc, 'Contact us')).toBeTruthy()
})
