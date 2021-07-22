import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { i18n } from 'src/apps/webWidget/services/i18n'
import { useCurrentFrame } from 'src/framework/components/Frame'
import { getLocale } from 'src/redux/modules/base/base-selectors'

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
