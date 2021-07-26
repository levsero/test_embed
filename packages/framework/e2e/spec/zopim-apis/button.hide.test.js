import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'
import loadWidget from 'e2e/helpers/widget-page'
import zChat from 'e2e/helpers/zChat'

beforeEach(async () => {
  await loadWidget('helpCenter', 'chat')
  await zChat.online()
})

test('api hides the the widget', async () => {
  await page.evaluate(() => $zopim.livechat.button.show())
  await launcher.waitForLauncherPill({ visible: true })
  await page.evaluate(() => $zopim.livechat.button.hide())
  await launcher.waitForLauncherPill({ visible: false })
  await expect(widget).toBeHidden()
})

test('api hides an opened widget', async () => {
  await launcher.click()
  await launcher.waitForLauncherPill({ visible: true })
  await page.evaluate(() => $zopim.livechat.button.hide())
  await launcher.waitForLauncherPill({ visible: false })
  await expect(widget).toBeHidden()
})

test('calling api multiple times is a no-op', async () => {
  await page.evaluate(() => $zopim.livechat.button.hide())
  await page.evaluate(() => $zopim.livechat.button.hide())
  await page.evaluate(() => $zopim.livechat.button.hide())
  await launcher.waitForLauncherPill({ visible: false })
  await expect(widget).toBeHidden()
})
