import zChat from 'e2e/helpers/zChat'
import { getChatReady } from 'e2e/helpers/chat-embed'

test('chat:department returns details about a department by passing an ID', async () => {
  await getChatReady()

  await zChat.updateDepartment({ status: 'online', id: 1984, name: 'Ebb Tide' })

  const department = await page.evaluate(() => $zopim.livechat.departments.getDepartment(1984))

  expect(department).toEqual({ status: 'online', id: 1984, name: 'Ebb Tide' })
})

test('chat:department returns details about a department by passing a name', async () => {
  await getChatReady()

  await zChat.updateDepartment({ status: 'online', id: 1984, name: 'Ebb Tide' })

  const department = await page.evaluate(() =>
    $zopim.livechat.departments.getDepartment('Ebb Tide')
  )

  expect(department).toEqual({ status: 'online', id: 1984, name: 'Ebb Tide' })
})
