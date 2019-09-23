import { queries } from 'pptr-testing-library'

import { TEST_IDS } from '../../src/constants/shared'

export default class WidgetHelper {
  constructor(page) {
    this.page = page
    this.launcherFrame = this.findFrameInPage('launcher')
    this.widgetFrame = this.findFrameInPage('webWidget')
  }

  findFrameInPage(frameName) {
    for (const frame of this.page.mainFrame().childFrames()) {
      if (frame.name().includes(frameName)) {
        return frame
      }
    }
    return null
  }

  async getDocumentHandle(iframe) {
    const documentHandle = await iframe.evaluateHandle('document')
    const frameDocument = documentHandle.asElement()

    return frameDocument
  }

  async clickLauncherPill() {
    const launcher = await this.getDocumentHandle(this.launcherFrame)
    const launcherButton = await queries.getByTestId(launcher, TEST_IDS.LAUNCHER_LABEL)

    await launcherButton.click()
  }

  async clickWidgetClose() {
    const widget = await this.getDocumentHandle(this.widgetFrame)
    const closeButton = await queries.getByTestId(widget, TEST_IDS.ICON_DASH)

    await closeButton.click()
  }
}
