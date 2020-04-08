import { queries } from 'pptr-testing-library'

import loadWidget from 'e2e/helpers/widget-page'
import widget from 'e2e/helpers/widget'
import launcher from 'e2e/helpers/launcher'
import zChat from 'e2e/helpers/zChat'
import { agentJoinsChat, waitForChatToBeReady } from 'e2e/helpers/chat-embed'

const sendMessageFromAgent = async proactive => {
  const detail = {
    nick: 'agent:12345',
    msg: 'message from agent',
    display_name: 'An agent',
    proactive
  }
  await zChat.chat(detail)
}

test('first proactive chat message opens the widget', async () => {
  await loadWidget()
    .withPresets('chat')
    .hiddenInitially()
    .load()
  await zChat.online()
  await launcher.waitForLauncherPill()

  expect(await queries.queryByText(await widget.getDocument(), 'Chat with us')).toBeFalsy()

  await agentJoinsChat('An agent')
  await sendMessageFromAgent(true)
  await waitForChatToBeReady()

  expect(await queries.queryByText(await widget.getDocument(), 'Chat with us')).toBeTruthy()
  expect(await queries.queryByText(await widget.getDocument(), 'message from agent')).toBeTruthy()

  await widget.clickClose()
  await launcher.waitForLauncherPill()

  expect(await queries.queryByText(await widget.getDocument(), 'Chat with us')).toBeFalsy()

  await sendMessageFromAgent(false)

  expect(await queries.queryByText(await widget.getDocument(), 'Chat with us')).toBeFalsy()
  expect(await queries.queryByText(await launcher.getDocument(), '1 new')).toBeTruthy()
})

test('proactive chats show a notification on mobile', async () => {
  await loadWidget()
    .withPresets('chat')
    .hiddenInitially()
    .useMobile()
    .load()
  await zChat.online()
  await launcher.waitForLauncherPill()

  expect(await queries.queryByText(await widget.getDocument(), 'Chat with us')).toBeFalsy()

  await agentJoinsChat('An agent')
  await sendMessageFromAgent(true)

  expect(await queries.queryByText(await widget.getDocument(), 'Chat with us')).toBeFalsy()
  expect(await queries.queryByText(await widget.getDocument(), 'message from agent')).toBeTruthy()

  const nextButton = await queries.queryByText(await widget.getDocument(), 'Reply')
  await nextButton.click()

  expect(await queries.queryByText(await widget.getDocument(), 'Chat with us')).toBeTruthy()
})

test('proactive chat notifications can be closed on mobile', async () => {
  await loadWidget()
    .withPresets('chat')
    .hiddenInitially()
    .useMobile()
    .load()
  await zChat.online()
  await launcher.waitForLauncherPill()

  expect(await queries.queryByText(await widget.getDocument(), 'Chat with us')).toBeFalsy()

  await agentJoinsChat('An agent')
  await sendMessageFromAgent(true)

  expect(await queries.queryByText(await widget.getDocument(), 'Chat with us')).toBeFalsy()
  expect(await queries.queryByText(await widget.getDocument(), 'message from agent')).toBeTruthy()

  const closeButton = await queries.queryByText(await widget.getDocument(), 'Dismiss')
  await closeButton.click()

  expect(await queries.queryByText(await widget.getDocument(), 'Chat with us')).toBeFalsy()
  expect(await queries.queryByText(await widget.getDocument(), 'message from agent')).toBeFalsy()
})
