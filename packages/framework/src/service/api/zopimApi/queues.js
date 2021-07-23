import _ from 'lodash'
import ZopimApiError from 'src/errors/nonFatal/ZopimApiError'
import { logAndTrackApiError } from 'src/service/api/errorHandlers'

export function setupZopimQueue(win) {
  // Define the global $zopim object.
  // The global object accepts a callback, e.g.
  // $zopim(() => console.log('callback'))
  // If there is an existing $zopim global,
  // preserve the old values that are set on it
  let $zopim, oldQueue, oldSet
  if (win.$zopim) {
    oldQueue = win.$zopim._
    if (win.$zopim.set) {
      oldSet = win.$zopim.set._
    }
  }

  $zopim = win.$zopim = (callback) => {
    if ($zopim._exec) {
      callback()
    } else {
      $zopim._.push(callback)
    }
  }
  $zopim.set = (callback) => {
    $zopim.set._.push(callback)
  }
  $zopim._ = []
  $zopim.set._ = []
  $zopim._setByWW = true
  if (oldQueue) {
    _.forEach(oldQueue, (callback) => {
      $zopim._.push(callback)
    })
  }
  if (oldSet) {
    _.forEach(oldSet, (callback) => {
      $zopim.set._.push(callback)
    })
  }
}

export function handleZopimQueue(win) {
  if (_.get(win.$zopim, '_setByWW') === false || _.get(win.$zopim, '_exec') === true) return

  _.set(win.$zopim, '_exec', true)

  _.forEach(_.get(win.$zopim, '_', []), (method) => {
    try {
      method()
    } catch (e) {
      const zopimCodeBlock = `${method}`.trim().replace(/\s{2,}/, ' ')
      logAndTrackApiError(new ZopimApiError(zopimCodeBlock, e))
    }
  })
}
