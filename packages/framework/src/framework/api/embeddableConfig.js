import { send } from 'src/service/transport/http-base'

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
      const result = await window.ACFetch(
        `https://${window.document.zendesk.web_widget.id}/embeddable/config`
      )
      if (result.success) {
        return result.config
      }
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
