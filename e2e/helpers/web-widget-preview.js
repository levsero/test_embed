import { setupContainer } from './previews'
import frame from './frame'

const goToTestPage = async () =>
  await page.goto('http://localhost:5123/webWidgetPreview.html', {
    waitUntil: ['domcontentloaded', 'load', 'networkidle0']
  })

const renderPreview = () =>
  page.evaluate(() => {
    window.preview = window.zE.renderWebWidgetPreview({
      element: document.querySelector('#container')
    })
  })

export const loadPreview = async () => {
  await goToTestPage()
  await setupContainer()
  await renderPreview()
  await page.waitForSelector('#webWidgetPreview')
}

const getDocument = () => frame.getDocument('webWidgetPreview')
const getFrame = () => frame.getByName('webWidgetPreview')

const evaluate = (script, ...arg) => {
  const frame = getFrame()
  return frame.evaluate(script, ...arg)
}

export default {
  getDocument,
  getFrame,
  evaluate
}
