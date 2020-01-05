import frame from './frame'

const goToTestPage = () => page.goto('http://localhost:5123/webWidgetPreview.html')

const setupContainer = () =>
  page.evaluate(() => {
    const div = document.createElement('div')
    div.id = 'container'
    document.querySelector('body').appendChild(div)
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
}

const getDocument = () => frame.getDocument('webWidgetPreview')
const getFrame = () => frame.getByName('webWidgetPreview')

const evaluate = async (script, ...arg) => {
  const frame = await getFrame()
  return frame.evaluate(script, ...arg)
}

export default {
  getDocument,
  getFrame,
  evaluate
}
