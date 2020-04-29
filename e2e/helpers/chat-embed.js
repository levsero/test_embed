import { queries, wait } from 'pptr-testing-library'
import loadWidget from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'
import { allowsInputTextEditing } from 'e2e/spec/shared-examples'
import zChat from 'e2e/helpers/zChat'
import widget from './widget'
import { TEST_IDS } from 'src/constants/shared'

const loadWidgetWithChatOnline = async () => {
  await loadWidget()
    .withPresets('chat')
    .hiddenInitially()
    .load()
  await zChat.online()
  await launcher.click()
  await waitForPrechatForm()
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
  const optionsButton = await queries.getByTestId(
    await widget.getDocument(),
    TEST_IDS.ICON_ELLIPSIS
  )

  await optionsButton.click()
}

export {
  waitForPrechatForm,
  clickStartChat,
  clickEndChat,
  sendMessageFromUser,
  agentJoinsChat,
  sendMessageFromAgent,
  loadWidgetWithChatOnline,
  clickToConfirmEndChat,
  waitForChatToBeReady,
  clickChatOptions
}