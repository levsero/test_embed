import { useSelector } from 'react-redux'
import { getUnreadCount } from 'messengerSrc/store/unreadIndicator'
import { getIsWidgetOpen } from 'messengerSrc/store/visibility'
import UnreadIndicator from './components/UnreadIndicator'
import UnreadIndicatorFrame from './components/UnreadIndicatorFrame'

const LauncherUnreadIndicator = () => {
  const unreadCount = useSelector(getUnreadCount)
  const isWidgetOpen = useSelector(getIsWidgetOpen)

  if (isWidgetOpen || unreadCount === 0) {
    return null
  }

  return (
    <UnreadIndicatorFrame>
      <UnreadIndicator unreadCount={unreadCount} />
    </UnreadIndicatorFrame>
  )
}

export default LauncherUnreadIndicator
