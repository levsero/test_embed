import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { forwardRef } from 'react'
import useTranslate from 'src/hooks/useTranslate'

import { linkIntegration, selectIntegrationById } from 'src/apps/messenger/store/integrations'

import ChannelLink from './components/ChannelLink'
import BackButton from '../../../backButton'

import { Container, MessengerIcon, WhatsAppIcon, InstagramIcon, Header } from './styles'

export const channelOptions = {
  whatsapp: {
    icon: WhatsAppIcon,
    title: 'Continue on WhatsApp',
    subtitle: 'Take the conversation to your WhatsApp account. You can return anytime.',
    instructions: {
      desktop: 'Scan the QR code and then send the message that appears in your WhatsApp.',
      mobile: 'Open WhatsApp and send a short message to connect your account.',
    },
    qrCodeAlt: '',
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
    qrCodeAlt: '',
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
    qrCodeAlt: '',
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
    dispatch(linkIntegration(channelId))
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
      <ChannelLogo />
      <h3>{title}</h3>
      <p>{subtitle}</p>

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
    </Container>
  )
})

export default ChannelPage
