import styled from 'styled-components'
import IconButton from 'src/IconButton'

const Input = styled.input`
  display: none;
`

const FileInputButton = styled(IconButton)`
  &&& {
    align-self: flex-end;
    margin-right: ${(props) => props.theme.messenger.space.xs};
  }
`

export { Input, FileInputButton }
