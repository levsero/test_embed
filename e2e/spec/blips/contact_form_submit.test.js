import { queries, wait } from 'pptr-testing-library'
import loadWidget from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'
import { mockBlipEndpoint, assertContactFormSubmittedPayload } from 'e2e/helpers/blips'
import { mockSearchEndpoint, waitForHelpCenter } from 'e2e/helpers/help-center-embed'
import { mockTicketFieldsEndpoint } from 'e2e/helpers/support-embed'

test('sends submit ticket blips in the correct format', async () => {
  const blipEndpoint = jest.fn()

  await loadWidget()
    .hiddenInitially()
    .withPresets('helpCenter', 'contactForm')
    .intercept(mockSearchEndpoint())
    .intercept(mockTicketFieldsEndpoint())
    .intercept(mockBlipEndpoint(blipEndpoint))
    .load()

  await launcher.click()
  await waitForHelpCenter()

  const widgetDoc = await widget.getDocument()
  await wait(() => queries.getByPlaceholderText(widgetDoc, 'How can we help?'))

  await page.keyboard.type('Help')
  await page.keyboard.press('Enter')
  await wait(() => queries.getByText(widgetDoc, 'Top results'))

  const contactButton = await queries.getByText(widgetDoc, 'Leave us a message')

  await contactButton.click()

  const emailField = await queries.getByLabelText(widgetDoc, 'Email address')
  const descriptionField = await queries.getByLabelText(widgetDoc, 'How can we help you?')

  await emailField.focus()
  await page.keyboard.type('hello@hello.com')

  await descriptionField.focus()
  await page.keyboard.type('need help pls')

  blipEndpoint.mockClear()

  const submitButton = await queries.getByText(widgetDoc, 'Send')
  await submitButton.click()

  await wait(() => queries.getByText(widgetDoc, 'Thanks for reaching out'))

  const blipUrl = blipEndpoint.mock.calls[0][0]

  assertContactFormSubmittedPayload(blipUrl)
})
