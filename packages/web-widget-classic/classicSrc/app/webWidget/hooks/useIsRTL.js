import { i18n } from 'classicSrc/app/webWidget/services/i18n'
import { useSelector } from 'react-redux'

const useIsRTL = () => useSelector(() => i18n.isRTL())

export default useIsRTL
