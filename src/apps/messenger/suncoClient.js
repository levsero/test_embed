import Sunco from 'src/../sunco_js_client/src'
import isFeatureEnabled from 'embeds/webWidget/selectors/feature-flags'
const PROD_URL = 'https://api.smooch.io'

let client
export const createClient = ({ integrationId, appId, baseUrl, storageType }) => {
  const url = isFeatureEnabled({}, 'use_production_sunco') ? PROD_URL : baseUrl

  client = new Sunco({ integrationId, appId, baseUrl: url, storageType })
  return client
}

export const getClient = () => client
