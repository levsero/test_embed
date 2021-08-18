/**
 * @group visual-regressions
 */
import {
  mockTicketSubmissionEndpoint,
  waitForContactForm,
  waitForSubmissionSuccess,
} from 'e2e/helpers/support-embed'
import { fillForm } from 'e2e/helpers/utils'
import { assertScreenshot } from 'e2e/helpers/visual-regressions'
import widget from 'e2e/helpers/widget'
import loadWidget from 'e2e/helpers/widget-page'

const buildWidget = () =>
  loadWidget()
    .withPresets('contactForm')
    .intercept(mockTicketSubmissionEndpoint({ request: { id: 123 } }))

const completeForm = async () => {
  await fillForm({
    'Your name (optional)': 'test name',
    'Email address': 'test@email.com',
    'How can we help you?': 'test description',
  })
}

const inputError = async (tag) => {
  await widget.clickText('Send')
  await widget.waitForText('Enter a valid email address.')
  await assertScreenshot('contact-form-input-error', { tag })
}

const submissionSuccess = async (tag) => {
  await completeForm()
  await assertScreenshot('contact-form-filled', { tag })
  await widget.clickText('Send')
  await waitForSubmissionSuccess()
  await assertScreenshot('contact-form-success', { tag })
}

const show = async (tag) => {
  await assertScreenshot('default-contact-form', { tag })
}

describe('desktop', () => {
  beforeEach(async () => {
    await buildWidget().load()
    await widget.openByKeyboard()
    await waitForContactForm()
  })

  test('default contact form', async () => {
    await show()
  })

  test('input error', async () => {
    await inputError()
  })

  test('submission success', async () => {
    await submissionSuccess()
  })
})

describe('mobile', () => {
  beforeEach(async () => {
    await buildWidget().useMobile().load()
    await widget.openByKeyboard()
    await waitForContactForm()
  })

  test('default contact form', async () => {
    await show('mobile')
  })

  test('input error', async () => {
    await inputError('mobile')
  })

  test('submission success', async () => {
    await submissionSuccess('mobile')
  })
})
