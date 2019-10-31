import { useSelector } from 'react-redux'
import { i18n } from 'service/i18n'

const useTranslation = (...args) => useSelector(() => i18n.t(...args))

export default useTranslation