const http2Chunks = {
  runtime: 'common',
  web_widget: 'common',
  preload: 'common',
  'chat-sdk': 'chat',
  'talk-sdk': 'talk'
}

const excludeFromVendoring = {
  'chat-sdk': true,
  'talk-sdk': true,
  webWidgetPreview: true,
  chatPreview: true,
  preload: true
}

const priority = {
  runtime: 1,
  preload: 2,
  web_widget: 4
}

const get = (chunkName, thing) => {
  return Object.keys(thing)
    .filter(chunk => chunkName.includes(chunk))
    .map(chunk => thing[chunk])[0]
}

module.exports = {
  priority(name) {
    return get(name, priority) || 500
  },
  http2Chunks(name) {
    return get(name, http2Chunks)
  },
  excludeFromVendoring(name) {
    return get(name, excludeFromVendoring)
  }
}
