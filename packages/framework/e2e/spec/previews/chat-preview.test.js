import events from 'e2e/fixtures/chat-preview-events'
import preview, { loadPreview } from 'e2e/helpers/chat-preview'
import widget from 'e2e/helpers/widget'
import { queries, wait } from 'pptr-testing-library'
import { OFFLINE_FORM_SCREENS } from 'src/constants/chat'
import { CHAT_BADGE } from 'src/constants/preview'
import { TEST_IDS } from 'src/constants/shared'
import * as constants from 'src/redux/modules/chat/chat-screen-types'

beforeEach(async () => {
  await loadPreview()
  await page.evaluate((events) => {
    events.forEach((event) => {
      window.preview.updateChatState(event)
    })
  }, events)
})

test('renders chat log', async () => {
  await preview.updateScreen(constants.CHATTING_SCREEN)
  const doc = await preview.getDocument()
  expect(await queries.queryByText(doc, 'Chat with us')).toBeTruthy()
  expect(await queries.queryByText(doc, 'Chat started')).toBeTruthy()
  expect(await queries.queryByText(doc, 'hey there')).toBeTruthy()
  expect(await queries.queryByText(doc, 'Briana Coppard joined the chat')).toBeTruthy()
  const els = await queries.queryAllByText(doc, 'Briana Coppard')
  expect(els.length).toEqual(2)
  expect(await queries.queryByText(doc, 'hey to you too')).toBeTruthy()
})

test('renders prechat screen', async () => {
  await preview.updateScreen(constants.PRECHAT_SCREEN)
  const doc = await preview.getDocument()
  expect(await queries.queryByLabelText(doc, 'Choose a department (optional)')).toBeTruthy()
  expect(await queries.queryByLabelText(doc, 'Message (optional)')).toBeTruthy()
  expect(await queries.queryByText(doc, 'Chat with us')).toBeTruthy()
  expect(await queries.queryByText(doc, 'Start chat')).toBeTruthy()
  const dropdown = await queries.getByRole(doc, 'button', { name: 'department' })
  await dropdown.click()
  await widget.waitForText('Dept 1')
})

test('renders offline screen', async () => {
  await preview.updateScreen(OFFLINE_FORM_SCREENS.MAIN)
  const doc = await preview.getDocument()
  expect(await queries.queryByText(doc, 'Sorry, we are not online at the moment')).toBeTruthy()
})

test('renders chat badge', async () => {
  await preview.updateScreen(CHAT_BADGE)
  const doc = await preview.getLauncherDocument()
  await wait(async () => {
    expect(await queries.queryByText(doc, 'Chat with us')).toBeTruthy()
  })
  expect(await queries.queryByText(doc, 'zendesk chat')).toBeTruthy()
  expect(await queries.queryByPlaceholderText(doc, 'Type your message here')).toBeTruthy()
})

test('updateLocale updates the translations', async () => {
  await page.evaluate(() => window.preview.updateLocale('fr'))
  await preview.updateScreen(OFFLINE_FORM_SCREENS.MAIN)
  await wait(async () => {
    const doc = await preview.getDocument()
    expect(
      await queries.queryByText(doc, 'Désolés, nous ne sommes pas en ligne actuellement')
    ).toBeTruthy()
  })
  await preview.updateScreen(CHAT_BADGE)
  await page.waitForSelector('iframe#launcher', { visible: true })
  await wait(async () => {
    const launcher = await preview.getLauncherDocument()
    expect(await queries.queryByPlaceholderText(launcher, 'Saisir un message ici')).toBeTruthy()
  })
})

test('setColor updates the color of the preview widget and badge', async () => {
  await page.evaluate(() => window.preview.setColor('#00FFFF'))
  await preview.updateScreen(constants.PRECHAT_SCREEN)
  const headerColor = await preview.evaluate(
    () => getComputedStyle(document.querySelector('h1').parentElement.parentElement).backgroundColor
  )
  expect(headerColor).toEqual('rgb(0, 255, 255)')
  await preview.updateScreen(CHAT_BADGE)
  await page.waitForSelector('iframe#launcher', { visible: true })
  const badgeColor = await preview
    .getLauncherFrame()
    .evaluate(
      (testId) =>
        getComputedStyle(document.querySelector(`div[data-testid="${testId}"] > button`))
          .backgroundColor,
      TEST_IDS.CHAT_BADGE
    )
  expect(badgeColor).toEqual('rgb(0, 255, 255)')
})

describe('updateSettings', () => {
  test('updates settings for chat badge', async () => {
    await preview.updateScreen(CHAT_BADGE)
    await page.evaluate(() => {
      window.preview.updateSettings({
        banner: {
          enabled: true,
          layout: 'image_left',
          text: 'hello world',
        },
      })
    })
    const launcher = await preview.getLauncherDocument()
    expect(await queries.queryByText(launcher, 'hello world')).toBeTruthy()
  })

  test('updates settings for widget', async () => {
    await page.evaluate(() => {
      window.preview.updateSettings({
        forms: {
          pre_chat_form: {
            required: true,
            profile_required: false,
            message: 'test here',
            form: {
              0: {
                name: 'name',
                required: false,
              },
              1: {
                name: 'email',
                required: true,
              },
              2: {
                label: 'Department',
                name: 'department',
                required: false,
                type: 'department',
              },
              3: {
                label: null,
                name: 'message',
                required: false,
                type: 'textarea',
              },
              4: {
                label: null,
                name: 'phone',
                required: false,
                type: 'text',
                hidden: true,
              },
            },
          },
        },
      })
    })
    await preview.updateScreen(constants.PRECHAT_SCREEN)
    const doc = await preview.getDocument()
    expect(await queries.queryByLabelText(doc, 'Name (optional)')).toBeTruthy()
    expect(await queries.queryByLabelText(doc, 'Email')).toBeTruthy()
    expect(await queries.queryByLabelText(doc, 'Department (optional)')).toBeTruthy()
    expect(await queries.queryByLabelText(doc, 'Message (optional)')).toBeTruthy()
    expect(await queries.queryByText(doc, 'test here')).toBeTruthy()
  })
})
