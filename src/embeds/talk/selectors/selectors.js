import { createSelector } from 'reselect'

import { getSettingsTalkTitle } from 'src/redux/modules/settings/settings-selectors'
import { i18n } from 'service/i18n'
import { isCallbackEnabled, getEmbeddableConfig } from 'src/redux/modules/talk/talk-selectors'
import { CONTACT_OPTIONS } from 'src/embeds/talk/constants'
import { CLICK_TO_CALL, PHONE_ONLY } from 'src/redux/modules/talk/talk-capability-types'

export const getTitle = (state, fallback) => {
  return i18n.getSettingTranslation(getSettingsTalkTitle(state)) || i18n.t(fallback)
}

// export const getSnapcallButtonId = state => getEmbeddableConfig(state).snapcallButtonId
export const getSnapcallButtonId = _state => 'SNAPCALL_BUTTON_EXAMPLE_ID'

export const getSnapcallCallStatus = state => state.talk.snapcall.callStatus
export const getSnapcallCallDuration = state => state.talk.snapcall.callDuration
export const getSnapcallPreviousCall = state => state.talk.snapcall.previousCall
export const getSnapcallSupported = state => state.talk.snapcall.snapcallSupported

export const getCapability = createSelector(
  [getEmbeddableConfig, getSnapcallSupported],
  (talkConfig, snapcallSupported) => {
    switch (snapcallSupported) {
      case false:
        return PHONE_ONLY
      case true:
        return CLICK_TO_CALL
      default:
        return talkConfig.capability === CLICK_TO_CALL ? PHONE_ONLY : talkConfig.capability
    }
  }
)

export const getOfflineTitle = state => {
  const capability = getCapability(state)
  const title = i18n.getSettingTranslation(getSettingsTalkTitle(state))

  if (title) {
    return title
  }

  switch (capability) {
    case CONTACT_OPTIONS.PHONE_ONLY:
      return i18n.t('embeddable_framework.talk.phoneOnly.title')
    case CONTACT_OPTIONS.CALLBACK_AND_PHONE:
    case CONTACT_OPTIONS.CALLBACK_ONLY:
    default:
      return i18n.t('embeddable_framework.talk.form.title')
  }
}

export const getTalkTitleKey = createSelector(
  [getCapability, isCallbackEnabled],
  (capability, callbackEnabled) => {
    if (capability === CLICK_TO_CALL) {
      return 'embeddable_framework.talk.clickToCall.header.title'
    }
    if (callbackEnabled) {
      return 'embeddable_framework.launcher.label.talk.request_callback'
    } else {
      return 'embeddable_framework.launcher.label.talk.call_us'
    }
  }
)
