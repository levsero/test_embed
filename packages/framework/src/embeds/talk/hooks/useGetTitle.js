import { useSelector } from 'react-redux'
import { getSettingsTalkTitle } from 'src/redux/modules/settings/settings-selectors'
import { i18n } from 'src/apps/webWidget/services/i18n'

const useGetTitle = () =>
  useSelector((state) => (fallback) =>
    i18n.getSettingTranslation({ '*': i18n.t(fallback), ...getSettingsTalkTitle(state) })
  )

export default useGetTitle
