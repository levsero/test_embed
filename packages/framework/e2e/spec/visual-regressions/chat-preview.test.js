/**
 * @group visual-regressions
 */
import events from 'e2e/fixtures/chat-preview-events'
import preview, { loadPreview } from 'e2e/helpers/chat-preview'
import { assertScreenshot } from 'e2e/helpers/visual-regressions'
import { OFFLINE_FORM_SCREENS } from 'src/constants/chat'
import * as constants from 'src/constants/chat/chat-screen-types'
import { CHAT_BADGE } from 'src/constants/preview'

beforeEach(async () => {
  await loadPreview()
  await page.evaluate((events) => {
    events.forEach((event) => {
      window.preview.updateChatState(event)
    })
  }, events)
})

test('chat preview chatting screen', async () => {
  await preview.updateScreen(constants.CHATTING_SCREEN)
  await assertScreenshot('chat-preview-chatting-screen')
})

test('chat preview chat badge', async () => {
  await preview.updateScreen(CHAT_BADGE)
  await assertScreenshot('chat-preview-chat-badge')
})

test('chat preview prechat screen', async () => {
  await preview.updateScreen(constants.PRECHAT_SCREEN)
  await assertScreenshot('chat-preview-prechat-screen')
})

test('chat preview offline form', async () => {
  await preview.updateScreen(OFFLINE_FORM_SCREENS.MAIN)
  await assertScreenshot('chat-preview-offline-form')
})
