import _ from 'lodash'
import NonFatalError from 'src/errors/NonFatalError'

export default class LegacyZEApiError extends NonFatalError {
  constructor(apiName = null, realError = {}) {
    const message = _.compact([
      'An error occurred in your use of the legacy v1 Zendesk Widget API:',
      apiName,
      "Check out the Developer API docs to make sure you're using it correctly",
      'https://developer.zendesk.com/embeddables/docs/widget/api',
      realError.stack,
    ]).join('\n\n')

    super(message, 'LegacyZEApiError')

    this.realError = realError
    this.rollbarFingerprint = `LegacyZEApiError: ${apiName}`
    this.rollbarTitle = `legacy zE.function() API user error: ${apiName}`
  }
}
