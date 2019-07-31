import _ from 'lodash'
import { createSelector } from 'reselect'
import { i18n } from 'service/i18n'
import { CALLBACK_ONLY, CALLBACK_AND_PHONE } from './talk-capability-types'

export const getEmbeddableConfig = state => state.talk.embeddableConfig
export const getCapability = state => getEmbeddableConfig(state).capability
export const getEmbeddableConfigEnabled = state => getEmbeddableConfig(state).enabled
export const getEmbeddableConfigConnected = state => getEmbeddableConfig(state).connected
export const getAgentAvailability = state => state.talk.agentAvailability
export const getFormState = state => state.talk.formState
export const getScreen = state => state.talk.screen
export const getCallback = state => state.talk.callback
export const getAverageWaitTime = state => state.talk.averageWaitTime.waitTime
export const getAverageWaitTimeEnabled = state => state.talk.averageWaitTime.enabled
export const getInitialScreen = state => `${getCapability(state)}_SCREEN`
export const getSocketIoVendor = state => state.talk.vendor.io
export const getLibPhoneNumberVendor = state => state.talk.vendor.libphonenumber

export const isCallbackEnabled = state => {
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
      averageWaitTime
    })
  }
)
