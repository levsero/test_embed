import { queries, wait } from 'pptr-testing-library'
import widgetPage from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'

beforeEach(async () => {
  await widgetPage.loadWithConfig('helpCenter', 'zopimChat')
})

test('api changes the language of the widget', async () => {
  await page.evaluate(() => {
    $zopim.livechat.setLanguage('fr')
  })

  await wait(async () => {
    expect(await queries.getNodeText(await launcher.getLabel())).toEqual('Aide')
  })
})
