import _ from 'lodash'
import { createSelector } from 'reselect'
import { i18n } from 'service/i18n'
import { CALLBACK_ONLY, CALLBACK_AND_PHONE } from './talk-capability-types'
import { getZendeskHost } from 'utility/globals'
export const getEmbeddableConfig = state => state.talk.embeddableConfig
export const getPhoneNumber = state => getEmbeddableConfig(state).phoneNumber
import { getTalkNickname, getTalkServiceUrl } from 'src/redux/modules/selectors'

export const getEmbeddableConfigEnabled = state => getEmbeddableConfig(state).enabled
export const getDefferedStatusOnline = state => getEmbeddableConfig(state).defferedStatusOnline
export const getEmbeddableConfigConnected = state => getEmbeddableConfig(state).connected
export const getAgentAvailability = state => state.talk.agentAvailability
export const getFormState = state => state.talk.formState
export const getCallback = state => state.talk.callback
export const getAverageWaitTime = state => state.talk.averageWaitTime.waitTime
export const getAverageWaitTimeEnabled = state => state.talk.averageWaitTime.enabled
export const getSocketIoVendor = state => state.talk.vendor.io
export const getIsPollingTalk = state => state.talk.isPolling

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

export const getDeferredTalkApiUrl = state => {
  const talkServiceUrl = getTalkServiceUrl(state)
  const nickname = getTalkNickname(state)
  const subdomain = getZendeskHost(document).split('.')[0]

  return `${talkServiceUrl}/talk_embeddables_service/web/status?subdomain=${subdomain}&nickname=${nickname}`
}
