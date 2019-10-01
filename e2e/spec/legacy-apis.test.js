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
    await launcher.isHidden()
    await widget.isHidden()
    await page.evaluate(() => zE.show())
    await launcher.isVisible()
    await widget.isHidden()
  })

  describe('zE.activate()', () => {
    test('initially hidden', async () => {
      await page.evaluate(() => zE.hide())
      await page.evaluate(() => zE.activate())
      await launcher.isHidden()
      await widget.isVisible()
      await widget.close()
      await launcher.isHidden()
      await widget.isHidden()
    })

    test('no arguments passed', async () => {
      await page.evaluate(() => zE.activate())
      await launcher.isHidden()
      await widget.isVisible()

      await widget.close()
      await launcher.isVisible()
      await widget.isHidden()
    })

    test('with hideOnClose set to true', async () => {
      await page.evaluate(() => zE.activate({ hideOnClose: true }))

      await widget.close()
      await launcher.isHidden()
      await widget.isHidden()
    })

    test('with hideOnClose set to false', async () => {
      await page.evaluate(() => zE.activate({ hideOnClose: false }))

      await widget.close()
      await launcher.isVisible()
      await widget.isHidden()
    })

    test('widget already opened', async () => {
      await launcher.click()
      await page.evaluate(() => zE.activate())
      await launcher.isHidden()
      await widget.isVisible()
    })
  })

  test('zE.setLocale(locale)', async () => {
    await page.evaluate(() => {
      zE.setLocale('fr')
    })

    expect(await queries.getNodeText(await launcher.getLabel())).toEqual('Aide')
  })
})
