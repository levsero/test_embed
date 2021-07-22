import launcher from 'e2e/helpers/launcher'
import {
  mockTicketSubmissionEndpoint,
  waitForContactForm,
  waitForSubmissionSuccess,
} from 'e2e/helpers/support-embed'
import { fillForm } from 'e2e/helpers/utils'
import widget from 'e2e/helpers/widget'
import loadWidget from 'e2e/helpers/widget-page'

test('hides the zendesk logo in the ticket form when requested in config', async () => {
  await loadWidget()
    .withPresets('contactForm', {
      hideZendeskLogo: true,
    })
    .intercept(mockTicketSubmissionEndpoint({ request: { id: 123 } }))
    .load()
  await launcher.click()
  await waitForContactForm()
  expect(await widget.zendeskLogoVisible()).toEqual(false)
  const frame = await widget.getFrame()

  await fillForm({
    'Your name (optional)': 'test name',
    'Email address': 'test@email.com',
    'How can we help you?': 'test description',
  })

  await expect(frame).toClick('button', { text: 'Send' })
  await waitForSubmissionSuccess()
  expect(await widget.zendeskLogoVisible()).toEqual(false)
})
