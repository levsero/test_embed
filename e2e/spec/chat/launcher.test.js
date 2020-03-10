import { wait } from 'pptr-testing-library'

import loadWidget from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'
import zChat from 'e2e/helpers/zChat'

test('shows the launcher when agents are online', async () => {
  await loadWidget()
    .hiddenInitially()
    .withPresets('chat')
    .load()
  await wait(() => expect(launcher).toBeHidden())
  await zChat.online()
  await expect(launcher).toBeVisible()
})
