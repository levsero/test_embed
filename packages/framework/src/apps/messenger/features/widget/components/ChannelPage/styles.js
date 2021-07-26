import styled from 'styled-components'
import BackIconSvg from '@zendeskgarden/svg-icons/src/12/chevron-left-stroke.svg'
import { IconButton as GardenIconButton } from '@zendeskgarden/react-buttons'
import { rem } from 'polished'

const IconButton = styled(GardenIconButton)``

const BackIcon = styled(BackIconSvg)`
  &&& {
    height: ${(props) => rem(24, props.theme.baseFontSize)};
    width: ${(props) => rem(24, props.theme.baseFontSize)};
  }
`

export { IconButton, BackIcon }
