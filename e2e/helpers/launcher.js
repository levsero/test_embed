import { queries } from 'pptr-testing-library'
import { TEST_IDS } from '../../src/constants/shared'
import frame from './frame'

const getDocument = () => frame.getDocument('launcher')
const getLabel = async () => queries.getByTestId(await getDocument(), TEST_IDS.LAUNCHER_LABEL)
const getLabelText = async () => queries.getNodeText(await getLabel())
const getButton = async () => queries.getByTestId(await getDocument(), TEST_IDS.LAUNCHER)
const getFrame = () => frame.getByName('launcher')

const evaluate = async (script, ...arg) => {
  const frame = await getFrame()
  return frame.evaluate(script, ...arg)
}

const click = async () => {
  const launcherFrame = await getFrame()
  await launcherFrame.waitForSelector('[data-testid="launcher"]', { visible: true })
  await evaluate(() => {
    document.querySelector('[data-testid="launcher"]').click()
  })
}

export default {
  click,
  getDocument,
  getLabel,
  getLabelText,
  selector: 'iframe#launcher',
  getFrame,
  getButton,
  evaluate
}
