import { i18n } from 'service/i18n'

const useTransformTime = seconds =>
  Intl.DateTimeFormat(i18n.getLocale(), { minute: 'numeric', second: 'numeric' }).format(
    new Date(Date.UTC(0, 0, 0, 0, 0, seconds))
  )

export default useTransformTime
