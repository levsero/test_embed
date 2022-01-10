import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useCurrentFrame } from '@zendesk/widget-shared-services/Frame'
import { i18n } from 'classicSrc/app/webWidget/services/i18n'
import { getLocale } from 'classicSrc/redux/modules/base/base-selectors'

const HTMLManager = ({ baseFontSize }) => {
  const locale = useSelector(getLocale)
  const frame = useCurrentFrame()

  useEffect(() => {
    frame.document.documentElement?.setAttribute('lang', locale)
    frame.document.documentElement?.setAttribute('dir', i18n.isRTL() ? 'rtl' : 'ltr')

    if (frame.document.documentElement?.style) {
      frame.document.documentElement.style.fontSize = baseFontSize
    }
  }, [locale, baseFontSize])

  return null
}
export default HTMLManager
