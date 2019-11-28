import widgetPage from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'
import { waitForHelpCenter } from 'e2e/helpers/utils'

beforeEach(async () => {
  await widgetPage.loadWithConfig('helpCenter')
})

describe('widget close behavior', () => {
  test('if initially hidden, closing hides widget', async () => {
    await page.evaluate(() => zE.hide())
    await page.evaluate(() => zE.activate())
    await expect(launcher).toBeHidden()
    await expect(widget).toBeVisible()
    await widget.clickClose()
    await expect(launcher).toBeHidden()
    await expect(widget).toBeHidden()
  })

  test('closing shows the launcher', async () => {
    await page.evaluate(() => zE.activate())
    await expect(launcher).toBeHidden()
    await expect(widget).toBeVisible()

    await waitForHelpCenter()
    await widget.clickClose()
    await expect(launcher).toBeVisible()
    await expect(widget).toBeHidden()
  })

  test('hides the widget if hideOnClose is true', async () => {
    await page.evaluate(() => zE.activate({ hideOnClose: true }))

    await waitForHelpCenter()
    await widget.clickClose()
    await expect(launcher).toBeHidden()
    await expect(widget).toBeHidden()
  })

  test('shows the launcher if hideOnClose is false', async () => {
    await page.evaluate(() => zE.activate({ hideOnClose: false }))

    await waitForHelpCenter()
    await widget.clickClose()
    await expect(launcher).toBeVisible()
    await expect(widget).toBeHidden()
  })
})

test('api is no-op if widget is already opened', async () => {
  await launcher.click()
  await waitForHelpCenter()
  await page.evaluate(() => zE.activate())
  await expect(launcher).toBeHidden()
  await expect(widget).toBeVisible()
})
