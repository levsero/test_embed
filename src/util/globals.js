import _ from 'lodash'
import { getMetaTagsByName, appendMetaTag } from 'utility/devices'

const win = window.parent
const document = win.document
const navigator = win.navigator
const location = win.location

let referrerPolicy = ''

const getReferrerPolicy = () => referrerPolicy

const setReferrerMetas = (iframe, doc) => {
  const metaElements = getMetaTagsByName(doc, 'referrer')
  const referrerMetas = _.map(metaElements, meta => meta.content)
  const iframeDoc = iframe.contentDocument

  _.forEach(referrerMetas, content => appendMetaTag(iframeDoc, 'referrer', content))

  if (referrerMetas.length > 0) {
    referrerPolicy = _.last(referrerMetas)
  }
}

function getDocumentHost() {
  return document.body || document.documentElement
}

const getZendeskHost = doc => {
  const path = 'web_widget.id'

  return doc.zendeskHost || _.get(doc.zendesk, path) || _.get(doc, path)
}

const isPopout = () => win.zEPopout === true

const getWebWidgetFrameContentDocument = () => {
  try {
    return document.getElementById('webWidget').contentDocument
  } catch (err) {
    return null
  }
}

const getWebWidgetFrameContentDocumentBody = () => {
  try {
    return getWebWidgetFrameContentDocument().body
  } catch (err) {
    return null
  }
}

export {
  win,
  document,
  navigator,
  location,
  getDocumentHost,
  getZendeskHost,
  isPopout,
  setReferrerMetas,
  getReferrerPolicy,
  getWebWidgetFrameContentDocumentBody
}
