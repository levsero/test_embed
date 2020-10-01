import styled from 'styled-components'

const size = 20

const Container = styled.div`
  height: ${size}px;
  min-width: ${size}px;
  color: ${props => props.theme.palette.white};
  background-color: ${props => props.theme.palette.red[500]};
  border-radius: ${size}px;
  position: absolute;
  top: 12px;
  right: 4px;
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 14px;
  padding: 0 6px;
`

const Plus = styled.div`
  font-size: 12px;
`

export { Container, Plus }
