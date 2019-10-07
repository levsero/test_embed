import { queries } from 'pptr-testing-library'
import widgetPage from 'helpers/widget-page'
import launcher from 'helpers/launcher'

beforeEach(async () => {
  await widgetPage.loadWithConfig('helpCenter', 'zopimChat')
})

test('api changes the language of the widget', async () => {
  await page.evaluate(() => {
    $zopim.livechat.setLanguage('fr')
  })

  expect(await queries.getNodeText(await launcher.getLabel())).toEqual('Aide')
})
