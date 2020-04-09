import { DEFAULT_CORS_HEADERS } from './utils'

export const mockBlipEndpoint = callback => request => {
  if (!request.url().includes('embeddable_blip')) {
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
  return Buffer.from(encoded, 'base64').toString('utf8')
}

export const getBlipPayload = url => {
  const data = url.substr(url.indexOf('data=') + 5)
  return JSON.parse(base64Decode(data))
}

export const assertIdentifyPayload = (identify, user) => {
  expect(identify).toHaveBeenCalled()
  const url = identify.mock.calls[0][0]

  const payload = getBlipPayload(url)
  expect(payload).toMatchObject({ user })
}

export const blipMetadata = {
  buid: expect.any(String),
  suid: expect.any(String),
  version: expect.any(String),
  timestamp: expect.any(String),
  url: 'http://localhost:5123/e2e.html'
}
