import { i18n } from 'classicSrc/app/webWidget/services/i18n'
import { CONTACT_OPTIONS } from 'classicSrc/embeds/talk/constants'
import {
  CALLBACK_ONLY,
  CALLBACK_AND_PHONE,
  CLICK_TO_CALL,
} from 'classicSrc/embeds/talk/talk-capability-types'
import { getSettingsTalkTitle } from 'classicSrc/redux/modules/settings/settings-selectors'
import _ from 'lodash'
import { createSelector } from 'reselect'
import isFeatureEnabled from '@zendesk/widget-shared-services/feature-flags'

export const getEmbeddedVoiceSupported = (_state) =>
  isFeatureEnabled(null, 'embedded_voice_enabled')

export const getIsCallInProgress = (state) => state.talk.embeddedVoiceCallStatus.isCallInProgress
export const getHasLastCallFailed = (state) => state.talk.embeddedVoiceCallStatus.hasLastCallFailed
export const getRecordingConsent = (state) => state.talk.recordingConsent
export const getUserRecordingConsentRequirement = (state) =>
  state.talk.embeddableConfig.recordingConsent
export const getMicrophoneMuted = (state) => state.talk.microphoneMuted
export const getTimeInCall = (state) => state.talk.timeInCall
export const getTalkEmbeddableConfig = (state) => state.talk.embeddableConfig
export const getPhoneNumber = createSelector(
  getTalkEmbeddableConfig,
  (config) => config.phoneNumber
)
export const getIsEmbeddedVoiceEnabled = (state) =>
  getTalkEmbeddableConfig(state)?.capability === CLICK_TO_CALL
export const getEmbeddableConfigEnabled = (state) => getTalkEmbeddableConfig(state).enabled
export const getDeferredStatusOnline = (state) =>
  getTalkEmbeddableConfig(state).deferredStatusOnline
export const getTalkEmbeddableConfigConnected = (state) => getTalkEmbeddableConfig(state).connected
export const getAgentAvailability = (state) => state.talk.agentAvailability
export const getFormState = (state) => state.talk.formState
export const getCallback = (state) => state.talk.callback
export const getAverageWaitTime = (state) => state.talk.averageWaitTime.waitTime
export const getAverageWaitTimeEnabled = (state) => state.talk.averageWaitTime.enabled
export const getSocketIoVendor = (state) => state.talk.vendor.io
export const getIsPollingTalk = (state) => state.talk.isPolling

export const isCallbackEnabled = (state) => {
  const { capability } = state.talk.embeddableConfig

  return _.includes([CALLBACK_ONLY, CALLBACK_AND_PHONE], capability)
}

export const getAverageWaitTimeString = createSelector(
  [getAverageWaitTimeEnabled, getAverageWaitTime],
  (averageWaitTimeEnabled, averageWaitTime) => {
    const averageWaitTimeNumber = parseInt(averageWaitTime, 10)

    if (!averageWaitTimeEnabled || averageWaitTimeNumber === 0) return null

    const waitTimeForm = averageWaitTimeNumber > 1 ? 'Plural' : 'Singular'

    return i18n.t(`embeddable_framework.talk.form.averageWaitTime${waitTimeForm}`, {
      averageWaitTime,
    })
  }
)

export const getCapability = createSelector(
  [getTalkEmbeddableConfig, getEmbeddedVoiceSupported],
  (talkConfig, embeddedVoiceSupported) => {
    return embeddedVoiceSupported ? CLICK_TO_CALL : talkConfig.capability
  }
)

export const getOfflineTitle = (state) => {
  const capability = getCapability(state)
  const title = i18n.getSettingTranslation(getSettingsTalkTitle(state))

  if (title) {
    return title
  }

  switch (capability) {
    case CONTACT_OPTIONS.PHONE_ONLY:
      return i18n.t('embeddable_framework.talk.phoneOnly.title')
    case CONTACT_OPTIONS.CLICK_TO_CALL:
      return i18n.t('embeddable_framework.talk.embeddedVoice.channel.title')
    case CONTACT_OPTIONS.CALLBACK_AND_PHONE:
    case CONTACT_OPTIONS.CALLBACK_ONLY:
    default:
      return i18n.t('embeddable_framework.talk.form.title')
  }
}

export const getTalkTitleKey = createSelector(
  [getCapability, isCallbackEnabled],
  (capability, callbackEnabled) => {
    if (capability === CLICK_TO_CALL) return 'embeddable_framework.talk.embeddedVoice.channel.title'
    if (callbackEnabled) {
      return 'embeddable_framework.launcher.label.talk.request_callback'
    } else {
      return 'embeddable_framework.launcher.label.talk.call_us'
    }
  }
)
