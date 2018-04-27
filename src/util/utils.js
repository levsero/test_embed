import _ from 'lodash';
import jsSha1 from 'sha1';

import { document as doc,
  location } from 'utility/globals';

const zendeskStagingDomain = 'zd-staging';

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
  /* eslint no-useless-escape: 0 */
  return decodeURIComponent(path)
    .replace(/\#|\:/g, ' ') // Strip out '#' and ':' characters.
    .replace(/\/(\d+(?:\.\w+)?)(?:$|\/)/g, ' ')
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

function cappedTimeoutCall(callback, delay = 50, repetitionCap = 1) {
  // Do not implement using setInterval
  // There were past issues with IE10 when a function's closure variables
  // were getting snapshotted. The evaluated result would always be the
  // same, potentially generating an infinite loop.
  let repCount = 0;
  const recurseFn = () => {
    repCount = repCount + 1;

    if (callback() || repCount >= repetitionCap) return;

    setTimeout(() => recurseFn(), delay);
  };

  recurseFn();
}

function base64decode(string) {
  return window.atob(string);
}

// As per this post on MDN https://goo.gl/XzjooY:
// > Since DOMStrings are 16-bit-encoded strings, in most browsers calling window.btoa
// > on a Unicode string will cause a Character Out Of Range exception if a character
// > exceeds the range of a 8-bit ASCII-encoded character.
// So we escape the string before encoding it. A test has been added for this
function base64encode(string) {
  return window.btoa(encodeURIComponent(string).replace(/%([0-9A-F]{2})/g, (match, p1) => {
    return String.fromCharCode('0x' + p1);
  }));
}

function sha1(string) {
  return jsSha1(string);
}

function objectDifference(a, b) {
  const transformFn = (res, val, key) => {
    // Arrays are objects so we need to check that it's not an array
    // so that it doesn't coerce it into an object
    if (_.isObject(val) && !_.isArray(val) && _.has(b, key)) {
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

function cssTimeToMs(str) {
  const time = parseInt(str, 10) || 0;
  const pattern = /\d+s$/;

  return pattern.test(str) ? (time * 1000) : time;
}

function nowInSeconds() {
  return Math.floor(Date.now() / 1000);
}

function emailValid(email, options = { allowEmpty: false }) {
  // Taken from https://tinyurl.com/35646w3
  const validRegex = new RegExp(/^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/) // eslint-disable-line
  const validEmpty = options.allowEmpty && email === '';

  return validRegex.test(email) || validEmpty;
}

function chatNameDefault(name) {
  const nameRegex = new RegExp(/^Visitor [0-9]{3,}$/);

  return nameRegex.test(name);
}

function referrerPolicyUrl(policy, url) {
  // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy#Examples
  // for reference on why each case does what it does
  switch (policy) {
    case 'no-referrer':
    case 'same-origin':
      return null;
    case 'origin':
    case 'origin-when-cross-origin':
    case 'strict-origin':
    case 'strict-origin-when-cross-origin':
      return parseUrl(url).origin;
    default:
      return url;
  }
}

function getEnvironment() {
  try {
    const mainScript = document.getElementById('js-iframe-async') || {};
    const url = mainScript.src || '';

    return (url.match(zendeskStagingDomain))
      ? 'staging'
      : 'production';
  } catch (e) {
    return 'production';
  }
}

export {
  getPageKeywords,
  getPageTitle,
  parseUrl,
  cappedTimeoutCall,
  splitPath,
  base64decode,
  base64encode,
  objectDifference,
  cssTimeToMs,
  nowInSeconds,
  sha1,
  emailValid,
  referrerPolicyUrl,
  getEnvironment,
  chatNameDefault
};
