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
const buildWidget = () =>
  loadWidget()
    .withPresets('chat')
    .hiddenInitially()
const expectWidgetToBeOpen = () => widget.expectToSeeText('Chat with us')
const expectWidgetNotToBeOpen = () => widget.expectNotToSeeText('Chat with us')

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
  await buildWidget()
    .useMobile()
    .load()
  await zChat.online()
  await launcher.waitForLauncherPill()

  await expectWidgetNotToBeOpen()

  await agentJoinsChat('An agent')
  await sendMessageFromAgent(true)

  await expectWidgetNotToBeOpen()
  await widget.expectToSeeText('message from agent')

  await widget.clickButton('Reply')

  await expectWidgetToBeOpen()
})

test('proactive chat notifications can be closed on mobile', async () => {
  await buildWidget()
    .useMobile()
    .load()
  await zChat.online()
  await launcher.waitForLauncherPill()

  await expectWidgetNotToBeOpen()

  await agentJoinsChat('An agent')
  await sendMessageFromAgent(true)

  await expectWidgetNotToBeOpen()
  await widget.expectToSeeText('message from agent')

  await widget.clickButton('Dismiss')

  await expectWidgetNotToBeOpen()
  await widget.expectNotToSeeText('message from agent')
})
