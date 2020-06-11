const getAccountSettings = async () => {
  await page.evaluate(() => {
    window.zChat.__mock__('getAccountSettings', () => ({
      banner: {
        enabled: true,
        layout: 'image_right',
        text: 'Talk with us',
        image_path: '',
        image_data: ''
      },
      behavior: { do_not_display: false },
      branding: { hide_branding: true, hide_favicon: false, custom_favicon_path: '' },
      bubble: { enabled: true, title: null, text: null },
      chat_button: { hide_when_offline: false },
      chat_window: {
        mobile_mode: 'overlay',
        title_bar: { title: null, status_messages: { online: null, away: null, offline: null } }
      },
      concierge: {
        display_name: null,
        title: null,
        avatar_path: '',
        avatar_data: '',
        greeting: { enabled: false, message: null }
      },
      file_sending: {
        enabled: true,
        file_size_limit: 20971520,
        allowed_extensions: 'png,jpg,jpeg,gif,txt,pdf'
      },
      forms: {
        pre_chat_form: {
          required: true,
          profile_required: false,
          message: 'hello there',
          form: {
            '0': { name: 'name', required: false },
            '1': { name: 'email', required: false },
            '2': {
              label: null,
              name: 'department',
              required: false,
              type: 'department',
              sentence_cased: true
            },
            '3': { label: null, name: 'message', required: false, type: 'textarea' },
            '4': { label: null, name: 'phone', required: false, type: 'text', hidden: false }
          }
        },
        offline_form: {
          message: null,
          message_disabled: null,
          post_submit_message: null,
          profile_required: true,
          form: {
            '0': { name: 'name', required: 1 },
            '1': { name: 'email', required: 1 },
            '2': { label: null, name: 'message', required: 1, type: 'textarea' },
            '3': { label: null, name: 'phone', required: false, type: 'text', hidden: false }
          },
          channels: {
            twitter: { allowed: false, page_id: '' },
            facebook: { allowed: false, page_id: '' }
          }
        },
        post_chat_form: {
          header: null,
          message: null,
          comments_enabled: true,
          comments_messages: {
            good: { message: null, placeholder: null },
            bad: { message: null, placeholder: null }
          }
        }
      },
      greetings: { online: null, offline: null },
      language: { language: null },
      login: {
        allowed_types: { email: true, facebook: true, twitter: false, google: true },
        phone_display: true,
        restrict_profile: false
      },
      rating: { enabled: true },
      sound: { disabled: false },
      theme: {
        name: 'zendesk2019',
        message_type: 'bubble_avatar',
        colors: { placeholder: '_', bubble: '#e59341', banner: '#ffffff', primary: '#3a433b' },
        chat_button: { position: 'br', position_mobile: 'br' },
        chat_window: {
          position: 'br',
          size: 'medium',
          profile_card: { display_avatar: true, display_rating: true, display_title_name: true },
          use_banner: true,
          title_bar: { hide_minimize: false, hide_popout: false }
        },
        branding: { type: 'icon_font_zopim' }
      },
      timezone: 'Australia/Melbourne',
      operating_hours: { display_notice: true }
    }))
  })
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
