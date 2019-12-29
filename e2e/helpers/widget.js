import { queries } from 'pptr-testing-library'
import frame from './frame'
import { TEST_IDS } from '../../src/constants/shared'

const getDocument = async () => {
  return frame.getDocument('webWidget')
}

const getFrame = async () => {
  return frame.getByName('webWidget')
}

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

const openByKeyboard = async () => {
  await page.keyboard.press('Tab')
  await page.keyboard.press('Enter')
}

const evaluate = async (script, ...arg) => {
  const frame = await getFrame()
  return frame.evaluate(script, ...arg)
}

export default {
  getDocument,
  getFrame,
  clickClose,
  clickBack,
  openByKeyboard,
  selector: 'iframe#webWidget',
  evaluate
}
