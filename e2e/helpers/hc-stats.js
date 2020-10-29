import { DEFAULT_CORS_HEADERS, OPTIONS_RESPONSE } from './utils'

const pattern = /\/api\/v2\/help_center\/.+\/stats/

export const mockHcStatsEndpoint = callback => request => {
  const url = request.url()
  if (!pattern.test(url)) {
    return false
  }

  if (request.method() === 'OPTIONS') {
    request.respond(OPTIONS_RESPONSE)
    return
  }

  if (callback) {
    callback(url, request.postData())
  }

  request.respond({
    status: 200,
    headers: DEFAULT_CORS_HEADERS,
    contentType: 'text/html',
    body: ''
  })
}
