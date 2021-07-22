import { WIDGET_OPENED_EVENT, WIDGET_CLOSED_EVENT, CHAT_POPOUT_EVENT } from 'src/constants/event'
import { contextualSearch } from 'src/embeds/helpCenter/actions'
import { getHasContextuallySearched } from 'src/embeds/helpCenter/selectors'
import { clearAttachments } from 'src/embeds/support/actions'
import { store } from 'src/framework/services/persistence'
import {
  getOAuth,
  getBaseIsAuthenticated,
  getAfterWidgetShowAnimation,
  getWebWidgetOpen,
  getWidgetAlreadyHidden,
} from 'src/redux/modules/base/base-selectors'
import {
  extractTokenId,
  isTokenRenewable,
  isTokenExpired,
} from 'src/redux/modules/base/helpers/auth'
import { updateChatScreen } from 'src/redux/modules/chat'
import { PRECHAT_SCREEN } from 'src/redux/modules/chat/chat-screen-types'
import { getPrechatFormRequired } from 'src/redux/modules/chat/chat-selectors'
import * as callbacks from 'src/service/api/callbacks'
import { settings } from 'src/service/settings'
import { http } from 'src/service/transport'
import { nameValid, emailValid, phoneValid } from 'src/util/utils'
import { focusLauncher } from 'utility/globals'
import * as actions from './../base-action-types'

function onAuthRequestSuccess(res, id, dispatch, webToken) {
  store.set('zE_oauth', {
    id: id,
    token: res.body.oauth_token,
    expiry: res.body.oauth_expiry,
    createdAt: res.body.oauth_created_at,
    webToken: webToken,
  })
  dispatch({
    type: actions.AUTHENTICATION_SUCCESS,
  })
}

function onAuthRequestFailure(res, dispatch) {
  store.remove('zE_oauth')
  dispatch({
    type: actions.AUTHENTICATION_FAILURE,
  })
}

export const authenticate = (webToken) => {
  return (dispatch) => {
    dispatch({
      type: actions.AUTHENTICATION_PENDING,
    })

    const oauth = getOAuth()
    const webTokenId = extractTokenId(webToken)
    const authenticationRequired = !getBaseIsAuthenticated() || (oauth && webTokenId !== oauth.id)

    if (authenticationRequired) {
      store.remove('zE_oauth')

      const payload = {
        method: 'POST',
        path: '/embeddable/authenticate',
        params: { body: webToken },
        timeout: 10000,
        callbacks: {
          done: (res) => onAuthRequestSuccess(res, webTokenId, dispatch, webToken),
          fail: (res) => onAuthRequestFailure(res, dispatch),
        },
      }

      http.send(payload)
    } else {
      dispatch({
        type: actions.AUTHENTICATION_SUCCESS,
      })
    }
  }
}

export const renewToken = () => {
  return (dispatch) => {
    const oauth = getOAuth()

    if (isTokenRenewable(oauth)) {
      const params = {
        body: oauth.webToken,
        token: {
          oauth_token: oauth.token,
          oauth_expiry: oauth.expiry,
        },
      }
      const payload = {
        method: 'POST',
        path: '/embeddable/authenticate/renew',
        params: params,
        callbacks: {
          done: (res) => onAuthRequestSuccess(res, oauth.id, dispatch, oauth.webToken),
          fail: (res) => onAuthRequestFailure(res, dispatch),
        },
      }

      http.send(payload)
    }

    const settingsJwtFn = settings.getAuthSettingsJwtFn()

    if (settingsJwtFn && (!oauth || isTokenExpired(oauth))) {
      const callback = (jwt) => {
        dispatch(authenticate(jwt))
      }

      return settingsJwtFn(callback)
    }
  }
}

const revokeToken = () => {
  store.remove('zE_oauth')
  return {
    type: actions.AUTHENTICATION_TOKEN_REVOKED,
  }
}

export const expireToken = (revokedAt) => {
  const oauth = getOAuth()

  if (oauth && oauth.createdAt <= revokedAt) {
    return revokeToken()
  }

  return {
    type: actions.AUTHENTICATION_TOKEN_NOT_REVOKED,
  }
}

export const logout = () => revokeToken()

export const updateEmbeddableConfig = (rawEmbeddableConfig) => {
  return {
    type: actions.UPDATE_EMBEDDABLE_CONFIG,
    payload: rawEmbeddableConfig,
  }
}

export const updateArturos = (payload) => {
  return {
    type: actions.UPDATE_ARTUROS,
    payload,
  }
}

export const updateEmbedAccessible = (name, accessible) => {
  return {
    type: actions.UPDATE_EMBED,
    payload: {
      name,
      params: { accessible },
    },
  }
}

export const updateWidgetShown = (show) => {
  const updateWidgetShownAction = {
    type: actions.UPDATE_WIDGET_SHOWN,
    payload: show,
  }

  return (dispatch, getState) => {
    const state = getState()

    if (!getHasContextuallySearched(state) && show) {
      dispatch(contextualSearch())
    }

    dispatch(updateWidgetShownAction)
  }
}

export const handlePrefillReceived = (payload) => {
  const { name = {}, email = {}, phone = {} } = payload
  let prefillValues = {}
  let isReadOnly = {}

  if (typeof name.readOnly === 'boolean') {
    isReadOnly.name = name.readOnly
  }

  if (typeof email.readOnly === 'boolean') {
    isReadOnly.email = email.readOnly
  }

  if (typeof phone.readOnly === 'boolean') {
    isReadOnly.phone = phone.readOnly
  }

  if (nameValid(name.value)) {
    prefillValues.name = name.value
  }

  if (emailValid(email.value)) {
    prefillValues.email = email.value
  }

  if (phoneValid(phone.value)) {
    prefillValues.phone = phone.value
  }

  return {
    type: actions.PREFILL_RECEIVED,
    payload: { prefillValues, isReadOnly, timestamp: Date.now() },
  }
}

export const updateQueue = (payload) => {
  return {
    type: actions.UPDATE_QUEUE,
    payload,
  }
}

export const removeFromQueue = (methodName) => {
  return {
    type: actions.REMOVE_FROM_QUEUE,
    payload: methodName,
  }
}

export const addToAfterShowAnimationQueue = (callback) => {
  return {
    type: actions.ADD_TO_AFTER_SHOW_ANIMATE,
    payload: callback,
  }
}

export const widgetShowAnimationComplete = () => {
  return (dispatch, getState) => {
    const queue = getAfterWidgetShowAnimation(getState())

    queue.forEach((callback) => {
      dispatch(callback())
    })

    dispatch({
      type: actions.WIDGET_SHOW_ANIMATION_COMPLETE,
    })
  }
}

export const handleCloseButtonClicked = () => {
  return (dispatch) => {
    dispatch({
      type: actions.CLOSE_BUTTON_CLICKED,
    })

    focusLauncher()
    callbacks.fireFor(WIDGET_CLOSED_EVENT)
  }
}

export const handleEscapeKeyPressed = () => {
  return (dispatch, getState) => {
    if (getWebWidgetOpen(getState())) {
      dispatch({
        type: actions.ESCAPE_KEY_PRESSED,
      })
      callbacks.fireFor(WIDGET_CLOSED_EVENT)
    }
  }
}

export const showWidget = () => {
  return (dispatch, getState) => {
    if (!getWidgetAlreadyHidden(getState())) {
      dispatch({ type: actions.SHOW_WIDGET })
    }
  }
}

export const handlePopoutCreated = () => {
  callbacks.fireFor(CHAT_POPOUT_EVENT)
  return { type: actions.POPOUT_CREATED }
}

export const apiClearForm = () => (dispatch, _getState) => {
  dispatch({ type: actions.API_CLEAR_FORM, payload: { timestamp: Date.now() } })
  dispatch(clearAttachments())
}

const goToPrechatScreen = () => {
  return updateChatScreen(PRECHAT_SCREEN)
}

export const apiResetWidget = () => {
  return (dispatch, getState) => {
    const state = getState()

    dispatch(apiClearForm())
    dispatch({ type: actions.API_RESET_WIDGET })

    if (getPrechatFormRequired(state)) {
      dispatch(goToPrechatScreen())
    }
  }
}

export const launcherClicked = () => {
  return (dispatch) => {
    dispatch({ type: actions.LAUNCHER_CLICKED })

    callbacks.fireFor(WIDGET_OPENED_EVENT)
  }
}

export const chatBadgeClicked = () => {
  return (dispatch) => {
    dispatch({ type: actions.CHAT_BADGE_CLICKED })
    callbacks.fireFor(WIDGET_OPENED_EVENT)
    dispatch(addToAfterShowAnimationQueue(handleChatBadgeMinimize))
  }
}

export const widgetInitialised = () => {
  return (dispatch) => {
    dispatch({
      type: actions.WIDGET_INITIALISED,
    })

    setTimeout(() => dispatch({ type: actions.BOOT_UP_TIMER_COMPLETE }), 5000)
  }
}

export const activateReceived = (options = {}) => {
  return {
    type: actions.ACTIVATE_RECEIVED,
    payload: options,
  }
}

export const hideReceived = () => {
  return {
    type: actions.HIDE_RECEIVED,
  }
}

export const showReceived = () => {
  return {
    type: actions.SHOW_RECEIVED,
  }
}

export const legacyShowReceived = () => {
  return {
    type: actions.LEGACY_SHOW_RECEIVED,
  }
}

export const openReceived = () => {
  return (dispatch, getState) => {
    if (!getWebWidgetOpen(getState())) {
      dispatch({ type: actions.OPEN_RECEIVED })
      callbacks.fireFor(WIDGET_OPENED_EVENT)
    }
  }
}

export const closeReceived = () => {
  return (dispatch, getState) => {
    if (getWebWidgetOpen(getState())) {
      dispatch({ type: actions.CLOSE_RECEIVED })
      callbacks.fireFor(WIDGET_CLOSED_EVENT)
    }
  }
}
export const toggleReceived = () => (dispatch, getState) => {
  dispatch({ type: actions.TOGGLE_RECEIVED })

  if (getWebWidgetOpen(getState())) {
    callbacks.fireFor(WIDGET_OPENED_EVENT)
  } else {
    callbacks.fireFor(WIDGET_CLOSED_EVENT)
  }
}

export const cancelButtonClicked = () => (dispatch, _getState) => {
  dispatch({
    type: actions.CANCEL_BUTTON_CLICKED,
  })

  callbacks.fireFor(WIDGET_CLOSED_EVENT)
}

export const handleChatBadgeMinimize = () => {
  return {
    type: actions.CHAT_BADGE_MINIMIZED,
  }
}

export const badgeHideReceived = () => {
  return {
    type: actions.BADGE_HIDE_RECEIVED,
  }
}

export const badgeShowReceived = () => {
  return {
    type: actions.BADGE_SHOW_RECEIVED,
  }
}
