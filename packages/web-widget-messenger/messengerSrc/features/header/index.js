/* eslint-disable no-console */
import { getIsLauncherVisible } from 'messengerSrc/features/launcher/store'
import { getAllIntegrationsLinkStatus } from 'messengerSrc/store/integrations'
import { widgetClosed } from 'messengerSrc/store/visibility'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { MessengerHeader } from '@zendesk/conversation-components'
import { getIsFullScreen } from '../responsiveDesign/store'
import { getHeaderValues } from './store'

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
