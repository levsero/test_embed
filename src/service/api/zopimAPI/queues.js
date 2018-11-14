import _ from 'lodash';
import {
  zopimExistsOnPage
} from './helpers';

export function setupZopimQueue(win) {
  // To enable $zopim api calls to work we need to define the queue callback.
  // When we inject the snippet we remove the queue method and just inject
  // the script tag.
  if (!zopimExistsOnPage(win)) {
    let $zopim;

    $zopim = win.$zopim = (callback) => {
      if ($zopim.flushed) {
        callback();
      } else {
        $zopim._.push(callback);
      }
    };

    $zopim.set = (callback) => {
      $zopim.set._.push(callback);
    };
    $zopim._ = [];
    $zopim.set._ = [];
    $zopim._setByWW = true;
  }
}

export function handleZopimQueue(win) {
  if (!_.get(win.$zopim, '_setByWW', false))
    return;

  _.forEach(_.get(win.$zopim, '_', []), (method) => {
    try {
      method();
    } catch (e) {
      const err = new Error('An error occurred in your use of the $zopim Widget API');

      err.special = true;
      throw err;
    }
  });
  _.set(win.$zopim, 'flushed', true);
}
