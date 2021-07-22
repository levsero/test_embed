import launcher from 'e2e/helpers/launcher'
import loadWidget from 'e2e/helpers/widget-page'
import zChat from 'e2e/helpers/zChat'
import { queries, wait } from 'pptr-testing-library'

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
