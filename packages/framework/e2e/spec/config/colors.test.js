import loadWidget from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'
import { waitForHelpCenter } from 'e2e/helpers/help-center-embed'

const getBackgroundColor = (selector) =>
  getComputedStyle(document.querySelector(selector)).backgroundColor
const getColor = (selector) => getComputedStyle(document.querySelector(selector)).color
const getLauncherColor = () => launcher.evaluate(getBackgroundColor, 'button')
const getLauncherTextColor = () => launcher.evaluate(getColor, 'button')
const getHeaderColor = () =>
  widget.evaluate(
    () => getComputedStyle(document.querySelector('h1').parentElement.parentElement).backgroundColor
  )

test('sets the launcher and widget colors based on config', async () => {
  await loadWidget()
    .withPresets('helpCenter', {
      color: '#ffffff',
      textColor: '#000000',
    })
    .load()
  expect(await getLauncherColor()).toEqual('rgb(255, 255, 255)')
  expect(await getLauncherTextColor()).toEqual('rgb(0, 0, 0)')
  await widget.openByKeyboard()
  await waitForHelpCenter()
  expect(await getHeaderColor()).toEqual('rgb(255, 255, 255)')
})
