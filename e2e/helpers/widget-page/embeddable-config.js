import _ from 'lodash'
import presets from './embeddable-config-presets'

const baseConfig = {
  locale: 'en-GB',
  brand: 'Browser tests',
  brandCount: 1,
  newChat: true,
  color: '#b74a1e',
  captchaRequired: false,
  embeds: {
    launcher: {
      embed: 'launcher',
      props: {
        color: '#1F73B7'
      }
    }
  }
}

const mergeEmbeddableConfigs = configs => {
  const values = configs
    .map(config => {
      if (typeof config !== 'object') {
        return presets[config]
      }

      return config
    })
    .filter(Boolean)

  return _.merge({}, baseConfig, ...values)
}

const mockEmbeddableConfigEndpoint = (...configs) => request => {
  if (!request.url().includes('config')) {
    return false
  }

  request.respond({
    status: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    contentType: 'application/json',
    body: JSON.stringify(mergeEmbeddableConfigs(configs))
  })
}

export { mockEmbeddableConfigEndpoint, mergeEmbeddableConfigs }
