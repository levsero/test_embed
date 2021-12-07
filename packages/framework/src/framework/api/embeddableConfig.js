const hostPageWindow = window.top

const isRequestFromLivePreview = () => {
  const livePreviewHosts = ['static-staging.zdassets.com', 'static.zdassets.com']
  const isAcceptableHost = livePreviewHosts.includes(hostPageWindow.location.host)
  const optedIn = !!hostPageWindow.zESettings?.preview
  return isAcceptableHost && optedIn
}

const fetchEmbeddableConfig = async () => {
  const zendeskHost =
    document.zendeskHost || document.zendesk?.web_widget?.id || document.web_widget?.id

  if (!zendeskHost) {
    throw new Error('Missing zendeskHost config param.')
  }

  const path = isRequestFromLivePreview() ? '/embeddable/preview/config' : '/embeddable/config'

  // attempt to use the config that was preloaded
  if (window.ACFetch) {
    try {
      return window.ACFetch(`https://${window.document.zendesk.web_widget.id}${path}`)
    } catch {
      // fallback to fetching embeddable config
    }
  }

  if (typeof fetch === 'undefined') {
    await import('whatwg-fetch')
  }

  return fetch(`https://${zendeskHost}${path}`).then((response) => {
    if (response.status !== 200) {
      throw new Error('Failed to fetch config')
    }
    return response.json()
  })
}

export { fetchEmbeddableConfig, isRequestFromLivePreview }
