import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'
import loadWidget from 'e2e/helpers/widget-page'

const buildWidget = () => loadWidget().withPresets('helpCenter')

test('api hides the widget', async () => {
  await buildWidget().load()
  await page.evaluate(() => zE.hide())
  await expect(launcher).toBeHidden()
  await expect(widget).toBeHidden()
})

test('api hides an opened widget', async () => {
  await buildWidget().load()
  await launcher.click()
  await page.evaluate(() => zE.hide())
  await expect(launcher).toBeHidden()
  await expect(widget).toBeHidden()
})

test('calling api multiple times is a no-op', async () => {
  await buildWidget().load()
  await page.evaluate(() => zE.hide())
  await page.evaluate(() => zE.hide())
  await page.evaluate(() => zE.hide())
  await expect(launcher).toBeHidden()
  await expect(widget).toBeHidden()
})

test('works on prerender as well', async () => {
  await buildWidget()
    .evaluateAfterSnippetLoads(() => {
      zE(() => {
        zE.hide()
      })
    })
    .dontWaitForLauncherToLoad()
    .load()
  await expect(launcher).toBeHidden()
  await expect(widget).toBeHidden()
})
