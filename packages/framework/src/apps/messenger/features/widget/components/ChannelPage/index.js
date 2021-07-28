import { useEffect } from 'react'
import { forwardRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import {
  ChannelLinkContainer,
  BackButton,
  ChannelLinkWithQrCode,
  ChannelLinkWithButton,
} from '@zendesk/conversation-components'
import useTranslate from 'src/apps/messenger/features/i18n/useTranslate'
import { getIsFullScreen } from 'src/apps/messenger/features/responsiveDesign/store'
import { fetchLinkRequest, selectIntegrationById } from 'src/apps/messenger/store/integrations'
import { Header } from './styles'

const ChannelPage = forwardRef((_props, ref) => {
  const { channelId } = useParams()
  const dispatch = useDispatch()
  const history = useHistory()
  const translate = useTranslate()
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

  return (
    <ChannelLinkContainer ref={ref}>
      <Header>
        <BackButton
          onClick={() => history.goBack()}
          ariaLabel={translate('embeddable_framework.messenger.channel_linking.back.button')}
        />
      </Header>
      {integration?.hasFetchedLinkRequest && (
        <>
          {!isFullScreen && (
            <ChannelLinkWithQrCode
              channelId={channelId}
              url={integration.linkRequest.url}
              qrCode={integration.linkRequest.qrCode}
            />
          )}

          {isFullScreen && (
            <ChannelLinkWithButton channelId={channelId} url={integration.linkRequest.url} />
          )}
        </>
      )}
    </ChannelLinkContainer>
  )
})

export default ChannelPage
