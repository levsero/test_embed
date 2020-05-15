import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getLocale } from 'src/redux/modules/base/base-selectors'
import { useCurrentFrame } from 'components/Frame'
import { i18n } from 'service/i18n'

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
