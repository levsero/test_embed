import embeddableConfig from './embeddable.config.json'

const embeddableConfigResponse = {
  status: 200,
  headers: { 'Access-Control-Allow-Origin': '*' },
  contentType: 'application/json',
  body: JSON.stringify(embeddableConfig)
}

module.exports = { embeddableConfigResponse }
