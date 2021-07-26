import { DEFAULT_CORS_HEADERS, mockCorsRequest } from 'e2e/helpers/utils'
import widget from 'e2e/helpers/widget'
import loadWidget from 'e2e/helpers/widget-page'
import { allowsInputTextEditing } from 'e2e/spec/shared-examples'
import { queries, wait } from 'pptr-testing-library'

test('displays an error message when the endpoint returns an error', async () => {
  await loadWidget()
    .withPresets('contactForm')
    .intercept(
      mockCorsRequest('api/v2/requests', (request) => {
        request.respond({
          status: 401,
          headers: DEFAULT_CORS_HEADERS,
          contentType: 'application/json',
          body: JSON.stringify({ error: true }),
        })
      })
    )
    .load()
  await widget.openByKeyboard()
  const doc = await widget.getDocument()
  const emailElement = await queries.queryByLabelText(doc, 'Email address')
  await allowsInputTextEditing(emailElement, 'fake@example.com')
  const descriptionElement = await queries.queryByLabelText(doc, 'How can we help you?')
  await allowsInputTextEditing(descriptionElement, 'Some message')
  const submitButton = await queries.getByText(doc, 'Send')
  await submitButton.click()
  await wait(async () => {
    expect(
      await queries.queryByText(
        doc,
        'There was an error processing your request. Please try again later.'
      )
    ).toBeTruthy()
  })
})
