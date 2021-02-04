import { http } from 'service/transport'

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
    http.send(
      {
        method: 'get',
        path: '/embeddable/config',
        callbacks: {
          done: res => resolve(res.body),
          fail: reject
        }
      },
      false
    )
  })
}

export { fetchEmbeddableConfig }
