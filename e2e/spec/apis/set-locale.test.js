import { queries } from 'pptr-testing-library'
import widgetPage from 'helpers/widget-page'
import launcher from 'helpers/launcher'

describe("zE('webWidget', 'setLocale', locale)", () => {
  beforeEach(async () => await widgetPage.loadWithConfig('helpCenter'))

  it('updates the locale when called with a supported locale', async () => {
    await page.evaluate(() => {
      zE('webWidget', 'setLocale', 'fr')
    })
    expect(await queries.getNodeText(await launcher.getLabel())).toEqual('Aide')
  })

  it('falls back to en-US when called with an unsupported locale', async () => {
    await page.evaluate(() => {
      zE('webWidget', 'setLocale', 'fr')
    })
    expect(await queries.getNodeText(await launcher.getLabel())).toEqual('Aide')

    await page.evaluate(() => {
      zE('webWidget', 'setLocale', 'unsupported locale')
    })
    expect(await queries.getNodeText(await launcher.getLabel())).toEqual('Help')
  })

  it('does nothing when no locale is provided', async () => {
    await page.evaluate(() => {
      zE('webWidget', 'setLocale', 'fr')
    })
    expect(await queries.getNodeText(await launcher.getLabel())).toEqual('Aide')

    await page.evaluate(() => {
      zE('webWidget', 'setLocale')
    })
    expect(await queries.getNodeText(await launcher.getLabel())).toEqual('Aide')
  })
})
