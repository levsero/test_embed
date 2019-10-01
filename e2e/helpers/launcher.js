import { queries } from 'pptr-testing-library'
import { TEST_IDS } from '../../src/constants/shared'
import frame from './frame'

const getDocument = async () => {
  return frame.getDocument('launcher')
}

const getLabel = async () => {
  return queries.getByTestId(await getDocument(), TEST_IDS.LAUNCHER_LABEL)
}

const click = async () => {
  const label = await getLabel()
  await label.click()
}

export default {
  click,
  getDocument,
  getLabel
}
