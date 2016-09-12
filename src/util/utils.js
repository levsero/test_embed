import _ from 'lodash';

import { document as doc,
         location } from 'utility/globals';

function parseUrl(url) {
  const anchor = document.createElement('a');

  anchor.href = url;

  return anchor;
}

/**
 * Given a URL/path extract the words on it splitting by common symbols (/, -, _, .)
 *
 * @param  {string}  path   The URL/path e.g. "domain.com/foo/bar.index.html"
 * @return {string}         The split string
 */
function splitPath(path) {
  return decodeURIComponent(path)
          .replace(/\#|\:/g, ' ') // Strip out '#' and ':' characters.
          .replace(/\.[^.]{1,4}$/, '')
          .replace(/[\/\.\|_\-]/g, ' ');
}

function getPageKeywords() {
  // If the hostpage has a URL pathname containing a hash (e.g http://foo.com/#/path),
  // location.pathname will break and only return '/', so we need to append location.hash.
  return splitPath(location.pathname + location.hash)
         .replace(/\s+/g, ' ')
         .trim();
}

function getPageTitle() {
  return doc.title || '';
}

function patchReactIdAttribute() {
  require('react/lib/DOMProperty').ID_ATTRIBUTE_NAME = 'data-ze-reactid';
}

function cappedIntervalCall(callback, delay, repetitions = 1) {
  let repCount = 0;
  const intervalId = setInterval(() => {
    if (callback() || ++repCount === repetitions) {
      clearInterval(intervalId);
    }
  }, delay);
}

function bindMethods(instance, prototype) {
  const methods = Object.getOwnPropertyNames(prototype);

  methods.forEach((method) => {
    instance[method] = instance[method].bind(instance);
  });
}

function base64decode(string) {
  return window.atob(string);
}

function objectDifference(a, b) {
  const transformFn = (res, val, key) => {
    if (_.isObject(val) && _.has(b, key)) {
      const diff = objectDifference(val, b[key]);

      if (!_.isEmpty(diff)) {
        res[key] = diff;
      }
    } else if (!_.isEqual(val, b[key])) {
      res[key] = val;
    }
  };

  return _.transform(a, transformFn, {});
}

function cssTimeToMs(string) {
  const unit = string.match(/m?s$/)
  let amount = parseInt(string, 10)

  if(unit && unit[0] == 's') {
    amount *= 1000;
  }
  return amount;
}

export {
  getPageKeywords,
  getPageTitle,
  parseUrl,
  patchReactIdAttribute,
  cappedIntervalCall,
  splitPath,
  bindMethods,
  base64decode,
  objectDifference,
  cssTimeToMs
};
