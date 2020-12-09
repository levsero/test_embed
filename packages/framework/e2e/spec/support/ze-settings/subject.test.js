import loadWidget from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'
import {
  createTicketSubmissionEndpointResponse,
  mockTicketSubmissionEndpoint,
  waitForContactForm,
  waitForSubmissionSuccess
} from 'e2e/helpers/support-embed'
import { fillForm } from 'e2e/helpers/utils'

test('includes the subject field in ticket form when enabled', async () => {
  const mockSubmissionEndpoint = jest.fn()
  await loadWidget()
    .withPresets('contactForm')
    .evaluateOnNewDocument(() => {
      window.zESettings = {
        webWidget: {
          contactForm: {
            subject: true
          }
        }
      }
    })
    .intercept(mockTicketSubmissionEndpoint({ request: { id: 123 } }, mockSubmissionEndpoint))
    .load()

  await launcher.click()
  await waitForContactForm()
  const frame = await widget.getFrame()

  await fillForm({
    'Your name (optional)': 'test name',
    'Email address': 'test@email.com',
    'Subject (optional)': 'test subject',
    'How can we help you?': 'test description'
  })
  await expect(frame).toClick('button', { text: 'Send' })
  await waitForSubmissionSuccess()
  expect(mockSubmissionEndpoint).toHaveBeenCalledWith(
    createTicketSubmissionEndpointResponse(null, {
      email: 'test@email.com',
      name: 'test name',
      subject: 'test subject',
      description: 'test description'
    })
  )
})
