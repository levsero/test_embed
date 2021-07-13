import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { forwardRef } from 'react'
import QRCode from 'qrcode.react'

import {
  linkIntegration,
  selectIntegrationById,
  getIsFetchingLinkRequest,
  getErrorFetchingLinkRequest,
  getHasFetchedLinkRequest,
} from 'src/apps/messenger/store/integrations'

import ChannelLink from './components/ChannelLink'
import BackButton from '../../../backButton'

import { Container, FBMessengerIcon, WhatsAppIcon, InstagramIcon } from './styles'

const ChannelPage = forwardRef((_props, ref) => {
  const { channelId } = useParams()
  const dispatch = useDispatch()
  const history = useHistory()
  const integration = useSelector((state) => selectIntegrationById(state, channelId))
  const isFetchingLinkRequest = useSelector(getIsFetchingLinkRequest)
  const errorFetchingLinkRequest = useSelector(getErrorFetchingLinkRequest)
  const hasFetchedLinkRequest = useSelector(getHasFetchedLinkRequest)

  useEffect(() => {
    dispatch(linkIntegration(channelId))
  }, [])

  return (
    <Container>
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

      {!hasFetchedLinkRequest && isFetchingLinkRequest && <div>Loading link request</div>}
      {!hasFetchedLinkRequest && errorFetchingLinkRequest && <div>Error fetching link request</div>}

      {hasFetchedLinkRequest && (
        <>
          <ChannelLink
            channelId={channelId}
            url={integration.linkRequest.url}
            qrCode={integration.linkRequest.qrCode}
          />
          <QRCode value={integration.linkRequest.url} />
        </>
      )}
    </Container>
  )
})

export default ChannelPage
