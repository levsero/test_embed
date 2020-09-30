import styled from 'styled-components'

const Container = styled.div`
  flex: 1;
  overflow-y: auto;
`

const CenterSpinnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: ${props => props.theme.messenger.fontSizes.xxxl};
`

const TopSpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: ${props => props.theme.messenger.space.sixteen};
  font-size: ${props => props.theme.messenger.fontSizes.xl};
`

export { Container, CenterSpinnerContainer, TopSpinnerContainer }
