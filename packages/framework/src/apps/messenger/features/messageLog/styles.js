import styled from 'styled-components'

const Container = styled.div`
  position: relative;
  flex-grow: 1;
  flex-shrink: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`

const Log = styled.div`
  overflow-y: auto;
  height: 100%;
  flex-grow: 1;
`

export { Container, Log }
