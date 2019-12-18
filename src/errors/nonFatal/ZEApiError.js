import _ from 'lodash'
import NonFatalError from 'errors/NonFatalError'

export default class ZEApiError extends NonFatalError {
  constructor(apiName = null, realError = {}) {
    const message = _.compact([
      'An error occurred in your use of the Zendesk Widget API:',
      apiName,
      "Check out the Developer API docs to make sure you're using it correctly",
      'https://developer.zendesk.com/embeddables/docs/widget/introduction',
      realError.stack
    ]).join('\n\n')

    super(message, 'ZEApiError')

    this.realError = realError
    this.rollbarFingerprint = `ZEApiError: ${apiName}`
    this.rollbarTitle = `zE() API user error: ${apiName}`
  }
}
