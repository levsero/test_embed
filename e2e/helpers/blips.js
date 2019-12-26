import { DEFAULT_CORS_HEADERS } from './utils'

export function mockBlipEndpoint(request) {
  if (!request.url().includes('embeddable_blip')) {
    return false
  }

  request.respond({
    status: 200,
    headers: DEFAULT_CORS_HEADERS,
    contentType: 'text/html',
    body: ''
  })
}

export const mockIdentifyEndpoint = callback => request => {
  if (!request.url().includes('embeddable_identify')) {
    return false
  }

  if (callback) {
    callback(request.url())
  }

  request.respond({
    status: 200,
    headers: DEFAULT_CORS_HEADERS,
    contentType: 'text/html',
    body: ''
  })
}

const base64Decode = encoded => {
  encoded = encoded.replace(/%3D/g, '=')
  return new Buffer(encoded, 'base64').toString('utf8')
}

export const getBlipPayload = endpoint => {
  const url = endpoint.mock.calls[0][0]
  const data = url.substr(url.indexOf('data=') + 5)
  return JSON.parse(base64Decode(data))
}

export const assertIdentifyPayload = (identify, user) => {
  expect(identify).toHaveBeenCalled()
  const payload = getBlipPayload(identify)
  expect(payload).toMatchObject({ user })
}
