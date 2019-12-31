import { wait } from 'pptr-testing-library'
import loadWidget from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'

const buildWidget = () => loadWidget().withPresets('helpCenter')

beforeEach(async () => {
  await buildWidget()
    .evaluateOnNewDocument(() => {
      zE(() => {
        zE.setLocale('fr')
      })
    })
    .load()
})

describe('zE.setLocale(locale)', () => {
  it('updates the locale when called with a supported locale', async () => {
    expect(await launcher.getLabelText()).toEqual('Aide')
  })

  it('falls back to en-US when called with an unsupported locale', async () => {
    expect(await launcher.getLabelText()).toEqual('Aide')

    await page.evaluate(() => {
      zE.setLocale('unsupported locale')
    })
    await wait(async () => {
      expect(await launcher.getLabelText()).toEqual('Help')
    })
  })

  it('does nothing when no locale is provided', async () => {
    expect(await launcher.getLabelText()).toEqual('Aide')

    await page.evaluate(() => {
      zE.setLocale()
    })
    await wait(async () => {
      expect(await launcher.getLabelText()).toEqual('Aide')
    })
  })
})
