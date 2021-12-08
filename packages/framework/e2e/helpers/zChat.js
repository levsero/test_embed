import accountSettings from 'e2e/fixtures/responses/chat-account-settings.json'
import zChat from 'e2e/helpers/zChat'

const getAccountSettings = async () => {
  await page.evaluate((accountSettings) => {
    window.zChat.__mock__('getAccountSettings', () => accountSettings)
  }, accountSettings)
}

const getOperatingHours = async () => {
  await page.evaluate(() => {
    window.zChat.__mock__('getOperatingHours', () => ({
      enabled: false,
      type: 'account',
      timezone: 'Australia/Melbourne',
      account_schedule: {
        0: [{ start: 0, end: 15 }],
        1: [{ start: 0, end: 1440 }],
        2: [{ start: 0, end: 1440 }],
        3: [{ start: 75, end: 1335 }],
        4: [{ start: 60, end: 1350 }],
        5: [{ start: 60, end: 1320 }],
        6: [{ start: 990, end: 1020 }],
      },
    }))
  })
}

const isChatting = async (val = false) => {
  await page.evaluate((v) => {
    window.zChat.__mock__('isChatting', () => v)
  }, val)
}

const endChat = async () => {
  await page.evaluate(() => {
    window.zChat.__mock__('endChat', (cb) => cb())
  })
}

const fireData = async (type, detail) => {
  await page.evaluate(
    (type, detail) => {
      window.zChat.__fire__('data', { type, detail })
    },
    type,
    detail
  )
}

const connectionUpdate = async (val) => await fireData('connection_update', val)
const accountStatus = async (val) => await fireData('account_status', val)
const visitorUpdate = async (val) => await fireData('visitor_update', val)

const onConnectionUpdate = async (status) => {
  await page.evaluate((status) => {
    window.zChat.__fire__('connection_update', status)
  }, status)
}

const chat = async (detail) => {
  await fireData('chat', {
    timestamp: Date.now(),
    type: 'chat.msg',
    ...detail,
  })
}

const agentJoined = async (detail) => {
  await fireData('chat', {
    timestamp: Date.now(),
    type: 'chat.memberjoin',
    ...detail,
  })
}

const chatMemberLeft = async (detail) => {
  await fireData('chat', {
    timestamp: Date.now(),
    type: 'chat.memberleave',
    ...detail,
  })
}

const agentRequestRating = async (detail) => {
  await fireData('chat', {
    timestamp: Date.now(),
    type: 'chat.request.rating',
    ...detail,
  })
}

const rating = async (rating, oldRating) => {
  await fireData('chat', { type: 'chat.rating', new_rating: rating, rating: oldRating })
}

const updateDepartment = async (detail) => {
  await fireData('department_update', {
    ...detail,
  })
}

const online = async () => {
  await getAccountSettings()
  await getOperatingHours()
  await clearVisitorDefaultDepartment()
  await isChatting()
  await zChat.setVisitorInfo()
  await endChat()
  await connectionUpdate('connecting')
  await accountStatus('online')
  await visitorUpdate({ email: '', display_name: 'Visitor 1' })
  await connectionUpdate('connected')
}

const setVisitorInfo = async () => {
  await page.evaluate(() => {
    window.zChat.__mock__('setVisitorInfo', (_info, callback) => {
      callback()
    })
  })
}

const offline = async () => {
  await isChatting(false)
  await accountStatus('offline')
}

const clearVisitorDefaultDepartment = async () => {
  await page.evaluate(() => {
    window.zChat.__mock__('clearVisitorDefaultDepartment', (callback) => {
      document.departmentId = null
      callback()
    })
  })
}

const setVisitorDefaultDepartment = async () => {
  await page.evaluate(() => {
    window.zChat.__mock__('setVisitorDefaultDepartment', (departmentId, callback) => {
      document.departmentId = departmentId
      callback()
    })
  })
}

const mockChatHistory = async () => {
  await page.evaluate(() => {
    window.zChat.__mock__('fetchChatHistory', (cb) => {
      const fireHistoryEvent = (detail) => {
        window.zChat.__fire__('data', { type: 'history', detail })
      }

      fireHistoryEvent({
        display_name: 'Alice Bob',
        first: true,
        nick: 'visitor',
        timestamp: 1586825289167,
        type: 'chat.memberjoin',
      })
      fireHistoryEvent({
        display_name: 'Alice Bob',
        msg: 'help',
        nick: 'visitor',
        options: [],
        timestamp: 1586825289457,
        type: 'chat.msg',
      })
      fireHistoryEvent({
        display_name: 'Alice Bob',
        msg: 'this is a message from visitor',
        nick: 'visitor',
        options: [],
        timestamp: 1586825293248,
        type: 'chat.msg',
      })
      fireHistoryEvent({
        display_name: 'Wayner',
        nick: 'agent:115806148031',
        timestamp: 1586825302265,
        type: 'chat.memberjoin',
      })
      fireHistoryEvent({
        display_name: 'Wayner',
        msg: 'this is a message from agent',
        nick: 'agent:115806148031',
        options: [],
        timestamp: 1586825326042,
        type: 'chat.msg',
      })
      fireHistoryEvent({
        display_name: 'Alice Bob',
        nick: 'visitor',
        reason: 'user_not_alive',
        timestamp: 1586825769415,
        type: 'chat.memberleave',
      })
      fireHistoryEvent({
        display_name: 'Alice Bob',
        first: true,
        nick: 'visitor',
        timestamp: 1586825809367,
        type: 'chat.memberjoin',
      })
      fireHistoryEvent({
        display_name: 'Alice Bob',
        msg: 'second message from visitor',
        nick: 'visitor',
        options: [],
        timestamp: 1586825809657,
        type: 'chat.msg',
      })
      fireHistoryEvent({
        display_name: 'Alice Bob',
        nick: 'visitor',
        reason: 'user_not_alive',
        timestamp: 1586826494816,
        type: 'chat.memberleave',
      })
      cb(null, { count: 9, has_more: false })
    })
  })
}

const expectCurrentDepartmentToBe = async (expectedDepartmentId) => {
  const currentDepartmentId = await page.evaluate(() => {
    return document.departmentId
  })

  await expect(currentDepartmentId).toBe(expectedDepartmentId)
}

const sendOfflineMsg = async () => {
  await page.evaluate(() => {
    window.zChat.__mock__('sendOfflineMsg', (formState, callback) => {
      document.chatOfflineSubmission = formState
      callback()
    })
  })
}

const expectOfflineFormSubmissionToBe = async (expectedFormSubmission) => {
  const currentFormSubmission = await page.evaluate(() => {
    return document.chatOfflineSubmission
  })

  await expect(currentFormSubmission).toEqual(expectedFormSubmission)
}

export default {
  getAccountSettings,
  getOperatingHours,
  isChatting,
  connectionUpdate,
  onConnectionUpdate,
  accountStatus,
  visitorUpdate,
  chat,
  online,
  offline,
  agentJoined,
  chatMemberLeft,
  rating,
  agentRequestRating,
  setVisitorInfo,
  updateDepartment,
  clearVisitorDefaultDepartment,
  setVisitorDefaultDepartment,
  expectCurrentDepartmentToBe,
  sendOfflineMsg,
  expectOfflineFormSubmissionToBe,
  mockChatHistory,
}
