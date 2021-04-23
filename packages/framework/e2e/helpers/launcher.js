import { queries } from 'pptr-testing-library'
import { TEST_IDS } from 'src/constants/shared'
import frame from './frame'

const launcherId = 'launcher'
const getLabel = async () => await queries.getByTestId(await getDocument(), TEST_IDS.LAUNCHER_LABEL)
const getLabelText = async () => await queries.getNodeText(await getLabel())
const getButton = async () => await queries.getByTestId(await getDocument(), TEST_IDS.LAUNCHER)

const getDocument = async () => {
  await page.waitForSelector(`#${launcherId}`)
  return frame.getDocument(launcherId)
}

const getFrame = async () => {
  await page.waitForSelector(`#${launcherId}`)
  return frame.getByName(launcherId)
}

const evaluate = async (script, ...arg) => {
  const frame = await getFrame()
  return frame.evaluate(script, ...arg)
}

const waitForTestId = async (testId, options = { visible: true }) => {
  const frame = await getFrame()
  await frame.waitForSelector(`[data-testid="${testId}"]`, options)
}

const waitForLauncherPill = async ({ isVisible = true } = {}) =>
  await waitForTestId(TEST_IDS.LAUNCHER, { visible: isVisible, timeout: 5000 })

const waitForChatBadge = async ({ isVisible = true } = {}) =>
  await waitForTestId(TEST_IDS.CHAT_BADGE, { visible: isVisible, timeout: 5000 })

const expectIconToBeVisible = async (iconType) => {
  const iconTestid = ((icon) => {
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

const expectLabelToEqual = async (label) => {
  expect(await getLabelText()).toEqual(label)
}

const click = async () => {
  await waitForTestId(launcherId)
  await evaluate(
    (launcherId) => document.querySelector(`[data-testid="${launcherId}"]`).click(),
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
  evaluate,
}
