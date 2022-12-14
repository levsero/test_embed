import _ from 'lodash'
import { document as doc, win, navigator } from 'src/util/globals'

let clickBusterClicks = []
let originalUserScalable = null

// Taken from Zopim Mobile.js
// Detects mobile and tablet user agents
const isMobileBrowser = () => {
  /* eslint max-len: 0 no-useless-escape: 0 */
  const BROWSER_MOBILE = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino|android|ipad|playbook|silk/i
  const BROWSER_MOBILE_OTHER = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i
  const str = navigator.userAgent || navigator.vendor || win.opera
  const result = BROWSER_MOBILE.test(str) || BROWSER_MOBILE_OTHER.test(str.substr(0, 4))

  return result
}

const getMetaTagsByName = (_doc, name) => {
  return _doc.querySelectorAll(`meta[name="${name}"]`)
}

function appendMetaTag(_doc, name, content) {
  const meta = _doc.createElement('meta')

  meta.setAttribute('name', name)
  meta.setAttribute('content', content)

  return _doc.head.appendChild(meta)
}

const initViewportMeta = (active) => {
  const viewportMetas = getMetaTagsByName(doc, 'viewport')

  if (viewportMetas.length > 0) {
    return _.last(viewportMetas)
  } else if (active) {
    return appendMetaTag(doc, 'viewport', '')
  }
}

function setScaleLock(active) {
  let viewportObj
  const meta = initViewportMeta(active)

  if (meta) {
    viewportObj = metaStringToObj(meta.getAttribute('content'))

    if (active) {
      if (_.isUndefined(viewportObj['user-scalable'])) {
        originalUserScalable = null
        viewportObj['user-scalable'] = 'no'
      } else if (originalUserScalable === null) {
        originalUserScalable = viewportObj['user-scalable']
        viewportObj['user-scalable'] = 'no'
      }
    } else {
      if (originalUserScalable === null) {
        delete viewportObj['user-scalable']
      } else {
        viewportObj['user-scalable'] = originalUserScalable
      }
      originalUserScalable = null
    }

    meta.setAttribute('content', metaObjToString(viewportObj))
  }
}

function metaStringToObj(str) {
  if (_.isEmpty(str)) {
    return {}
  } else {
    return str.split(/(,| |;)/).reduce((res, item) => {
      const pair = item.trim().split('=')

      if (pair[1]) {
        res[pair[0]] = pair[1]
      }
      return res
    }, {})
  }
}

const metaObjToString = (obj) => _.map(obj, (value, key) => `${key}=${value}`).join(', ')

function isLandscape() {
  return Math.abs(win.orientation) === 90
}

function getDeviceZoom() {
  const screen = win.screen

  // We need to grab the max in landscape because of the different ways iOS and android handle
  // orientation change. On android, 'screen.availWidth' and 'screen.availHeight' are swapped for us,
  // while on iOS they remain the same.
  const deviceWidth = isLandscape()
    ? Math.max(screen.availWidth, screen.availHeight)
    : screen.availWidth

  return deviceWidth / win.innerWidth
}

function getZoomSizingRatio() {
  const ratio = 1 / getDeviceZoom()

  return isMobileBrowser() ? Math.max(0, ratio) : 1
}

function isIos() {
  const IOS_MOBILE = /iPhone|iPad|iPod/i
  const str = navigator.userAgent || navigator.vendor || win.opera

  return IOS_MOBILE.test(str)
}

function isChromeOnIPad() {
  return navigator.userAgent.includes('iPad') && navigator.userAgent.includes('CriOS')
}

function isDevice(...testStrings) {
  const str = navigator.userAgent

  return _.every(testStrings, (string) => {
    return str.indexOf(string) !== -1
  })
}

function isFirefox() {
  const FIREFOX_BROWSER = /Gecko\/.*\d.*Firefox/

  return FIREFOX_BROWSER.test(navigator.userAgent)
}

function isSafari() {
  const SAFARI_BROWSER = /Apple/i

  return SAFARI_BROWSER.test(navigator.vendor)
}

function shouldGoFullscreen() {
  return getZoomSizingRatio() && isMobileBrowser()
}

function isIE() {
  return (
    // MSIE is present in all IE user agents since IE 2.0
    navigator.userAgent.indexOf('MSIE') !== -1 ||
    // Trident is IE specific
    navigator.userAgent.indexOf('Trident') !== -1
  )
}

function clickBusterRegister(x, y) {
  clickBusterClicks.push([x, y])
}

function clickBusterHandler(ev) {
  let x, y
  const radius = 25 * getZoomSizingRatio()

  if (clickBusterClicks.length) {
    ;[x, y] = clickBusterClicks.pop()
    if (Math.abs(x - ev.clientX) < radius && Math.abs(y - ev.clientY) < radius) {
      ev.stopPropagation()
      ev.preventDefault()
    }
  }
}

export {
  appendMetaTag,
  isMobileBrowser,
  getMetaTagsByName,
  initViewportMeta,
  setScaleLock,
  metaStringToObj,
  isLandscape,
  getDeviceZoom,
  getZoomSizingRatio,
  shouldGoFullscreen,
  isIE,
  isIos,
  isFirefox,
  isSafari,
  isDevice,
  clickBusterHandler,
  clickBusterRegister,
  isChromeOnIPad,
}
