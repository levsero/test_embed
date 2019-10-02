import { queries } from 'pptr-testing-library'
import widgetPage from '../helpers/widget-page'
import widget from '../helpers/widget'
import launcher from '../helpers/launcher'

describe('legacy apis', () => {
  beforeEach(async () => {
    await widgetPage.loadWithConfig('helpCenter')
  })

  test('zE.hide() and zE.show()', async () => {
    await page.evaluate(() => zE.hide())
    await expect(launcher).toBeHidden()
    await expect(widget).toBeHidden()
    await page.evaluate(() => zE.show())
    await expect(launcher).toBeVisible()
    await expect(widget).toBeHidden()
  })

  describe('zE.activate()', () => {
    test('initially hidden', async () => {
      await page.evaluate(() => zE.hide())
      await page.evaluate(() => zE.activate())
      await expect(launcher).toBeHidden()
      await expect(widget).toBeVisible()
      await widget.close()
      await expect(launcher).toBeHidden()
      await expect(widget).toBeHidden()
    })

    test('no arguments passed', async () => {
      await page.evaluate(() => zE.activate())
      await expect(launcher).toBeHidden()
      await expect(widget).toBeVisible()

      await widget.close()
      await expect(launcher).toBeVisible()
      await expect(widget).toBeHidden()
    })

    test('with hideOnClose set to true', async () => {
      await page.evaluate(() => zE.activate({ hideOnClose: true }))

      await widget.close()
      await expect(launcher).toBeHidden()
      await expect(widget).toBeHidden()
    })

    test('with hideOnClose set to false', async () => {
      await page.evaluate(() => zE.activate({ hideOnClose: false }))

      await widget.close()
      await expect(launcher).toBeVisible()
      await expect(widget).toBeHidden()
    })

    test('widget already opened', async () => {
      await launcher.click()
      await page.evaluate(() => zE.activate())
      await expect(launcher).toBeHidden()
      await expect(widget).toBeVisible()
    })
  })

  test('zE.setLocale(locale)', async () => {
    await page.evaluate(() => {
      zE.setLocale('fr')
    })

    expect(await queries.getNodeText(await launcher.getLabel())).toEqual('Aide')
  })
})
