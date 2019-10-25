import widgetPage from '../../helpers/widget-page'
import widget from '../../helpers/widget'
import launcher from '../../helpers/launcher'

describe('widget navbar', () => {
  beforeEach(async () => {
    await widgetPage.loadWithConfig('helpCenter')
  })

  it('focuses on the launcher when the close button is pressed', async () => {
    await expect(launcher).not.toHaveFocus()

    await launcher.click()
    await widget.clickClose()

    await expect(launcher).toHaveFocus()
  })
})
