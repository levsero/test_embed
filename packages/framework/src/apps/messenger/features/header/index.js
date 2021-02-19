import { useDispatch, useSelector } from 'react-redux'
import { MessengerHeader } from '@zendesk/conversation-components'
import { widgetClosed } from 'src/apps/messenger/store/visibility'
import { getIsLauncherVisible } from 'src/apps/messenger/features/launcher/store'
import { getIsFullScreen } from 'src/apps/messenger/features/responsiveDesign/store'
import { getHeaderValues } from './store'

const Header = () => {
  const dispatch = useDispatch()
  const { avatar, name, description } = useSelector(getHeaderValues)
  const isLauncherVisible = useSelector(getIsLauncherVisible)
  const isFullScreen = useSelector(getIsFullScreen)

  return (
    <MessengerHeader
      title={name}
      description={description}
      avatar={avatar}
      showCloseButton={!isLauncherVisible}
      isCompact={isFullScreen}
      onClose={() => {
        dispatch(widgetClosed())
      }}
    />
  )
}

export default Header
