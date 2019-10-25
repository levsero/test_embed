import { queries } from 'pptr-testing-library'
import frame from './frame'
import { TEST_IDS } from '../../src/constants/shared'

const getDocument = async () => {
  return frame.getDocument('webWidget')
}

const clickClose = async () => {
  const widget = await getDocument()
  const closeButton = await queries.getByTestId(widget, TEST_IDS.ICON_DASH)
  await closeButton.click()
}

export default {
  getDocument,
  clickClose,
  selector: 'iframe#webWidget'
}
