import { win, navigator } from 'src/framework/utils/window'

const isBlacklisted = () => {
  return (
    // Iphone chrome on ios 8.0.x displays a blank space instead of content
    (navigator.userAgent.indexOf('CriOS') !== -1 && navigator.userAgent.indexOf('OS 8_0') !== -1) ||
    // MSIE 9.0
    navigator.userAgent.indexOf('MSIE 9.0') !== -1 ||
    // IE 10 on windows phone
    navigator.userAgent.indexOf('IEMobile/10.0') !== -1 ||
    // Googlebot, Googlebot-Mobile, etc. https://support.google.com/webmasters/answer/1061943?hl=en
    navigator.userAgent.indexOf('Googlebot') !== -1 ||
    // If user agent doesn't support CORS blacklist browser
    !(win?.XMLHttpRequest && 'withCredentials' in new win.XMLHttpRequest())
  )
}

export { isBlacklisted }
