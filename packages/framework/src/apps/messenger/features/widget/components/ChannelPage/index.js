import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { forwardRef } from 'react'
import { ChannelLinkWithQrCode, ChannelLinkWithButton } from '@zendesk/conversation-components'
import { getIsFullScreen } from 'src/apps/messenger/features/responsiveDesign/store'

import { fetchLinkRequest, selectIntegrationById } from 'src/apps/messenger/store/integrations'

import { Container } from './styles'

const ChannelPage = forwardRef((_props, ref) => {
  const { channelId } = useParams()
  const dispatch = useDispatch()
  const history = useHistory()
  const integration = useSelector((state) => selectIntegrationById(state, channelId))
  const isFullScreen = useSelector(getIsFullScreen)

  useEffect(() => {
    dispatch(fetchLinkRequest({ channelId }))
  }, [])

  if (!integration?.hasFetchedLinkRequest && integration?.isFetchingLinkRequest) {
    return <div>Loading link request</div>
  }

  if (!integration?.hasFetchedLinkRequest && integration?.errorFetchingLinkRequest) {
    return <div>Error fetching link request</div>
  }

  const handleBackButtonClick = () => {
    history.goBack()
  }

  return (
    <Container ref={ref}>
      {integration?.hasFetchedLinkRequest && (
        <>
          {!isFullScreen && (
            <ChannelLinkWithQrCode
              channelId={channelId}
              url={integration.linkRequest.url}
              qrCode={integration.linkRequest.qrCode}
              handleBackButtonClick={handleBackButtonClick}
            />
          )}

          {isFullScreen && (
            <ChannelLinkWithButton
              channelId={channelId}
              url={integration.linkRequest.url}
              handleBackButtonClick={handleBackButtonClick}
            />
          )}
        </>
      )}
    </Container>
  )
})

export default ChannelPage
