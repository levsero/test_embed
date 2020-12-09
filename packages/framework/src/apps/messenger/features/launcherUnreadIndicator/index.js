import React from 'react'
import { useSelector } from 'react-redux'

import { getUnreadCount } from 'src/apps/messenger/store/unreadIndicator'
import { getIsWidgetOpen } from 'src/apps/messenger/store/visibility'

import UnreadIndicatorFrame from './components/UnreadIndicatorFrame'
import UnreadIndicator from './components/UnreadIndicator'

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
