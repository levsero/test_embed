import styled from 'styled-components'
import { zdColorWhite } from '@zendeskgarden/css-variables'

const Shadow = styled.div`
  box-shadow: 0 0 ${(props) => 12 / props.theme.fontSize}rem
    ${(props) => 8 / props.theme.fontSize}rem ${zdColorWhite};
  height: 0;
  width: 100%;
  z-index: 1;
`

const ChatLogContainer = styled.div`
  min-height: calc(100% - calc(${(props) => 30 / props.theme.fontSize}rem + 6px));
  ${(props) =>
    props.isMobile &&
    `
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: ${(props) => 14 / props.theme.fontSize}rem;`}
`

export { ChatLogContainer, Shadow }
