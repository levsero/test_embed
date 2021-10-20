import { useSelector } from 'react-redux'
import { i18n } from 'src/apps/webWidget/services/i18n'

const useIsRTL = () => useSelector(() => i18n.isRTL())

export default useIsRTL
