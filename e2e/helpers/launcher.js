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

const isHidden = async () => {
  await page.waitForSelector('iframe#launcher', {
    hidden: true
  })
}

const isVisible = async () => {
  await page.waitForSelector('iframe#launcher', {
    visible: true
  })
}

export default {
  click,
  getDocument,
  getLabel,
  isHidden,
  isVisible
}
