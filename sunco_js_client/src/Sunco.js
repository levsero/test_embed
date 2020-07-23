import AppUsersApi from './api/AppUsersApi'
import ConversationsApi from './api/ConversationsApi'
import MessagesApi from './api/MessagesApi'
import IntegrationsApi from './api/IntegrationsApi'

const BASE_URL = 'https://api.smooch.io'

export default class Sunco {
  constructor(options = {}) {
    const { baseUrl = BASE_URL, appId, integrationId } = options

    this.baseUrl = baseUrl
    this.appId = appId
    this.integrationId = integrationId
    this.apiVersion = 'v2'

    this.appUsers = new AppUsersApi(this)
    this.conversations = new ConversationsApi(this)
    this.messages = new MessagesApi(this)
    this.integrations = new IntegrationsApi(this) //temp - will remove
  }
}
