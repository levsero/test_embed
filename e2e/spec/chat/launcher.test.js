import loadWidget from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'
import zChat from 'e2e/helpers/zChat'

test('shows the launcher when agents are online', async () => {
  await loadWidget()
    .hiddenInitially()
    .withPresets('chat')
    .load()
  // wait for a few seconds to make sure the launcher isn't visible
  await page.waitFor(2000)
  await expect(launcher).toBeHidden()
  await zChat.online()
  await expect(launcher).toBeVisible()
})
