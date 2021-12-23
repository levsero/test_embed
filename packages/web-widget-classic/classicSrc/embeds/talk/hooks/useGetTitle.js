import { i18n } from 'classicSrc/app/webWidget/services/i18n'
import { getSettingsTalkTitle } from 'classicSrc/redux/modules/settings/settings-selectors'
import { useSelector } from 'react-redux'

const useGetTitle = () =>
  useSelector((state) => (fallback) =>
    i18n.getSettingTranslation({ '*': i18n.t(fallback), ...getSettingsTalkTitle(state) })
  )

export default useGetTitle
