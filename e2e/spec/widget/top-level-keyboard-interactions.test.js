import widgetPage from 'e2e/helpers/widget-page'
import widget from 'e2e/helpers/widget'
import launcher from 'e2e/helpers/launcher'

describe('widget top level keyboard interactions', () => {
  const openWidgetViaKeyboard = async () => {
    await expect(widget).toBeHidden()
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter')
    await expect(widget).toBeVisible()
    await expect(widget).toHaveFocus()
  }

  beforeEach(async () => {
    await widgetPage.loadWithConfig('helpCenter')
  })

  it('allows the user to tab to the launcher', async () => {
    await expect(launcher).not.toHaveFocus()

    await page.keyboard.press('Tab')

    await expect(launcher).toHaveFocus()
  })

  it('allows the user to tab out of the launcher', async () => {
    await page.keyboard.press('Tab')

    await expect(launcher).toHaveFocus()

    await page.keyboard.press('Tab')

    await expect(launcher).not.toHaveFocus()
  })

  it('allows the user to open the widget by pressing enter when launcher is focused', async () => {
    await openWidgetViaKeyboard()
  })

  it('does not allow the user to tab out of the widget', async () => {
    await openWidgetViaKeyboard()

    await expect(widget).toHaveFocus()

    await page.keyboard.press('Tab')

    await expect(widget).toHaveFocus()
  })

  it('allows the user to close the widget by pressing the escape key', async () => {
    await openWidgetViaKeyboard()

    await page.keyboard.press('Escape')

    await expect(launcher).toBeVisible()
    await expect(widget).toBeHidden()

    await expect(launcher).toHaveFocus()
  })
})
