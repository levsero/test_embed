export function goToTestPage() {
  page.goto('http://localhost:5123/e2e.html')
}

export function mockBlipEndpoint(request) {
  if (!request.url().includes('embeddable_blip')) {
    return false
  }

  request.respond({
    status: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    contentType: 'text/html',
    body: ''
  })
}
