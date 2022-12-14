import _ from 'lodash'
import jsSha1 from 'sha1'
import { NAME_PATTERN, EMAIL_PATTERN, PHONE_PATTERN } from 'src/constants/shared'
import { document as doc, location } from 'src/util/globals'

function parseUrl(url) {
  const anchor = document.createElement('a')

  anchor.href = url

  return anchor
}

function onNextTick(callback) {
  setTimeout(callback, 0)
}

function sha1(string) {
  return jsSha1(string)
}

function base64decode(string) {
  return window.atob(string)
}

function referrerPolicyUrl(policy, url) {
  // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy#Examples
  // for reference on why each case does what it does
  switch (policy) {
    case 'no-referrer':
    case 'same-origin':
      return null
    case 'origin':
    case 'origin-when-cross-origin':
    case 'strict-origin':
    case 'strict-origin-when-cross-origin':
      return parseUrl(url).origin
    default:
      return url
  }
}

// b64DecodeUnicode and base64UrlDecode adapted from the jwt-decode library
// https://github.com/auth0/jwt-decode
function b64DecodeUnicode(str) {
  return decodeURIComponent(
    window.atob(str).replace(/(.)/g, function (_match, captureGroup) {
      let code = captureGroup.charCodeAt(0).toString(16).toUpperCase()

      if (code.length < 2) {
        code = '0' + code
      }
      return '%' + code
    })
  )
}

function base64UrlDecode(str) {
  let output = str.replace(/-/g, '+').replace(/_/g, '/')
  switch (output.length % 4) {
    case 0:
      break
    case 2:
      output += '=='
      break
    case 3:
      output += '='
      break
  }

  return b64DecodeUnicode(output)
}

// As per this post on MDN https://goo.gl/XzjooY:
// > Since DOMStrings are 16-bit-encoded strings, in most browsers calling window.btoa
// > on a Unicode string will cause a Character Out Of Range exception if a character
// > exceeds the range of a 8-bit ASCII-encoded character.
// So we escape the string before encoding it. A test has been added for this
function base64encode(string) {
  return window.btoa(
    encodeURIComponent(string).replace(/%([0-9A-F]{2})/g, (match, p1) => {
      return String.fromCharCode('0x' + p1)
    })
  )
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
    .replace(/[\/\.\|_\-]/g, ' ')
}

function getPageKeywords() {
  // If the hostpage has a URL pathname containing a hash (e.g http://foo.com/#/path),
  // location.pathname will break and only return '/', so we need to append location.hash.
  return splitPath(location.pathname + location.hash)
    .replace(/\s+/g, ' ')
    .trim()
}

function getPageTitle() {
  return doc.title || ''
}

function objectDifference(a, b) {
  const transformFn = (res, val, key) => {
    // Arrays are objects so we need to check that it's not an array
    // so that it doesn't coerce it into an object
    if (_.isObject(val) && !_.isArray(val) && _.has(b, key)) {
      const diff = objectDifference(val, b[key])

      if (!_.isEmpty(diff)) {
        res[key] = diff
      }
    } else if (!_.isEqual(val, b[key])) {
      res[key] = val
    }
  }

  return _.transform(a, transformFn, {})
}

function cssTimeToMs(str) {
  const time = parseInt(str, 10) || 0
  const pattern = /\d+s$/

  return pattern.test(str) ? time * 1000 : time
}

function emailValid(email, options = { allowEmpty: false }) {
  const validEmpty = options.allowEmpty && email === ''

  return EMAIL_PATTERN.test(email) || validEmpty
}

function nameValid(name, options = { allowEmpty: false }) {
  const validEmpty = options.allowEmpty && name === ''

  return (_.isString(name) && NAME_PATTERN.test(name)) || validEmpty
}

function phoneValid(phone, options = { allowEmpty: false }) {
  const validEmpty = options.allowEmpty && phone === ''

  return PHONE_PATTERN.test(phone) || validEmpty
}

function getHostUrl() {
  return location.toString()
}

function isValidUrl(url) {
  const a = parseUrl(url)

  return !!(a.host && a.host !== location.host)
}

/**
 * Appends the provided query params to the end of the given url
 *
 * @param  {string}  url          The URL/path e.g. "domain.com/foo/bar.index.html"
 * @param  {string}  queryParams  The params you want to add to the end of the URL e.g. "some=example&another=example"
 */
function appendParams(url = '', queryParams = '') {
  if (!queryParams || Object.keys(queryParams).length === 0) {
    return url
  }

  const hashIndex = url.indexOf('#')
  const hasHash = hashIndex !== -1

  const urlBeforeHash = hasHash ? url.substring(0, hashIndex) : url
  const originalHash = hasHash ? url.substring(hashIndex) : ''
  const hasQueryParams = urlBeforeHash.indexOf('?') !== -1
  const divider = hasQueryParams ? '&' : '?'

  return urlBeforeHash + divider + queryParams + originalHash
}

export {
  appendParams,
  base64decode,
  base64encode,
  base64UrlDecode,
  cssTimeToMs,
  emailValid,
  getHostUrl,
  getPageKeywords,
  getPageTitle,
  isValidUrl,
  nameValid,
  objectDifference,
  onNextTick,
  parseUrl,
  phoneValid,
  referrerPolicyUrl,
  sha1,
  splitPath,
}
