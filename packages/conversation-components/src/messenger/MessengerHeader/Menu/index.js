import PropTypes from 'prop-types'
import { useContext } from 'react'
import Transition from 'react-transition-group/Transition'
import { ThemeContext } from 'styled-components'
import { Trigger } from '@zendeskgarden/react-dropdowns'
import { Dropdown } from 'src/Dropdown'
import useLabels from 'src/hooks/useLabels'
import { HeaderControl, IconButton } from 'src/messenger/MessengerHeader/styles'
import FBMessengerIcon from './FBMessengerIcon'
import InstagramIcon from './InstagramIcon'
import WhatsAppIcon from './WhatsAppIcon'
import { ChannelIcon, HeaderMenu, HeaderMenuItem, MenuIcon, MenuTrigger } from './styles'

const channelOptions = [
  {
    key: 'whatsapp',
    name: 'WhatsApp',
    icon: WhatsAppIcon,
  },
  {
    key: 'messenger',
    name: 'Messenger',
    icon: FBMessengerIcon,
  },
  {
    key: 'instagram',
    name: 'Instagram',
    icon: InstagramIcon,
  },
]

const Menu = ({ channels = {}, onChannelSelect, isOpen, onStateChange }) => {
  const labels = useLabels().messengerHeader
  const {
    messenger: { currentFrame },
  } = useContext(ThemeContext)

  const channelsToDisplay = channelOptions.filter(
    (channel) => channels?.[channel.key] !== undefined
  )

  return (
    <Transition
      appear={false}
      in={channelsToDisplay.length !== 0}
      timeout={0}
      mountOnEnter={true}
      unmountOnExit={true}
    >
      {(state) => {
        return (
          <HeaderControl>
            <Dropdown
              isOpen={isOpen}
              onStateChange={onStateChange}
              onSelect={(selected) => {
                onChannelSelect(selected)
              }}
              downshiftProps={{
                environment: currentFrame?.window,
              }}
            >
              <MenuTrigger state={state}>
                <Trigger>
                  <IconButton isPill={true} aria-label={labels.channelLinkingMenuAriaLabel}>
                    <MenuIcon />
                  </IconButton>
                </Trigger>
              </MenuTrigger>
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
      }}
    </Transition>
  )
}

Menu.propTypes = {
  channels: PropTypes.objectOf(PropTypes.bool),
  onChannelSelect: PropTypes.func,
  isOpen: PropTypes.bool,
  onStateChange: PropTypes.func,
}

export default Menu
