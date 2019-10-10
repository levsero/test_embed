import styled from 'styled-components'
import SoundOffIcon from '@zendeskgarden/svg-icons/src/16/volume-muted-stroke.svg'
import SoundOnIcon from '@zendeskgarden/svg-icons/src/16/volume-unmuted-stroke.svg'
import { FONT_SIZE } from 'constants/shared'
import { IconButton } from '@zendeskgarden/react-buttons'
import { Menu } from '@zendeskgarden/react-dropdowns'
import { isMobileBrowser } from 'utility/devices'

const StyledSoundOffIcon = styled(SoundOffIcon)`
  height: 1em;
  vertical-align: middle;
  margin-left: ${6 / FONT_SIZE}rem;
`

const StyledSoundOnIcon = StyledSoundOffIcon.withComponent(SoundOnIcon)

const StyledIconButton = styled(IconButton)`
  margin: ${3 / FONT_SIZE}rem !important;
  height: 3rem !important;
  width: 3rem !important;

  svg {
    height: 1rem;
    width: 1rem;
  }

  &:focus {
    outline: none !important;
    box-shadow: 0 0 0 ${3 / FONT_SIZE}rem rgba(255, 255, 255, 0.4) !important;
  }
`

const MENU_PADDING = 20

const StyledMenu = styled(Menu)`
  &&& {
    width: ${isMobileBrowser() ? '100vw' : `calc(100vw - ${MENU_PADDING * 2}px)`};
    z-index: 5;
    border-radius: 0;
    margin: 0;
  }
`

export {
  StyledSoundOffIcon as SoundOffIcon,
  StyledSoundOnIcon as SoundOnIcon,
  StyledIconButton as IconButton,
  StyledMenu as Menu,
  MENU_PADDING
}
