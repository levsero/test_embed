import styled from 'styled-components'
import { Message as GardenMessage } from '@zendeskgarden/react-forms'
import { rem } from 'polished'
import { baseFontSize } from 'src/apps/messenger/features/themeProvider'

const Message = styled(GardenMessage)`
  &&& {
    margin-top: ${props => props.theme.messenger.space.xs};

    display: inline-block;
    position: relative;
    vertical-align: middle;
    line-height: 1.3333333333333333;
    font-size: ${rem(12, baseFontSize)};
    padding-left: ${rem(24, baseFontSize)};
    color: #cc3340;

    svg {
      height: ${props => props.theme.messenger.space.sixteen};
      width: ${props => props.theme.messenger.space.sixteen};
    }
  }
`

export default Message
