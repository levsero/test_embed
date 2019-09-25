import _ from 'lodash'
import presets from './embeddable-config-presets'
import { defaultRequestHandler } from '../utils'

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

const createEmbeddableConfig = (...configs) => {
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

const mockEmbeddableConfigEndpoint = async (config = {}) => {
  await page.setRequestInterception(true)
  await page.on('request', request => {
    if (defaultRequestHandler(request)) {
      return
    }

    if (request.url().includes('config')) {
      request.respond({
        status: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        contentType: 'application/json',
        body: JSON.stringify(config)
      })
    } else {
      request.continue()
    }
  })
}

export { mockEmbeddableConfigEndpoint, createEmbeddableConfig }
