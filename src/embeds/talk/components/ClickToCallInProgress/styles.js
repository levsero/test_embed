import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-bottom: ${props => 14 / props.theme.fontSize}rem;
`

const PageContents = styled.div`
  min-height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const FlexContainer = styled.div`
  flex: 1;
`

export { Container, FlexContainer, PageContents }
