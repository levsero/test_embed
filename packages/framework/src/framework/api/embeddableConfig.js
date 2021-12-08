import { send } from '@zendesk/widget-shared-services/transport/http/base'

const hostPageWindow = window.top

const isRequestFromLivePreview = () => {
  const livePreviewHosts = ['static-staging.zdassets.com', 'static.zdassets.com']
  const isAcceptableHost = livePreviewHosts.includes(hostPageWindow.location.host)
  const optedIn = !!hostPageWindow.zESettings?.preview
  return isAcceptableHost && optedIn
}

const fetchEmbeddableConfig = async () => {
  // attempt to use the config that was preloaded
  if (window.ACFetch) {
    try {
      const endpoint = isRequestFromLivePreview()
        ? '/embeddable/preview/config'
        : '/embeddable/config'

      const result = await window.ACFetch(
        `https://${window.document.zendesk.web_widget.id}${endpoint}`
      )

      return result
    } catch {
      // fallback to fetching embeddable config
    }
  }

  return new Promise((resolve, reject) => {
    send(
      {
        method: 'get',
        path: isRequestFromLivePreview() ? '/embeddable/preview/config' : '/embeddable/config',
        callbacks: {
          done: (res) => resolve(res.body),
          fail: reject,
        },
      },
      false
    )
  })
}

export { fetchEmbeddableConfig, isRequestFromLivePreview }
