import styled from 'styled-components'
import { Button } from '@zendeskgarden/react-buttons'
import { rgba } from 'polished'

const replyButtonHorizontalMargin = props => props.theme.messenger.space.xxs

const Container = styled.div`
  margin: 0
    calc(
      ${props => props.theme.messenger.space.md} - ${props => replyButtonHorizontalMargin(props)}
    );
  display: flex;
  flex-flow: row-reverse;
  flex-wrap: wrap;
`

const StyledButton = styled(Button)`
  && {
    border-color: ${props => props.theme.messenger.colors.action};
    color: ${props => props.theme.messenger.colors.action};
    margin: ${props => props.theme.messenger.space.xs}
      ${props => replyButtonHorizontalMargin(props)} 0;
  }

  &:hover {
    background-color: ${props => rgba(props.theme.messenger.colors.action, 0.2)};
  }

  &:active,
  &[aria-pressed='true'],
  &[aria-pressed='mixed'] {
    background-color: ${props => rgba(props.theme.messenger.colors.action, 0.35)};
  }

  &[data-garden-focus-visible] {
    box-shadow: ${props => props.theme.shadows.md(rgba(props.theme.messenger.colors.action, 0.2))};
  }
`

export { StyledButton as Button, Container }
