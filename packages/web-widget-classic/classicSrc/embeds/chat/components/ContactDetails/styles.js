import styled from 'styled-components'
import { Modal } from '@zendeskgarden/react-modals'
import { isIE } from '@zendesk/widget-shared-services'

const StyledModal = styled(Modal)`
  ${(props) =>
    isIE() &&
    `{
      right: ${200 / props.theme.fontSize}rem !important;
      left: ${-142 / props.theme.fontSize}rem !important;
      bottom: ${220 / props.theme.fontSize}rem !important;
      width: ${322 / props.theme.fontSize}rem !important;
      height: ${392 / props.theme.fontSize}rem;
     }`}
`

export { StyledModal }
