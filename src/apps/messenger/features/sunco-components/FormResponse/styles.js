import styled from 'styled-components'

const FormContainer = styled.div`
  font-size: ${props => props.theme.messenger.fontSizes.md};
  border-radius: ${props => props.theme.messenger.borderRadii.textMessage};
  border: ${props => props.theme.borders.sm} ${props => props.theme.palette.grey['300']};
  height: auto;
  padding: ${props => props.theme.messenger.space.sixteen};
  width: 100%;
  margin-top: ${props => props.theme.messenger.space.xxs};
`

const Label = styled.div`
  font-weight: ${props => props.theme.fontWeights.semibold};
  margin-bottom: ${props => props.theme.messenger.space.small};
`

const Field = styled.div`
  margin-bottom: ${props => (props.isLastField ? 0 : props.theme.messenger.space.sixteen)};
`

export { FormContainer, Field, Label }
