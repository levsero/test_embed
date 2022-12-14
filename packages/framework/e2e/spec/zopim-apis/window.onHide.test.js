import { waitForHelpCenter } from 'e2e/helpers/help-center-embed'
import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'
import loadWidget from 'e2e/helpers/widget-page'
import zChat from 'e2e/helpers/zChat'

beforeEach(async () => {
  await loadWidget('helpCenter', 'chat')
  await zChat.online()
})

test('callback is called when widget is closed', async () => {
  await page.evaluate(() => {
    $zopim.livechat.window.onHide(() => (window.onCloseCalled = true))
  })

  await launcher.click()
  await waitForHelpCenter()
  await widget.clickClose()
  const result = await page.evaluate(() => window.onCloseCalled)
  expect(result).toEqual(true)
})
