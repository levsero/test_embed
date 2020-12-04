import styled from 'styled-components'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-block-end: 0;
  overflow-y: hidden;
`

const FieldSpace = styled.div`
  margin-bottom: ${props => 10 / props.theme.fontSize}rem;
`

export { Form, FieldSpace }
