import chatBadgeComponentStyles from 'src/component/launcher/ChatBadge.scss'
import widgetLauncherComponentStyles from 'src/component/launcher/WidgetLauncher.scss'
import { sharedStyles } from 'src/embed/sharedStyles'

export const launcherStyles = `
  ${sharedStyles}
  ${widgetLauncherComponentStyles}
  ${chatBadgeComponentStyles}
`
