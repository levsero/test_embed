import { queries, wait } from 'pptr-testing-library'
import frame from './frame'
import { TEST_IDS } from 'src/constants/shared'

const webWidgetId = 'webWidget'
const selector = `iframe#${webWidgetId}`
const getDocument = () => frame.getDocument(webWidgetId)
const getFrame = () => frame.getByName(webWidgetId)

const clickClose = async () => {
  const widget = await getDocument()
  const closeButton = await queries.getByTestId(widget, TEST_IDS.ICON_DASH)
  await closeButton.click()
}

const clickBack = async () => {
  const widget = await getDocument()
  const backButton = await queries.getByTestId(widget, TEST_IDS.ICON_BACK)
  await backButton.click()
}

const clickButton = async (buttonText) => {
  const frame = await getFrame()
  await waitForText(buttonText)
  await expect(frame).toClick('button', { text: buttonText })
}

const clickText = async (text, options) => {
  const widget = await getDocument()
  await wait(async () => {
    const element = await queries.getByText(widget, text, options)
    await element.click()
  })
}

const zendeskLogoVisible = async () => {
  const widget = await getDocument()
  return !!(await queries.queryByTestId(widget, TEST_IDS.ICON_ZENDESK))
}

const openByKeyboard = async () => {
  await page.keyboard.press('Tab')
  await page.keyboard.press('Enter')
}

const evaluate = async (script, ...arg) => {
  const frame = await getFrame()
  return frame.evaluate(script, ...arg)
}

const waitForTestId = async (testId, options = { visible: true }) => {
  const frame = await getFrame()
  await frame.waitForSelector(`[data-testid="${testId}"]`, options)
}

const waitForText = async (text, options) => {
  const widget = await getDocument()
  await wait(async () => await queries.getByText(widget, text, options))
}

const waitForPlaceholderText = async (placeholderText) => {
  const widget = await getDocument()
  await wait(async () => await queries.getByPlaceholderText(widget, placeholderText))
}

const expectToSeeText = async (text) => {
  expect(await queries.queryByText(await getDocument(), text)).toBeTruthy()
}

const expectNotToSeeText = async (text) => {
  expect(await queries.queryByText(await getDocument(), text)).toBeNull()
}

const expectToBeVisible = async () => {
  try {
    await page.waitForSelector(selector, {
      visible: true,
      timeout: 5000, // wait for 5 seconds
    })
    const embed = await evaluate(() => {
      return document.querySelector('#Embed [data-embed]').dataset['embed']
    })
    expect(embed).not.toEqual('nilEmbed')
  } catch (e) {
    fail('Expected web widget to be visible, but was not')
  }
}

export default {
  getDocument,
  getFrame,
  clickClose,
  clickBack,
  clickButton,
  clickText,
  openByKeyboard,
  selector,
  waitForTestId,
  waitForPlaceholderText,
  waitForText,
  expectToSeeText,
  expectNotToSeeText,
  evaluate,
  zendeskLogoVisible,
  expectToBeVisible,
}
