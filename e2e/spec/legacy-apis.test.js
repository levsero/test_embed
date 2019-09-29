import { queries } from 'pptr-testing-library'
import WidgetHelper from '../helpers/widgetHelper'
import { loadPageWithWidget } from '../helpers/utils'

beforeEach(async () => await loadPageWithWidget())

test('zE.hide() and zE.show()', async () => {
  await page.evaluate(() => zE.hide())
  await page.waitForSelector('iframe#launcher', {
    hidden: true
  })
  await page.evaluate(() => zE.show())
  await page.waitForSelector('iframe#launcher', {
    visible: true
  })
})

describe('zE.activate()', () => {
  test('initially hidden', async () => {
    await page.evaluate(() => zE.hide())
    await page.evaluate(() => zE.activate())
    await page.waitForSelector('iframe#launcher', {
      hidden: true
    })
    await page.waitForSelector('iframe#webWidget', {
      visible: true
    })
    const widgetHelper = new WidgetHelper(page)
    await widgetHelper.clickWidgetClose()
    await page.waitForSelector('iframe#launcher', {
      hidden: true
    })
    await page.waitForSelector('iframe#webWidget', {
      hidden: true
    })
  })

  test('no arguments passed', async () => {
    await page.evaluate(() => zE.activate())
    await page.waitForSelector('iframe#launcher', {
      hidden: true
    })
    await page.waitForSelector('iframe#webWidget', {
      visible: true
    })
    const widgetHelper = new WidgetHelper(page)
    await widgetHelper.clickWidgetClose()
    await page.waitForSelector('iframe#launcher', {
      visible: true
    })
    await page.waitForSelector('iframe#webWidget', {
      hidden: true
    })
  })

  test('with hideOnClose set to true', async () => {
    await page.evaluate(() => zE.activate({ hideOnClose: true }))
    const widgetHelper = new WidgetHelper(page)
    await widgetHelper.clickWidgetClose()
    await page.waitForSelector('iframe#launcher', {
      hidden: true
    })
    await page.waitForSelector('iframe#webWidget', {
      hidden: true
    })
  })

  test('with hideOnClose set to false', async () => {
    await page.evaluate(() => zE.activate({ hideOnClose: false }))
    const widgetHelper = new WidgetHelper(page)
    await widgetHelper.clickWidgetClose()
    await page.waitForSelector('iframe#launcher', {
      visible: true
    })
    await page.waitForSelector('iframe#webWidget', {
      hidden: true
    })
  })

  test('widget already opened', async () => {
    const widgetHelper = new WidgetHelper(page)
    await widgetHelper.clickLauncherPill()
    await page.evaluate(() => zE.activate())
    await page.waitForSelector('iframe#launcher', {
      hidden: true
    })
    await page.waitForSelector('iframe#webWidget', {
      visible: true
    })
  })
})

test('zE.setLocale(locale)', async () => {
  await page.evaluate(() => {
    zE.setLocale('fr')
  })
  const widgetHelper = new WidgetHelper(page)
  const launcher = await widgetHelper.getDocumentHandle(widgetHelper.launcherFrame)
  const element = await queries.getByTestId(launcher, 'launcher-label')
  expect(await queries.getNodeText(element)).toEqual('Aide')
})
