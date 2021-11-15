import { getLocale } from 'messengerSrc/features/i18n/store'
import { useSelector } from 'react-redux'
import i18n from 'src/framework/services/i18n'

const useTranslate = () => {
  // This selector is needed to trigger the component to re-render when the locale changes
  useSelector(getLocale)

  return i18n.translate
}

export default useTranslate
