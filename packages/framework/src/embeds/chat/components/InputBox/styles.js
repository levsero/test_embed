import styled, { css } from 'styled-components'
import { zdColorGrey300 } from '@zendeskgarden/css-variables'
import { Label, Textarea } from '@zendeskgarden/react-forms'
import { isMobileBrowser } from 'src/util/devices'

export const HiddenLabel = styled(Label)`
  position: absolute !important;
  overflow: hidden !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  border: 0 !important;
  clip: rect(1px, 1px, 1px, 1px) !important;
`
export const Container = styled.div`
  vertical-align: bottom !important;
  margin: 0 ${(props) => 1 / props.theme.fontSize}rem;
`

export const StyledTextarea = styled(Textarea)`
  ${isMobileBrowser() &&
  css`
    padding: ${(props) => 8 / props.theme.fontSize}rem;
    border: none !important;
    border-radius: 0;
    box-shadow: none !important;
    font-size: ${(props) => 16 / props.theme.fontSize}rem !important;
  `}
  &::-webkit-scrollbar {
    width: ${(props) => 4 / props.theme.fontSize}rem;
  }

  &::-webkit-scrollbar-thumb {
    background: ${zdColorGrey300};
    border-radius: ${(props) => 4 / props.theme.fontSize}rem;
  }
`
