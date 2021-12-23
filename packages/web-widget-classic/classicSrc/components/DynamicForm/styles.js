import { Alert } from 'classicSrc/embeds/support/components/Notifications'
import styled from 'styled-components'

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-block-end: 0;
  overflow-y: hidden;

  > *:first-child {
    padding-bottom: ${(props) => 30 / props.theme.fontSize}rem;
  }
`

const Fields = styled.div`
  > *:not(:first-child) {
    margin-top: ${(props) => 16 / props.theme.fontSize}rem;
  }
`

const StyledAlert = styled(Alert)`
  margin-top: ${(props) => 16 / props.theme.fontSize}rem;
  margin-bottom: 0 !important;
`

export { StyledAlert as Alert, FormContainer, Fields }
