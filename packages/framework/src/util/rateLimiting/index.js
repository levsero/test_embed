import { isRateLimited } from './helpers'
import { beacon } from 'service/beacon'

export default (apiCall, payload, name, _errorCallback) => {
  const timestamp = Date.now()

  if (isRateLimited(name, timestamp)) {
    beacon.trackUserAction('api', 'rateLimited', {
      label: name,
    })
  }

  return apiCall(payload)
}
