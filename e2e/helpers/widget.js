import { queries } from 'pptr-testing-library'
import frame from './frame'
import { TEST_IDS } from '../../src/constants/shared'

const getDocument = async () => {
  return frame.getDocument('webWidget')
}

const close = async () => {
  const widget = await getDocument()
  const closeButton = await queries.getByTestId(widget, TEST_IDS.ICON_DASH)
  await closeButton.click()
}

const isHidden = async () => {
  await page.waitForSelector('iframe#webWidget', {
    hidden: true
  })
}

const isVisible = async () => {
  await page.waitForSelector('iframe#webWidget', {
    visible: true
  })
}

export default {
  getDocument,
  close,
  isHidden,
  isVisible
}
