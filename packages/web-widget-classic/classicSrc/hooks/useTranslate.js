import { i18n } from 'classicSrc/app/webWidget/services/i18n'
import { useSelector } from 'react-redux'

const useTranslate = () => useSelector(() => (...args) => i18n.t(...args))

export default useTranslate
