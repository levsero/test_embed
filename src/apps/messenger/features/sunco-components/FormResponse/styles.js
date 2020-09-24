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
const Field = styled.div`
  & + & {
    margin-top: ${props => props.theme.messenger.space.sixteen};
  }
`

export { FormContainer, Field }
