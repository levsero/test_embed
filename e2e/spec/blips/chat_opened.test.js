import { queries } from 'pptr-testing-library'
import loadWidget from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'
import zChat from 'e2e/helpers/zChat'
import { mockBlipEndpoint, assertChatOpenedPayload } from 'e2e/helpers/blips'

test('should send chat opened blips in the correct format', async () => {
  const blipEndpoint = jest.fn()

  await loadWidget()
    .hiddenInitially()
    .withPresets('chat', 'helpCenterWithContextualHelp')
    .intercept(mockBlipEndpoint(blipEndpoint))
    .load()

  await zChat.online()
  await launcher.click()
  const widgetDoc = await widget.getDocument()
  const channelButton = await queries.getByText(widgetDoc, 'Live chat')
  await channelButton.click()
  await queries.getByText(widgetDoc, 'Chat with us')

  const chatOpenedRequestUrl = blipEndpoint.mock.calls[2][0]

  assertChatOpenedPayload(chatOpenedRequestUrl)
})
