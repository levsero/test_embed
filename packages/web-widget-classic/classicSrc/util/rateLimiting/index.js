import { beacon } from '@zendesk/widget-shared-services/beacon'
import { isRateLimited } from './helpers'

export default (apiCall, payload, name, _errorCallback) => {
  const timestamp = Date.now()

  if (isRateLimited(name, timestamp)) {
    beacon.trackUserAction('api', 'rateLimited', {
      label: name,
    })
  }

  return apiCall(payload)
}
