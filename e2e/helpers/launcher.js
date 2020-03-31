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

const waitForLauncherPill = async () => await waitForTestId(TEST_IDS.LAUNCHER, { visible: true })
const waitForChatBadge = async () => await waitForTestId(TEST_IDS.CHAT_BADGE, { visible: true })

const expectIconToBeVisible = async iconType => {
  const iconTestid = (icon => {
    switch (icon) {
      case 'chat':
        return 'Icon--chat'
      case 'talk':
        return 'Icon--launcher-talk'
      case 'help':
        return 'Icon'
    }
  })(iconType)

  await expect(async () => queries.getByTestId(await getDocument(), iconTestid)).toBeTruthy()
}

const expectLabelToEqual = async label => {
  expect(await getLabelText()).toEqual(label)
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
  waitForLauncherPill,
  waitForChatBadge,
  expectIconToBeVisible,
  expectLabelToEqual,
  getFrame,
  getButton,
  evaluate
}
