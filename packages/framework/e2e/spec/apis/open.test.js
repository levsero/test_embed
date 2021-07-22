import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'
import loadWidget from 'e2e/helpers/widget-page'

const buildWidget = () => loadWidget().withPresets('helpCenter')
const fn = () => zE('webWidget', 'open')

test('api opens the widget and hides the launcher', async () => {
  await buildWidget().load()
  await page.evaluate(fn)
  await widget.waitForWidget({ isVisible: true })
  await expect(launcher).toBeHidden()
})

test('works on prerender as well', async () => {
  await buildWidget().evaluateAfterSnippetLoads(fn).dontWaitForLauncherToLoad().load()
  await widget.waitForWidget({ isVisible: true })
  await expect(launcher).toBeHidden()
})
