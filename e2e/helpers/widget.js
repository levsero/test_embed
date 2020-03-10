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
  await wait(() => queries.getByText(widget, text))
}

export default {
  getDocument,
  getFrame,
  clickClose,
  clickBack,
  openByKeyboard,
  selector: `iframe#${webWidgetId}`,
  waitForTestId,
  waitForText,
  evaluate,
  zendeskLogoVisible
}
