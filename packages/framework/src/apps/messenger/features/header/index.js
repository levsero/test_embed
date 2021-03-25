import { useDispatch, useSelector } from 'react-redux'
import { MessengerHeader } from '@zendesk/conversation-components'
import { widgetClosed } from 'src/apps/messenger/store/visibility'
import { getIsLauncherVisible } from 'src/apps/messenger/features/launcher/store'
import { getHeaderValues } from './store'
import { getIsFullScreen } from '../responsiveDesign/store'

const Header = () => {
  const dispatch = useDispatch()
  const { avatar, name, description } = useSelector(getHeaderValues)
  const isLauncherVisible = useSelector(getIsLauncherVisible)
  const isFullScreen = useSelector(getIsFullScreen)

  return (
    <MessengerHeader isCompact={isFullScreen}>
      <MessengerHeader.Content title={name} description={description} avatar={avatar} />
      {!isLauncherVisible && (
        <MessengerHeader.Close
          onClick={() => {
            dispatch(widgetClosed())
          }}
        />
      )}
    </MessengerHeader>
  )
}

export default Header
