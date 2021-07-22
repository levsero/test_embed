import styled from 'styled-components'
import { zdColorRed300, zdColorRed500 } from '@zendeskgarden/css-variables'
import { Alert, Notification, Title } from '@zendeskgarden/react-notifications'

const StyledAlert = styled(Alert)`
  padding: ${(props) =>
    `${14 / props.theme.fontSize}rem ${36 / props.theme.fontSize}rem !important`};
  border-radius: ${(props) => 4 / props.theme.fontSize}rem;
  background-color: rgba(${zdColorRed500}, 0.1);
  padding-left: ${(props) => `${36 / props.theme.fontSize}rem !important`};
  border: ${(props) => 1 / props.theme.fontSize}rem solid ${zdColorRed300};
  color: ${zdColorRed500};
  line-height: ${(props) => 20 / props.theme.fontSize}rem;
  margin-bottom: ${(props) => 10 / props.theme.fontSize}rem !important;

  background-position-y: ${(props) => 15 / props.theme.fontSize}rem !important;
  background-position-x: ${(props) => 12 / props.theme.fontSize}rem !important;
`

const StyledNotification = styled(Notification)`
  &&& {
    padding: ${(props) =>
      `${14 / props.theme.fontSize}rem ${36 / props.theme.fontSize}rem !important`};
    padding-left: ${(props) => `${36 / props.theme.fontSize}rem !important`};

    background-size: 1rem;
    background-position-y: ${(props) => 15 / props.theme.fontSize}rem !important;
    background-position-x: ${(props) => 12 / props.theme.fontSize}rem !important;
  }
`

const StyledTitle = styled(Title)`
  font-size: ${(props) => 14 / props.theme.fontSize}rem;

  &&& {
    margin-left: ${(props) => 14 / props.theme.fontSize}rem;

    ${(props) =>
      props.theme.rtl &&
      `
        margin-left: 0;
        margin-right: ${14 / props.theme.fontSize}rem;
      `}
  }
`

export { StyledAlert as Alert, StyledTitle as Title, StyledNotification as Notification }
