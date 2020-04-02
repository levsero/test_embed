import { queries, wait } from 'pptr-testing-library'
import loadWidget from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'
import { mockBlipEndpoint, assertHCSearchPayload } from 'e2e/helpers/blips'
import { mockSearchEndpoint, waitForHelpCenter } from 'e2e/helpers/help-center-embed'

test('should send Help Center search blips in the correct format', async () => {
  const blipEndpoint = jest.fn()

  await loadWidget()
    .hiddenInitially()
    .withPresets('helpCenter')
    .intercept(mockSearchEndpoint())
    .intercept(mockBlipEndpoint(blipEndpoint))
    .load()

  await launcher.click()
  await waitForHelpCenter()

  const widgetDoc = await widget.getDocument()
  await wait(() => queries.getByPlaceholderText(widgetDoc, 'How can we help?'))

  expect(await widget.zendeskLogoVisible()).toEqual(true)

  blipEndpoint.mockClear()
  await page.keyboard.type('Help')
  await page.keyboard.press('Enter')
  await wait(() => queries.getByText(widgetDoc, 'Top results'))

  const blipUrl = blipEndpoint.mock.calls[0][0]

  assertHCSearchPayload(blipUrl)
})
