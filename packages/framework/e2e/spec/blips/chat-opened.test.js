import { mockBlipEndpoint, getBlipPayload, blipMetadata } from 'e2e/helpers/blips'
import { waitForHelpCenter } from 'e2e/helpers/help-center-embed'
import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'
import loadWidget from 'e2e/helpers/widget-page'
import zChat from 'e2e/helpers/zChat'
import { queries } from 'pptr-testing-library'

export const assertChatOpenedPayload = (url) => {
  const payload = getBlipPayload(url)

  expect(payload).toMatchObject({
    channel: 'web_widget',
    userAction: { category: 'chat', action: 'opened', label: 'newChat', value: null },
    ...blipMetadata,
  })
}

test('sends chat opened blips in the correct format', async () => {
  const blipEndpoint = jest.fn()

  await loadWidget()
    .withPresets('chat', 'helpCenterWithContextualHelp')
    .intercept(mockBlipEndpoint(blipEndpoint))
    .load()

  await zChat.online()
  await launcher.click()
  await waitForHelpCenter()

  const widgetDoc = await widget.getDocument()

  blipEndpoint.mockClear()

  const channelButton = await queries.getByText(widgetDoc, 'Live chat')
  await channelButton.click()

  await widget.waitForText('Chat with us')
  await queries.getByText(widgetDoc, 'Chat with us')

  const chatOpenedRequestUrl = blipEndpoint.mock.calls[0][0]

  assertChatOpenedPayload(chatOpenedRequestUrl)
})
