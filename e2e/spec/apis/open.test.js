import loadWidget from 'e2e/helpers/widget-page'
import widget from 'e2e/helpers/widget'
import launcher from 'e2e/helpers/launcher'

const buildWidget = () => loadWidget().withPresets('helpCenter')
const fn = () => zE('webWidget', 'open')

test('api opens the widget and hides the launcher', async () => {
  await buildWidget().load()
  await page.evaluate(fn)
  await expect(widget).toBeVisible()
  await expect(launcher).toBeHidden()
})

test('works on prerender as well', async () => {
  await buildWidget()
    .evaluateOnNewDocument(fn)
    .load()
  await expect(widget).toBeVisible()
  await expect(launcher).toBeHidden()
})
