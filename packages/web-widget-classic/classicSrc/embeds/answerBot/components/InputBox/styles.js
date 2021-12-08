import { FONT_SIZE } from 'classicSrc/constants/shared'
import styled from 'styled-components'
import { Label, Textarea } from '@zendeskgarden/react-forms'
import { isMobileBrowser } from '@zendesk/widget-shared-services'

const Container = styled.div`
  vertical-align: bottom !important;
  margin: 0 ${1 / FONT_SIZE}rem;
`

const HiddenLabel = styled(Label)`
  position: absolute;
  overflow: hidden;
  width: 1px;
  height: 1px;
  padding: 0;
  border: 0;
  clip: rect(1px, 1px, 1px, 1px);
`

const inputStyle = (isMobile) => {
  if (isMobile) {
    return `
      padding: ${8 / FONT_SIZE}rem 0;
      border: none !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      font-size: ${16 / FONT_SIZE}rem;

      &&&:focus {
        border: none !important;
        box-shadow: none !important;
      }
    `
  } else {
    return ''
  }
}

const Input = styled(Textarea)`
  ${inputStyle(isMobileBrowser())}
`

export { Container, HiddenLabel, Input }
