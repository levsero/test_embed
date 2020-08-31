import styled from 'styled-components'
import { Textarea, Field } from '@zendeskgarden/react-forms'
import { IconButton } from '@zendeskgarden/react-buttons'

import SendIcon from './send-icon.svg'

const StyledSendIcon = styled(SendIcon)`
  g {
    fill: #17494d !important;
  }
`

const SendButton = styled(IconButton)`
  position: absolute;
  right: 20px;
  bottom: 15px;
`

const StyledTextarea = styled(Textarea)`
  border-radius: 22px !important;
  border: 1px solid rgb(216, 220, 222) !important;
  min-height: 44px !important;
  padding: 12px 52px 12px 16px !important;
  box-shadow: none !important;
  line-height: 20px !important;

  :hover,
  :focus {
    border: 1px solid #17494d !important;
    box-shadow: 0 0 0 3px rgba(23, 73, 77, 0.35) !important;
  }
`

const Container = styled.div`
  display: flex !important;
  align-items: center;
  padding: 12px 16px;
`

const StyledField = styled(Field)`
  display: flex;
  flex-grow: 1;
`

export {
  Container,
  StyledTextarea as Textarea,
  StyledSendIcon as SendIcon,
  StyledField as Field,
  SendButton
}
