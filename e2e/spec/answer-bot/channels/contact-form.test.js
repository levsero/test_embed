import loadWidget from 'e2e/helpers/widget-page'
import widget from 'e2e/helpers/widget'
import { waitForAnswerBot } from 'e2e/helpers/answer-bot-embed'
import { queries, wait } from 'pptr-testing-library'

beforeEach(async () => {
  await loadWidget('answerBot', 'contactForm')
  await widget.openByKeyboard()
  await waitForAnswerBot()
  await page.waitFor(3000)
})

test('clicking contact us channel goes to contact form embed', async () => {
  const doc = await widget.getDocument()
  const button = await queries.getByText(doc, 'Get in touch')
  await button.click()
  await wait(() => queries.getByText(doc, 'How do you want to get in touch?'))
  const contactButton = await queries.queryByText(doc, 'Leave a message')
  expect(contactButton).toBeTruthy()
  await contactButton.click()
  expect(await queries.queryByLabelText(doc, 'Email address')).toBeTruthy()
})

test('can go back to answer bot', async () => {
  const doc = await widget.getDocument()
  const button = await queries.getByText(doc, 'Get in touch')
  await button.click()
  await wait(() => queries.getByText(doc, 'How do you want to get in touch?'))
  const contactButton = await queries.getByText(doc, 'Leave a message')
  await contactButton.click()
  await queries.getByLabelText(doc, 'Email address')
  await widget.clickBack()
  expect(await queries.queryByText(doc, 'How do you want to get in touch?')).toBeTruthy()
})
