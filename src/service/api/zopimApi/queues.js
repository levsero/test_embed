import _ from 'lodash'
import { zopimExistsOnPage } from './helpers'
import ZopimApiError from 'errors/nonFatal/ZopimApiError'
import errorTracker from 'service/errorTracker'
import logToCustomer from 'utility/logger'

export function setupZopimQueue(win) {
  // To enable $zopim api calls to work we need to define the queue callback.
  // When we inject the snippet we remove the queue method and just inject
  // the script tag.
  if (!zopimExistsOnPage(win)) {
    let $zopim

    $zopim = win.$zopim = callback => {
      if ($zopim.flushed) {
        callback()
      } else {
        $zopim._.push(callback)
      }
    }

    $zopim.set = callback => {
      $zopim.set._.push(callback)
    }
    $zopim._ = []
    $zopim.set._ = []
    $zopim._setByWW = true
  }
}

export function handleZopimQueue(win) {
  if (_.get(win.$zopim, '_setByWW') === false || _.get(win.$zopim, 'flushed') === true) return

  _.forEach(_.get(win.$zopim, '_', []), method => {
    try {
      method()
    } catch (e) {
      const formattedCode = `${method}`.trim().replace(/\s{2,}/, ' ')
      const error = new ZopimApiError(
        [
          'An error occurred in your use of the $zopim Widget API:',
          formattedCode,
          "Check out the Developer API docs to make sure you're using it correctly",
          'https://api.zopim.com/files/meshim/widget/controllers/LiveChatAPI-js.html',
          e.stack
        ].join('\n\n')
      )

      logToCustomer.error(error.message)
      errorTracker.warn(error)
    }
  })
  _.set(win.$zopim, 'flushed', true)
}
