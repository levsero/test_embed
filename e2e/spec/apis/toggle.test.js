import loadWidget from 'e2e/helpers/widget-page'
import widget from 'e2e/helpers/widget'
import launcher from 'e2e/helpers/launcher'

const buildWidget = () => loadWidget().withPresets('helpCenter')
const toggleFn = () => zE('webWidget', 'toggle')

test('api toggles the widget visibility', async () => {
  await buildWidget().load()
  await page.evaluate(toggleFn)
  await expect(launcher).toBeHidden()
  await expect(widget).toBeVisible()
  expect(await page.evaluate(() => zE('webWidget:get', 'display'))).toEqual('helpCenter')
  await page.evaluate(() => zE('webWidget', 'toggle'))
  await expect(launcher).toBeVisible()
  await expect(widget).toBeHidden()
  expect(await page.evaluate(() => zE('webWidget:get', 'display'))).toEqual('launcher')
})

test('widget toggles to launcher when it is initially open', async () => {
  await buildWidget().load()
  await launcher.click()
  await page.evaluate(toggleFn)
  await expect(widget).toBeHidden()
  await expect(launcher).toBeVisible()
})

test('works on prerender as well', async () => {
  await buildWidget()
    .evaluateAfterSnippetLoads(toggleFn)
    .load()
  await expect(launcher).toBeHidden()
  await expect(widget).toBeVisible()
})
