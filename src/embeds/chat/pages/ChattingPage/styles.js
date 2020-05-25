import styled from 'styled-components'

const ChatLogContainer = styled.div`
  min-height: calc(100% - calc(${props => 30 / props.theme.fontSize}rem + 6px));
  ${props =>
    props.isMobile &&
    `
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: ${props => 14 / props.theme.fontSize}rem;`}
`

export { ChatLogContainer }
