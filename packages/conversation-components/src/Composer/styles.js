import styled, { css } from 'styled-components'
import { rem, rgba } from 'polished'
import { Textarea, Field } from '@zendeskgarden/react-forms'
import { IconButton } from '@zendeskgarden/react-buttons'

import SendIcon from './send-icon.svg'
import dirStyles from 'src/utils/dirStyles'

const StyledSendIcon = styled(SendIcon)``

// Send button size needs to match the height of the text area when it is a single row
// To do this, add the line height, padding and border together
const sendButtonSize = css`
  ${(props) => `
  calc(${props.theme.messenger.lineHeights.md} + ${props.theme.messenger.space.sm} + ${props.theme.messenger.space.sm} + ${props.theme.borderWidths.sm})
`}
`

const SendButton = styled(IconButton)`
  &&& {
    position: absolute;
    ${dirStyles.right}: 0;
    bottom: 0;
    height: ${sendButtonSize};
    width: ${sendButtonSize};
    border-radius: ${(props) => rem(22, props.theme.messenger.baseFontSize)};
    color: ${(props) => props.theme.messenger.primary};

    ${dirStyles.rtlOnly('transform: scaleX(-1);')}

    ${StyledSendIcon} {
      height: ${(props) => props.theme.messenger.iconSizes.md};
      width: ${(props) => props.theme.messenger.iconSizes.md};
      margin-${dirStyles.left}: ${(props) => props.theme.messenger.space.xxs};

      g {
        fill: ${(props) => props.theme.messenger.colors.primary};
      }
    }

    &:hover,
    &:focus,
    &:active {
      background-color: transparent;
    }

    &:focus,
    &:active {
      box-shadow: inset
        ${(props) => props.theme.shadows.md(rgba(props.theme.messenger.colors.action, 0.35))};
    }
  }
`

const StyledTextarea = styled(Textarea)`
  &&& {
    border-radius: ${(props) => rem(22, props.theme.messenger.baseFontSize)};
    border: ${(props) => props.theme.borders.sm} rgb(216, 220, 222);
    background: transparent;
    min-height: auto;
    padding: ${(props) => props.theme.messenger.space.sm}
      ${(props) => props.theme.messenger.space.sixteen};
    padding-${dirStyles.right}: ${sendButtonSize};

    box-shadow: none;
    line-height: ${(props) => props.theme.messenger.lineHeights.md};
    font-size: ${(props) => props.theme.messenger.fontSizes.md};

    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }

    &:not(:disabled) {
      :hover {
        border: ${(props) => props.theme.borders.sm} ${(props) => props.theme.palette.grey[500]};
      }

    :focus,
    :active,
    &[data-garden-focus-visible] {
      border: ${(props) => props.theme.borders.sm} ${(props) =>
  props.theme.messenger.colors.action};
      box-shadow: ${(props) =>
        props.theme.shadows.md(rgba(props.theme.messenger.colors.action, 0.35))};
    }
    }
`

const Container = styled.div`
  display: flex;
  align-items: center;
  font-family: ${(props) => props.theme.messenger.fontFamily};
  padding: ${(props) => props.theme.messenger.space.sm}
    ${(props) => props.theme.messenger.space.sixteen};
  flex-shrink: 0;
  position: relative;
`

const StyledField = styled(Field)`
  display: flex;
  flex-grow: 1;
  position: relative;
`

export {
  Container,
  StyledTextarea as Textarea,
  StyledSendIcon as SendIcon,
  StyledField as Field,
  SendButton,
}
