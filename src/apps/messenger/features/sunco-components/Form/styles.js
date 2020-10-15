import styled from 'styled-components'

const FormContainer = styled.div`
  border-radius: ${props => props.theme.messenger.borderRadii.textMessage};
  border: ${props => props.theme.borders.sm} ${props => props.theme.palette.grey['300']};
  height: auto;
  padding: ${props => props.theme.messenger.space.sixteen};
  width: 100%;
  margin-top: ${props => props.theme.messenger.space.xxs};
  margin-right: ${props => props.theme.messenger.space.sixteen};
`

const Form = styled.form`
  margin-bottom: 0;
  font-size: ${props => props.theme.messenger.fontSizes.md};
`

const FormFooter = styled.div`
  display: flex;
  margin-top: ${props => props.theme.messenger.space.sixteen};
`
const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: auto;
`

const Steps = styled.div`
  color: ${props => props.theme.palette.grey['600']};
  line-height: ${props => props.theme.messenger.lineHeights.md};
  width: auto;
`
const Fields = styled.div``

const Field = styled.div`
  & + & {
    margin-top: ${props => props.theme.messenger.space.sixteen};
  }
`

export { FormContainer, Form, FormFooter, TextContainer, Steps, Fields, Field }
