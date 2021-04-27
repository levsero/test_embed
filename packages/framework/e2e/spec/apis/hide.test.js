import loadWidget from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'

const buildWidget = () => loadWidget().withPresets('helpCenter')
const fn = () => zE('webWidget', 'hide')

test('api hides the widget', async () => {
  await buildWidget().load()
  await page.evaluate(fn)
  await expect(launcher).toBeHidden()
  await expect(widget).toBeHidden()
})

test('api hides an opened widget', async () => {
  await buildWidget().load()
  await launcher.click()
  await page.evaluate(fn)
  await expect(launcher).toBeHidden()
  await expect(widget).toBeHidden()
})

test('calling api multiple times is a no-op', async () => {
  await buildWidget().load()
  await page.evaluate(fn)
  await page.evaluate(fn)
  await page.evaluate(fn)
  await expect(launcher).toBeHidden()
  await expect(widget).toBeHidden()
})

test('works on prerender as well', async () => {
  await buildWidget().evaluateAfterSnippetLoads(fn).dontWaitForLauncherToLoad().load()
  await expect(launcher).toBeHidden()
  await expect(widget).toBeHidden()
})
