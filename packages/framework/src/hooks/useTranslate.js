import { useSelector } from 'react-redux'
import { i18n } from 'src/apps/webWidget/services/i18n'

const useTranslate = () => useSelector(() => (...args) => i18n.t(...args))

export default useTranslate
