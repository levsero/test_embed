import widgetPage from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'
import { mockEmbeddableConfigEndpoint } from 'e2e/helpers/widget-page/embeddable-config'

const getZIndex = async selector => {
  return await page.evaluate(iframe => document.querySelector(iframe).style.zIndex, selector)
}

test('override zIndex value for launcher and frame', async () => {
  await widgetPage.load({
    mockRequests: [mockEmbeddableConfigEndpoint('contactForm')],
    preload: () => {
      window.zESettings = {
        zIndex: 4567
      }
    }
  })
  expect(await getZIndex(launcher.selector)).toEqual('4566')
  expect(await getZIndex(widget.selector)).toEqual('4567')
})
