import loadWidget from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'
import { queries } from 'pptr-testing-library'
import zChat from 'e2e/helpers/zChat'
import { DEFAULT_CORS_HEADERS, mockCorsRequest } from 'e2e/helpers/utils'
import { waitForPrechatForm, clickStartChat } from 'e2e/helpers/chat-embed'

const buildWidget = async () => {
  const authenticateEndpoint = jest.fn()
  await loadWidget()
    .withPresets('chat')
    .hiddenInitially()
    .evaluateBeforeSnippetLoads(() => {
      window.zESettings = {
        authenticate: {
          chat: {
            jwtFn: cb => cb('abc123')
          }
        }
      }
    })
    .intercept(mockAuthSuccessEndpoint(authenticateEndpoint))
    .load()
  return authenticateEndpoint
}

const mockAuthSuccessEndpoint = callback => {
  return mockCorsRequest('authenticated/web/jwt', request => {
    callback(request.url())
    request.respond({
      status: 200,
      headers: DEFAULT_CORS_HEADERS,
      contentType: 'application/json',
      body: JSON.stringify({
        expires_in: 7200,
        error: null,
        success: true
      })
    })
  })
}

test('authentication endpoint is called', async () => {
  const authenticateEndpoint = await buildWidget()
  await zChat.online()
  await launcher.waitForLauncherPill()
  expect(authenticateEndpoint).toHaveBeenCalled()
})

test('name and email are not editable', async () => {
  await buildWidget()
  await zChat.online()
  await launcher.waitForLauncherPill()
  await launcher.click()
  await waitForPrechatForm()
  await widget.expectToSeeText('Your profile:')
  await widget.expectToSeeText('Visitor 1')

  const doc = await widget.getDocument()
  expect(await queries.queryByLabelText(doc, 'Name (optional)')).toBeFalsy()
  expect(await queries.queryByLabelText(doc, 'Email (optional)')).toBeFalsy()
})

const mockChatHistory = async () => {
  await page.evaluate(() => {
    window.zChat.__mock__('fetchChatHistory', cb => {
      const fireHistoryEvent = detail => {
        window.zChat.__fire__('data', { type: 'history', detail })
      }

      fireHistoryEvent({
        display_name: 'Alice Bob',
        first: true,
        nick: 'visitor',
        timestamp: 1586825289167,
        type: 'chat.memberjoin'
      })
      fireHistoryEvent({
        display_name: 'Alice Bob',
        msg: 'help',
        nick: 'visitor',
        options: [],
        timestamp: 1586825289457,
        type: 'chat.msg'
      })
      fireHistoryEvent({
        display_name: 'Alice Bob',
        msg: 'this is a message from visitor',
        nick: 'visitor',
        options: [],
        timestamp: 1586825293248,
        type: 'chat.msg'
      })
      fireHistoryEvent({
        display_name: 'Wayner',
        nick: 'agent:115806148031',
        timestamp: 1586825302265,
        type: 'chat.memberjoin'
      })
      fireHistoryEvent({
        display_name: 'Wayner',
        msg: 'this is a message from agent',
        nick: 'agent:115806148031',
        options: [],
        timestamp: 1586825326042,
        type: 'chat.msg'
      })
      fireHistoryEvent({
        display_name: 'Alice Bob',
        nick: 'visitor',
        reason: 'user_not_alive',
        timestamp: 1586825769415,
        type: 'chat.memberleave'
      })
      fireHistoryEvent({
        display_name: 'Alice Bob',
        first: true,
        nick: 'visitor',
        timestamp: 1586825809367,
        type: 'chat.memberjoin'
      })
      fireHistoryEvent({
        display_name: 'Alice Bob',
        msg: 'second message from visitor',
        nick: 'visitor',
        options: [],
        timestamp: 1586825809657,
        type: 'chat.msg'
      })
      fireHistoryEvent({
        display_name: 'Alice Bob',
        nick: 'visitor',
        reason: 'user_not_alive',
        timestamp: 1586826494816,
        type: 'chat.memberleave'
      })
      cb(null, { count: 9, has_more: false })
    })
  })
}

const assertPastChatsVisible = async () => {
  await widget.expectToSeeText('14 April 2020, 00:48')
  await widget.expectToSeeText('this is a message from visitor')
  await widget.expectToSeeText('Wayner joined the chat')
  await widget.expectToSeeText('Wayner')
  await widget.expectToSeeText('this is a message from agent')
  await widget.expectToSeeText('14 April 2020, 00:56')
  await widget.expectToSeeText('second message from visitor')
}

describe('view past chats', () => {
  beforeEach(async () => {
    await buildWidget()
    await mockChatHistory()
    await zChat.online()
    await launcher.waitForLauncherPill()
    await launcher.click()
    await waitForPrechatForm()
    await widget.clickText('View past chats')
  })

  test('shows past chats', async () => {
    await assertPastChatsVisible()
  })

  test('chat input box is not available', async () => {
    const doc = await widget.getDocument()
    expect(await queries.queryByPlaceholderText(doc, 'Type a message here...')).toBeFalsy()
  })

  test('can navigate back to prechat form', async () => {
    await widget.clickBack()
    await widget.expectToSeeText('Your profile:')
    await widget.expectToSeeText('Visitor 1')
  })
})

describe('start chat', () => {
  beforeEach(async () => {
    await buildWidget()
    await mockChatHistory()
    await zChat.online()
    await launcher.waitForLauncherPill()
    await launcher.click()
    await waitForPrechatForm()
    await clickStartChat()
  })

  test('shows past chats', async () => {
    await assertPastChatsVisible()
  })

  test('chat input box is available', async () => {
    const doc = await widget.getDocument()
    expect(await queries.queryByPlaceholderText(doc, 'Type a message here...')).toBeTruthy()
  })
})
