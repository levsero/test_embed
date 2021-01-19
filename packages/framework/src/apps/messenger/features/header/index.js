import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MessengerHeader } from '@zendesk/conversation-components'
import useTranslate from 'src/apps/messenger/features/i18n/useTranslate'
import { widgetClosed } from 'src/apps/messenger/store/visibility'
import { getIsLauncherVisible } from 'src/apps/messenger/features/launcher/store'
import { getIsFullScreen } from 'src/apps/messenger/features/responsiveDesign/store'
import { getHeaderValues } from './store'

const Header = () => {
  const dispatch = useDispatch()
  const { avatar, name, description } = useSelector(getHeaderValues)
  const isLauncherVisible = useSelector(getIsLauncherVisible)
  const isFullScreen = useSelector(getIsFullScreen)
  const translate = useTranslate()

  return (
    <MessengerHeader
      title={name}
      description={description}
      avatar={avatar}
      avatarAltTag={translate('embeddable_framework.messenger.header.company_logo')}
      showCloseButton={!isLauncherVisible}
      closeButtonAriaLabel={translate(
        'embeddable_framework.messenger.unread_indicator.frame.title'
      )}
      isCompact={isFullScreen}
      onClose={() => {
        dispatch(widgetClosed())
      }}
    />
  )
}

export default Header
