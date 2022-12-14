import { agentJoinsChat, waitForChatToBeReady } from 'e2e/helpers/chat-embed'
import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'
import loadWidget from 'e2e/helpers/widget-page'
import zChat from 'e2e/helpers/zChat'

const sendMessageFromAgent = async (proactive) => {
  const detail = {
    nick: 'agent:12345',
    msg: 'message from agent',
    display_name: 'An agent',
    proactive,
  }
  await zChat.chat(detail)
}
const buildWidget = () => loadWidget().withPresets('chat').dontWaitForLauncherToLoad()
const expectWidgetToBeOpen = async () => await widget.expectToSeeText('Chat with us')
const expectWidgetNotToBeOpen = async () => await widget.waitForWidget({ isVisible: false })

test('first proactive chat message opens the widget', async () => {
  await buildWidget().load()
  await zChat.online()
  await launcher.waitForLauncherPill()

  await expectWidgetNotToBeOpen()

  await agentJoinsChat('An agent')
  await sendMessageFromAgent(true)
  await waitForChatToBeReady()

  await expectWidgetToBeOpen()
  await widget.expectToSeeText('message from agent')

  await widget.clickClose()
  await launcher.waitForLauncherPill()

  await expectWidgetNotToBeOpen()

  await sendMessageFromAgent(false)

  await expectWidgetNotToBeOpen()
  await launcher.expectLabelToEqual('1 new')
})

test('proactive chats show a notification on mobile', async () => {
  await buildWidget().useMobile().load()
  await zChat.online()

  await launcher.waitForLauncherPill()

  await expectWidgetNotToBeOpen()

  await agentJoinsChat('An agent')

  await sendMessageFromAgent(true)

  await expectWidgetNotToBeOpen()

  await widget.waitForText('message from agent')

  await widget.clickText('Reply', { exact: false })

  await expectWidgetToBeOpen()
})

test('proactive chat notifications can be closed on mobile', async () => {
  await buildWidget().useMobile().load()
  await zChat.online()
  await launcher.waitForLauncherPill()

  await expectWidgetNotToBeOpen()

  await agentJoinsChat('An agent')
  await sendMessageFromAgent(true)

  await expectWidgetNotToBeOpen()
  await widget.waitForText('message from agent')

  await widget.clickText('Dismiss', { exact: false })

  await expectWidgetNotToBeOpen()
})
