import { setupContainer } from './previews'
import frame from './frame'

const goToTestPage = () => page.goto('http://localhost:5123/chatPreview.html')

const renderPreview = () =>
  page.evaluate(() => {
    window.preview = window.zEPreview.renderPreview({
      element: document.getElementById('container')
    })
  })

export const loadPreview = async () => {
  await goToTestPage()
  await setupContainer()
  await renderPreview()
  await waitForPreview()
}

const getDocument = () => frame.getDocument('webWidget')
const getLauncherDocument = () => frame.getDocument('launcher')
const getFrame = () => frame.getByName('webWidget')
const getLauncherFrame = () => frame.getByName('launcher')

const evaluate = (script, ...arg) => {
  const frame = getFrame()
  return frame.evaluate(script, ...arg)
}

const waitForPreview = async () => {
  await page.evaluate(() => {
    window.preview.waitForComponent(() => {
      window.loaded = true
    })
  })
  await page.waitForFunction('window.loaded')
}

export default {
  getDocument,
  getLauncherDocument,
  getFrame,
  getLauncherFrame,
  evaluate,
  waitForPreview
}