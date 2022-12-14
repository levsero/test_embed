import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'
import loadWidget from 'e2e/helpers/widget-page'

const getZIndex = async (selector) => {
  return await page.evaluate((iframe) => document.querySelector(iframe).style.zIndex, selector)
}

test('override zIndex value for launcher and frame', async () => {
  await loadWidget()
    .withPresets('contactForm')
    .evaluateOnNewDocument(() => {
      window.zESettings = {
        zIndex: 4567,
      }
    })
    .load()
  // launch so that widget gets lazy loaded onto the page
  await launcher.click()
  await widget.getDocument()
  expect(await getZIndex(launcher.selector)).toEqual('4566')
  expect(await getZIndex(widget.selector)).toEqual('4567')
})
