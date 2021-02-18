import loadWidget from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'
import { waitForHelpCenter } from 'e2e/helpers/help-center-embed'

const getPosition = async (selector) => {
  return await page.evaluate((iframe) => {
    const frame = document.querySelector(iframe)
    return {
      top: frame.style.top,
      left: frame.style.left,
    }
  }, selector)
}

test('sets the launcher and widget positions based on config', async () => {
  await loadWidget()
    .withPresets('helpCenter', {
      position: 'left',
    })
    .load()
  expect(await getPosition(launcher.selector)).toEqual({
    top: '',
    left: '0px',
  })
  await launcher.click()
  await waitForHelpCenter()
  expect(await getPosition(widget.selector)).toEqual({
    top: '',
    left: '0px',
  })
})
