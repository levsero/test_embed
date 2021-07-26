import { openChattingScreenAndEvaluate } from 'e2e/helpers/chat-embed'
import zChat from 'e2e/helpers/zChat'

test('on chat:departmentStatus calls a function when department status changes', async () => {
  let result

  await openChattingScreenAndEvaluate(() => {
    zE('webWidget:on', 'chat:departmentStatus', (dept) => {
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
