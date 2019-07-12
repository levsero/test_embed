import { queries } from 'pptr-testing-library'
export default class WidgetHelper {
  launcherFrame
  widgetFrame
  launcher

  constructor(page) {
    this.page = page
    this.launcherFrame = this.findFrameInPage('launcher')
    this.widgetFrame = this.findFrameInPage('webWidget')
  }

  findFrameInPage(frameName) {
    let foundFrame

    for (const frame of this.page.mainFrame().childFrames()) {
      if (frame.name().includes(frameName)) {
        foundFrame = frame
      }
    }
    return foundFrame
  }

  async getDocumentHandle(iframe) {
    const documentHandle = await iframe.evaluateHandle('document')
    const frameDocument = documentHandle.asElement()

    return frameDocument
  }

  async clickLauncherPill() {
    const launcher = await this.getDocumentHandle(this.launcherFrame)
    const launcherButton = await queries.getByTestId(launcher, 'launcherLabel')

    await launcherButton.click()
  }
}
