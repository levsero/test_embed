import { wait } from 'pptr-testing-library'
import loadWidget from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'

describe('zE.setLocale(locale)', () => {
  beforeEach(async () => {
    await loadWidget('helpCenter')
  })

  it('updates the locale when called with a supported locale', async () => {
    await page.evaluate(() => {
      zE.setLocale('fr')
    })
    await wait(async () => {
      expect(await launcher.getLabelText()).toEqual('Aide')
    })
  })

  it('falls back to en-US when called with an unsupported locale', async () => {
    await page.evaluate(() => {
      zE.setLocale('fr')
    })
    await wait(async () => {
      expect(await launcher.getLabelText()).toEqual('Aide')
    })

    await page.evaluate(() => {
      zE.setLocale('unsupported locale')
    })
    await wait(async () => {
      expect(await launcher.getLabelText()).toEqual('Help')
    })
  })

  it('does nothing when no locale is provided', async () => {
    await page.evaluate(() => {
      zE.setLocale('fr')
    })
    await wait(async () => {
      expect(await launcher.getLabelText()).toEqual('Aide')
    })

    await page.evaluate(() => {
      zE.setLocale()
    })
    await wait(async () => {
      expect(await launcher.getLabelText()).toEqual('Aide')
    })
  })
})
