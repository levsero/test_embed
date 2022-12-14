import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'
import loadWidget from 'e2e/helpers/widget-page'

const buildWidget = () => loadWidget().withPresets('helpCenter')
const toggleFn = () => zE('webWidget', 'toggle')

test('api toggles the widget visibility', async () => {
  await buildWidget().load()
  await page.evaluate(toggleFn)
  await expect(launcher).toBeHidden()
  await widget.expectToBeVisible()
  expect(await page.evaluate(() => zE('webWidget:get', 'display'))).toEqual('helpCenter')
  await page.evaluate(() => zE('webWidget', 'toggle'))
  await widget.waitForWidget({ isVisible: false })
  await expect(launcher).toBeVisible()
  expect(await page.evaluate(() => zE('webWidget:get', 'display'))).toEqual('launcher')
})

test('widget toggles to launcher when it is initially open', async () => {
  await buildWidget().load()
  await launcher.click()
  await page.evaluate(toggleFn)
  await widget.waitForWidget({ isVisible: false })
  await expect(launcher).toBeVisible()
})

test('works on prerender as well', async () => {
  await buildWidget().evaluateAfterSnippetLoads(toggleFn).dontWaitForLauncherToLoad().load()

  await widget.waitForWidget({ isVisible: true })
  await expect(launcher).toBeHidden()
})
