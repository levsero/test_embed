import { i18n } from 'src/apps/webWidget/services/i18n'

const useTransformTime = (seconds) =>
  Intl.DateTimeFormat(i18n.getLocale(), { minute: 'numeric', second: 'numeric' }).format(
    new Date(Date.UTC(0, 0, 0, 0, 0, seconds))
  )

export default useTransformTime
