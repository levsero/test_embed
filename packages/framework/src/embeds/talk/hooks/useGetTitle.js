import { useSelector } from 'react-redux'
import { i18n } from 'src/apps/webWidget/services/i18n'
import { getSettingsTalkTitle } from 'src/redux/modules/settings/settings-selectors'

const useGetTitle = () =>
  useSelector((state) => (fallback) =>
    i18n.getSettingTranslation({ '*': i18n.t(fallback), ...getSettingsTalkTitle(state) })
  )

export default useGetTitle
