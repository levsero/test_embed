import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  ${props =>
    !props.isFullScreen &&
    `
    margin: 5px;
    box-shadow: 0 0 5px 0 rgba(0,0,0,0.6);
  `}
`

export { Container }
