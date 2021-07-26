import { waitForPrechatForm, clickStartChat } from 'e2e/helpers/chat-embed'
import launcher from 'e2e/helpers/launcher'
import { DEFAULT_CORS_HEADERS, mockCorsRequest } from 'e2e/helpers/utils'
import widget from 'e2e/helpers/widget'
import loadWidget from 'e2e/helpers/widget-page'
import zChat from 'e2e/helpers/zChat'
import { queries } from 'pptr-testing-library'

const buildWidget = async () => {
  const authenticateEndpoint = jest.fn()
  await loadWidget()
    .withPresets('chat')
    .dontWaitForLauncherToLoad()
    .evaluateBeforeSnippetLoads(() => {
      window.zESettings = {
        authenticate: {
          chat: {
            jwtFn: (cb) => cb('abc123'),
          },
        },
      }
    })
    .intercept(mockAuthSuccessEndpoint(authenticateEndpoint))
    .load()
  return authenticateEndpoint
}

const mockAuthSuccessEndpoint = (callback) => {
  return mockCorsRequest('authenticated/web/jwt', (request) => {
    callback(request.url())
    request.respond({
      status: 200,
      headers: DEFAULT_CORS_HEADERS,
      contentType: 'application/json',
      body: JSON.stringify({
        expires_in: 7200,
        error: null,
        success: true,
      }),
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
    await zChat.mockChatHistory()
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
    await zChat.mockChatHistory()
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
