import ChannelLinkContainer from 'src/messenger/ChannelLinkContainer'
import { MessengerContainerDecorator } from '../../../.storybook/decorators'
import ChannelLinkWithQrCode from './ChannelLinkWithQrCode'

export default {
  title: 'Messenger/ChannelLink',
  component: ChannelLinkWithQrCode,
  decorators: [MessengerContainerDecorator],
}

export const LinkWithProvidedQrCode = (args) => {
  return (
    <ChannelLinkContainer>
      <ChannelLinkWithQrCode {...args} />
    </ChannelLinkContainer>
  )
}

LinkWithProvidedQrCode.args = {
  channelId: 'messenger',
  url: 'www.awesomeurl.com',
  status: 'success',
  qrCode:
    'data:image/png;base64,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',
}

export const LinkWithGeneratedQrCode = (args) => {
  return (
    <ChannelLinkContainer>
      <ChannelLinkWithQrCode {...args} />
    </ChannelLinkContainer>
  )
}

LinkWithGeneratedQrCode.args = {
  channelId: 'messenger',
  url: 'www.awesomeurl.com',
  status: 'success',
}
