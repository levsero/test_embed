import { rem } from 'polished'
import styled from 'styled-components'
import { Button } from '@zendeskgarden/react-buttons'
import { baseFontSize } from 'messengerSrc/constants'
import ArrowDown from 'messengerSrc/icons/icon_arrow-down.svg'

const StyledButton = styled(Button)`
  width: ${rem(117, baseFontSize)};
  height: ${(props) => props.theme.messenger.space.lg};
  max-height: ${(props) => props.theme.messenger.space.lg};
  border-radius: ${(props) => props.theme.messenger.borderRadii.lg};
  box-shadow: 0px 1px 4px 0px rgba(71, 69, 123, 0.04), 0px 4px 12px 0px rgba(36, 36, 36, 0.1);
  border-color: ${(props) => props.theme.palette.white} !important;
  background-color: ${(props) => props.theme.palette.white} !important;
`

const StyledArrow = styled(ArrowDown)`
  margin-right: ${(props) => props.theme.messenger.space.xs};
  width: ${(props) => props.theme.messenger.space.sixteen};
  height: ${(props) => props.theme.messenger.space.sixteen};
  min-width: ${(props) => props.theme.messenger.space.sixteen};
  min-height: ${(props) => props.theme.messenger.space.sixteen};

  g > g > path {
    fill: ${(props) => props.theme.palette.grey[800]};
  }
`

const Text = styled.p`
  color: ${(props) => props.theme.palette.grey[800]} !important;
  line-height: ${(props) => props.theme.messenger.lineHeights.md};
`

const Container = styled.div`
  position: absolute;
  bottom: ${(props) => props.theme.messenger.space.sm};
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
`

export { StyledButton as Button, StyledArrow as ArrowDown, Text, Container }
