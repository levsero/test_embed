import chatBadgeComponentStyles from 'component/launcher/ChatBadge.scss'
import widgetLauncherComponentStyles from 'component/launcher/WidgetLauncher.scss'
import { sharedStyles } from 'embed/sharedStyles'

export const launcherStyles = `
  ${sharedStyles}
  ${widgetLauncherComponentStyles}
  ${chatBadgeComponentStyles}
`
