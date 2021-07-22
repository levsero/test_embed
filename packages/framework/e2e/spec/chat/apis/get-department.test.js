import { openChattingScreen } from 'e2e/helpers/chat-embed'
import zChat from 'e2e/helpers/zChat'

test('chat:department returns details about a department by passing an ID', async () => {
  await openChattingScreen()

  await zChat.updateDepartment({ status: 'online', id: 1984, name: 'Ebb Tide' })

  const department = await page.evaluate(() => zE('webWidget:get', 'chat:department', 1984))

  expect(department).toEqual({ status: 'online', id: 1984, name: 'Ebb Tide' })
})

test('chat:department returns details about a department by passing a name', async () => {
  await openChattingScreen()

  await zChat.updateDepartment({ status: 'online', id: 1984, name: 'Ebb Tide' })

  const department = await page.evaluate(() => zE('webWidget:get', 'chat:department', 'Ebb Tide'))

  expect(department).toEqual({ status: 'online', id: 1984, name: 'Ebb Tide' })
})
