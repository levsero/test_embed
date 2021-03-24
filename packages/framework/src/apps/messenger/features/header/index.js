/* eslint-disable no-console */
import { useDispatch, useSelector } from 'react-redux'
import { MessengerHeader } from '@zendesk/conversation-components'
import { widgetClosed } from 'src/apps/messenger/store/visibility'
import { getIsLauncherVisible } from 'src/apps/messenger/features/launcher/store'
import { getHeaderValues } from './store'
import { getIsFullScreen } from '../responsiveDesign/store'
import {
  getAllIntegrationsLinkStatus,
  linkIntegration,
  unlinkIntegration,
} from 'src/apps/messenger/store/integrations'
import {} from '../../store/integrations'

const Header = () => {
  const dispatch = useDispatch()
  const { avatar, name, description } = useSelector(getHeaderValues)
  const isLauncherVisible = useSelector(getIsLauncherVisible)
  const isFullScreen = useSelector(getIsFullScreen)
  const integrationLinks = useSelector(getAllIntegrationsLinkStatus)

  const onChannelSelect = (channel) => {
    if (integrationLinks[channel] === 'not linked') {
      dispatch(linkIntegration(channel))
    } else {
      dispatch(unlinkIntegration(channel))
    }
    console.log(channel)
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
