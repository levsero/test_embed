import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { forwardRef } from 'react'
import useTranslate from 'src/hooks/useTranslate'
import { MessengerIcon, WhatsAppIcon, InstagramIcon } from '@zendesk/conversation-components'

import { fetchLinkRequest, selectIntegrationById } from 'src/apps/messenger/store/integrations'

import ChannelLink from './components/ChannelLink'
import BackButton from '../../../backButton'

import { Container, Body, Title, Subtitle, ChannelIcon, Header } from './styles'

export const channelOptions = {
  whatsapp: {
    icon: WhatsAppIcon,
    title: 'Continue on WhatsApp',
    subtitle: 'Take the conversation to your WhatsApp account. You can return anytime.',
    instructions: {
      desktop: 'Scan the QR code and then send the message that appears in your WhatsApp.',
      mobile: 'Open WhatsApp and send a short message to connect your account.',
    },
    qrCodeAlt: 'QR code to open WhatsApp on this device',
    button: {
      desktop: 'Open WhatsApp on this device',
      mobile: 'Open WhatsApp',
    },
  },
  messenger: {
    icon: MessengerIcon,
    title: 'Continue on Messenger',
    subtitle: 'Take the conversation to your Messenger account. You can return anytime.',
    instructions: {
      desktop: 'Scan the QR code and then send the message that appears in your Messenger.',
      mobile: 'Open Messenger and send a short message to connect your account.',
    },
    qrCodeAlt: 'QR code to open Messenger on this device',
    button: {
      desktop: 'Open Messenger on this device',
      mobile: 'Open Messenger',
    },
  },
  instagram: {
    icon: InstagramIcon,
    title: 'Continue on Instagram',
    subtitle: 'Take the conversation to your Instagram account. You can return anytime.',
    instructions: {
      desktop: 'Scan the QR code to open Instagram. Follow @[Instagram handle] to send a DM.',
      mobile: 'Follow @[Instagram handle] to send a DM.',
    },
    qrCodeAlt: 'QR code to open Instagram on this device',
    button: {
      desktop: 'Open Instagram on this device',
      mobile: 'Open Instagram',
    },
  },
}

const ChannelPage = forwardRef((_props, ref) => {
  const { channelId } = useParams()
  const dispatch = useDispatch()
  const history = useHistory()
  const translate = useTranslate()
  const integration = useSelector((state) => selectIntegrationById(state, channelId))
  const { title, subtitle, icon: ChannelLogo } = channelOptions[channelId]

  useEffect(() => {
    dispatch(fetchLinkRequest({ channelId }))
  }, [])

  return (
    <Container ref={ref}>
      <Header>
        <BackButton
          onClick={() => {
            history.goBack()
          }}
          ariaLabel={translate('embeddable_framework.messenger.channel_linking.back.button')}
        />
      </Header>
      <Body>
        <ChannelIcon>
          <ChannelLogo />
        </ChannelIcon>
        <Title>{title}</Title>
        <Subtitle>{subtitle}</Subtitle>

        {!integration?.hasFetchedLinkRequest && integration?.isFetchingLinkRequest && (
          <div>Loading link request</div>
        )}
        {!integration?.hasFetchedLinkRequest && integration?.errorFetchingLinkRequest && (
          <div>Error fetching link request</div>
        )}

        {integration?.hasFetchedLinkRequest && (
          <ChannelLink
            channelId={channelId}
            url={integration.linkRequest.url}
            qrCode={integration.linkRequest.qrCode}
          />
        )}
      </Body>
    </Container>
  )
})

export default ChannelPage
