import loadWidget from 'e2e/helpers/widget-page'
import widget from 'e2e/helpers/widget'
import {
  search,
  waitForAnswerBot,
  mockInteractionEndpoint,
  waitForGetInTouchButton
} from 'e2e/helpers/answer-bot-embed'
import { queries, wait } from 'pptr-testing-library'

test('does not display get in touch button when there are no channels available', async () => {
  await loadWidget('answerBot')
  await widget.openByKeyboard()
  await waitForAnswerBot()
  await page.waitFor(3000)
  const doc = await widget.getDocument()
  expect(await queries.queryByText(doc, 'Get in touch')).toBeNull()
})

describe('channels available', () => {
  test('displays button after greeting', async () => {
    await loadWidget('answerBot', 'contactForm')
    await widget.openByKeyboard()
    await waitForAnswerBot()
    await waitForGetInTouchButton()
    const doc = await widget.getDocument()
    expect(await queries.queryByText(doc, 'Get in touch')).toBeTruthy()
  })

  test('displays button after asking a question', async () => {
    await loadWidget()
      .withPresets('answerBot', 'contactForm')
      .intercept(mockInteractionEndpoint())
      .load()
    await widget.openByKeyboard()
    await waitForAnswerBot()

    const doc = await widget.getDocument()

    // button not yet available
    expect(await queries.queryByText(doc, 'Get in touch')).toBeNull()
    await search('Help')
    await wait(() => queries.getByText(doc, 'Here are some articles that may help:'))
    await waitForGetInTouchButton()
    await wait(async () => {
      expect(await queries.queryByText(doc, 'Or you can get in touch.')).toBeTruthy()
    })
    expect(await queries.queryByText(doc, 'Get in touch')).toBeTruthy()
  })
})
