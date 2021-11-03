import { send } from 'src/service/transport/http-base'

const isRequestFromLivePreview = () => {
  const livePreviewHosts = ['static-staging.zdassets.com', 'static.zdassets.com']
  const isAcceptableHost = livePreviewHosts.includes(window.location.host)
  const optedIn = !!window.zESettings?.preview
  return isAcceptableHost && optedIn
}

const fetchEmbeddableConfig = async () => {
  // attempt to use the config that was preloaded
  if (global.configRequest) {
    try {
      const result = await global.configRequest
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
