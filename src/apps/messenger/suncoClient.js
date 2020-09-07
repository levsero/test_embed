import Sunco from 'src/../sunco_js_client/src'

let client
export const createClient = ({ integrationId, appId }) => {
  client = new Sunco({ integrationId, appId })
  return client
}

export const getClient = () => client
