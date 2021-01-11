import styled from 'styled-components'
import { rem } from 'polished'
import { Message as GardenMessage } from '@zendeskgarden/react-forms'

const Message = styled(GardenMessage)`
  &&& {
    margin-top: ${props => props.theme.messenger.space.xs};
    font-size: ${props => rem(12, props.theme.messenger.baseFontSize)};
    padding-left: ${props => rem(24, props.theme.messenger.baseFontSize)};

    svg {
      height: ${props => props.theme.messenger.space.sixteen};
      width: ${props => props.theme.messenger.space.sixteen};
    }
  }
`

export default Message
