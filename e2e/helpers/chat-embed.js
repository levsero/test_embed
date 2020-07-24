import { queries, wait } from 'pptr-testing-library'
import loadWidget from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'
import { allowsInputTextEditing } from 'e2e/spec/shared-examples'
import zChat from 'e2e/helpers/zChat'
import widget from './widget'

const loadWidgetWithChatOnline = async (options = {}) => {
  let builder = loadWidget()
    .withPresets('chat')
    .hiddenInitially()

  if (options.mobile) {
    builder = builder.useMobile()
  }

  await builder.load()
  await zChat.online()
  await launcher.click()
  await waitForPrechatForm()
}

const openChattingScreen = async () => {
  await loadWidgetWithChatOnline()
  await clickStartChat()
  await waitForChatToBeReady()
}

const openChattingScreenAndEvaluate = async cb => {
  await loadWidget()
    .withPresets('chat')
    .hiddenInitially()
    .evaluateAfterSnippetLoads(cb)
    .load()

  await zChat.online()
}

const waitForPrechatForm = async () => {
  await widget.waitForText('Start chat')
}

const clickStartChat = async () => {
  await widget.clickButton('Start chat')
}

const waitForChatToBeReady = async () => {
  await widget.waitForPlaceholderText('Type a message here...')
}

const clickEndChat = async () => {
  const endChatButton = await queries.getByLabelText(await widget.getDocument(), 'End chat')
  await endChatButton.click()
}

const clickToConfirmEndChat = async () => {
  await widget.waitForText('Are you sure you want to end this chat?')
  await widget.clickButton('End')
}

const sendMessageFromUser = async message => {
  const composer = await queries.queryByPlaceholderText(
    await widget.getDocument(),
    'Type a message here...'
  )
  await allowsInputTextEditing(composer, message)
  await wait(() => composer.focus())
  await page.keyboard.press('Enter')

  expect(await queries.queryByText(await widget.getDocument(), message)).toBeTruthy()
}

const agentJoinsChat = async agentName => {
  await zChat.agentJoined({
    display_name: agentName,
    nick: 'agent:12345'
  })
}

const agentLeavesChat = async agentName => {
  await zChat.chatMemberLeft({
    display_name: agentName,
    nick: 'agent:12345'
  })
}

const visitorLeavesChat = async visitorName => {
  await zChat.chatMemberLeft({
    display_name: visitorName,
    nick: visitorName
  })
}

const sendMessageFromAgent = async (agentName, message) => {
  const detail = {
    nick: 'agent:12345',
    msg: message,
    display_name: agentName,
    proactive: false
  }
  await zChat.chat(detail)

  // Check the message is shown in the chat log
  expect(await queries.queryByText(await widget.getDocument(), agentName)).toBeTruthy()
  expect(await queries.queryByText(await widget.getDocument(), message)).toBeTruthy()
}

const clickChatOptions = async () => {
  const optionsButton = await queries.getByLabelText(await widget.getDocument(), 'Menu')

  await optionsButton.click()
}

export {
  waitForPrechatForm,
  clickStartChat,
  clickEndChat,
  sendMessageFromUser,
  agentJoinsChat,
  agentLeavesChat,
  visitorLeavesChat,
  sendMessageFromAgent,
  loadWidgetWithChatOnline,
  openChattingScreen,
  openChattingScreenAndEvaluate,
  clickToConfirmEndChat,
  waitForChatToBeReady,
  clickChatOptions
}
