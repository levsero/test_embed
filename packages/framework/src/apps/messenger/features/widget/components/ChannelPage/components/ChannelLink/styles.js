import styled from 'styled-components'
import { Button, Anchor } from '@zendeskgarden/react-buttons'

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const StyledChannelLink = styled(Anchor)`
  &&& {
    color: ${(props) => props.theme.palette.black};

    &:focus {
      text-decoration: underline;
    }
  }
`

const StyledChannelButton = styled(Button)`
  background-color: ${(props) => props.theme.messenger.colors.action};
`

export { Content, StyledChannelLink, StyledChannelButton }
