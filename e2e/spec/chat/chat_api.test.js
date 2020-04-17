import loadWidget from 'e2e/helpers/widget-page'
import zChat from 'e2e/helpers/zChat'
import { queries } from 'pptr-testing-library'
import launcher from 'e2e/helpers/launcher'
import widget from '../../helpers/widget'

import {
  loadWidgetWithChatOnline,
  clickStartChat,
  agentJoinsChat,
  visitorLeavesChat,
  sendMessageFromAgent,
  waitForChatToBeReady,
  waitForPrechatForm
} from 'e2e/helpers/chat-embed'

//   WidgetChatPage.within do
//     expect(page).to have_content('Chat ended')
//   end
// await jestPuppeteer.debug()

const getChatReady = async () => {
  await loadWidgetWithChatOnline()
  await clickStartChat()
  await waitForChatToBeReady()
}

const getChatReadyAndEvaluate = async cb => {
  await loadWidget()
    .withPresets('chat')
    .hiddenInitially()
    .evaluateAfterSnippetLoads(cb)
    .load()

  await zChat.online()
  await launcher.click()
  await waitForPrechatForm()
}

describe('Chat API tests', () => {
  test('chat:send sends a chat message', async () => {
    await getChatReady()

    await page.evaluate(() => {
      zE('webWidget', 'chat:send', 'The Screaming Mimi')
    })

    expect(await queries.queryByText(await widget.getDocument(), 'The Screaming Mimi')).toBeTruthy()
  })

  test('chat:isChatting shows a chat has not started', async () => {
    await getChatReady()

    const isChatting = await page.evaluate(() => zE('webWidget:get', 'chat:isChatting'))

    expect(isChatting).toBeFalsy()
  })

  test('chat:isChatting shows a chat is in progress', async () => {
    await getChatReady()
    await agentJoinsChat('Cody Allen')

    const isChatting = await page.evaluate(() => zE('webWidget:get', 'chat:isChatting'))

    expect(isChatting).toBeTruthy()
  })

  test('chat:department returns details about a department by passing an ID', async () => {
    await getChatReady()

    await zChat.updateDepartment({ status: 'online', id: 1984, name: 'Ebb Tide' })

    const department = await page.evaluate(() => zE('webWidget:get', 'chat:department', 1984))

    expect(department).toEqual({ status: 'online', id: 1984, name: 'Ebb Tide' })
  })

  test('chat:department returns details about a department by passing a name', async () => {
    await getChatReady()

    await zChat.updateDepartment({ status: 'online', id: 1984, name: 'Ebb Tide' })

    const department = await page.evaluate(() => zE('webWidget:get', 'chat:department', 'Ebb Tide'))

    expect(department).toEqual({ status: 'online', id: 1984, name: 'Ebb Tide' })
  })

  test('chat:departments returns all departments for an account', async () => {
    await getChatReady()

    await zChat.updateDepartment({ status: 'online', id: 3, name: 'Pier 56' })
    await zChat.updateDepartment({ status: 'online', id: 58, name: 'Riptide' })

    const departments = await page.evaluate(() => zE('webWidget:get', 'chat:departments'))

    expect(departments).toEqual([
      { status: 'online', id: 3, name: 'Pier 56' },
      { status: 'online', id: 58, name: 'Riptide' }
    ])
  })

  test('chat:end ends a chat', async () => {
    await getChatReady()
    await agentJoinsChat('Murray Bozinsky')
    await visitorLeavesChat('Visitor 1')

    await page.evaluate(() => zE('webWidget', 'chat:end'))

    expect(await queries.queryByText(await widget.getDocument(), 'Chat ended')).toBeTruthy()
  })

  test('on chat:connected shows a chat connection has been successful', async () => {
    await getChatReadyAndEvaluate(() => {
      zE('webWidget:on', 'chat:connected', () => {
        window.onChatConnectedCalled = true
      })
    })

    await agentJoinsChat('Cody Allen')
    const result = await page.evaluate(() => window.onChatConnectedCalled)

    expect(result).toEqual(true)
  })

  test('on chat:start shows a chat has, well, started', async () => {
    await getChatReadyAndEvaluate(() => {
      zE('webWidget:on', 'chat:start', () => {
        window.onChatStartCalled = true
      })
    })

    await agentJoinsChat('Cody Allen')
    const result = await page.evaluate(() => window.onChatStartCalled)

    expect(result).toEqual(true)
  })

  test('on chat:status calls a function when the status changes', async () => {
    let result

    await getChatReadyAndEvaluate(() => {
      zE('webWidget:on', 'chat:status', status => {
        window.chatStatus = status
      })
    })

    await zChat.online()
    result = await page.evaluate(() => window.chatStatus)

    expect(result).toEqual('online')

    await zChat.offline()
    result = await page.evaluate(() => window.chatStatus)

    expect(result).toEqual('offline')
  })

  test('on chat:departmentStatus calls a function when department status changes', async () => {
    let result

    await getChatReadyAndEvaluate(() => {
      zE('webWidget:on', 'chat:departmentStatus', dept => {
        window.departmentStatus = dept.status
      })
    })

    await zChat.updateDepartment({ status: 'online', id: 1984, name: 'Ebb Tide' })
    result = await page.evaluate(() => window.departmentStatus)
    expect(result).toEqual('online')

    await zChat.updateDepartment({ status: 'offline', id: 1984, name: 'Ebb Tide' })
    result = await page.evaluate(() => window.departmentStatus)
    expect(result).toEqual('offline')
  })

  test('on chat:unreadMessages returns the number of unread messages', async () => {
    let result

    await getChatReadyAndEvaluate(() => {
      zE('webWidget:on', 'chat:unreadMessages', number => {
        window.unreadMessageNumber = number
      })
    })

    await agentJoinsChat('Cody Allen')

    await sendMessageFromAgent('Cody Allen', "It's the Riptide!")
    result = await page.evaluate(() => window.unreadMessageNumber)
    expect(result).toEqual(1)
  })
})
