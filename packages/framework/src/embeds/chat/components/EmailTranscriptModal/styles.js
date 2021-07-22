import styled from 'styled-components'
import { Body, Modal } from '@zendeskgarden/react-modals'
import { Alert } from 'src/embeds/support/components/Notifications'
import { isIE } from 'utility/devices'

const Form = styled.form`
  ${Alert} {
    margin-top: ${(props) => 16 / props.theme.fontSize}rem;
    margin-bottom: 0 !important;
  }
`
const StyledBody = styled(Body)`
  ${isIE() &&
  `
    &&& {
      height: 50% !important;
    }
    `}
`
const StyledModal = styled(Modal)`
  ${(props) =>
    isIE() &&
    `{
      right: ${200 / props.theme.fontSize}rem !important;
      left: ${-142 / props.theme.fontSize}rem !important;
      bottom: ${180 / props.theme.fontSize}rem !important;
      width: ${322 / props.theme.fontSize}rem !important;
      height: ${280 / props.theme.fontSize}rem;
     }`}
`
export { Form, StyledBody, StyledModal }
