import styled from 'styled-components'
import { Button } from '@zendeskgarden/react-buttons'
import { rgba } from 'polished'
import dirStyles from 'src/utils/dirStyles'

const replyButtonHorizontalMargin = props => props.theme.messenger.space.xxs

const Container = styled.div`
  margin: 0
    calc(
      ${props => props.theme.messenger.space.md} - ${props => replyButtonHorizontalMargin(props)}
    );
  display: flex;
  height: fit-content;
  flex-wrap: wrap;
  justify-content: flex-end;
  margin-bottom: ${props => props.theme.messenger.space.xxs};
`

const StyledButton = styled(Button)`
  &&& {
    font-size: ${props => props.theme.messenger.fontSizes.md};
    min-height: ${props => props.theme.messenger.space.xl};
    height: 100%;
    white-space: normal;
    line-height: ${props => props.theme.messenger.lineHeights.lg};
    border-color: ${props => props.theme.messenger.colors.action};
    color: ${props => props.theme.messenger.colors.action};
    margin-top: ${props => props.theme.messenger.space.xs};
    margin-${dirStyles.right}: 0;
    margin-${dirStyles.left}: calc(${props => replyButtonHorizontalMargin(props)} * 2);
    margin-bottom: 0;
    text-align: start;

    &:hover {
      background-color: ${props => rgba(props.theme.messenger.colors.action, 0.2)};
    }

    &:active,
    &[aria-pressed='true'],
    &[aria-pressed='mixed'] {
      background-color: ${props => rgba(props.theme.messenger.colors.action, 0.35)};
    }

    &[data-garden-focus-visible] {
      box-shadow: ${props =>
        props.theme.shadows.md(rgba(props.theme.messenger.colors.action, 0.2))};
    }
  }
`

export { StyledButton as Button, Container }
