import loadWidget from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'
import { waitForContactForm } from 'e2e/helpers/support-embed'
import { wait } from 'pptr-testing-library'

const getPosition = async selector => {
  return await page.evaluate(iframe => {
    const frame = document.querySelector(iframe)
    return {
      top: frame.style.top,
      left: frame.style.left
    }
  }, selector)
}

test('override left and top positions for launcher and frame', async () => {
  await loadWidget()
    .withPresets('contactForm')
    .evaluateOnNewDocument(() => {
      window.zESettings = {
        webWidget: {
          position: { horizontal: 'left', vertical: 'top' }
        }
      }
    })
    .load()
  await wait(async () =>
    expect(await getPosition(launcher.selector)).toEqual({
      top: '0px',
      left: '0px'
    })
  )
  await launcher.click()
  await waitForContactForm()
  await wait(async () => {
    expect(await getPosition(widget.selector)).toEqual({
      top: '0px',
      left: '0px'
    })
  })
})
