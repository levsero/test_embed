import { send } from 'src/service/transport/http-base'

const hostPageWindow = window.top

const isRequestFromLivePreview = () => {
  const livePreviewHosts = ['static-staging.zdassets.com', 'static.zdassets.com']
  const isAcceptableHost = livePreviewHosts.includes(hostPageWindow.location.host)
  const optedIn = !!hostPageWindow.zESettings?.preview
  return isAcceptableHost && optedIn
}

const fetchEmbeddableConfig = async () => {
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
