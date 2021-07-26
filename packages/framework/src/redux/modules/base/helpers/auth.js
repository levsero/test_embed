import _ from 'lodash'
import { base64UrlDecode, sha1 } from 'src/util/utils'

function isTokenValid(token) {
  if (token && token.expiry) {
    const now = Math.floor(Date.now() / 1000)

    return token.expiry > now
  }
  return false
}

const extractTokenId = _.memoize(function (jwt) {
  const jwtBody = jwt.split('.')[1]

  if (typeof jwtBody === 'undefined') {
    return null
  }

  const decodedBody = base64UrlDecode(jwtBody)
  const message = JSON.parse(decodedBody)

  return message.email ? sha1(message.email) : null
})

function isTokenRenewable(token) {
  if (token && token.expiry) {
    const now = Math.floor(Date.now() / 1000)
    const timeDiff = token.expiry - now
    const renewTime = 20 * 60 // 20 mins in secs

    return timeDiff > 0 && timeDiff <= renewTime
  }
  return false
}

function isTokenExpired(token) {
  if (token && token.expiry) {
    const now = Math.floor(Date.now() / 1000)

    return token.expiry < now
  }
  return false
}

export { isTokenValid, extractTokenId, isTokenRenewable, isTokenExpired }
