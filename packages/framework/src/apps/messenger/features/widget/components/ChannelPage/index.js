import { forwardRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import {
  BackButton,
  ChannelLinkContainer,
  ChannelLinkWithButton,
  ChannelLinkWithQrCode,
  ChannelLinkWithUnlink,
  Notification,
  NOTIFICATION_TYPES,
} from '@zendesk/conversation-components'
import useTranslate from 'src/apps/messenger/features/i18n/useTranslate'
import { getIsFullScreen } from 'src/apps/messenger/features/responsiveDesign/store'
import {
  fetchLinkRequest,
  leftChannelPage,
  selectIntegrationById,
  unlinkIntegration,
} from 'src/apps/messenger/store/integrations'
import { Header } from './styles'

const getLinkStatus = (integration) => {
  if (integration.errorFetchingLinkRequest) return 'error'
  if (integration.isFetchingLinkRequest || !integration.linkRequest.url) return 'loading'
  return 'success'
}

const ChannelPage = forwardRef((_props, ref) => {
  const { channelId } = useParams()
  const dispatch = useDispatch()
  const history = useHistory()
  const translate = useTranslate()
  const integration = useSelector((state) => selectIntegrationById(state, channelId))
  const isFullScreen = useSelector(getIsFullScreen)

  useEffect(() => {
    if (!integration.linked) {
      dispatch(fetchLinkRequest({ channelId }))
    }
  }, [integration.linked])

  const linkStatus = getLinkStatus(integration)

  return (
    <ChannelLinkContainer ref={ref}>
      <Header>
        <BackButton
          onClick={() => {
            history.goBack()
            dispatch(leftChannelPage({ channelId }))
          }}
          ariaLabel={translate('embeddable_framework.messenger.channel_linking.back.button')}
        />
      </Header>
      {integration.linked && (
        <ChannelLinkWithUnlink
          channelId={channelId}
          pending={integration.unlinkPending}
          onDisconnect={() => {
            dispatch(unlinkIntegration({ channelId }))
          }}
        />
      )}
      {!integration.linked && (
        <>
          {isFullScreen ? (
            <ChannelLinkWithButton
              channelId={channelId}
              url={integration.linkRequest.url}
              status={linkStatus}
              onRetry={() => dispatch(fetchLinkRequest({ channelId }))}
            />
          ) : (
            <ChannelLinkWithQrCode
              channelId={channelId}
              url={integration.linkRequest.url}
              qrCode={integration.linkRequest.qrCode}
              status={linkStatus}
              onRetry={() => dispatch(fetchLinkRequest({ channelId }))}
            />
          )}
        </>
      )}

      {integration.linkCancelled && <Notification messageType={NOTIFICATION_TYPES.connectError} />}
      {integration.linkFailed && <Notification messageType={NOTIFICATION_TYPES.connectError} />}
      {integration.unlinkFailed && (
        <Notification messageType={NOTIFICATION_TYPES.disconnectError} />
      )}
    </ChannelLinkContainer>
  )
})

export default ChannelPage
