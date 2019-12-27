import widgetPage from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'
import { TEST_IDS } from '../../../src/constants/shared'
import { mockEmbeddableConfigEndpoint } from 'e2e/helpers/widget-page/embeddable-config'

describe('zESettings.webWidget.launcher.label', () => {
  it('overrides the launcher label', async () => {
    await widgetPage.load({
      mockRequests: [mockEmbeddableConfigEndpoint('contactForm')],
      preload: () => {
        window.zESettings = {
          launcher: {
            label: {
              '*': 'Need help?',
              fr: "Besoin d'aide?"
            }
          }
        }
      }
    })
    expect(await launcher.getLabelText()).toEqual('Need help?')
  })

  it('sets the label according to locale', async () => {
    await widgetPage.load({
      mockRequests: [mockEmbeddableConfigEndpoint('contactForm')],
      preload: () => {
        window.zESettings = {
          launcher: {
            label: {
              '*': 'Need help?',
              fr: "Besoin d'aide?"
            }
          }
        }
        zE('webWidget', 'setLocale', 'fr')
      }
    })
    expect(await launcher.getLabelText()).toEqual("Besoin d'aide?")
  })
})

describe('zESettings.webWidget.launcher.mobile.labelVisible', () => {
  const setup = async (labelVisible, mobile = true) => {
    await widgetPage.load({
      mockRequests: [mockEmbeddableConfigEndpoint('helpCenter')],
      preload: labelVisible => {
        window.zESettings = {
          launcher: {
            mobile: {
              labelVisible
            }
          }
        }
      },
      preloadArgs: [labelVisible],
      mobile
    })
  }

  const getLabelVisible = async () => {
    return await launcher.evaluate(testId => {
      return (
        getComputedStyle(document.querySelector(`[data-testid="${testId}"]`)).display !== 'none'
      )
    }, TEST_IDS.LAUNCHER_LABEL)
  }

  it('does not show the label when false', async () => {
    await setup(false)
    expect(await getLabelVisible()).toEqual(false)
  })

  it('does shows the label when true', async () => {
    await setup(true)
    expect(await getLabelVisible()).toEqual(true)
  })

  it('does not hide label on desktop', async () => {
    await setup(true, false)
    expect(await getLabelVisible()).toEqual(true)
  })
})
