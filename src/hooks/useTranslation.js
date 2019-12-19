import { useSelector } from 'react-redux'
import { i18n } from 'service/i18n'

// This is deprecated, please use useTranslate instead
const useTranslation = (...args) => useSelector(() => i18n.t(...args))

const useTranslate = () => useSelector(() => (...args) => i18n.t(...args))

export default useTranslation
export { useTranslate }
