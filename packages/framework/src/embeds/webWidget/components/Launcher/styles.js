import { sharedStyles } from 'embed/sharedStyles'
import chatBadgeComponentStyles from 'src/component/launcher/ChatBadge.scss'
import widgetLauncherComponentStyles from 'src/component/launcher/WidgetLauncher.scss'

export const launcherStyles = `
  ${sharedStyles}
  ${widgetLauncherComponentStyles}
  ${chatBadgeComponentStyles}
`
