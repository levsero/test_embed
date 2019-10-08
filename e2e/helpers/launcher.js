import { queries } from 'pptr-testing-library'
import { TEST_IDS } from '../../src/constants/shared'
import frame from './frame'

const getDocument = async () => frame.getDocument('launcher')
const getLabel = async () => queries.getByTestId(await getDocument(), TEST_IDS.LAUNCHER_LABEL)
const getLabelText = async () => queries.getNodeText(await getLabel())
const getFrame = async () => frame.getByName('launcher')

const click = async () => {
  const label = await getLabel()
  await label.click()
}

export default {
  click,
  getDocument,
  getLabel,
  getLabelText,
  selector: 'iframe#launcher',
  getFrame
}
