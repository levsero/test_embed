import styled from 'styled-components'
import { dirStyles } from '@zendesk/conversation-components'

const Header = styled.div`
  position: fixed;
  ${dirStyles.left}: ${(props) => props.theme.messenger.space.sm};
  top: ${(props) => props.theme.messenger.space.xs};
  ${dirStyles.rtlOnly('transform: scaleX(-1);')}
`

export { Header }
