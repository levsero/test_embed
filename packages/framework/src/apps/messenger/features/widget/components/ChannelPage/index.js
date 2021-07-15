import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { forwardRef } from 'react'

import { linkIntegration, selectIntegrationById } from 'src/apps/messenger/store/integrations'

import ChannelLink from './components/ChannelLink'
import BackButton from '../../../backButton'

import { FBMessengerIcon, WhatsAppIcon, InstagramIcon } from './styles'

const ChannelPage = forwardRef((_props, ref) => {
  const { channelId } = useParams()
  const dispatch = useDispatch()
  const history = useHistory()
  const integration = useSelector((state) => selectIntegrationById(state, channelId))

  useEffect(() => {
    dispatch(linkIntegration(channelId))
  }, [])

  return (
    <div ref={ref}>
      <BackButton
        onClick={() => {
          history.goBack()
        }}
      />
      <FBMessengerIcon />
      <WhatsAppIcon />
      <InstagramIcon />
      <h3>Continue on {channelId}</h3>
      <p>Take the conversation to your {channelId} account. You can return anytime.</p>

      {!integration?.hasFetchedLinkRequest && integration?.isFetchingLinkRequest && (
        <div>Loading link request</div>
      )}
      {!integration?.hasFetchedLinkRequest && integration?.errorFetchingLinkRequest && (
        <div>Error fetching link request</div>
      )}

      {integration?.hasFetchedLinkRequest && (
        <>
          <ChannelLink
            channelId={channelId}
            url={integration.linkRequest.url}
            qrCode={integration.linkRequest.qrCode}
          />
        </>
      )}
    </div>
  )
})

export default ChannelPage
