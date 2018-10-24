import _ from 'lodash';
import { toggleReceived } from 'src/redux/modules/base';

let zopimExistsOnPage = false;

function setupZopimQueue(win, queue) {
  let $zopim = () => {};

  zopimExistsOnPage = !!win.$zopim;

  // To enable $zopim api calls to work we need to define the queue callback.
  // When we inject the snippet we remove the queue method and just inject
  // the script tag.
  if (!zopimExistsOnPage) {
    $zopim = win.$zopim = (callback) => {
      $zopim._.push(callback);

      queue.push(callback);
    };

    $zopim.set = (callback) => {
      $zopim.set._.push(callback);
    };
    $zopim._ = [];
    $zopim.set._ = [];
  }
}

function setUpZopimApiMethods(win, store) {
  if (!zopimExistsOnPage) {
    win.$zopim = {
      livechat: {
        window: {
          toggle: () => { store.dispatch(toggleReceived()); }
        }
      }
    };
  }
}

function handleZopimQueue(queue) {
  _.forEach(queue, (method) => {
    try {
      method();
    } catch (e) {
      const err = new Error('An error occurred in your use of the $zopim Widget API');

      err.special = true;
      throw err;
    }
  });
}

export const zopimApi = {
  setupZopimQueue,
  handleZopimQueue,
  setUpZopimApiMethods
};
