import { setReferrerMetas, document } from '@zendesk/widget-shared-services/util/globals'

const setupIframe = (iframe = window.frameElement, doc = document) => {
  // Firefox has an issue with calculating computed styles from within a iframe
  // with display:none. If getComputedStyle returns null we adjust the styles on
  // the iframe so when we need to query the parent document it will work.
  // http://bugzil.la/548397

  if (getComputedStyle(doc.documentElement) === null) {
    const newStyle = 'width: 0; height: 0; border: 0; position: absolute; top: -9999px'

    iframe.removeAttribute('style')
    iframe.setAttribute('style', newStyle)
  }

  // Honour any no-referrer policies on the host page by dynamically
  // injecting the appropriate meta tags on the iframe.
  // TODO: When main.js refactor is complete, test this.
  if (iframe) {
    setReferrerMetas(iframe, doc)
  }
}

export default setupIframe
