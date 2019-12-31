import loadWidget from 'e2e/helpers/widget-page'
import widget from 'e2e/helpers/widget'
import launcher from 'e2e/helpers/launcher'
import { waitForHelpCenter } from 'e2e/helpers/help-center-embed'

describe('widget navbar', () => {
  beforeEach(async () => {
    await loadWidget('helpCenter')
  })

  it('focuses on the launcher when the close button is pressed', async () => {
    await expect(launcher).not.toHaveFocus()

    await launcher.click()
    await waitForHelpCenter()
    await widget.clickClose()

    await expect(launcher).toHaveFocus()
  })
})
