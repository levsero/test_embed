import { useSelector } from 'react-redux'
import i18n from 'src/framework/services/i18n'
import { getLocale } from 'src/apps/messenger/features/i18n/store'

const useTranslate = () => {
  useSelector(getLocale)

  return i18n.translate
}

export default useTranslate
