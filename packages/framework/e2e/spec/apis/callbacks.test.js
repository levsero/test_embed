import loadWidget from 'e2e/helpers/widget-page'
import { wait } from 'pptr-testing-library'

test('callbacks in zE are called', async () => {
  await loadWidget()
    .withPresets('helpCenter')
    .evaluateAfterSnippetLoads(() => {
      zE(() => {
        window.hello = 'world'
      })
    })
    .load()

  await wait(async () => {
    expect(await page.evaluate(() => window.hello)).toEqual('world')
  })
})
