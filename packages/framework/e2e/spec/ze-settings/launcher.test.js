import launcher from 'e2e/helpers/launcher'
import loadWidget from 'e2e/helpers/widget-page'
import { TEST_IDS } from 'src/constants/shared'

describe('zESettings.webWidget.launcher.label', () => {
  const buildWidget = () => {
    return loadWidget()
      .withPresets('contactForm')
      .evaluateOnNewDocument(() => {
        window.zESettings = {
          launcher: {
            label: {
              '*': 'Need help?',
              fr: "Besoin d'aide?",
            },
          },
        }
      })
  }

  it('overrides the launcher label', async () => {
    await buildWidget().load()
    expect(await launcher.getLabelText()).toEqual('Need help?')
  })

  it('sets the label according to locale', async () => {
    await buildWidget()
      .evaluateAfterSnippetLoads(() => {
        zE('webWidget', 'setLocale', 'fr')
      })
      .load()
    expect(await launcher.getLabelText()).toEqual("Besoin d'aide?")
  })
})

describe('zESettings.webWidget.launcher.mobile.labelVisible', () => {
  const buildWidget = (labelVisible) => {
    return loadWidget()
      .withPresets('helpCenter')
      .evaluateOnNewDocument((labelVisible) => {
        window.zESettings = {
          launcher: {
            mobile: {
              labelVisible,
            },
          },
        }
      }, labelVisible)
  }

  const getLabelVisible = async () => {
    return await launcher.evaluate((testId) => {
      return (
        getComputedStyle(document.querySelector(`[data-testid="${testId}"]`)).display !== 'none'
      )
    }, TEST_IDS.LAUNCHER_LABEL)
  }

  it('does not show the label when false', async () => {
    await buildWidget(false).useMobile().load()
    expect(await getLabelVisible()).toEqual(false)
  })

  it('does shows the label when true', async () => {
    await buildWidget(true).useMobile().load()
    expect(await getLabelVisible()).toEqual(true)
  })

  it('does not hide label on desktop', async () => {
    await buildWidget(false).load()
    expect(await getLabelVisible()).toEqual(true)
  })
})
