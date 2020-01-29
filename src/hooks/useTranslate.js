import { useSelector } from 'react-redux'
import { i18n } from 'service/i18n'

const useTranslate = () => useSelector(() => (...args) => i18n.t(...args))

export default useTranslate
