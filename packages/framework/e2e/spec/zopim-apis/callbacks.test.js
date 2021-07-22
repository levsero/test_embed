import loadWidget from 'e2e/helpers/widget-page'
import { wait } from 'pptr-testing-library'

test('callbacks in $zopim are called', async () => {
  await loadWidget()
    .withPresets('chat', 'helpCenter')
    .evaluateAfterSnippetLoads(() => {
      zE(() => {
        $zopim(() => {
          window.insideZopim = 'one'
          $zopim(() => {
            window.insideAnotherZopim = 'two'
          })
        })
      })
    })
    .load()

  await wait(async () => {
    expect(await page.evaluate(() => window.insideZopim)).toEqual('one')
    expect(await page.evaluate(() => window.insideAnotherZopim)).toEqual('two')
  })
})
