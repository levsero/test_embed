import loadWidget from 'e2e/helpers/widget-page'
import widget from 'e2e/helpers/widget'
import { waitForAnswerBot } from 'e2e/helpers/answer-bot-embed'
import { queries } from 'pptr-testing-library'

test('does not display get in touch button when there are no channels available', async () => {
  await loadWidget('answerBot')
  await widget.openByKeyboard()
  await waitForAnswerBot()
  await page.waitFor(3000)
  await widget.expectNotToSeeText('Get in touch')
})

describe('Chrome iPad bug', () => {
  it('adds 40px margin under the composer when focused on Chrome on iPads to prevent composer going off screen', async () => {
    await loadWidget().withPresets('answerBot', 'contactForm').useMobile().load()

    await page.evaluate(() => {
      Object.defineProperty(navigator, 'userAgent', { value: 'iPad CriOS' })
    })

    await widget.openByKeyboard()
    await waitForAnswerBot()
    const doc = await widget.getDocument()

    await queries.getByPlaceholderText(doc, 'Type your question here...')

    const input = await queries.getByPlaceholderText(doc, 'Type your question here...')

    const boxModelBeforeFocus = await input.boxModel()

    await input.focus()

    const boxModelAfterFocus = await input.boxModel()

    const positionYBeforeFocus = boxModelBeforeFocus.content[0].y
    const positionYAfterFocus = boxModelAfterFocus.content[0].y

    expect(positionYBeforeFocus - positionYAfterFocus).toBe(40)
  })

  it('does not add 40px for other browsers when focused', async () => {
    await loadWidget().withPresets('answerBot', 'contactForm').useMobile().load()

    await page.evaluate(() => {
      Object.defineProperty(navigator, 'userAgent', { value: 'some other value' })
    })

    await widget.openByKeyboard()
    await waitForAnswerBot()
    const doc = await widget.getDocument()

    await queries.getByPlaceholderText(doc, 'Type your question here...')

    const input = await queries.getByPlaceholderText(doc, 'Type your question here...')

    const boxModelBeforeFocus = await input.boxModel()

    await input.focus()

    const boxModelAfterFocus = await input.boxModel()

    const positionYBeforeFocus = boxModelBeforeFocus.content[0].y
    const positionYAfterFocus = boxModelAfterFocus.content[0].y

    expect(positionYBeforeFocus).toBe(positionYAfterFocus)
  })
})
