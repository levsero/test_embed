import _ from 'lodash'
import {
  API_ON_CHAT_CONNECTED_NAME,
  API_ON_CHAT_START_NAME,
  API_ON_CHAT_END_NAME,
  API_ON_CHAT_UNREAD_MESSAGES_NAME,
  API_ON_CLOSE_NAME,
  API_ON_OPEN_NAME,
} from 'src/constants/api'
import { updateActiveEmbed } from 'src/redux/modules/base'
import { getWebWidgetOpen } from 'src/redux/modules/base/base-selectors'
import { setStatusForcefully, setVisitorInfo } from 'src/redux/modules/chat'
import { getCanShowOnlineChat } from 'src/redux/modules/chat/chat-selectors'
import { getDelayChatConnection } from 'src/redux/modules/selectors/chat-linked-selectors'
import {
  endChatApi,
  sendChatMsgApi,
  openApi,
  closeApi,
  toggleApi,
  hideApi,
  showApi,
  isChattingApi,
  prefill,
  updatePathApi,
  logoutApi,
  onApiObj,
  getDepartmentApi,
  getAllDepartmentsApi,
  popoutApi,
  setLocaleApi,
  addTagsApi,
  removeTagsApi,
} from 'src/service/api/apis'
import { settings } from 'src/service/settings'
import tracker from 'src/service/tracker'
import { nameValid, emailValid, phoneValid } from 'src/util/utils'
import { onChatConnected, onChatSDKInitialized } from './callbacks'
import {
  setPositionApi,
  setOffsetApi,
  updateSettings,
  setOffsetMobileApi,
  setProfileCardConfigApi,
  setApi,
  setGreetingsApi,
  setOnStatusApi,
  showBadgeApi,
  hideBadgeApi,
} from './helpers'

const noop = () => {}

export function setUpZopimApiMethods(win, store) {
  win.$zopim = win.$zopim || {}

  if (_.isUndefined(win.$zopim.livechat)) {
    const onApis = onApiObj()
    const { setOffsetVertical, setOffsetHorizontal } = setOffsetApi(store)

    win.$zopim.livechat = {
      authenticate: ({ jwtFn }) => settings.storeChatAuth(jwtFn),
      cookieLaw: {
        comply: noop,
        showPrivacyPanel: noop,
        setDefaultImplicitConsent: () => updateSettings(store, 'cookies', false),
      },
      unreadflag: {
        enable: noop,
        disable: noop,
      },
      window: {
        toggle: () => toggleApi(store),
        hide: () => hideApi(store),
        show: () => {
          if (getDelayChatConnection(store.getState())) {
            showApi(store)
            openApi(store)
            store.dispatch(updateActiveEmbed('chat'))
          } else {
            onChatConnected(() => {
              showApi(store)
              openApi(store)
              if (getCanShowOnlineChat(store.getState())) {
                store.dispatch(updateActiveEmbed('chat'))
              }
            })
          }
        },
        setSize: noop,
        getDisplay: () => getWebWidgetOpen(store.getState()),
        onHide: (callback) => onApis[API_ON_CLOSE_NAME](store, callback),
        onShow: (callback) => onApis[API_ON_OPEN_NAME](store, callback),
        setTitle: (title) => updateSettings(store, 'webWidget.chat.title.*', title),
        setColor: (color) => updateSettings(store, 'webWidget.color.theme', color),
        openPopout: () => onChatConnected(() => popoutApi(store)),
        setPosition: setPositionApi(store),
        setOffsetHorizontal,
        setOffsetVertical,
        setOffsetBottom: setOffsetVertical,
        setBg: noop,
        getSettings: noop,
      },
      badge: {
        hide: () => hideBadgeApi(store),
        show: () => {
          showBadgeApi(store)
          showApi(store)
        },
        setColor: (color) => updateSettings(store, 'webWidget.color.launcher', color),
        setText: (text) => updateSettings(store, 'webWidget.launcher.badge.label.*', text),
        setImage: (image) => updateSettings(store, 'webWidget.launcher.badge.image', image),
        setLayout: (layout) => updateSettings(store, 'webWidget.launcher.badge.layout', layout),
      },
      prechatForm: {
        setGreetings: (msg) => updateSettings(store, 'webWidget.chat.prechatForm.greeting.*', msg),
      },
      offlineForm: {
        setGreetings: (msg) => updateSettings(store, 'webWidget.chat.offlineForm.greeting.*', msg),
      },
      button: {
        hide: () => hideApi(store),
        show: () => {
          showApi(store)
          closeApi(store)
        },
        setHideWhenOffline: (bool) => updateSettings(store, 'webWidget.chat.hideWhenOffline', bool),
        setPosition: setPositionApi(store),
        setPositionMobile: setPositionApi(store),
        setColor: (color) => updateSettings(store, 'webWidget.color.launcher', color),
        setOffsetVertical,
        setOffsetHorizontal,
        ...setOffsetMobileApi(store),
        setOffsetBottom: setOffsetVertical,
        useFavicon: noop,
        setTheme: noop,
        setImage: noop,
      },
      theme: {
        setColor: (color) => updateSettings(store, 'webWidget.color.theme', color),
        setColors: (options) => {
          if (!options.primary) return

          updateSettings(store, 'webWidget.color.theme', options.primary)
        },
        reload: noop,
        setProfileCardConfig: setProfileCardConfigApi(store),
        setFontConfig: noop,
        setTheme: noop,
      },
      mobileNotifications: {
        setDisabled: (bool) =>
          updateSettings(store, 'webWidget.chat.notifications.mobile.disable', bool),
        setIgnoreChatButtonVisibility: noop,
      },
      departments: {
        setLabel: (label) =>
          onChatConnected(() => {
            updateSettings(store, 'webWidget.chat.prechatForm.departmentLabel.*', label)
          }),
        getDepartment: (id) => getDepartmentApi(store, id),
        getAllDepartments: () => getAllDepartmentsApi(store),
        filter: (...deps) =>
          onChatConnected(() => {
            updateSettings(store, 'webWidget.chat.departments.enabled', [...deps])
          }),
        setVisitorDepartment: (nameOrId) =>
          onChatConnected(() => {
            updateSettings(store, 'webWidget.chat.departments.select', nameOrId)
          }),
        clearVisitorDepartment: () =>
          onChatConnected(() => {
            updateSettings(store, 'webWidget.chat.departments.select', '')
          }),
      },
      concierge: {
        setAvatar: (path) => updateSettings(store, 'webWidget.chat.concierge.avatarPath', path),
        setName: (name) => updateSettings(store, 'webWidget.chat.concierge.name', name),
        setTitle: (title) => updateSettings(store, 'webWidget.chat.concierge.title.*', title),
      },
      setColor: (color) => updateSettings(store, 'webWidget.color.theme', color),
      hideAll: () => hideApi(store),
      set: (options) => onChatSDKInitialized(() => setApi(win, options)),
      isChatting: () => isChattingApi(store),
      say: (msg) => sendChatMsgApi(store, msg),
      endChat: () => endChatApi(store),
      addTags: addTagsApi(store),
      removeTags: removeTagsApi(store),
      setName: (name) => {
        if (nameValid(name)) {
          onChatSDKInitialized(() => {
            store.dispatch(
              setVisitorInfo({ visitor: { display_name: name }, identifier: 'zopim api' })
            ) // eslint-disable-line camelcase

            prefill(store, { name: { value: name } })
          })
        } else {
          console.warn(`invalid name passed into setName: ${name}`) // eslint-disable-line no-console
        }
      },
      setPhone: (phone) => {
        if (phoneValid(phone)) {
          onChatSDKInitialized(() => {
            store.dispatch(setVisitorInfo({ visitor: { phone }, identifier: 'zopim api' }))
            prefill(store, { phone: { value: phone } })
          })
        } else {
          console.warn(`invalid phone number passed into setPhone: ${phone}`) // eslint-disable-line no-console
        }
      },
      setEmail: (email) => {
        if (emailValid(email)) {
          onChatSDKInitialized(() => {
            store.dispatch(setVisitorInfo({ visitor: { email }, identifier: 'zopim api' }))
            prefill(store, { email: { value: email } })
          })
        } else {
          console.warn(`invalid email passed into setEmail: ${email}`) // eslint-disable-line no-console
        }
      },
      setLanguage: (locale) => setLocaleApi(store, locale),
      sendVisitorPath: (page) => updatePathApi(store, page),
      clearAll: () => onChatSDKInitialized(() => logoutApi(store)),
      setStatus: (status) => {
        if (status !== 'online' && status !== 'offline') return

        store.dispatch(setStatusForcefully(status))
      },
      setDisableGoogleAnalytics: (bool) => updateSettings(store, 'webWidget.analytics', !bool),
      setGreetings: (greeting) => setGreetingsApi(store, greeting),
      setOnConnected: (callback) => onApis.chat[API_ON_CHAT_CONNECTED_NAME](store, callback),
      setOnChatStart: (callback) => onApis.chat[API_ON_CHAT_START_NAME](store, callback),
      setOnChatEnd: (callback) => onApis.chat[API_ON_CHAT_END_NAME](store, callback),
      setOnStatus: (callback) => setOnStatusApi(store, callback),
      setOnUnreadMsgs: (callback) => onApis.chat[API_ON_CHAT_UNREAD_MESSAGES_NAME](store, callback),
      bubble: {
        show: noop,
        setTitle: noop,
        setText: noop,
        setImage: noop,
        setColor: noop,
        reset: noop,
        hide: noop,
      },
      getName: noop,
      getEmail: noop,
      getPhone: noop,
      setNotes: noop,
      appendNotes: noop,
      setOnGreeting: noop,
      setOnFlashReady: noop,
      setDisableSound: noop,
      freeze: noop,
      fire: noop,
    }

    instrumentZopimApis(win)
  }
}

function instrumentZopimApis(win) {
  tracker.addTo(win.$zopim.livechat.theme, '$zopim.livechat.theme')
  tracker.addTo(win.$zopim.livechat.window, '$zopim.livechat.window')
  tracker.addTo(win.$zopim.livechat.button, '$zopim.livechat.button')
  tracker.addTo(win.$zopim.livechat.departments, '$zopim.livechat.departments')
  tracker.addTo(win.$zopim.livechat.concierge, '$zopim.livechat.concierge')
  tracker.addTo(win.$zopim.livechat.mobileNotifications, '$zopim.livechat.mobileNotifications')
  tracker.addTo(win.$zopim.livechat.prechatForm, '$zopim.livechat.prechatForm')
  tracker.addTo(win.$zopim.livechat.offlineForm, '$zopim.livechat.offlineForm')
  tracker.addTo(win.$zopim.livechat.cookieLaw, '$zopim.livechat.cookieLaw')
  tracker.addTo(win.$zopim.livechat, '$zopim.livechat')
}
