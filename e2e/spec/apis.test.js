import { queries } from 'pptr-testing-library'
import WidgetHelper from '../helpers/widgetHelper'
import { loadPageWithWidget } from '../helpers/utils'

beforeEach(async () => await loadPageWithWidget())

test("zE('webWidget:get', 'display')", async () => {
  let result = await page.evaluate(() => zE('webWidget:get', 'display'))
  expect(result).toEqual('launcher')

  const widgetHelper = new WidgetHelper(page)
  await widgetHelper.clickLauncherPill()
  result = await page.evaluate(() => zE('webWidget:get', 'display'))
  expect(result).toEqual('helpCenter')

  await page.evaluate(() => zE('webWidget', 'hide'))
  result = await page.evaluate(() => zE('webWidget:get', 'display'))
  expect(result).toEqual('hidden')
})

test("zE('webWidget', 'hide') and zE('webWidget', 'show')", async () => {
  await page.evaluate(() => zE('webWidget', 'hide'))
  await page.waitForSelector('iframe#launcher', {
    hidden: true
  })
  await page.evaluate(() => zE('webWidget', 'show'))
  await page.waitForSelector('iframe#launcher', {
    visible: true
  })
})

test("zE('webWidget', 'open')", async () => {
  await page.evaluate(() => zE('webWidget', 'open'))
  await page.waitForSelector('iframe#webWidget', {
    visible: true
  })
  await page.waitForSelector('iframe#launcher', {
    hidden: true
  })
})

test("zE('webWidget', 'close')", async () => {
  await page.evaluate(() => zE('webWidget', 'open'))
  await page.evaluate(() => zE('webWidget', 'close'))
  await page.waitForSelector('iframe#webWidget', {
    hidden: true
  })
  await page.waitForSelector('iframe#launcher', {
    visible: true
  })
})

describe("zE('webWidget:on', 'open', fn)", () => {
  test('with user action', async () => {
    await page.evaluate(() => {
      zE('webWidget:on', 'open', () => {
        window.onOpenCalled = true
      })
    })
    const widgetHelper = new WidgetHelper(page)
    await widgetHelper.clickLauncherPill()
    const result = await page.evaluate(() => window.onOpenCalled)
    expect(result).toEqual(true)
  })

  test('with apis', async () => {
    await page.evaluate(() => {
      zE('webWidget:on', 'open', () => {
        window.onOpenCalledWithApi = true
      })
    })
    await page.evaluate(() => zE('webWidget', 'open'))
    const result = await page.evaluate(() => window.onOpenCalledWithApi)
    expect(result).toEqual(true)
  })
})

describe("zE('webWidget:on', 'close', fn)", () => {
  test('with user action', async () => {
    await page.evaluate(() => {
      zE('webWidget:on', 'close', () => {
        window.onCloseCalled = true
      })
    })
    const widgetHelper = new WidgetHelper(page)
    await widgetHelper.clickLauncherPill()
    await widgetHelper.clickWidgetClose()
    const result = await page.evaluate(() => window.onCloseCalled)
    expect(result).toEqual(true)
  })

  test('with apis', async () => {
    await page.evaluate(() => {
      zE('webWidget:on', 'close', () => {
        window.onCloseCalledWithApi = true
      })
    })
    await page.evaluate(() => zE('webWidget', 'open'))
    await page.evaluate(() => zE('webWidget', 'close'))
    const result = await page.evaluate(() => window.onCloseCalledWithApi)
    expect(result).toEqual(true)
  })
})

test("zE('webWidget', 'setLocale', locale)", async () => {
  await page.evaluate(() => {
    zE('webWidget', 'setLocale', 'fr')
  })
  const widgetHelper = new WidgetHelper(page)
  const launcher = await widgetHelper.getDocumentHandle(widgetHelper.launcherFrame)
  const element = await queries.getByTestId(launcher, 'launcher-label')
  expect(await queries.getNodeText(element)).toEqual('Aide')
})

describe("zE('webWidget', 'toggle')", () => {
  test('toggling', async () => {
    await page.evaluate(() => zE('webWidget', 'toggle'))
    await page.waitForSelector('iframe#launcher', {
      hidden: true
    })
    await page.waitForSelector('iframe#webWidget', {
      visible: true
    })
    expect(await page.evaluate(() => zE('webWidget:get', 'display'))).toEqual('helpCenter')
    await page.evaluate(() => zE('webWidget', 'toggle'))
    await page.waitForSelector('iframe#launcher', {
      visible: true
    })
    await page.waitForSelector('iframe#webWidget', {
      hidden: true
    })
    expect(await page.evaluate(() => zE('webWidget:get', 'display'))).toEqual('launcher')
  })

  test('initially open', async () => {
    const widgetHelper = new WidgetHelper(page)
    await widgetHelper.clickLauncherPill()
    await page.evaluate(() => zE('webWidget', 'toggle'))
    await page.waitForSelector('iframe#launcher', {
      visible: true
    })
    await page.waitForSelector('iframe#webWidget', {
      hidden: true
    })
  })
})
