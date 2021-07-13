import { useContext } from 'react'
import PropTypes from 'prop-types'
import { Dropdown } from 'src/Dropdown'
import { ThemeContext } from 'styled-components'
import { Trigger } from '@zendeskgarden/react-dropdowns'
import { HeaderControl, IconButton } from 'src/messenger/MessengerHeader/styles'
import WhatsAppIcon from './WhatsAppIcon'
import InstagramIcon from './InstagramIcon'
import MessengerIcon from './MessengerIcon'
import useLabels from 'src/hooks/useLabels'
import { HeaderMenu, HeaderMenuItem, MenuIcon, ChannelIcon } from './styles'

const channelOptions = [
  {
    key: 'whatsapp',
    name: 'WhatsApp',
    icon: WhatsAppIcon,
  },
  {
    key: 'messenger',
    name: 'Messenger',
    icon: MessengerIcon,
  },
  {
    key: 'instagram',
    name: 'Instagram',
    icon: InstagramIcon,
  },
]

const validLinkOptions = {
  linked: true,
  'not linked': true,
}

const Menu = ({ channels = {}, onChannelSelect, isOpen, onStateChange }) => {
  const {
    messenger: { currentFrame },
  } = useContext(ThemeContext)
  const labels = useLabels().messengerHeader

  const channelsToDisplay = channelOptions.filter(
    (channel) => validLinkOptions[channels?.[channel.key]]
  )

  if (channelsToDisplay.length === 0) {
    return null
  }

  return (
    <HeaderControl>
      <Dropdown
        isOpen={isOpen}
        onStateChange={onStateChange}
        onSelect={onChannelSelect}
        downshiftProps={{
          environment: currentFrame?.window,
        }}
      >
        <Trigger>
          <IconButton isPill={true}>
            <MenuIcon />
          </IconButton>
        </Trigger>
        <HeaderMenu placement="bottom-end">
          {channelsToDisplay.map((channel) => {
            const ChannelLogo = channel.icon
            return (
              <HeaderMenuItem key={channel.key} value={channel.key}>
                <ChannelIcon channel={channel.key}>
                  <ChannelLogo />
                </ChannelIcon>
                {` `}
                {labels.continueOnChannel(channel.name)}
              </HeaderMenuItem>
            )
          })}
        </HeaderMenu>
      </Dropdown>
    </HeaderControl>
  )
}

Menu.propTypes = {
  channels: PropTypes.objectOf(PropTypes.oneOf(Object.keys(validLinkOptions))),
  onChannelSelect: PropTypes.func,
  isOpen: PropTypes.bool,
  onStateChange: PropTypes.func,
}

export default Menu
