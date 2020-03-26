import { queries } from 'pptr-testing-library'
import { TEST_IDS } from 'src/constants/shared'
import frame from './frame'

const launcherId = 'launcher'
const getDocument = () => frame.getDocument(launcherId)
const getLabel = async () => queries.getByTestId(await getDocument(), TEST_IDS.LAUNCHER_LABEL)
const getLabelText = async () => queries.getNodeText(await getLabel())
const getButton = async () => queries.getByTestId(await getDocument(), TEST_IDS.LAUNCHER)
const getFrame = () => frame.getByName(launcherId)

const evaluate = async (script, ...arg) => {
  const frame = await getFrame()
  return frame.evaluate(script, ...arg)
}

const waitForTestId = async (testId, options = { visible: true }) => {
  const frame = await getFrame()
  await frame.waitForSelector(`[data-testid="${testId}"]`, options)
}

const click = async () => {
  await waitForTestId(launcherId)
  await evaluate(
    launcherId => document.querySelector(`[data-testid="${launcherId}"]`).click(),
    launcherId
  )
}

export default {
  click,
  getDocument,
  getLabel,
  getLabelText,
  selector: `iframe#${launcherId}`,
  waitForTestId,
  getFrame,
  getButton,
  evaluate
}
