import styled, { css } from 'styled-components'
import { Anchor, Button } from '@zendeskgarden/react-buttons'

const buttonStyles = css`
  &&& {
    text-decoration: underline;
    color: inherit;

    &:hover,
    &:focus,
    &:active {
      color: ${(props) => props.theme.palette.black};
    }
  }
`

const StyledButton = styled(Button).attrs(() => ({
  isLink: true,
}))`
  &&& {
    ${buttonStyles}
  }
`

const StyledAnchorButton = styled(Anchor).attrs(() => ({
  target: '_blank',
  rel: 'noopener noreferrer',
}))`
  &&& {
    ${buttonStyles}
  }
`

export { StyledButton as Button, StyledAnchorButton as Anchor }
