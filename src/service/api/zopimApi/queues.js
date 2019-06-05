import _ from 'lodash'
import {
  zopimExistsOnPage
} from './helpers'
import ZopimApiError from 'errors/reportable/ZopimApiError'

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
      throw new ZopimApiError('An error occurred in your use of the $zopim Widget API')
    }
  })
  _.set(win.$zopim, 'flushed', true)
}
