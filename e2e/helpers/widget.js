import { queries, wait } from 'pptr-testing-library'
import frame from './frame'
import { TEST_IDS } from 'src/constants/shared'

const webWidgetId = 'webWidget'
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

const clickButton = async buttonText => {
  const widgetFrame = await getFrame()
  const xpathSelector = `//button[contains(., '${buttonText}')]`
  await widgetFrame.waitForXPath(xpathSelector, { visible: true })
  const elements = await widgetFrame.$x(xpathSelector)
  await elements[0].click()
}

const clickText = async text => {
  const widget = await getDocument()
  await wait(async () => await queries.getByText(widget, text))
  const element = await queries.getByText(widget, text)
  await element.click()
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

const waitForText = async text => {
  const widget = await getDocument()
  await wait(async () => await queries.getByText(widget, text))
}

const waitForPlaceholderText = async placeholderText => {
  const widget = await getDocument()
  await wait(async () => await queries.getByPlaceholderText(widget, placeholderText))
}

const expectToSeeText = async text => {
  const widget = await getDocument()
  expect(await queries.queryByText(widget, text)).toBeTruthy()
}

export default {
  getDocument,
  getFrame,
  clickClose,
  clickBack,
  clickButton,
  clickText,
  openByKeyboard,
  selector: `iframe#${webWidgetId}`,
  waitForTestId,
  waitForPlaceholderText,
  waitForText,
  expectToSeeText,
  evaluate,
  zendeskLogoVisible
}
