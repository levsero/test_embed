import loadWidget from 'e2e/helpers/widget-page'
import { mockBlipEndpoint, assertPageViewPayload } from 'e2e/helpers/blips'

test('should send page view blips in the correct format', async () => {
  const blipEndpoint = jest.fn()

  await loadWidget()
    .hiddenInitially()
    .withPresets('helpCenter')
    .intercept(mockBlipEndpoint(blipEndpoint))
    .load()

  const blipUrl = blipEndpoint.mock.calls[1][0]

  assertPageViewPayload(blipUrl)
})
