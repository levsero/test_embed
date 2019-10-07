import widgetPage from 'helpers/widget-page'
import launcher from 'helpers/launcher'
import widget from 'helpers/widget'

beforeEach(async () => {
  await widgetPage.loadWithConfig('helpCenter')
})

describe('widget close behavior', () => {
  test('if initially hidden, closing hides widget', async () => {
    await page.evaluate(() => zE.hide())
    await page.evaluate(() => zE.activate())
    await expect(launcher).toBeHidden()
    await expect(widget).toBeVisible()
    await widget.close()
    await expect(launcher).toBeHidden()
    await expect(widget).toBeHidden()
  })

  test('closing shows the launcher', async () => {
    await page.evaluate(() => zE.activate())
    await expect(launcher).toBeHidden()
    await expect(widget).toBeVisible()

    await widget.close()
    await expect(launcher).toBeVisible()
    await expect(widget).toBeHidden()
  })

  test('hides the widget if hideOnClose is true', async () => {
    await page.evaluate(() => zE.activate({ hideOnClose: true }))

    await widget.close()
    await expect(launcher).toBeHidden()
    await expect(widget).toBeHidden()
  })

  test('shows the launcher if hideOnClose is false', async () => {
    await page.evaluate(() => zE.activate({ hideOnClose: false }))

    await widget.close()
    await expect(launcher).toBeVisible()
    await expect(widget).toBeHidden()
  })
})

test('api is no-op if widget is already opened', async () => {
  await launcher.click()
  await page.evaluate(() => zE.activate())
  await expect(launcher).toBeHidden()
  await expect(widget).toBeVisible()
})
