import styled from 'styled-components'
import { Button } from '@zendeskgarden/react-buttons'
import { zdColorGrey800 } from '@zendeskgarden/css-variables'
import { Textarea, Label } from '@zendeskgarden/react-forms'

import RatingGroup from 'embeds/chat/components/RatingGroup'

const SecondaryButton = styled(Button)`
  flex-grow: 1;
  max-width: 50%;
`

const SubmitButton = styled(Button)`
  flex-grow: 1;
  max-width: 50%;
  margin-left: ${props => 7 / props.theme.fontSize}rem !important;

  ${props =>
    props.theme.rtl &&
    `
      margin-left: 0 !important;
      margin-right: ${7 / props.theme.fontSize}rem !important;
    `}
`

const ButtonGroup = styled.div`
  display: flex !important;
`

const StyledLabel = styled(Label)`
  color: ${zdColorGrey800};
  font-weight: 700;
  display: block !important;
`

const StyledTextarea = styled(Textarea)`
  margin-bottom: ${props => 15 / props.theme.fontSize}rem;
`

const StyledRatingGroup = styled(RatingGroup)`
  margin-bottom: ${props => 10 / props.theme.fontSize}rem;
  margin-top: ${props => 5 / props.theme.fontSize}rem;
`

export {
  SecondaryButton,
  SubmitButton,
  ButtonGroup,
  StyledLabel as Label,
  StyledTextarea as Textarea,
  StyledRatingGroup as RatingGroup
}
