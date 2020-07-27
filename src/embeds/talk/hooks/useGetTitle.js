import { useSelector } from 'react-redux'
import { getSettingsTalkTitle } from 'src/redux/modules/settings/settings-selectors'
import { i18n } from 'service/i18n'

const useGetTitle = () =>
  useSelector(state => fallback =>
    i18n.getSettingTranslation({ '*': i18n.t(fallback), ...getSettingsTalkTitle(state) })
  )

export default useGetTitle
