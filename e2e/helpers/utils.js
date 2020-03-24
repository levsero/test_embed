import { queries } from 'pptr-testing-library'
import widget from 'e2e/helpers/widget'
import fs from 'fs'
import { allowsInputTextEditing } from '../spec/shared-examples'

export const goToTestPage = async () =>
  await page.goto('http://localhost:5123/e2e.html', { waitUntil: 'domcontentloaded' })

export const failOnConsoleError = () =>
  page.on('console', msg => {
    if (msg.type() === 'error' && msg.location().url.includes('rollbar')) {
      fail(`Console error detected: ${msg.text()}`)
    }
  })

export const DEFAULT_CORS_HEADERS = {
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Expose-Headers':
    'X-Zendesk-API-Warn,X-Zendesk-User-Id,X-Zendesk-User-Session-Expires-At'
}

export const OPTIONS_RESPONSE = {
  status: 200,
  headers: {
    ...DEFAULT_CORS_HEADERS,
    'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT,DELETE',
    'Access-Control-Allow-Headers':
      'Authorization,X-Requested-With,X-Prototype-Version,X-Zendesk-API,Content-Type,X-CSRF-Token,X-Zendesk-Renew-Session',
    'Access-Control-Max-Age': '86400'
  },
  contentType: 'text/plain'
}

export const mockCorsRequest = (path, cb) => request => {
  const url = request.url()
  if (!url.includes(path)) {
    return false
  }
  if (request.method() === 'OPTIONS') {
    request.respond(OPTIONS_RESPONSE)
  } else {
    cb(request)
  }
}

export const mockRollbarEndpoint = mockCorsRequest('rollbar-eu.zendesk.com', request => {
  request.respond({
    status: 200,
    headers: DEFAULT_CORS_HEADERS,
    contentType: 'text/html',
    body: ''
  })
})

export const assertInputValue = async (label, value) => {
  const doc = await widget.getDocument()
  const input = await queries.getByLabelText(doc, label)
  const valueHandle = await input.getProperty('value')
  expect(await valueHandle.jsonValue()).toEqual(value)
}

export const getJsonPayload = endpoint => JSON.parse(endpoint.mock.calls[0][0])

const assetLookups = {
  'chat-incoming-message-notification.mp3': {
    contentType: 'audio/mpeg',
    body: fs.readFileSync('src/asset/media/chat-incoming-message-notification.mp3')
  },
  'flags.png': {
    contentType: 'image/png',
    body: fs.readFileSync('src/asset/images/flags.png')
  }
}

export const mockStaticAssets = request => {
  const url = request.url(),
    path = '/web_widget/static/',
    length = path.length

  if (!url.includes(path)) {
    return false
  }

  const file = url.substr(url.indexOf(path) + length)
  const asset = assetLookups[file]

  if (asset) {
    request.respond({
      status: 200,
      ...asset
    })
  } else {
    request.abort()
  }
}

// fillForm will input all given values into the form
// Expected shape is
// { [label text]: [value to put into field] }
export const fillForm = async (options = {}) => {
  const fields = Object.entries(options)

  for (let i = 0; i < fields.length; i++) {
    const [label, value] = fields[i]

    await allowsInputTextEditing(
      await queries.queryByLabelText(await widget.getDocument(), label),
      value
    )
  }
}
