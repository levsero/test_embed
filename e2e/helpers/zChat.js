import accountSettings from 'e2e/fixtures/responses/chat-account-settings.json'

const getAccountSettings = async () => {
  await page.evaluate(accountSettings => {
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
        '0': [{ start: 0, end: 15 }],
        '1': [{ start: 0, end: 1440 }],
        '2': [{ start: 0, end: 1440 }],
        '3': [{ start: 75, end: 1335 }],
        '4': [{ start: 60, end: 1350 }],
        '5': [{ start: 60, end: 1320 }],
        '6': [{ start: 990, end: 1020 }]
      }
    }))
  })
}

const isChatting = async (val = false) => {
  await page.evaluate(v => {
    window.zChat.__mock__('isChatting', () => v)
  }, val)
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

const connectionUpdate = async val => await fireData('connection_update', val)
const accountStatus = async val => await fireData('account_status', val)
const visitorUpdate = async val => await fireData('visitor_update', val)

const chat = async detail => {
  await fireData('chat', {
    timestamp: Date.now(),
    type: 'chat.msg',
    ...detail
  })
}

const agentJoined = async detail => {
  await fireData('chat', {
    timestamp: Date.now(),
    type: 'chat.memberjoin',
    ...detail
  })
}

const chatMemberLeft = async detail => {
  await fireData('chat', {
    timestamp: Date.now(),
    type: 'chat.memberleave',
    ...detail
  })
}

const agentRequestRating = async detail => {
  await fireData('chat', {
    timestamp: Date.now(),
    type: 'chat.request.rating',
    ...detail
  })
}

const rating = async (rating, oldRating) => {
  await fireData('chat', { type: 'chat.rating', new_rating: rating, rating: oldRating })
}

const updateDepartment = async detail => {
  await fireData('department_update', {
    ...detail
  })
}

const online = async () => {
  await getAccountSettings()
  await getOperatingHours()
  await clearVisitorDefaultDepartment()
  await isChatting()
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
    window.zChat.__mock__('clearVisitorDefaultDepartment', callback => {
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

const expectCurrentDepartmentToBe = async expectedDepartmentId => {
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

const expectOfflineFormSubmissionToBe = async expectedFormSubmission => {
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
  expectOfflineFormSubmissionToBe
}
