import { queries, wait } from 'pptr-testing-library'
import preview, { loadPreview } from 'e2e/helpers/chat-preview'
import * as constants from 'src/redux/modules/chat/chat-screen-types'
import { OFFLINE_FORM_SCREENS } from 'src/constants/chat'
import { CHAT_BADGE } from 'src/constants/preview'
import { TEST_IDS } from 'src/constants/shared'
import widget from 'e2e/helpers/widget'

const events = [
  { type: 'account_status', detail: 'online' },
  { type: 'visitor_update', detail: { email: '', display_name: 'Visitor 85153315' } },
  { type: 'connection_update', detail: 'connected' },
  { type: 'department_update', detail: { status: 'online', id: 1, name: 'Dept 1' } },
  {
    type: 'chat',
    detail: {
      timestamp: 1525325772386,
      nick: 'visitor',
      type: 'chat.memberjoin',
      display_name: 'Visitor 1525325771'
    }
  },
  {
    type: 'chat',
    detail: {
      timestamp: 1525325926444,
      nick: 'visitor',
      type: 'chat.msg',
      display_name: 'Visitor 1525325926',
      msg: 'hey there'
    }
  },
  {
    type: 'chat',
    detail: {
      timestamp: 1525325936518,
      nick: 'agent:1689357',
      type: 'chat.memberjoin',
      display_name: 'Briana Coppard'
    }
  },
  {
    type: 'chat',
    detail: {
      timestamp: 1525325939026,
      nick: 'agent:1689357',
      type: 'chat.msg',
      display_name: 'Briana Coppard',
      msg: 'hey to you too'
    }
  },
  {
    type: 'agent_update',
    detail: {
      avatar_path:
        'https://v2assets.zopim.io/2EkTn0An31opxOLXuGgRCy5nPnSNmpe6-agents-1689357?1524707165289',
      display_name: 'Briana Coppard',
      title: 'Customer Service',
      nick: 'agent:1689357'
    }
  }
]

beforeEach(async () => {
  await loadPreview()
  await page.evaluate(events => {
    events.forEach(event => {
      window.preview.updateChatState(event)
    })
  }, events)
})

const goTo = screen => page.evaluate(screen => window.preview.updateScreen(screen), screen)

test('renders chat log', async () => {
  await goTo(constants.CHATTING_SCREEN)
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
  await goTo(constants.PRECHAT_SCREEN)
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
  await goTo(OFFLINE_FORM_SCREENS.MAIN)
  const doc = await preview.getDocument()
  expect(await queries.queryByText(doc, 'Sorry, we are not online at the moment')).toBeTruthy()
})

test('renders chat badge', async () => {
  await goTo(CHAT_BADGE)
  const doc = await preview.getLauncherDocument()
  await wait(async () => {
    expect(await queries.queryByText(doc, 'Chat with us')).toBeTruthy()
  })
  expect(await queries.queryByText(doc, 'zendesk chat')).toBeTruthy()
  expect(await queries.queryByPlaceholderText(doc, 'Type your message here')).toBeTruthy()
})

test('updateLocale updates the translations', async () => {
  await page.evaluate(() => window.preview.updateLocale('fr'))
  await goTo(OFFLINE_FORM_SCREENS.MAIN)
  const doc = await preview.getDocument()
  expect(
    await queries.queryByText(doc, 'Désolés, nous ne sommes pas en ligne actuellement')
  ).toBeTruthy()
  await goTo(CHAT_BADGE)
  await page.waitForSelector('iframe#launcher', { visible: true })
  const launcher = await preview.getLauncherDocument()
  expect(await queries.queryByPlaceholderText(launcher, 'Saisir un message ici')).toBeTruthy()
})

test('setColor updates the color of the preview widget and badge', async () => {
  await page.evaluate(() => window.preview.setColor('#00FFFF'))
  await goTo(constants.PRECHAT_SCREEN)
  const headerColor = await preview.evaluate(
    () => getComputedStyle(document.querySelector('h1').parentElement.parentElement).backgroundColor
  )
  expect(headerColor).toEqual('rgb(0, 255, 255)')
  await goTo(CHAT_BADGE)
  await page.waitForSelector('iframe#launcher', { visible: true })
  const badgeColor = await preview
    .getLauncherFrame()
    .evaluate(
      testId =>
        getComputedStyle(document.querySelector(`div[data-testid="${testId}"]`)).backgroundColor,
      TEST_IDS.CHAT_BADGE
    )
  expect(badgeColor).toEqual('rgb(0, 255, 255)')
})

describe('updateSettings', () => {
  test('updates settings for chat badge', async () => {
    await goTo(CHAT_BADGE)
    await page.evaluate(() => {
      window.preview.updateSettings({
        banner: {
          enabled: true,
          layout: 'image_left',
          text: 'hello world'
        }
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
              '0': {
                name: 'name',
                required: false
              },
              '1': {
                name: 'email',
                required: true
              },
              '2': {
                label: 'Department',
                name: 'department',
                required: false,
                type: 'department'
              },
              '3': {
                label: null,
                name: 'message',
                required: false,
                type: 'textarea'
              },
              '4': {
                label: null,
                name: 'phone',
                required: false,
                type: 'text',
                hidden: true
              }
            }
          }
        }
      })
    })
    await goTo(constants.PRECHAT_SCREEN)
    const doc = await preview.getDocument()
    expect(await queries.queryByLabelText(doc, 'Name (optional)')).toBeTruthy()
    expect(await queries.queryByLabelText(doc, 'Email')).toBeTruthy()
    expect(await queries.queryByLabelText(doc, 'Department (optional)')).toBeTruthy()
    expect(await queries.queryByLabelText(doc, 'Message (optional)')).toBeTruthy()
    expect(await queries.queryByText(doc, 'test here')).toBeTruthy()
  })
})
