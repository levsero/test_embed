import { queries, wait } from 'pptr-testing-library'
import loadWidget from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'
import zChat from 'e2e/helpers/zChat'

beforeEach(async () => {
  await loadWidget('helpCenter', 'chat')
  await zChat.online()
})

test('api changes the language of the widget', async () => {
  await page.evaluate(() => {
    $zopim.livechat.setLanguage('fr')
  })

  await wait(async () => {
    expect(await queries.getNodeText(await launcher.getLabel())).toEqual('Aide')
  })
})
