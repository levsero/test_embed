import loadWidget from 'e2e/helpers/widget-page'
import { mockBlipEndpoint, getBlipPayload, blipMetadata } from 'e2e/helpers/blips'

export const assertPageViewPayload = (url) => {
  const payload = getBlipPayload(url)
  expect(payload).toMatchObject({
    pageView: {
      referrer: 'http://localhost:5123/e2e.html',
      time: expect.any(Number),
      loadTime: expect.any(Number),
      navigatorLanguage: expect.any(String),
      pageTitle: 'End-to-end tests',
      userAgent: expect.any(String),
      isMobile: false,
      isResponsive: true,
      viewportMeta: 'width=device-width,initial-scale=1',
      helpCenterDedup: false,
    },
    ...blipMetadata,
  })
}

test('sends page view blips in the correct format', async () => {
  const blipEndpoint = jest.fn()

  await loadWidget().withPresets('helpCenter').intercept(mockBlipEndpoint(blipEndpoint)).load()

  const blipUrl = blipEndpoint.mock.calls.find((call) => call[0].indexOf('type=pageView') !== -1)[0]

  assertPageViewPayload(blipUrl)
})
