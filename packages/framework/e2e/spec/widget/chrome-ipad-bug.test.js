import { waitForAnswerBot } from 'e2e/helpers/answer-bot-embed'
import widget from 'e2e/helpers/widget'
import loadWidget from 'e2e/helpers/widget-page'
import { queries } from 'pptr-testing-library'
import {
  clickStartChat,
  loadWidgetWithChatOnline,
  waitForChatToBeReady,
} from '../../helpers/chat-embed'

describe('Chrome iPad bug', () => {
  describe('AnswerBot', () => {
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

  describe('Chat', () => {
    it('adds 40px margin under the composer when focused on Chrome on iPads to prevent composer going off screen', async () => {
      await loadWidgetWithChatOnline({ mobile: true })
      await clickStartChat()
      await waitForChatToBeReady()

      await page.evaluate(() => {
        Object.defineProperty(navigator, 'userAgent', { value: 'iPad CriOS' })
      })

      const doc = await widget.getDocument()

      const input = await queries.getByPlaceholderText(doc, 'Type a message here...')

      const boxModelBeforeFocus = await input.boxModel()

      await input.focus()

      const boxModelAfterFocus = await input.boxModel()

      const positionYBeforeFocus = boxModelBeforeFocus.content[0].y
      const positionYAfterFocus = boxModelAfterFocus.content[0].y

      expect(positionYBeforeFocus - positionYAfterFocus).toBe(40)
    })

    it('does not add 40px for other browsers when focused', async () => {
      await loadWidgetWithChatOnline({ mobile: true })
      await clickStartChat()
      await waitForChatToBeReady()

      await page.evaluate(() => {
        Object.defineProperty(navigator, 'userAgent', { value: 'some other value' })
      })

      const doc = await widget.getDocument()

      const input = await queries.getByPlaceholderText(doc, 'Type a message here...')

      const boxModelBeforeFocus = await input.boxModel()

      await input.focus()

      const boxModelAfterFocus = await input.boxModel()

      const positionYBeforeFocus = boxModelBeforeFocus.content[0].y
      const positionYAfterFocus = boxModelAfterFocus.content[0].y

      expect(positionYBeforeFocus).toBe(positionYAfterFocus)
    })
  })
})
