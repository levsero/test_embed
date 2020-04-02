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

export const assertChatOpenedPayload = url => {
  const payload = getBlipPayload(url)
  expect(payload).toMatchObject({
    channel: 'web_widget',
    userAction: { category: 'chat', action: 'opened', label: 'newChat', value: null },
    buid: expect.any(String),
    suid: expect.any(String),
    version: expect.any(String),
    timestamp: expect.any(String),
    url: 'http://localhost:5123/e2e.html'
  })
}

export const assertPageViewPayload = url => {
  const payload = getBlipPayload(url)
  expect(payload).toMatchObject({
    pageView: {
      referrer: 'http://localhost:5123/e2e.html',
      time: expect.any(Number),
      loadTime: expect.any(Number),
      navigatorLanguage: 'en-GB',
      pageTitle: 'End-to-end tests',
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.0 Safari/537.36',
      isMobile: false,
      isResponsive: true,
      viewportMeta: 'width=device-width initial-scale=1',
      helpCenterDedup: false
    },
    buid: expect.any(String),
    suid: expect.any(String),
    version: expect.any(String),
    timestamp: expect.any(String),
    url: 'http://localhost:5123/e2e.html'
  })
}

export const assertHCSearchPayload = url => {
  const payload = getBlipPayload(url)
  expect(payload).toEqual({
    channel: 'web_widget',
    userAction: {
      category: 'helpCenter',
      action: 'search',
      label: 'helpCenterForm',
      value: 'Help'
    },
    buid: expect.any(String),
    suid: expect.any(String),
    version: expect.any(String),
    timestamp: expect.any(String),
    url: 'http://localhost:5123/e2e.html'
  })
}

export const assertHCArticleViewedPayload = url => {
  const payload = getBlipPayload(url)

  expect(payload).toEqual({
    channel: 'web_widget',
    userAction: {
      category: 'helpCenter',
      action: 'click',
      label: 'helpCenterForm',
      value: {
        query: 'Help',
        resultsCount: 3,
        uniqueSearchResultClick: true,
        articleId: expect.any(Number),
        locale: 'en-gb',
        contextualSearch: false,
        answerBot: false
      }
    },
    buid: expect.any(String),
    suid: expect.any(String),
    version: expect.any(String),
    timestamp: expect.any(String),
    url: 'http://localhost:5123/e2e.html'
  })
}

export const assertContactFormSubmittedPayload = url => {
  const payload = getBlipPayload(url)

  expect(payload).toEqual({
    channel: 'web_widget',
    userAction: {
      category: 'submitTicket',
      action: 'send',
      label: 'ticketSubmissionForm',
      value: {
        query: 'Help',
        locale: 'en-gb',
        ticketId: expect.any(Number),
        attachmentsCount: 0,
        attachmentTypes: [],
        contextualSearch: false
      }
    },
    buid: expect.any(String),
    suid: expect.any(String),
    version: expect.any(String),
    timestamp: expect.any(String),
    url: 'http://localhost:5123/e2e.html'
  })
}
