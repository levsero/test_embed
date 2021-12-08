import chatBadgeComponentStyles from 'classicSrc/component/launcher/ChatBadge.scss'
import widgetLauncherComponentStyles from 'classicSrc/component/launcher/WidgetLauncher.scss'
import { sharedStyles } from 'classicSrc/embed/sharedStyles'

export const launcherStyles = `
  ${sharedStyles}
  ${widgetLauncherComponentStyles}
  ${chatBadgeComponentStyles}
`
