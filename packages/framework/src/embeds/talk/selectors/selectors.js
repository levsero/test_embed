import { createSelector } from 'reselect'

import { getSettingsTalkTitle } from 'src/redux/modules/settings/settings-selectors'
import { i18n } from 'src/apps/webWidget/services/i18n'
import { isCallbackEnabled, getEmbeddableConfig } from 'src/redux/modules/talk/talk-selectors'
import { CONTACT_OPTIONS } from 'src/embeds/talk/constants'
import { CLICK_TO_CALL } from 'src/redux/modules/talk/talk-capability-types'
import isFeatureEnabled from 'src/embeds/webWidget/selectors/feature-flags/index'

export const getEmbeddedVoiceSupported = _state => isFeatureEnabled(null, 'embedded_voice_enabled')

export const getIsCallInProgress = state => state.talk.embeddedVoiceCallStatus.isCallInProgress
export const getHasLastCallFailed = state => state.talk.embeddedVoiceCallStatus.hasLastCallFailed
export const getRecordingConsent = state => state.talk.recordingConsent
export const getUserRecordingConsentRequirement = state =>
  state.talk.embeddableConfig.recordingConsent

export const getMicrophoneMuted = state => state.talk.microphoneMuted
export const getTimeInCall = state => state.talk.timeInCall

export const getCapability = createSelector(
  [getEmbeddableConfig, getEmbeddedVoiceSupported],
  (talkConfig, embeddedVoiceSupported) => {
    return embeddedVoiceSupported ? CLICK_TO_CALL : talkConfig.capability
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
    case CONTACT_OPTIONS.CLICK_TO_CALL:
      return i18n.t('embeddable_framework.talk.clickToCall.header.title')
    case CONTACT_OPTIONS.CALLBACK_AND_PHONE:
    case CONTACT_OPTIONS.CALLBACK_ONLY:
    default:
      return i18n.t('embeddable_framework.talk.form.title')
  }
}

export const getTalkTitleKey = createSelector(
  [getCapability, isCallbackEnabled],
  (capability, callbackEnabled) => {
    if (capability === CLICK_TO_CALL) return 'embeddable_framework.talk.clickToCall.header.title'
    if (callbackEnabled) {
      return 'embeddable_framework.launcher.label.talk.request_callback'
    } else {
      return 'embeddable_framework.launcher.label.talk.call_us'
    }
  }
)

export const getCallInProgressLabel = createSelector(
  [getIsCallInProgress, getHasLastCallFailed],
  (isCallInProgress, hasLastCallFailed) => {
    if (hasLastCallFailed)
      return i18n.t('embeddable_framework.talk.embeddedVoice.callErrors.callFailed')
    return isCallInProgress
      ? i18n.t('embeddable_framework.talk.embeddedVoice.call_in_progress')
      : i18n.t('embeddable_framework.talk.embeddedVoice.call.ended')
  }
)
