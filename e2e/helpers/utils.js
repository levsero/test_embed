export function goToTestPage() {
  page.goto('http://localhost:5123/e2e.html')
}

export function defaultRequestHandler(request) {
  const url = request.url()
  if (url.includes('embeddable_blip')) {
    request.respond({
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      contentType: 'text/html',
      body: ''
    })
    return true
  }
}
