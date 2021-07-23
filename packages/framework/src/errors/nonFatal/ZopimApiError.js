import _ from 'lodash'
import NonFatalError from 'src/errors/NonFatalError'

const truncateCodeBlock = (zopimCodeBlock) => {
  if (_.isString(zopimCodeBlock)) {
    return zopimCodeBlock.length > 200
      ? `${zopimCodeBlock.slice(0, 200)} \n\t...\n}`
      : zopimCodeBlock
  }
  return null
}

export default class ZopimApiError extends NonFatalError {
  constructor(zopimCodeBlock = null, realError = {}) {
    const message = _.compact([
      'An error occurred within your use of the $zopim Widget API:',
      truncateCodeBlock(zopimCodeBlock),
      "Check out the Developer API docs to make sure you're using it correctly",
      'https://api.zopim.com/files/meshim/widget/controllers/LiveChatAPI-js.html',
      realError.stack,
    ]).join('\n\n')

    super(message, 'ZopimApiError')

    this.realError = realError
    this.rollbarFingerprint = `$zopim() API user error`
    this.rollbarTitle = `$zopim() API user error`
  }
}
