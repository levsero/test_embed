/* eslint-disable no-console */
import { useDispatch, useSelector } from 'react-redux'
import { MessengerHeader } from '@zendesk/conversation-components'
import { getIsLauncherVisible } from 'src/apps/messenger/features/launcher/store'
import { getHeaderValues } from './store'
import { getIsFullScreen } from '../responsiveDesign/store'
import { getAllIntegrationsLinkStatus } from 'src/apps/messenger/store/integrations'
import { useHistory } from 'react-router-dom'
import { widgetClosed } from 'src/apps/messenger/store/visibility'

const Header = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const { avatar, name, description } = useSelector(getHeaderValues)
  const isLauncherVisible = useSelector(getIsLauncherVisible)
  const isFullScreen = useSelector(getIsFullScreen)
  const integrationLinks = useSelector(getAllIntegrationsLinkStatus)

  const onChannelSelect = (channel) => {
    const route = `/channelPage/${channel}`
    history.push(route)
  }

  return (
    <MessengerHeader isCompact={isFullScreen}>
      <MessengerHeader.Content title={name} description={description} avatar={avatar} />
      <MessengerHeader.Menu channels={integrationLinks} onChannelSelect={onChannelSelect} />
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
